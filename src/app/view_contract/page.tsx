"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, MessageCircle, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const ViewContract = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // State to hold the full rendered LaTeX content (as HTML)
  const [latexContent, setLatexContent] = useState<string>('');
  // State to hold split pages
  const [pages, setPages] = useState<string[]>([]);

  // Simulate fetching rendered LaTeX content from the backend
  useEffect(() => {
    // This is example content with a page break marker.
    // In your actual implementation, you might fetch this via an API call.
    const fetchedContent = `
      <div>
        <h1>Page 1: Contract Content</h1>
        <p>This is the first page of the contract. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <!--PAGE_BREAK-->
      <div>
        <h1>Page 2: More Content</h1>
        <p>This is the second page of the contract. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis.</p>
      </div>
    `;
    setLatexContent(fetchedContent);
  }, []);

  useEffect(() => {
    const storedContent = localStorage.getItem('contractHtml') || '';
    setLatexContent(storedContent);
  }, []);

  // When latexContent updates, split it into pages by a defined marker
  useEffect(() => {
    if (latexContent) {
      // Calculate approximate characters per page (based on standard margins and font size)
      const charsPerPage = 3000; // This can be adjusted based on your font size and content

      // Split by explicit page breaks first
      const splitByMarker = latexContent.split('<!--PAGE_BREAK-->');
      
      const processedPages = splitByMarker.flatMap(content => {
        // If content length exceeds our target page size
        if (content.length > charsPerPage) {
          // Try to split at natural break points
          const sections = content.split(/(?=<h[1-6]>)|(?=<div)|(?=\n\n)/g);
          
          let currentPage = '';
          const pages = [];
          
          sections.forEach(section => {
            if ((currentPage + section).length > charsPerPage) {
              if (currentPage) {
                pages.push(currentPage);
                currentPage = section;
              } else {
                pages.push(section);
              }
            } else {
              currentPage += section;
            }
          });
          
          if (currentPage) {
            pages.push(currentPage);
          }
          
          return pages;
        }
        return [content];
      }).filter(page => page.trim().length > 0);

      setPages(processedPages);
    }
  }, [latexContent]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Contract'
  });

  return (
    <div className="min-h-screen flex bg-white">
      {/* Contract Viewer Section */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isChatOpen ? 'pr-[40%]' : 'pr-0'
        }`}
      >
        {/* Header */}
        <header className="w-full flex justify-between items-center p-8">
          <h1 className="text-3xl font-bold">View Contract</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Modify
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>
          </div>
        </header>

        {/* Contract Pages Container */}
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden flex justify-center">
          <div ref={printRef} className="flex flex-col items-center gap-8 w-full max-w-[900px] py-4 px-8">
            {pages.map((page, index) => (
              <div
                key={index}
                style={{ 
                  width: '100%',
                  aspectRatio: '0.773',
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

        {/* Export Button */}
        <div className="p-8">
          <Button onClick={() => handlePrint()}>
            Export to PDF
          </Button>
        </div>
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
          <div className="flex-1 overflow-y-auto p-4">
            {/* Add your chat messages here */}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <Button>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContract;