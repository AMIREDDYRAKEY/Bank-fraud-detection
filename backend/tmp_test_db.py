import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def test_db():
    print("Testing MongoDB Connection...")
    url = os.getenv("MONGODB_URL")
    db_name = os.getenv("DB_NAME")
    print(f"URL: {url[:20]}...")
    client = AsyncIOMotorClient(url)
    try:
        await client.admin.command('ping')
        print("SUCCESS: Ping successful!")
        db = client[db_name]
        count = await db["admins"].count_documents({})
        print(f"SUCCESS: Found {count} admins.")
    except Exception as e:
        print(f"ERROR: Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_db())
