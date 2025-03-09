from google import genai
from google.genai import types
from datetime import datetime
import re
import asyncio
import os
import requests
import string

def extract_latex(text):
    matches = re.findall(r"```latex\s*(.*?)\s*```", text, re.DOTALL)
    return matches[0] if matches else text

def load_template(document_type):
    # Map document types to template files
    template_mapping = {
        'consulting': 'consulting1.tex',
        'contract': 'contract1.tex',
        'job offer': 'joboffer1.tex',
        'nda': 'nda1.tex',
        'privacy policy': 'privacypol1.tex',
        'invoice': 'purchaseorder1.tex',
        'service': 'service1.tex',
        'terms of service': 'terms1.tex'
    }
    
    # Normalize document type (lowercase, remove special chars)
    normalized_type = ''.join(c for c in document_type.lower() if c in string.ascii_lowercase + ' ')
    
    # Find the best matching template
    best_match = None
    for key in template_mapping:
        if key in normalized_type:
            best_match = key
            break
    
    # If no match found, default to contract
    template_file = template_mapping.get(best_match, 'contract1.tex')
    
    # Load the template file
    template_path = os.path.join(os.path.dirname(__file__), '..', 'templates', template_file)
    try:
        with open(template_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print(f"Error loading template {template_file}: {e}")
        return None

async def async_gen_latex(description, admin_first, admin_last, admin_company, document_type, client_first, client_last, client_company=None, template_content=None):
    date = datetime.today()
    client = genai.Client(api_key="AIzaSyChp7kIwWx_fA_QEENcIgWCbGrrTNp96-4")

    # If we have a template, use it for modification
    if template_content:
        instruction = (
            "You are to output only LaTeX code with no explanation. "
            "I will provide you with a LaTeX template and information to fill in. "
            "Modify the template to include the specific details I provide, but maintain the overall structure and formatting. "
            "Do not add explanatory text or comments outside the LaTeX code."
        )

        content = (
            f"Here is a LaTeX template for a {document_type}:\n\n"
            f"```latex\n{template_content}\n```\n\n"
            f"Please modify this template with the following information:\n"
            f"- Admin: {admin_first} {admin_last}, Company: {admin_company}\n"
            f"- Client: {client_first} {client_last}{', Company: ' + client_company if client_company else ''}\n"
            f"- Date: {date.strftime('%B %d, %Y')}\n"
            f"- Description: {description}\n\n"
            f"Fill in all appropriate fields in the template with this information."
        )
    else:
        # Fallback to generating from scratch
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
            f"Date: {date.strftime('%B %d, %Y')}. "
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
    
    # Load the appropriate template based on document type
    template_content = load_template(document_type)
    
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
    
    # Create a new event loop for this thread if needed
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    output = loop.run_until_complete(
        async_gen_latex(
            description, admin_first, admin_last, admin_company, 
            document_type, client_first, client_last, client_company,
            template_content
        )
    )
    
    return output