import os
import tempfile
import subprocess
from flask import Flask, render_template, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Import the blueprint from render.py
from blueprints.render import render_bp
from blueprints.summarization import summarization_bp
from blueprints.modify import modify_bp

@app.route('/', methods=['GET'])
def home():
    return {"message": "Flask backend is running!"}

# Register the blueprint so that its routes (like /render) become available
app.register_blueprint(render_bp)
app.register_blueprint(summarization_bp)
app.register_blueprint(modify_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5001)