import os
import joblib
import pandas as pd
import shap
import numpy as np

def _resolve_model_path():
    candidates = []
    here = os.path.dirname(__file__)
    candidates.append(os.path.join(here, "..", "ensemble_model.pkl"))
    candidates.append(os.path.join(here, "ensemble_model.pkl"))
    candidates.append(os.path.join(os.getcwd(), "ensemble_model.pkl"))
    env_path = os.getenv("MODEL_PATH")
    if env_path:
        candidates.insert(0, env_path)
    for p in candidates:
        full = os.path.abspath(p)
        if os.path.exists(full):
            return full
    return None

model_file = _resolve_model_path()

try:
    package = joblib.load(model_file) if model_file else None
    knn = package["knn"]
    rf = package["rf"]
    xgb = package["xgb"]
    columns = package["columns"]
    threshold = package["threshold"]
except Exception:
    columns = ["Source", "Target", "Weight", "typeTrans"]
    threshold = 0.3
    knn = None
    rf = None
    xgb = None

background = pd.DataFrame(np.zeros((1, len(columns))), columns=columns)

explainer = shap.KernelExplainer(
    lambda x: xgb.predict_proba(pd.DataFrame(x, columns=columns))[:, 1] if xgb else np.zeros(len(x)),
    background
)

feature_map = {
    "Weight": "Transaction amount unusually high",
    "Source": "Sender behavior suspicious",
    "Target": "Receiver risky",
    "typeTrans": "Transaction type risky"
}

def ensemble_predict_proba(features: dict):
    df = pd.DataFrame([features])
    df = df.reindex(columns=columns, fill_value=0)
    if knn is None or rf is None or xgb is None:
        prob = 0.5
    else:
        p1 = knn.predict_proba(df)[0][1]
        p2 = rf.predict_proba(df)[0][1]
        p3 = xgb.predict_proba(df)[0][1]
        prob = (p1 + 2*p2 + 3*p3) / 6
    return prob, df

def explain_transaction(df):
    vals = explainer.shap_values(df)[0] if hasattr(explainer, "shap_values") else np.zeros(len(df.columns))
    idx = np.argsort(np.abs(vals))[::-1][:3]
    reasons = []
    for i in idx:
        if i < len(df.columns) and abs(vals[i]) > 0.01:
            reasons.append(feature_map.get(df.columns[i], "Risk detected"))
    return reasons or ["High risk profile"]
