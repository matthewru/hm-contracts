import os
import tempfile
import subprocess
from flask import Blueprint, render_template, request, jsonify
from gemini.modify import modify_latex
from scripts.make4ht import convert_latex_to_html
from db_helpers import db
from bson import ObjectId

chat_bp = Blueprint('chat_bp', __name__)

@chat_bp.route('/chat', methods = ['POST'])
def start_chat():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON data'}), 400

    message = data.get('message')
    focus = data.get('focus')
    context = data.get('context')
    conv_context = data.get('conv_context')

    max_attempts = 3
    response_latex = context
    
    user_object = db['users'].find_one({
                "documents.latexcontent": response_latex
            })

    for attempt in range(max_attempts):
        try:
            response_latex, response_chat = modify_latex(context, focus, message, conv_context)

            # print(response_latex)
            # print(response_chat)

            
            
            

            with tempfile.TemporaryDirectory() as tmpdir:
                tex_file = os.path.join(tmpdir, "contract.tex")
                with open(tex_file, "w", encoding="utf-8") as f:
                    f.write(response_latex)

                try:
                    # Convert the LaTeX file to HTML (with inline CSS) using our module.
                    output_html_path = os.path.join(tmpdir, "contract.html")
                    convert_latex_to_html(tex_file, output_html_path, workdir=tmpdir)

                    # Read the generated HTML content
                    with open(output_html_path, "r", encoding="utf-8") as f:
                        response_html = f.read()

                    # doc_payload = {"content": html_content, 
                    #                "doctype": "",
                    #                "client": ""} 
                    # 
                    # # TODO: MATTHEW

                    # update_user_documents(user_id, doc_payload)
                    
                    if user_object:
                        user_id = user_object.get("_id")
                        
                        
                        # Find the specific document in the user's documents array
                        document_index = None
                        for i, doc in enumerate(user_object.get("documents", [])):
                            if doc.get("latexcontent") == context:
                                document_index = i
                                break
                        
                        if document_index is not None:
                            # Update the specific document with modified content
                            update_result = db['users'].update_one(
                                            {
                                                "_id": ObjectId(user_id),
                                                "documents.latexcontent": context
                                            },
                                            {
                                                "$set": {
                                                    "documents.$.latexcontent": response_latex,
                                                    "documents.$.htmlcontent": response_html
                                                }
                                            }
                                        )

                            print(update_result)
                        else:
                            print("User not found for the given LaTeX content")
                    
                    
                    return jsonify({
                        "latex": response_latex,
                        "html": response_html,
                        "chat": response_chat
                    })
                except subprocess.CalledProcessError as e:
                    print(f"TeX4ht conversion failed: {e.stderr}")
                    return jsonify({'error': 'Failed to convert document to HTML'}), 500
        except Exception as e:
            print(f"Attempt {attempt + 1} failed; error message: {e}")
            if attempt == max_attempts - 1:
                return jsonify({
                        "latex": response_latex,
                        "html": response_html,
                        "chat": response_chat
                    })

