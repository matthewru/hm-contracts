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
        "You are to output only LaTeX code with no explanation"
    ) if not modify_message else (
        "You are to output only the modified LaTeX code with no explanation "
        "You are to avoid changing the structure of the LaTeX framework by any means necessary unless absolutely required"
    )

    content = (
        f"Make me a basic {document_type} template for a small business based on the following info: "
        f"My information: name = {admin_first} {admin_last}, company = {admin_company} "
        f"Client information: name = {client_first} {client_last}{', company = ' + client_company if client_company else ''} "
        "If no client company is provided, assume this is for an individual "
        f"Date: {date} "
        f"If you deem the content to be relevant, here is an additional description: {description}"
    ) if not modify_message else (
        f"I want you to make modifications to the following LaTeX code only where specified. The rest should stay the same: {old_latex} "
        f"The specifications for the modification are: {modify_message}"
    )

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