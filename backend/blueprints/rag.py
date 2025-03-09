import os
from flask import Blueprint, request, jsonify
from sentence_transformers import SentenceTransformer
import numpy as np
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# Create a Blueprint for RAG functionality
rag_bp = Blueprint('rag_bp', __name__)

# MongoDB connection
uri = "mongodb+srv://matthewru07:hU2b3yphXGxhXykY@hm-contracts.s1zza.mongodb.net/?retryWrites=true&w=majority&appName=hm-contracts"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client.get_database("hm-contracts")
users_collection = db['users']

# Load the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

@rag_bp.route('/search_similar', methods=['POST'])
def search_similar():
    data = request.get_json()
    if not data or 'description' not in data or 'user_id' not in data:
        return jsonify({'error': 'Missing description or user_id'}), 400
    
    description = data['description']
    user_id = data['user_id']
    
    # Get user's documents
    user = users_collection.find_one({"user_id": user_id})
    if not user or 'documents' not in user or not user['documents']:
        return jsonify({'results': []}), 200
    
    # Create embeddings for the query
    query_embedding = model.encode(description)
    
    # Calculate similarity with each document
    results = []
    for doc in user['documents']:
        if 'content' in doc:
            # Extract text content from HTML (simplified)
            doc_text = doc.get('doctype', '') + ' ' + str(doc.get('client', {}))
            
            # Create embedding for the document
            doc_embedding = model.encode(doc_text)
            
            # Calculate cosine similarity
            similarity = np.dot(query_embedding, doc_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(doc_embedding)
            )
            
            results.append({
                'document': doc,
                'similarity': float(similarity)
            })
    
    # Sort by similarity (highest first) and take top 3
    results.sort(key=lambda x: x['similarity'], reverse=True)
    top_results = results[:3]
    
    return jsonify({'results': top_results}), 200 