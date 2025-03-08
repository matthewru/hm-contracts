import os
import tempfile
import subprocess
from flask import Blueprint, render_template, request, jsonify
import json
from gemini.create import gen_latex
from scripts.make4ht import convert_latex_to_html
from db_helpers import get_user_by_id, update_user_documents



# Create a Blueprint for the render functionality
render_bp = Blueprint('render_bp', __name__)

@render_bp.route('/render', methods=['POST'])
def render_contract():

    # temp variables

    prompt = request.get_json()
    if not prompt:
        return jsonify({'error': 'Invalid JSON data'}), 400
    
    #   Find user_id from the prompt payload
    user_id = prompt.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    doctype = prompt.get('doctype')
    client_info = prompt.get('client')
    client_first_name = client_info.get('firstName')
    client_last_name = client_info.get('lastName')
    client_company = client_info.get('company')
    
    user = get_user_by_id(user_id)  # Use the imported function to get user from DB
    # print(user_id)
    print("LWEIFPWEI", user)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    admin_first = user.get('firstName')
    admin_last = user.get('lastName')
    admin_company = user.get('company')

    # Generate the LaTeX string using your invoice template
    max_attempts = 3
    contract_latex = None
    for attempt in range(max_attempts):
        try:
            # TODO: Implement calling the API with modify message in the modify API call
            contract_latex = gen_latex(prompt.get('description'), admin_first, admin_last, admin_company, prompt.get('doctype'), prompt.get('client', {}).get('firstName'), prompt.get('client', {}).get('lastName'), prompt.get('client', {}).get('company') if prompt.get('client', {}).get('company') else None)
            break
        except Exception as e:
            # debugging statement
            print(f"Attempt {attempt + 1} failed; error message: {e}")
            if attempt == max_attempts - 1:
                error_message = "An error occurred while generating the document. Please try again."
                return render_template('contract_result.html', error_message=error_message)
    # Write the LaTeX to a temporary file and convert to HTML using tex4ht
    with tempfile.TemporaryDirectory() as tmpdir:
        tex_file = os.path.join(tmpdir, "contract.tex")
        with open(tex_file, "w", encoding="utf-8") as f:
            f.write(contract_latex)
        
        try:
            # Convert the LaTeX file to HTML (with inline CSS) using our module.
            output_html_path = os.path.join(tmpdir, "contract.html")
            convert_latex_to_html(tex_file, output_html_path, workdir=tmpdir)
            
            # Read the generated HTML content
            with open(output_html_path, "r", encoding="utf-8") as f:
                html_content = f.read()
            
            doc_payload = {"content": html_content, 
                           "doctype": doctype,
                           "client": client_info}
            
            update_result = update_user_documents(user_id, doc_payload)
            if update_result:
                return jsonify({'message': 'Document added successfully', 'document': {"content": html_content,
                                                                                       "doctype": doctype,
                                                                                       "client": client_info}}), 200
            else:
                return jsonify({'error': 'Failed to update the document list'}), 500
            return html_content
        except subprocess.CalledProcessError as e:
            print(f"TeX4ht conversion failed: {e.stderr}")
            return render_template('contract_result.html', error_message="Failed to convert document to HTML")
