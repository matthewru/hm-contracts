import os
import tempfile
import subprocess
from flask import Blueprint, render_template, request

# Create a Blueprint for the render functionality
render_bp = Blueprint('render_bp', __name__)

@render_bp.route('/render', methods=['GET', 'POST'])
def render_contract():
    if request.method == 'POST':
        prompt = request.form.get('prompt', '')

        # Generate the LaTeX string using your invoice template
        contract_latex = r"""\documentclass{article}
\usepackage{amsmath}
\usepackage{geometry}
\usepackage{array}
\usepackage{tabularx}
\usepackage{ragged2e}
\geometry{a4paper, margin=1in}

\title{Invoice}
\date{}

\begin{document}

\noindent
\begin{tabularx}{\textwidth}{@{} >{\RaggedRight\hsize=0.5\hsize}X >{\RaggedRight\hsize=0.5\hsize}X @{}}
\textbf{Contractor Information} & \textbf{Client Information} \\
\hline
\textbf{Company Name:} """ + prompt + r""" & \textbf{Client Name:} [Client Name] \\
\textbf{Address:} [Company Address] & \textbf{Address:} [Client Address] \\
\textbf{Phone:} [Company Phone] & \textbf{Phone:} [Client Phone] \\
\textbf{Email:} [Company Email] & \textbf{Email:} [Client Email] \\
\end{tabularx}

\vspace{0.5cm}

\noindent
\begin{tabularx}{\textwidth}{@{} >{\hsize=0.3\hsize}X >{\hsize=0.35\hsize}X >{\hsize=0.35\hsize}X @{}}
\textbf{Invoice Number:} [Invoice Number] & \textbf{Date:} [Date] & \textbf{Due Date:} [Due Date] \\
\end{tabularx}

\vspace{0.5cm}

\noindent
\begin{tabularx}{\textwidth}{|l|X|r|r|}
\hline
\textbf{Item \#} & \textbf{Description} & \textbf{Quantity} & \textbf{Price} \\ \hline
1 & [Description of Service 1] & [Quantity 1] & [Price 1] \\ \hline
2 & [Description of Service 2] & [Quantity 2] & [Price 2] \\ \hline
3 & [Description of Service 3] & [Quantity 3] & [Price 3] \\ \hline
 &  & \textbf{Subtotal:} & [Subtotal] \\
 &  & \textbf{Tax:} & [Tax] \\
 &  & \textbf{Total:} & [Total] \\ \hline
\end{tabularx}

\vspace{0.5cm}

\noindent
\textbf{Notes:} [Any notes, such as payment terms, etc.]

\vspace{0.5cm}

\noindent
\textbf{Payment Information:}

\noindent
[Payment details such as Bank Name, Account Number, etc.]

\vspace{0.5cm}

\noindent
Thank you for your business!

\end{document}
"""

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