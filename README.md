# PaperPilot

PaperPilot is a contract management platform designed to streamline document creation, revision, and distribution—empowering small business owners to save time, money, and stress.


## Inspiration

Whether through our own experiences or those of our friends and family, we understand that small business owners often find themselves burdened by an abundance of paperwork they need to draft, revise, and distribute. We set out to develop a solution that does all three in one, simplifying contract management for the modern business owner.


## What It Does

- **Document Generation:**  
  Prompt the user for input and automatically generate documents (contracts, invoices, etc.) based on their description.
  
- **Seamless Revision:**  
  Interact directly with our AI to revise the document until it meets your needs.
  
- **Effortless Distribution:**  
  When satisfied, email the document straight from your dashboard.


## How We Built It

- **Frontend:**  
  Built with Next.js for a fast, responsive, and modern user interface.
  
- **Backend:**  
  Flask and MongoDB power our backend services.
  
- **AI & Models:**  
  Our model is built around the Gemini API, pretrained using LaTeX templates scraped from the web. We also implemented a Retrieval-Augmented Generation (RAG) architecture to enhance performance and consistency during document revisions.

- **Note:**  
  You must add your own API keys for Gemini in the configuration files. Ensure you set up the appropriate environment variables or configuration settings before running the application.


## What's Next for PaperPilot

Upcoming features and improvements include:
- Enhanced security features.
- Better prompt engineering for improved AI responses.
- More robust document distribution options.


## Installation

### Prerequisites

- Node.js and npm (for the Next.js frontend)
- Python 3.8+ (for the Flask backend)
- MongoDB
- [pip](https://pip.pypa.io/en/stable/)
- Gemini API access (remember to add your own API keys)

### Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/paperpilot.git
   cd paperpilot
   ```
2. **Frontend Setup (Next.js):**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup (Flask):**

   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
Create a .env file in the backend folder and add your Gemini API key along with other required settings:

  ```bash
  GEMINI_API_KEY=your_gemini_api_key_here
  MONGODB_URI=your_mongodb_connection_string
  SECRET_KEY=your_flask_secret_key
  ```

5. **Run the Backend:**

   ```bash
   python app.py
   ```

## Usage
- **Upload Documents:**  
  Upload contracts, invoices, or other documents through the web interface.

- **Preprocess & Annotate:**  
  Our system cleans, vectorizes, and indexes documents for efficient retrieval. AI-driven annotation can be used for further enhancements.

- **Search & Retrieve:**  
  Use semantic search to quickly find relevant contract sections.

- **Revise & Distribute:**  
  Interact with our AI to make revisions, then distribute the final document via email directly from your dashboard.


## Contributing

Contributions to PaperPilot are welcome! If you’d like to contribute, please:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.


## License

PaperPilot is released under the MIT License. See [LICENSE](LICENSE) for more information.


<img width="1512" alt="Screenshot 2025-03-13 at 2 50 46 PM" src="https://github.com/user-attachments/assets/3b77a1c6-208c-4346-a5f5-edd840b57a8a" />
<img width="1512" alt="Screenshot 2025-03-09 at 5 28 06 AM" src="https://github.com/user-attachments/assets/aeb434f5-8d22-461e-8218-ea3031d99cb7" />
