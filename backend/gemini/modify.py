from google import genai
from google.genai import types
from datetime import datetime
import re
import asyncio

def extract_latex(text):
    matches = re.findall(r"```latex\s*(.*?)\s*```", text, re.DOTALL)
    return matches[0] if matches else text

async def async_modify(context, focus, message):
    client = genai.Client(api_key="AIzaSyChp7kIwWx_fA_QEENcIgWCbGrrTNp96-4")

    instruction = (
        f"I want you to output LaTeX code with modifications only where specified. The starting code is {context}"
    )

    latex_response_content = (
        f"The user wants you to implement the following changes: {message}. "
        f"The specific part of the document they are referencing is: {focus}."
    ) if focus != None else (
        f"The user wants you to implement the following changes: {message}."
    )

    latex_response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(system_instruction=instruction),
        contents=latex_response_content
    )

    working_latex = latex_response.text
    working_latex = extract_latex(working_latex)

    chat_response_content = (
        f"Given the starting latex: {context} "
        f"your reached the ending latex: {working_latex} "
        f"by considering the desired changes: {message} "
        f"and focusing on the part of the document that said: {focus}. "
        f"Tersely explain what you changed and why."
    ) if focus != None else (
        f"Given the starting latex: {context} "
        f"your reached the ending latex: {working_latex} "
        f"by considering the desired changes: {message}. "
        f"Tersely explain what you changed and why."
    )

    chat_response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=chat_response_content
    )

    working_chat = chat_response.text
    return working_latex, working_chat

# This function handles the event loop setup
def modify_latex(context, focus, message):
    # Create a new event loop for this thread if needed
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    response_latex, response_chat = loop.run_until_complete(
        async_modify(
            context, focus, message
        )
    )
    
    return response_latex, response_chat