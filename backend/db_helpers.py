# db_helpers.py

from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os

uri = "mongodb+srv://matthewru07:hU2b3yphXGxhXykY@hm-contracts.s1zza.mongodb.net/?retryWrites=true&w=majority&appName=hm-contracts"
# Connect to MongoDB once, the connection persists
client = MongoClient(uri, server_api=ServerApi('1'))

# Access the database and collection
db = client.get_database("hm-contracts")  # Default database
users_collection = db['users']  # The 'users' collection

def get_user_by_id(user_id):
    """Fetch a user by their user_id"""
    print("HERE", user_id)
    print(users_collection)
    return users_collection.find_one({"user_id": user_id})

def update_user_documents(user_id, new_document):
    """Update the documents list for a specific user"""
    try:
        result = users_collection.update_one(
            {"user_id": user_id},
            {"$push": {"documents": new_document}}  # Append to the documents list
        )
        return result.modified_count > 0  # Return True if the update was successful
    except Exception as e:
        print(f"Error updating documents: {e}")
        return False
