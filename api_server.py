from __future__ import annotations

import pickle
from pathlib import Path
from typing import Any, Dict

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


MODEL_PATH = Path("respiratory_risk_model.pkl")

# Canonical feature order expected by the trained pipeline.
CANONICAL_FEATURE_ORDER = [
    "Age",
    "BMI",
    "Smoking_Status",
    "Air_Pollution_Exposure",
    "Dust_Allergy",
    "Family_History",
    "Lung_Function_FEV1",
    "FeNO_Level",
]

RISK_LABELS = {
    0: "Low Risk",
    1: "Moderate Risk",
    2: "High Risk",
}

RECOMMENDATIONS = {
    "Low Risk": "Respiratory indicators appear stable. Continue healthy habits and routine monitoring.",
    "Moderate Risk": "Air quality exposure and lung indicators suggest moderate respiratory stress. Monitor breathing conditions.",
    "High Risk": "Respiratory stress appears high. Seek medical guidance and reduce exposure to triggers immediately.",
}


class RespiratoryInput(BaseModel):
    age: float
    bmi: float
    smoking_status: int
    air_pollution_exposure: float
    dust_allergy: int
    family_history: int
    lung_function_fev1: float
    feno_level: float


app = FastAPI(title="RespiraGuard Risk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


loaded_artifacts: Dict[str, Any] = {}


def _load_pickle_model(path: Path) -> Any:
    with path.open("rb") as f:
        return pickle.load(f)


def _load_model_artifacts(path: Path) -> Dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"Model file not found at: {path.resolve()}")

    # Try joblib first, then fallback to pickle for maximum compatibility.
    try:
        payload = joblib.load(path)
    except Exception:
        payload = _load_pickle_model(path)

    if isinstance(payload, dict) and "model" in payload:
        return payload

    # Support plain estimator payloads too.
    return {
        "model": payload,
        "scaler": None,
        "label_encoders": {},
        "feature_order": CANONICAL_FEATURE_ORDER,
        "numeric_columns": CANONICAL_FEATURE_ORDER,
    }


@app.on_event("startup")
def startup_event() -> None:
    global loaded_artifacts
    loaded_artifacts = _load_model_artifacts(MODEL_PATH)


@app.get("/")
def root() -> Dict[str, str]:
    return {"message": "RespiraGuard API is running."}


@app.post("/predict-risk")
def predict_risk(data: RespiratoryInput) -> Dict[str, str]:
    if not loaded_artifacts:
        raise HTTPException(status_code=500, detail="Model is not loaded.")

    model = loaded_artifacts["model"]
    scaler = loaded_artifacts.get("scaler")
    encoders = loaded_artifacts.get("label_encoders", {})
    feature_order = loaded_artifacts.get("feature_order", CANONICAL_FEATURE_ORDER)
    numeric_columns = loaded_artifacts.get("numeric_columns", CANONICAL_FEATURE_ORDER)

    row = {
        "Age": data.age,
        "BMI": data.bmi,
        "Smoking_Status": data.smoking_status,
        "Air_Pollution_Exposure": data.air_pollution_exposure,
        "Dust_Allergy": data.dust_allergy,
        "Family_History": data.family_history,
        "Lung_Function_FEV1": data.lung_function_fev1,
        "FeNO_Level": data.feno_level,
    }

    df = pd.DataFrame([row])[feature_order]

    for column, encoder in encoders.items():
        if column in df.columns:
            raw_value = df.at[0, column]

            # Keep numeric values as provided; they may already be encoded.
            if isinstance(raw_value, (int, float, np.integer, np.floating)):
                continue

            df[column] = encoder.transform(df[column].astype(str))

    if scaler is not None and numeric_columns:
        df[numeric_columns] = scaler.transform(df[numeric_columns])

    prediction = model.predict(df)
    predicted_class = int(prediction[0])

    risk_level = RISK_LABELS.get(predicted_class)
    if risk_level is None:
        # Fallback for models that do not emit 0/1/2 classes directly.
        risk_level = "Moderate Risk"

    response = {
        "risk_level": risk_level,
        "recommendation": RECOMMENDATIONS[risk_level],
    }
    return response
