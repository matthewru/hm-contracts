from google import genai
from google.genai import types

# template text
document_type = "invoice"
highlighted_text = "amount owed: $500.59 USD"

client = genai.Client(api_key="AIzaSyChp7kIwWx_fA_QEENcIgWCbGrrTNp96-4")

instruction = (
    "Your text output must be in concise complete sentences and remain under 50 words with only text output"
    "Make your response understandable for general audiences with little background "
)

content = (
    f"In the context of a form of type {document_type}, explain the meaning of the text: {highlighted_text}"
)

response = client.models.generate_content(
    model="gemini-2.0-flash",
    config=types.GenerateContentConfig(system_instruction=instruction),
    contents=content
)

def analyze_doc():
    return response.text