from google import genai
from google.genai import types
import re

def extract_latex(text):
    matches = re.findall(r"```latex\s*(.*?)\s*```", text, re.DOTALL)
    return matches[0] if matches else text

client = genai.Client(api_key="AIzaSyChp7kIwWx_fA_QEENcIgWCbGrrTNp96-4")

instruction = (
    "You are to output only LaTeX code with no explanation"
)

response = client.models.generate_content(
    model="gemini-2.0-flash",
    config=types.GenerateContentConfig(system_instruction=instruction),
    contents="Make me a basic invoice template for a general contractor"
)

working_text = response.text

working_text = extract_latex(working_text)

with open("backend/workingFiles/output.tex", "w") as file:
    file.write(working_text)