from google import genai
from google.genai import types
from datetime import datetime
import re
import asyncio

def extract_latex(text):
    matches = re.findall(r"```latex\s*(.*?)\s*```", text, re.DOTALL)
    return matches[0] if matches else text

async def async_gen_latex(description, admin_first, admin_last, admin_company, document_type, client_first, client_last, client_company=None, modify_message=None, old_latex=None):
    date = datetime.today()

    client = genai.Client(api_key="AIzaSyChp7kIwWx_fA_QEENcIgWCbGrrTNp96-4")

    instruction = (
        "My company name should be in large bold font at the top. "
        "You are to output only LaTeX code with no explanation. "
        "Always output enough LaTeX to fill at least three quarters of a page."
    )

    content = (
        f"Make me a basic {document_type} template for a small business based on the following info: "
        f"My information: name = {admin_first} {admin_last}, company = {admin_company}. "
        f"Client information: name = {client_first} {client_last}{', company = ' + client_company if client_company else ', no client company is provided, assume this is for an individual'}. "
        f"Date: {date}. "
        f"Additional description: {description}."
    )

    print(content)

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(system_instruction=instruction),
        contents=content
    )

    working_text = response.text
    working_text = extract_latex(working_text)
    return working_text

# This function handles the event loop setup
def gen_latex(description, admin_first, admin_last, admin_company, document_type, client_first, client_last, client_company=None, modify_message=None, old_latex=None):
    # Create a new event loop for this thread if needed
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    # Run the async function and return its result
    return loop.run_until_complete(
        async_gen_latex(
            description, admin_first, admin_last, admin_company, 
            document_type, client_first, client_last, client_company,
            modify_message, old_latex
        )
    )