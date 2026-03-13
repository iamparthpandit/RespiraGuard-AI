from __future__ import annotations

import argparse
import os
import pickle
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple, Any

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler


ASTHMA_FEATURES: List[str] = [
    "Age",
    "BMI",
    "Smoking_Status",
    "Air_Pollution_Exposure",
    "Dust_Allergy",
    "Family_History",
    "Lung_Function_FEV1",
    "FeNO_Level",
]
ASTHMA_TARGET = "Has_Asthma"
DEFAULT_MODEL_FILE = "respiratory_risk_model.pkl"

# Canonical feature names mapped to likely alternatives across public asthma datasets.
FEATURE_ALIASES: Dict[str, List[str]] = {
    "Air_Pollution_Exposure": ["Air_Pollution_Exposure", "Air_Pollution_Level"],
    "Dust_Allergy": ["Dust_Allergy", "Allergies"],
    "Lung_Function_FEV1": ["Lung_Function_FEV1", "Peak_Expiratory_Flow"],
}


@dataclass
class TrainingArtifacts:
    model: RandomForestClassifier
    scaler: StandardScaler
    label_encoders: Dict[str, LabelEncoder]
    feature_order: List[str]
    numeric_columns: List[str]


def _find_dataset_path(dataset_name: str, explicit_path: str | None = None) -> Path:
    if explicit_path:
        path = Path(explicit_path).expanduser().resolve()
        if not path.exists():
            raise FileNotFoundError(f"Dataset not found at explicit path: {path}")
        return path

    candidates = [
        Path.cwd() / dataset_name,
        Path.cwd() / "data" / dataset_name,
        Path.home() / "Downloads" / dataset_name,
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate.resolve()

    raise FileNotFoundError(
        f"Could not find {dataset_name}. Checked: "
        + ", ".join(str(p) for p in candidates)
    )


def load_datasets(
    synthetic_asthma_path: str | None = None,
    lung_disease_path: str | None = None,
    air_quality_path: str | None = None,
) -> Dict[str, pd.DataFrame]:
    paths = {
        "synthetic_asthma": _find_dataset_path(
            "synthetic_asthma_dataset.csv", synthetic_asthma_path
        ),
        "lung_disease": _find_dataset_path("lung_disease.csv", lung_disease_path),
        "air_quality": _find_dataset_path("Air Quality.csv", air_quality_path),
    }

    datasets = {
        name: pd.read_csv(path, low_memory=False) for name, path in paths.items()
    }
    return datasets


def remove_irrelevant_columns(df: pd.DataFrame) -> pd.DataFrame:
    id_like_keywords = ["id", "patient_id", "patientid", "record_id"]
    drop_columns = [
        col
        for col in df.columns
        if any(keyword in col.lower() for keyword in id_like_keywords)
    ]
    return df.drop(columns=drop_columns, errors="ignore")


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    cleaned = df.copy()

    # Many air-quality datasets encode missing values as -200.
    cleaned = cleaned.replace(-200, np.nan)

    cleaned = remove_irrelevant_columns(cleaned)
    cleaned = cleaned.dropna(axis=0)
    return cleaned


def encode_categorical_columns(
    df: pd.DataFrame,
) -> Tuple[pd.DataFrame, Dict[str, LabelEncoder]]:
    encoded = df.copy()
    encoders: Dict[str, LabelEncoder] = {}

    for column in encoded.columns:
        if encoded[column].dtype == "object" or str(encoded[column].dtype).startswith("category"):
            encoder = LabelEncoder()
            encoded[column] = encoder.fit_transform(encoded[column].astype(str))
            encoders[column] = encoder

    return encoded, encoders


def harmonize_synthetic_schema(synthetic_df: pd.DataFrame) -> pd.DataFrame:
    harmonized = synthetic_df.copy()

    for canonical_name, alternatives in FEATURE_ALIASES.items():
        if canonical_name in harmonized.columns:
            continue

        matched_source = next((col for col in alternatives if col in harmonized.columns), None)
        if matched_source:
            harmonized[canonical_name] = harmonized[matched_source]

    return harmonized


def build_training_dataset(synthetic_df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series, Dict[str, LabelEncoder]]:
    synthetic_df = harmonize_synthetic_schema(synthetic_df)

    missing_cols = [
        col for col in ASTHMA_FEATURES + [ASTHMA_TARGET] if col not in synthetic_df.columns
    ]
    if missing_cols:
        raise ValueError(f"Missing required columns in synthetic asthma dataset: {missing_cols}")

    selected = synthetic_df[ASTHMA_FEATURES + [ASTHMA_TARGET]].copy()
    selected, encoders = encode_categorical_columns(selected)

    X = selected[ASTHMA_FEATURES]
    y = selected[ASTHMA_TARGET]
    return X, y, encoders


def normalize_numeric_columns(
    X_train: pd.DataFrame, X_test: pd.DataFrame
) -> Tuple[pd.DataFrame, pd.DataFrame, StandardScaler, List[str]]:
    scaler = StandardScaler()
    numeric_columns = X_train.select_dtypes(include=[np.number]).columns.tolist()

    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()

    if numeric_columns:
        X_train_scaled[numeric_columns] = scaler.fit_transform(X_train[numeric_columns])
        X_test_scaled[numeric_columns] = scaler.transform(X_test[numeric_columns])

    return X_train_scaled, X_test_scaled, scaler, numeric_columns


def train_model(X_train: pd.DataFrame, y_train: pd.Series) -> RandomForestClassifier:
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)
    return model


def evaluate_model(
    model: RandomForestClassifier, X_test: pd.DataFrame, y_test: pd.Series
) -> Dict[str, Any]:
    y_pred = model.predict(X_test)

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "confusion_matrix": confusion_matrix(y_test, y_pred),
        "classification_report": classification_report(y_test, y_pred),
    }
    return metrics


def save_model(artifacts: TrainingArtifacts, model_path: str = DEFAULT_MODEL_FILE) -> Path:
    output_path = Path(model_path).resolve()

    payload = {
        "model": artifacts.model,
        "scaler": artifacts.scaler,
        "label_encoders": artifacts.label_encoders,
        "feature_order": artifacts.feature_order,
        "numeric_columns": artifacts.numeric_columns,
    }

    with output_path.open("wb") as f:
        pickle.dump(payload, f)

    return output_path


def train_pipeline(
    synthetic_asthma_path: str | None = None,
    lung_disease_path: str | None = None,
    air_quality_path: str | None = None,
    model_path: str = DEFAULT_MODEL_FILE,
) -> Dict[str, Any]:
    datasets = load_datasets(
        synthetic_asthma_path=synthetic_asthma_path,
        lung_disease_path=lung_disease_path,
        air_quality_path=air_quality_path,
    )

    cleaned_datasets = {name: clean_dataframe(df) for name, df in datasets.items()}

    X, y, label_encoders = build_training_dataset(cleaned_datasets["synthetic_asthma"])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    X_train_scaled, X_test_scaled, scaler, numeric_columns = normalize_numeric_columns(
        X_train, X_test
    )

    model = train_model(X_train_scaled, y_train)
    metrics = evaluate_model(model, X_test_scaled, y_test)

    artifacts = TrainingArtifacts(
        model=model,
        scaler=scaler,
        label_encoders=label_encoders,
        feature_order=ASTHMA_FEATURES,
        numeric_columns=numeric_columns,
    )
    saved_path = save_model(artifacts, model_path=model_path)

    return {
        "metrics": metrics,
        "model_path": str(saved_path),
        "row_counts": {name: len(df) for name, df in cleaned_datasets.items()},
    }


def _load_saved_artifacts(model_path: str = DEFAULT_MODEL_FILE) -> Dict[str, Any]:
    path = Path(model_path).resolve()
    if not path.exists():
        raise FileNotFoundError(f"Saved model file not found: {path}")

    with path.open("rb") as f:
        artifacts = pickle.load(f)

    return artifacts


def predict_respiratory_risk(
    input_features: Dict[str, Any], model_path: str = DEFAULT_MODEL_FILE
) -> str:
    artifacts = _load_saved_artifacts(model_path)
    feature_order = artifacts["feature_order"]
    encoders = artifacts["label_encoders"]
    scaler = artifacts["scaler"]
    model = artifacts["model"]
    numeric_columns = artifacts["numeric_columns"]

    missing_features = [feature for feature in feature_order if feature not in input_features]
    if missing_features:
        raise ValueError(f"Missing input features for prediction: {missing_features}")

    row = pd.DataFrame([input_features])[feature_order].copy()

    for column, encoder in encoders.items():
        if column in row.columns:
            value = str(row.at[0, column])
            if value not in set(encoder.classes_):
                raise ValueError(
                    f"Unknown category '{value}' for column '{column}'. "
                    f"Expected one of: {list(encoder.classes_)}"
                )
            row[column] = encoder.transform([value])[0]

    if numeric_columns:
        row[numeric_columns] = scaler.transform(row[numeric_columns])

    probability = float(model.predict_proba(row)[0][1])

    if probability < 0.33:
        return "Low Risk"
    if probability < 0.66:
        return "Moderate Risk"
    return "High Risk"


def _print_training_summary(results: Dict[str, Any]) -> None:
    metrics = results["metrics"]
    print("Training completed successfully.")
    print(f"Model saved to: {results['model_path']}")
    print(f"Cleaned row counts: {results['row_counts']}")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print("Confusion Matrix:")
    print(metrics["confusion_matrix"])
    print("Classification Report:")
    print(metrics["classification_report"])


def _build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Train and save respiratory disease risk model from tabular datasets."
    )
    parser.add_argument("--synthetic", default=None, help="Path to synthetic_asthma_dataset.csv")
    parser.add_argument("--lung", default=None, help="Path to lung_disease.csv")
    parser.add_argument("--air", default=None, help='Path to "Air Quality.csv"')
    parser.add_argument(
        "--model-output",
        default=DEFAULT_MODEL_FILE,
        help="Output path for saved pickle model",
    )
    return parser


def main() -> None:
    parser = _build_arg_parser()
    args = parser.parse_args()

    results = train_pipeline(
        synthetic_asthma_path=args.synthetic,
        lung_disease_path=args.lung,
        air_quality_path=args.air,
        model_path=args.model_output,
    )
    _print_training_summary(results)


if __name__ == "__main__":
    main()
