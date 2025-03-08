from flask import Blueprint, request, jsonify
import json

from gemini.modify import modify_latex

start_chat_bp = Blueprint('start_chat_bp', __name__)

@start_chat_bp.route('/start_chat', methods = ['POST'])
def start_chat():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON data'}), 400

    message = data.get('message')
    focus = data.get('focus')
    context = data.get('context')

    max_attempts = 3
    contract_latex = context

    for attempt in range(max_attempts):
        try:
            contract_latex = modify_latex(context, focus, message)
        except Exception as e:
            print(f"Attempt {attempt + 1} failed; error message: {e}")

            if attempt == max_attempts - 1:
                error_message = "Unable to modify document. Please try again."
                return contract_latex
            
    # code goes here    

