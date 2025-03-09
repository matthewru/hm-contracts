"use client"
import GenContract from '../generate_contract/page';
import React, { useState, useEffect } from 'react';
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Dashboard = () => {

  const userID = 6
  const [user, setUser] = useState<any | null>(null);  // Use proper type
  const [error, setError] = useState<string | null>(null);  // Error state
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    // Function to fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/user/${userID}`);
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
  }, [userID]);

  console.log(user)
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }
  //   const user = {
  //   name: "Jane Doe",
  //   email: "jane.doe@example.com",
  //   avatar: "/api/placeholder/64/64",
  //   role: "Administrator"
  // };
  const contracts = user.documents

  const sampleContracts = [
    {id: 0, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Completed"},
    {id: 1, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 2, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "In Progress"},
    {id: 3, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 4, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 5, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 6, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 7, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 8, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 9, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 10, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 11, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
    {id: 12, doctype: "Invoice", firstName: "Henry", lastName: "Ru", company: "Gentleman's Club", status: "Pending"},
  ]

  
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
      case 'Completed':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'In Progress':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'Pending':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          {/* Profile corner (top left) */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
              <AvatarFallback>{user.firstName[0] + user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{user.firstName + " " + user.lastName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
          </div>
          
          {/* Button (top right) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription>
                </DialogDescription>
              </DialogHeader>
              <GenContract></GenContract>
              <DialogFooter>
              </DialogFooter>
            </DialogContent>
            
          </Dialog>
          
        </header>
        
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Manage your documents and clients</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Type</TableHead>
                  <TableHead className="w-[25%]">Client</TableHead>
                  <TableHead className="w-[25%]">Status</TableHead>
                  <TableHead className="w-[25%]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.doctype}</TableCell>
                    <TableCell className="font-medium">{item.client.firstName + " " + item.client.lastName + ", " + item.client.company}</TableCell>
                    <TableCell>
                      <Badge className={getStatusStyles(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} items
              </p>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
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