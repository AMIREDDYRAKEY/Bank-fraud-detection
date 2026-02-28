from datetime import datetime
from fastapi import APIRouter, HTTPException, Request
from models import UserCreate, UserResponse, Token
from database import users_collection, admins_collection
from auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth")

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    if await users_collection.find_one({"email": user_data.email}):
        raise HTTPException(400, "Email exists")
    data = user_data.dict()
    password = data.pop("password")
    user = {
        **data,
        "password_hash": get_password_hash(password),
        "account_number": "".join(__import__("random").choices("0123456789", k=10)),
        "balance": 50000,
        "status": "ACTIVE",
        "created_at": datetime.utcnow()
    }
    res = await users_collection.insert_one(user)
    user["_id"] = str(res.inserted_id)
    return user

@router.post("/login", response_model=Token)
async def login(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")
    user = await users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": email, "role": "USER"})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/admin/login", response_model=Token)
async def admin_login(request: Request):
    data = {}
    try:
        data = await request.json()
    except Exception:
        try:
            form = await request.form()
            data = dict(form)
        except Exception:
            data = {}
    email = data.get("email") or data.get("username")
    password = data.get("password")
    if not email or not password:
        raise HTTPException(400, "Invalid admin payload")
    if await admins_collection.count_documents({}) == 0 and email == "admin@fraudshield.ai":
        default_admin = {
            "email": "admin@fraudshield.ai",
            "password_hash": get_password_hash("admin123"),
            "role": "ADMIN",
            "created_at": datetime.utcnow()
        }
        await admins_collection.insert_one(default_admin)
    admin = await admins_collection.find_one({"email": email})
    if not admin or not verify_password(password, admin["password_hash"]):
        raise HTTPException(401, "Invalid admin credentials")
    token = create_access_token({"sub": admin["email"], "role": "ADMIN"})
    return {"access_token": token, "token_type": "bearer"}
