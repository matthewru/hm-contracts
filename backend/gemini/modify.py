from google import genai
from google.genai import types
from datetime import datetime
import re
import asyncio

def extract_latex(text):
    matches = re.findall(r"```latex\s*(.*?)\s*```", text, re.DOTALL)
    return matches[0] if matches else text

async def async_modify_latex(context, focus, message):
    date = datetime.today()

    client = genai.Client(api_key="AIzaSyChp7kIwWx_fA_QEENcIgWCbGrrTNp96-4")

    instruction = (
        "You are to only modify the LaTeX code that is directly related to the focused content. "
        "You are to output only LaTeX code with no explanation. "
    ) if focus != None else (
        "You are to only modify the LaTeX code that is directly related to the changes desired. "
        "You are to output only LaTeX code with no explanation. "
    )

    content = (
        f"The LaTeX code you are given is: {context}. "
        f"The user wants you to implement the following changes: {message}. "
        f"The specific part of the document they are referencing is {focus}."
    ) if focus != None else (
        f"The LaTeX code you are given is: {context}. "
        f"The user wants you to implement the following changes: {message}."
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
def modify_latex(context, focus, message):
    # Create a new event loop for this thread if needed
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    output = loop.run_until_complete(
        async_modify_latex(
            context, focus, message
        )
    )
    
    # Write the output to a LaTeX file before returning it
    # with open("workingFiles/output.tex", "w") as f:
    #     f.write(output)
    
    return output