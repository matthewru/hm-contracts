import os
import tempfile
import subprocess
from flask import Flask, render_template, request
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = "mongodb+srv://matthewru07:hU2b3yphXGxhXykY@hm-contracts.s1zza.mongodb.net/?retryWrites=true&w=majority&appName=hm-contracts"


app = Flask(__name__)
CORS(app)
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    
# Import the blueprint from render.py
from blueprints.render import render_bp
from blueprints.summarization import summarization_bp

@app.route('/test_connection')
def test_connection():
    try:
        # Ping the database
        client.db.command('ping')
        # Try to get collections list
        collection_names = client.db.list_collection_names()
        return {
            "status": "Connected successfully to MongoDB Atlas",
            "collections": collection_names
        }
    except Exception as e:
        return {
            "status": "Failed to connect to MongoDB Atlas",
            "error": str(e)
        }

@app.route('/', methods=['GET'])
def home():
    return {"message": "Flask backend is running!"}

# Register the blueprint so that its routes (like /render) become available
app.register_blueprint(render_bp)
app.register_blueprint(summarization_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5001)