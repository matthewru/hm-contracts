import os
from flask import Blueprint, request, jsonify, session

modify_bp = Blueprint("modify_bp", __name__, url_prefix='/modify')

conversation_state = {

}

@modify_bp.route("/start", methods=["POST"])
def start_chat():
    """
    intiialize a conversation session for contract revisions. 

    input: retreive json payload of the contract text from DB

    returns session_id for use in subsequent request
    """
    data = request.get_json()
    contract_text = data.get("contract_text", "No contract text provided.")

    # Generate a unique session ID or use something from the user session
    # For simplicity, we'll just use a random integer or time-based ID
    import uuid
    session_id = str(uuid.uuid4())

    conversation_state[session_id] = {
        "contract_text": contract_text,
        "messages": [
            {
                "role": "system",
                "content": "You are an AI assistant that helps revise contracts. Be sure to keep track of all changes."
            }
        ]
    }

    return jsonify({
        "session_id": session_id,
        "contract_text": contract_text,
        "message": "Chat session started. Use this session_id for subsequent requests."
    }), 200

@modify_bp.route("/chat", methods=["POST"])
def chat():
    """
    handle user prompt (+optional highlight) to revise contract in conversational manner

    expect json payload: {"session_id": "...", "user_input": "...", "highlight": "..."}

    returns updated contract and AI's response
    """

    data = request.get_json()
    session_id = data.get("session_id")
    user_input = data.get("user_input", "")

    highlight = data.get("highlight", "") #this is optional
    if highlight:
        user_input += f"\n\nHighlighted section to revise: {highlight}"

    if not session_id or session_id not in conversation_state:
        return jsonify({"error": "Invalid or missing session_id."}), 400
    
    state = conversation_state[session_id]
    contract_text = state["contract_text"]
    messages = state["messages"]

    messages.append({"role": "user", "content": user_input})
    assistant_response = "" #TODO: integrate gemini here
    updated_contract_text = contract_text #TODO: put in updated contract from AI here

    # Update the conversation with the assistant's response
    messages.append({"role": "assistant", "content": assistant_response})

    # Save updated text and conversation
    conversation_state[session_id]["contract_text"] = updated_contract_text
    conversation_state[session_id]["messages"] = messages

    return jsonify({
        "session_id": session_id,
        "assistant_message": assistant_response,
        "updated_contract_text": updated_contract_text
    }), 200



    