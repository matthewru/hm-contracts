from flask import Blueprint, request, jsonify
from google import genai
from google.genai import types

summarization_bp = Blueprint('summarization_bp', __name__)

@summarization_bp.route('/summarize', methods = ['POST'])
def summarize_clause_api():
    """
    Endpoint receives JSON payload with highlighted section as key,
    returns JSON response with summary.
    """

    text = request.get_json().get('selection')
    if not text:
        return jsonify({'error': 'Invalid JSON data'}), 400


    client = genai.Client(api_key="AIzaSyChp7kIwWx_fA_QEENcIgWCbGrrTNp96-4")

    instruction = (
        "I want you to output simple readable text to help someone understand the prompt. "
    )

    content = (
        f"{text}"
    )

    summarization = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(system_instruction=instruction),
        contents=content
    )

    print(summarization.text)
    print('\n')
    print(text)
    return jsonify({ 'summary': summarization.text })