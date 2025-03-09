"use client"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  doctype: string;
  client: {
    firstName: string;
    lastName: string;
    company?: string;
  };
  description: string;
}

const GenContract = ({ userId }: { userId?: string }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com';

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true);
    
    const jsonData = {
      user_id: userId,
      doctype: data.doctype,
      client: {
        firstName: data.client.firstName,
        lastName: data.client.lastName,
        company: data.client.company || null,
      },
      description: data.description,
    };

    fetch(`${apiUrl}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('contractHtml', data.html);
        localStorage.setItem('contractLatex', data.latex);
        router.push('/view_contract');
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };

  return (
    <div className="p-6 max-w-xl bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Generate Your Document</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Subject/Document Type */}
        <div className="mb-4">
          <Label htmlFor="doctype" className="text-gray-700 font-medium">Subject</Label>
          <Input
            id="doctype"
            type="text"
            placeholder="Enter Document Type"
            className="mt-2 w-full border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
            {...register('doctype', { required: true })}
          />
          {errors.doctype && <p className="text-red-500 text-sm mt-1">Document type is required</p>}
        </div>

        {/* Client Information */}
        <div className="mb-4">
          <Label htmlFor="client.firstName" className="text-gray-700 font-medium">First Name</Label>
          <Input
            id="client.firstName"
            type="text"
            placeholder="Enter first name"
            className="mt-2 w-full border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
            {...register('client.firstName', { required: true })}
          />
          {errors.client?.firstName && <p className="text-red-500 text-sm mt-1">First name is required</p>}
        </div>
        
        <div className="mb-4">
          <Label htmlFor="client.lastName" className="text-gray-700 font-medium">Last Name</Label>
          <Input
            id="client.lastName"
            type="text"
            placeholder="Enter last name"
            className="mt-2 w-full border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
            {...register('client.lastName', { required: true })}
          />
          {errors.client?.lastName && <p className="text-red-500 text-sm mt-1">Last name is required</p>}
        </div>
        
        <div className="mb-4">
          <Label htmlFor="client.company" className="text-gray-700 font-medium">Company (Optional)</Label>
          <Input
            id="client.company"
            type="text"
            className="mt-2 w-full border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors"
            placeholder="Enter company name (optional)"
            {...register('client.company')}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter description"
            className="mt-2 w-full border-gray-200 focus:border-[#75e782] focus:ring-[#75e782] transition-colors min-h-[120px]"
            {...register('description', { required: true })}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
        </div>

        {/* Submit Button with Loading State */}
        <Button 
          type="submit" 
          className="w-full mt-6 bg-[#75e782] text-gray-800 hover:bg-[#5bc566] border-none"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
};

export default GenContract;