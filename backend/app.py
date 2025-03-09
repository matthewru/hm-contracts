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
from blueprints.chat import chat_bp
from db_helpers import get_user_by_id, update_user_documents
from flask import jsonify
from blueprints.rag import rag_bp


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

#Get user info from user_id endpoint
@app.route('/user/<string:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        # Find the user by user_id
        user = users_collection.find_one({'user_id': user_id})
        if user:
            # Convert MongoDB _id to string (as ObjectId is not JSON serializable)
            user['_id'] = str(user['_id'])
            return jsonify(user), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return {"message": "Flask backend is running!"}

# Register the blueprint so that its routes (like /render) become available
app.register_blueprint(render_bp)
app.register_blueprint(summarization_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(rag_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5001)