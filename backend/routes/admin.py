from fastapi import APIRouter, HTTPException, Depends
from database import users_collection, transactions_collection, fraud_logs_collection
from typing import List
from bson import ObjectId

router = APIRouter(prefix="/admin")

@router.get("/stats")
async def admin_stats():
    total_users = await users_collection.count_documents({})
    active = await users_collection.count_documents({"status": "ACTIVE"})
    hold = await users_collection.count_documents({"status": "HOLD"})
    total_tx = await transactions_collection.count_documents({})
    fraud_tx = await transactions_collection.count_documents({"decision": "BLOCK"})
    return {
        "total_users": total_users,
        "active_accounts": active,
        "hold_accounts": hold,
        "total_transactions": total_tx,
        "fraud_transactions": fraud_tx
    }

@router.get("/users")
async def get_users():
    cursor = users_collection.find({})
    users = await cursor.to_list(length=100)
    for u in users:
        u["_id"] = str(u["_id"])
    return users

@router.get("/transactions")
async def get_transactions():
    cursor = transactions_collection.find({}).sort("timestamp", -1)
    txs = await cursor.to_list(length=100)
    for t in txs:
        t["_id"] = str(t["_id"])
    return txs

@router.get("/fraud-logs")
async def get_fraud_logs():
    cursor = fraud_logs_collection.find({}).sort("timestamp", -1)
    logs = await cursor.to_list(length=100)
    for l in logs:
        l["_id"] = str(l["_id"])
    return logs

@router.post("/unhold/{user_id}")
async def unhold_user(user_id: str):
    res = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": "ACTIVE"}}
    )
    if res.matched_count == 0:
        raise HTTPException(404, "User not found")
    return {"status": "success"}

@router.post("/block/{user_id}")
async def block_user(user_id: str):
    res = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": "HOLD"}}
    )
    if res.matched_count == 0:
        raise HTTPException(404, "User not found")
    return {"status": "success"}

@router.post("/unblock/{user_id}")
async def unblock_user(user_id: str):
    return await unhold_user(user_id)
