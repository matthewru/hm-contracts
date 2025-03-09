"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, MessageCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Bubble = {
  id: string;          // a unique ID, e.g. Date.now() or uuid
  text: string;        // the response text from the API
  top: number;         // Y coordinate for positioning
  show: boolean;       // to handle mounting/unmounting animations (optional)
};

const ViewContract = () => {

  const router = useRouter();  // Initialize the router

  const handleReturnClick = () => {
    router.push('/dashboard');  // Navigate to the dashboard page
  };
  const printRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // State to hold the full rendered LaTeX content (as HTML)
  const [HTMLContent, setHTMLContent] = useState<string>('');
  const [latexContent, setLatexContent] = useState<string>('');
  // State to hold split pages
  const [pages, setPages] = useState<string[]>([]);

  // Simplified chat state
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');

  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const storedHTML = localStorage.getItem('contractHtml') || '';
    const storeLatex = localStorage.getItem('contractLatex') || '';
    console.log(storedHTML)
    setHTMLContent(storedHTML);
    setLatexContent(storeLatex);
  }, []);

  // When HTMLContent updates, split it into pages using actual rendered heights
  useEffect(() => {
    if (HTMLContent) {
      // Create a temporary container for measuring content.
      const tempContainer = document.createElement('div');
      // Style it so it renders off-screen but still uses page layout rules.
      Object.assign(tempContainer.style, {
        position: 'absolute',
        top: '0',
        left: '-9999px',
        width: '900px', // same as your page container's max width
        visibility: 'hidden',
      });
      document.body.appendChild(tempContainer);
      tempContainer.innerHTML = HTMLContent;

      // Define the available page height in pixels.
      // Adjust this value based on your page size, margins, and scaling.
      const targetPageHeight = 700;
      let currentPageHTML = '';
      let currentHeight = 0;
      const newPages: string[] = [];

      // Iterate over the children of the temporary container.
      // We use 'children' to only consider element nodes.
      Array.from(tempContainer.children).forEach((child) => {
        // Clone the child so we can measure it independently.
        const measuringChild = child.cloneNode(true) as HTMLElement;
        tempContainer.appendChild(measuringChild);
        const elementHeight = measuringChild.offsetHeight;
        tempContainer.removeChild(measuringChild);

        // If adding this element would exceed the target height,
        // finalize the current page and start a new one.
        if (currentHeight + elementHeight > targetPageHeight) {
          if (currentPageHTML.trim().length > 0) {
            newPages.push(currentPageHTML);
          }
          // Start a new page with the current child
          currentPageHTML = child.outerHTML;
          currentHeight = elementHeight;
        } else {
          currentPageHTML += child.outerHTML;
          currentHeight += elementHeight;
        }
      });

      // If there is leftover content, add it as a final page.
      if (currentPageHTML.trim().length > 0) {
        newPages.push(currentPageHTML);
      }

      // Clean up the temporary container.
      document.body.removeChild(tempContainer);

      setPages(newPages);
    }
  }, [HTMLContent]);

  // Simplified message handler - just returns a fixed message
  const handleSendMessage = async () => {
    if (!inputMessage) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: inputMessage }
    ]);

    const selection = window.getSelection();
    let focusedText = "";
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (printRef.current && printRef.current.contains(range.commonAncestorContainer)) {
        focusedText = selection.toString();
      }
    } 

    const holdInput = inputMessage;
    setInputMessage('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hm-contracts.vercel.app';

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: holdInput, focus: focusedText, context: latexContent, conv_context: messages })
      })
      
      const { latex, html, chat } = await response.json();

      setLatexContent(latex)
      setHTMLContent(html)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: chat }
      ]);

    } catch (err) {
      console.log(err)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Unable to generate response. Please try again.' }
      ]);
    }
  };


  return (
    <div className="min-h-screen flex bg-white justify-center">
      {/* Contract Viewer Section */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isChatOpen ? 'pr-[77%]' : 'pr-0'
        }`}
      >
        {/* Header */}
        <header className="w-full flex justify-between items-center p-8">
          <h1 className="text-3xl font-bold">View Contract</h1>
          <div className="flex gap-2">
              <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleReturnClick}// Add the onClick handler
        >
          <Edit className="h-4 w-4" />
          Return to Dashboard
        </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                setIsChatOpen(!isChatOpen)
                if (!isChatOpen) {
                  setBubbles([]);
                }
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>
          </div>
        </header>

        {/* Contract Pages Container */}
        <div 
          className="w-full flex-1 overflow-y-auto overflow-x-hidden flex justify-center"
        >
          <div ref={printRef} className="flex flex-col items-center gap-8 py-4 px-8">
            {pages.map((page, index) => (
              <div
                key={index}
                style={{ 
                  width: '8.5in',
                  height: '11in',
                  margin: '0 auto',
                  padding: '8%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  position: 'relative',
                  border: '1px solid #e0e0e0'
                }}
                className="shadow-xl relative"
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: page }}
                  className="flex flex-col gap-4"
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: 'min(12pt, 1.5vw)',
                    lineHeight: '1.5',
                    overflow: 'hidden'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            style={{
              position: 'absolute',
              top: bubble.top,
              right: '20px', // pinned to the right
              width: '200px',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease-in-out', // for basic animation
              // Optionally fade in/out if bubble.show is toggled
              opacity: bubble.show ? 1 : 0,
              transform: bubble.show ? 'translateX(0)' : 'translateX(100px)',
              zIndex: 1000
            }}
          >
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                // remove bubble
                setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
              }}
            >
              <X className="h-2 w-2" />
            </Button>
            {bubble.text}
          </div>
        ))}

        
      </div>

      {/* Chat Section */}
      <div 
        className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 transition-all duration-300 ${
          isChatOpen ? 'w-[40%] translate-x-0' : 'w-[40%] translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chat</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-100 ml-auto' 
                    : 'bg-gray-100'
                } max-w-[80%]`}
              >
                {message.content}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-md"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContract;
