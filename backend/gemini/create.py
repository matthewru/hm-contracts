from google import genai
from google.genai import types
from datetime import datetime
import re
import asyncio
import os
import requests

def extract_latex(text):
    matches = re.findall(r"```latex\s*(.*?)\s*```", text, re.DOTALL)
    return matches[0] if matches else text

async def async_gen_latex(description, admin_first, admin_last, admin_company, document_type, client_first, client_last, client_company=None):
    date = datetime.today()

    client = genai.Client(api_key="AIzaSyChp7kIwWx_fA_QEENcIgWCbGrrTNp96-4")

    instruction = (
        "You are to output only LaTeX code with no explanation. "
        "The document must be formatted for standard letter paper (8.5x11 inches) with body text in 12pt font. "
        "Ensure the content fills the full page width, avoiding half-page layouts. "
        "The header/title must include the admin company name. "
        "Where forms are presented, use tables for clear organization. "
        "When you have an hrule, it should span the entire width of the content it attempts to capture. "
    )

    content = (
        f"Make me a professional {document_type} template based on the following info: "
        f"My information: name = {admin_first} {admin_last}, company = {admin_company}. "
        f"Client information: name = {client_first} {client_last}{', company = ' + client_company if client_company else ', no client company is provided, assume this is for an individual'}. "
        f"Date: {date}. "
        f"Additional description: {description}."
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
def gen_latex(description, admin_first, admin_last, admin_company, document_type, client_first, client_last, client_company=None, user_id=None):
    date = datetime.now().strftime("%B %d, %Y")
    
    # Get similar documents if user_id is provided
    similar_docs = []
    if user_id:
        try:
            response = requests.post(
                'http://localhost:5001/search_similar',
                json={'description': description, 'user_id': user_id}
            )
            if response.ok:
                similar_docs = response.json().get('results', [])
        except Exception as e:
            print(f"Error fetching similar documents: {e}")
    
    # Build context from similar documents
    context = ""
    if similar_docs:
        context = "Here are some similar documents I've created before:\n"
        for i, doc in enumerate(similar_docs, 1):
            doc_info = doc['document']
            context += f"{i}. {doc_info.get('doctype', 'Document')} for {doc_info.get('client', {}).get('firstName', '')} {doc_info.get('client', {}).get('lastName', '')}\n"
        context += "\nPlease use these as reference for style and structure.\n\n"
    
    # Build the prompt with RAG context
    prompt = (
        f"{context}"
        f"Make me a professional {document_type} template based on the following info: "
        f"My information: name = {admin_first} {admin_last}, company = {admin_company}. "
        f"Client information: name = {client_first} {client_last}{', company = ' + client_company if client_company else ', no client company is provided, assume this is for an individual'}. "
        f"Date: {date}. "
        f"Additional description: {description}."
    )
    
    # Create a new event loop for this thread if needed
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    output = loop.run_until_complete(
        async_gen_latex(
            description, admin_first, admin_last, admin_company, 
            document_type, client_first, client_last, client_company
        )
    )
    
    return output