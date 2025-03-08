"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const ViewContract = () => {
  const printRef = useRef<HTMLDivElement>(null);
  
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

  // When latexContent updates, split it into pages by a defined marker.
  useEffect(() => {
    if (latexContent) {
      const splitPages = latexContent.split('<!--PAGE_BREAK-->');
      setPages(splitPages);
    }
  }, [latexContent]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Contract'
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">View Contract</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Modify
        </Button>
      </header>

      {/* Contract Pages Container */}
      <div ref={printRef}>
        {pages.map((page, index) => (
          <div
            key={index}
            style={{ width: '8.5in', height: '11in' }}
            className="bg-white shadow-md p-6 mb-4 overflow-auto"
          >
            <div dangerouslySetInnerHTML={{ __html: page }} />
          </div>
        ))}
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <Button onClick={() => handlePrint()} className="mt-6">
          Export to PDF
        </Button>
      </div>
    </div>
  );
};

export default ViewContract;