"use client"
import GenContract from '../generate_contract/GenContract';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SendContractPopup from '@/components/ui/sendcontractpopup';


import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    let userID: any = null;
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      userID = storedUser?.id;
    }
  
    const fetchUserData = async () => {
      try {
        // Get API URL from localStorage or use environment variable as fallback
        const storedApiUrl = localStorage.getItem('apiUrl');
        const apiEndpoint = storedApiUrl || process.env.NEXT_PUBLIC_API_URL || 'https://hm-contracts.vercel.app';
        
        const response = await fetch(`${apiEndpoint}/api/user/${userID}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
  
    if (userID) {
      fetchUserData();
    }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }
  const contracts = user.documents;

  const handleRowClick = (index: number) => {
    console.log("clicked");
    localStorage.setItem('contractHtml', contracts[index].htmlcontent);
    localStorage.setItem('contractLatex', contracts[index].latexcontent);
    router.push('/view_contract');
  };
  
  
  const itemsPerPage = 12;
  const totalItems = contracts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contracts.slice(indexOfFirstItem, indexOfLastItem);

  // Page navigation
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'Sent':
        return "bg-green-100 text-green-800";
      case 'In Progress':
        return "bg-[#75e782]/20 text-[#5bc566]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          {/* Profile corner (top left) */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-[#75e782]">
              <AvatarFallback className="bg-[#75e782]/10 text-gray-700">{user.firstName[0] + user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg text-gray-800">{user.firstName + " " + user.lastName}</h3>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
          
          {/* Button (top right) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#75e782] text-gray-800 hover:bg-[#5bc566] border-none">
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl border-gray-100 shadow-md">
              <DialogHeader className="border-b border-gray-100 pb-2">
                <DialogTitle className="text-gray-800"></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              {user && <GenContract userId={user.user_id} />}
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
        </header>
        
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Dashboard</CardTitle>
            <CardDescription className="text-gray-500">Manage your documents and clients</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="w-[25%] text-gray-700">Type</TableHead>
                  <TableHead className="w-[25%] text-gray-700">Client</TableHead>
                  <TableHead className="w-[25%] text-gray-700">Status</TableHead>
                  <TableHead className="w-[25%] text-gray-700">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((item: any, index: number) => (
                  <TableRow 
                    key={index} 
                    onClick={() => handleRowClick(index)}
                    className="border-gray-100 cursor-pointer hover:bg-[#75e782]/5 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-800">{item.doctype}</TableCell>
                    <TableCell className="text-gray-700">{item.client.firstName + " " + item.client.lastName + (item.client.company ? ", " + item.client.company : "")}</TableCell>
                    <TableCell>
                      <Badge className={getStatusStyles(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">{item.date}</TableCell>
                    <TableCell className="flex justify-between items-center">
                      {item.status === "In Progress" && (
                        <div onClick={(e) => e.stopPropagation()}>  
                        <SendContractPopup/>
                      </div>
  )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} items
              </p>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="border-gray-200 text-gray-700 hover:border-[#75e782] hover:text-[#5bc566]"
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="border-gray-200 text-gray-700 hover:border-[#75e782] hover:text-[#5bc566]"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;