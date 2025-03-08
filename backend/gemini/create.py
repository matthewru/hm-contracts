from google import genai
from google.genai import types
from datetime import datetime
import re

def extract_latex(text):
    matches = re.findall(r"```latex\s*(.*?)\s*```", text, re.DOTALL)
    return matches[0] if matches else text

def gen_latex(af, al, ac, dt, cf, cl, cc):
    admin_first = af
    admin_last = al
    admin_company = ac
    document_type = dt
    client_first = cf
    client_last = cl
    client_company = cc
    date = datetime.today()

    client = genai.Client(api_key="AIzaSyChp7kIwWx_fA_QEENcIgWCbGrrTNp96-4")

    instruction = (
        "You are to output only LaTeX code with no explanation"
    )

    content = (
        f"Make me a basic {document_type} template for a general contractor based on the following info: "
        f"My information: name = {admin_first} {admin_last}, company = {admin_company} "
        f"Client information: name = {client_first} {client_last}{', company = ' + client_company if client_company else ''} "
        f"Date: {date}"
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(system_instruction=instruction),
        contents=content
    )

    working_text = response.text

    working_text = extract_latex(working_text)

    return working_text