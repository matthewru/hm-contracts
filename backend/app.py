import os
import tempfile
import subprocess
from flask import Flask, render_template, request
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from blueprints.render import render_bp
from blueprints.summarization import summarization_bp
from db_helpers import get_user_by_id, update_user_documents


uri = "mongodb+srv://matthewru07:hU2b3yphXGxhXykY@hm-contracts.s1zza.mongodb.net/?retryWrites=true&w=majority&appName=hm-contracts"


app = Flask(__name__)
CORS(app)
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Create a global reference to the MongoDB collection
db = client.get_database("hm-contracts")  # Get the default database
users_collection = db['users']
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    
# Import the blueprint from render.py


@app.route('/', methods=['GET'])
def home():
    return {"message": "Flask backend is running!"}

# Register the blueprint so that its routes (like /render) become available
app.register_blueprint(render_bp)
app.register_blueprint(summarization_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5001)