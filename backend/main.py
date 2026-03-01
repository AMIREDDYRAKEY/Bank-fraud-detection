import os
import random
import string
import warnings
from datetime import datetime

import joblib
import pandas as pd
import shap
import numpy as np
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.banking import router as banking_router
from routes.admin import router as admin_router

load_dotenv()
warnings.filterwarnings("ignore")

app = FastAPI(title="FraudShield AI Banking System")

# ============================
# 🔥 CORS FIX (DEPLOY SAFE)
# ============================


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://bank-fraud-detection-vjvm.vercel.app",
    "https://bank-fraud-detection-iota.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(auth_router)

app.include_router(auth_router)
app.include_router(banking_router)
app.include_router(admin_router)

@app.get("/")
async def root():
    return {"status": "FraudShield Running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}


# ============================
# MAIN
# ============================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
