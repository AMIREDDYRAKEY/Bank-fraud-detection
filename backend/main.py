from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import shap
import numpy as np
import warnings

warnings.filterwarnings("ignore")

app = FastAPI(title="Real-Time Fraud Detection API")

# ======================
# CORS
# ======================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# Load Model
# ======================

package = joblib.load("ensemble_model.pkl")

knn = package["knn"]
rf = package["rf"]
xgb = package["xgb"]
columns = package["columns"]
threshold = package["threshold"]

print("Model loaded successfully")
print("Model expects columns:", columns)
print("Threshold:", threshold)

# ======================
# SHAP Kernel Explainer (Version Safe)
# ======================

background = pd.DataFrame(
    np.zeros((1, len(columns))),
    columns=columns
)

explainer = shap.KernelExplainer(
    lambda x: xgb.predict_proba(pd.DataFrame(x, columns=columns))[:, 1],
    background
)

# ======================
# Feature Explanation Map
# ======================

feature_map = {
    "Weight": "Transaction amount is unusually high",
    "Source": "Sender account behavior looks unusual",
    "Target": "Receiver account appears suspicious",
    "typeTrans": "Transaction type has elevated fraud risk"
}

# ======================
# Input Schema
# ======================

class Transaction(BaseModel):
    Source: float
    Target: float
    Weight: float
    typeTrans: float


# ======================
# Ensemble Prediction
# ======================

def ensemble_predict_proba(features: dict):

    df = pd.DataFrame([features])

    # Ensure correct column order
    df = df.reindex(columns=columns, fill_value=0)

    p1 = knn.predict_proba(df)[0][1]
    p2 = rf.predict_proba(df)[0][1]
    p3 = xgb.predict_proba(df)[0][1]

    prob = (p1*1 + p2*2 + p3*3) / 6

    return prob, df


# ======================
# Explainability Function
# ======================

def explain_transaction(df):

    shap_values = explainer.shap_values(df.values)[0]

    reasons = []

    for val, name in sorted(zip(shap_values, df.columns), reverse=True):

        if val > 0 and name in feature_map:
            reasons.append(feature_map[name])

    if len(reasons) == 0:
        reasons.append("Transaction pattern appears normal")

    return reasons[:3]


# ======================
# Routes
# ======================

@app.get("/")
def home():
    return {"message": "Fraud Detection API Running 🚀"}


@app.post("/predict")
def predict(txn: Transaction):

    features = txn.dict()

    prob, df = ensemble_predict_proba(features)

    # Decision Logic
    if prob > 0.7:
        decision = "BLOCK"
    elif prob > threshold:
        decision = "OTP_VERIFICATION"
    else:
        decision = "APPROVE"

    # Explainability
    reasons = explain_transaction(df)

    return {
        "risk_score": float(prob),
        "decision": decision,
        "model": "Ensemble AI v1",
        "explanation": reasons
    }