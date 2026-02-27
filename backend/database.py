import os
import dns.resolver
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Patch DNS resolution for MongoDB SRV issues on some networks
try:
    dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
    dns.resolver.default_resolver.nameservers = ['8.8.8.8', '1.1.1.1']
except Exception as e:
    print(f"⚠️ DNS patch failed: {e}")

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DB_NAME]

async def get_db():
    return db

# Collections
users_collection = db["users"]
transactions_collection = db["transactions"]
fraud_logs_collection = db["fraud_logs"]
admins_collection = db["admins"]
admin_logs_collection = db["admin_logs"]
