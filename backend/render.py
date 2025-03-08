import os
import tempfile
import subprocess
from flask import Blueprint, render_template, request

from gemini.create import gen_latex

# Create a Blueprint for the render functionality
render_bp = Blueprint('render_bp', __name__)

@render_bp.route('/render', methods=['GET', 'POST'])
def render_contract():
    if request.method == 'POST':
        prompt = request.form.get('prompt', '')

        # Generate the LaTeX string using your invoice template
        # TODO: UPDATE TO INCLUDE PARAMS
        # TODO: 
        max_attempts = 3
        contract_latex = None

        for attempt in range(max_attempts):
            try:
                contract_latex = gen_latex()
                break
            except Exception as e:
                # debugging statement
                print(f"Attempt {attempt + 1} failed; error message: {e}")

                if attempt == max_attempts - 1:
                    error_message = "An error occurred while generating the document. Please try again."
                    return render_template('contract_result.html', error_message=error_message)

        # Write the LaTeX to a temporary file and convert to HTML using pandoc
        with tempfile.TemporaryDirectory() as tmpdir:
            tex_file = os.path.join(tmpdir, "contract.tex")
            html_file = os.path.join(tmpdir, "contract.html")

            with open(tex_file, "w") as f:
                f.write(contract_latex)

            subprocess.run(["pandoc", "-f", "latex", "-t", "html", "-s", tex_file, "-o", html_file], check=True)

            with open(html_file, "r") as f:
                html_content = f.read()

        return render_template('contract_result.html', content=html_content)

    # For GET requests, show the form
    return render_template('contract_form.html')