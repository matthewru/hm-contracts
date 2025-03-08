from flask import Blueprint, request, jsonify

summarization_bp = Blueprint('summarization_bp', __name__)

@summarization_bp.route('/summarize', methods = ['POST'])
def summarize_clause_api():
    """
    Endpoint receives JSON payload with highlighted section as key,
    returns JSON response with summary.
    """
    data = request.get_json()
    clause = data.get('highlighted', '')

    #fill in summary logic with function
    summary = "placeholder summary"

    return jsonify({
        'highlighted': clause,
        'summary': summary
    })