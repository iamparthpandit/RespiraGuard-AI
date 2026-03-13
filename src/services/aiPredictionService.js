const FASTAPI_PREDICT_URL =
  import.meta.env.VITE_FASTAPI_PREDICT_URL || 'http://127.0.0.1:8000/predict-risk';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

const buildPredictionPayload = (sensorData) => ({
  age: 40,
  bmi: 25,
  smoking_status: 0,
  air_pollution_exposure: Number(sensorData?.air_quality ?? 0),
  dust_allergy: 1,
  family_history: 0,
  lung_function_fev1: Number(sensorData?.sound ?? 0),
  feno_level: Number(sensorData?.humidity ?? 0)
});

const fallbackRecommendationByRisk = (riskLevel) => {
  if (riskLevel === 'Low Risk') {
    return 'Respiratory indicators look stable. Maintain hydration and continue routine monitoring.';
  }

  if (riskLevel === 'High Risk') {
    return 'Respiratory stress appears high. Reduce trigger exposure and seek medical guidance as soon as possible.';
  }

  return 'Air quality exposure and lung indicators suggest moderate respiratory stress. Monitor breathing conditions.';
};

export const getRespiratoryPrediction = async (sensorData) => {
  const response = await fetch(FASTAPI_PREDICT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildPredictionPayload(sensorData))
  });

  if (!response.ok) {
    throw new Error(`Prediction request failed with status ${response.status}`);
  }

  return response.json();
};

export const generateAIRecommendation = async (
  riskLevel,
  sensorData,
  fallbackRecommendation = ''
) => {
  const fallback = fallbackRecommendation || fallbackRecommendationByRisk(riskLevel);

  if (!OPENAI_API_KEY) {
    return fallback;
  }

  const prompt = [
    'Generate a short medical-style recommendation for a respiratory monitoring system.',
    `Risk level: ${riskLevel}.`,
    `Air quality: ${sensorData?.air_quality ?? 'N/A'}.`,
    `Humidity: ${sensorData?.humidity ?? 'N/A'}.`,
    `Temperature: ${sensorData?.temperature ?? 'N/A'}.`,
    `Breathing intensity: ${sensorData?.sound ?? 'N/A'}.`,
    'Return 1-2 concise sentences only.'
  ].join(' ');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 90
      })
    });

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const recommendation = data?.choices?.[0]?.message?.content?.trim();

    return recommendation || fallback;
  } catch (error) {
    console.error('OpenAI recommendation failed:', error);
    return fallback;
  }
};
