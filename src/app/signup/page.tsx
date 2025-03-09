'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    companyDescription: '',
    email: '',
    password: '',
    logo: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          companyDescription: formData.companyDescription,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }
      
      // Handle logo upload separately if needed
      if (formData.logo) {
        const logoFormData = new FormData();
        logoFormData.append('logo', formData.logo);
        logoFormData.append('userId', data.user.id);
        
        await fetch('/api/upload-logo', {
          method: 'POST',
          body: logoFormData,
        });
      }
      
      // Redirect to login page after successful signup
      router.push('/login');
    } catch (err: unknown) {
      setError('An error occurred during signup. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-100 shadow-sm">
        <CardHeader className="flex items-center space-y-2 pb-2">
          <Image
            src="/paperpilot-logo.png"
            alt="PaperPilot Logo"
            width={180}
            height={50}
            className="mb-4"
          />
          <CardDescription className="text-center text-gray-600">
            Sign up to start managing your contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-gray-700">Company Name *</Label>
              <Input
                id="companyName"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDescription" className="text-gray-700">Company Description</Label>
              <Textarea
                id="companyDescription"
                value={formData.companyDescription}
                onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                placeholder="Tell us about your company..."
                className="border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo" className="text-gray-700">Company Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, logo: e.target.files?.[0] || null})}
                className="border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#75e782] text-gray-800 hover:bg-[#5bc566] border-none mt-6" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[#5bc566] hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 