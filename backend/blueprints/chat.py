import os
import tempfile
import subprocess
from flask import Blueprint, render_template, request, jsonify
from gemini.modify import modify_latex
from scripts.make4ht import convert_latex_to_html
# from db_helpers import get_user_by_id, update_user_documents

start_chat_bp = Blueprint('start_chat_bp', __name__)

@start_chat_bp.route('/chat', methods = ['POST'])
def start_chat():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON data'}), 400

    message = data.get('message')
    focus = data.get('focus')
    context = data.get('context')

    max_attempts = 3
    response_latex = context

    for attempt in range(max_attempts):
        try:
            response_latex, response_chat = modify_latex(context, focus, message)
        except Exception as e:
            print(f"Attempt {attempt + 1} failed; error message: {e}")

            if attempt == max_attempts - 1:
                error_message = "Unable to modify document. Please try again."
                return response_latex, response_chat
            
    with tempfile.TemporaryDirectory() as tmpdir:
        tex_file = os.path.join(tmpdir, "contract.tex")
        with open(tex_file, "w", encoding="utf-8") as f:
            f.write(response_latex)
        
        try:
            # Convert the LaTeX file to HTML (with inline CSS) using our module.
            output_html_path = os.path.join(tmpdir, "contract.html")
            convert_latex_to_html(tex_file, output_html_path, workdir=tmpdir)
            
            # Read the generated HTML content
            with open(output_html_path, "r", encoding="utf-8") as f:
                html_content = f.read()
            
            # doc_payload = {"content": html_content, 
            #                "doctype": "",
            #                "client": ""} # TODO: MATTHEW
            
            # update_user_documents(user_id, doc_payload)
            return response_latex, response_chat
        except subprocess.CalledProcessError as e:
            print(f"TeX4ht conversion failed: {e.stderr}")
            return render_template('contract_result.html', error_message="Failed to convert document to HTML")

