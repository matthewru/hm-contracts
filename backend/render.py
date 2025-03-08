import os
import tempfile
import subprocess
from flask import Blueprint, render_template, request, jsonify
import json

from gemini.create import gen_latex

# Create a Blueprint for the render functionality
render_bp = Blueprint('render_bp', __name__)

@render_bp.route('/render', methods=['GET', 'POST'])
def render_contract():

    # temp variables
    admin_first = "Jill"
    admin_last = "Bill"
    admin_company = "Jill Bill's Bakery"

    if request.method == 'POST':
        prompt = request.get_json()
        if not prompt:
            return jsonify({'error': 'Invalid JSON data'}), 400

        # Generate the LaTeX string using your invoice template
        max_attempts = 3
        contract_latex = None

        for attempt in range(max_attempts):
            try:
                # TODO: Implement calling the API with modify message in the modify API call
                contract_latex = gen_latex(prompt.get('description'), admin_first, admin_last, admin_company, prompt.get('doctype'), prompt.get('client', {}).get('firstName'), prompt.get('client', {}).get('lastName'), prompt.get('client', {}).get('company') if prompt.get('client', {}).get('company') else None, prompt.get('modifyMessage') if prompt.get('modifyMessage') else None, prompt.get('oldLatex') if prompt.get('modifyMessage') else None)
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
            
            # Write the LaTeX content to the temporary file
            with open(tex_file, "w") as f:
                f.write(contract_latex)
            
            # Run make4ht to convert LaTeX to HTML5 with MathJax
            try:
                subprocess.run(["make4ht", tex_file, "mathjax"], 
                             check=True, 
                             cwd=tmpdir,
                             capture_output=True,
                             text=True)
                
                # Read the generated HTML file
                html_file = os.path.join(tmpdir, "contract.html")
                with open(html_file, "r") as f:
                    html_content = f.read()
                
                return html_content
                
            except subprocess.CalledProcessError as e:
                print(f"TeX4ht conversion failed: {e.stderr}")
                return render_template('contract_result.html', 
                                     error_message="Failed to convert document to HTML")

    # For GET requests, show the form
    return render_template('contract_form.html')