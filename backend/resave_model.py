import joblib
import xgboost as xgb
import os
import warnings

warnings.filterwarnings('ignore')

model_file = 'ensemble_model.pkl'
if os.path.exists(model_file):
    try:
        package = joblib.load(model_file)
        # Re-save to current version's format
        joblib.dump(package, 'ensemble_model.pkl')
        print("Model re-saved successfully.")
    except Exception as e:
        print("Error:", e)
else:
    print("Model file not found")
