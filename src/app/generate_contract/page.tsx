"use client"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface FormData {
  doctype: string;
  client: {
    firstName: string;
    lastName: string;
    company?: string;
  };
  description: string;
}

const GenContract = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>(); // Use the FormData type
  const router = useRouter();

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const jsonData = {
      user_id: "auth0|67cc89198ab7ffc6de02365c",
      doctype: data.doctype,
      client: {
        firstName: data.client.firstName,
        lastName: data.client.lastName,
        company: data.client.company || null,
      },
      description: data.description,
    };

    fetch('http://localhost:5001/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.text())
      .then((html) => {
        localStorage.setItem('contractHtml', html);
        router.push('/view_contract');
      })
      .catch((error) => console.error('Error:', error));
    console.log('Form submitted:', data);
  };

  return (
    <div className="p-6 max-w-xl bg-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Generate Your Document</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Short Text Answer */}
        <div className="mb-4">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="doctype"
            type="text"
            placeholder="Enter Document Type"
            className="mt-4 w-full"
            {...register('doctype', { required: true })}
          />
          {errors.doctype && <p className="text-red-500 text-sm">Document type is required</p>}
        </div>

        {/* Client Information */}
        <div className="mb-4">
          <Label htmlFor="client.firstName">First Name</Label>
          <Input
            id="client.firstName"
            type="text"
            placeholder="Enter first name"
            className="mt-4 w-full"
            {...register('client.firstName', { required: true })}
          />
          {errors.client?.firstName && <p className="text-red-500 text-sm">First name is required</p>}
        </div>
        <div className="mb-4">
          <Label htmlFor="client.lastName">Last Name</Label>
          <Input
            id="client.lastName"
            type="text"
            placeholder="Enter last name"
            className="mt-4 w-full"
            {...register('client.lastName', { required: true })}
          />
          {errors.client?.lastName && <p className="text-red-500 text-sm">Last name is required</p>}
        </div>
        <div className="mb-4">
          <Label htmlFor="client.company">Company (Optional)</Label>
          <Input
            id="client.company"
            type="text"
            className="mt-4 w-full"
            placeholder="Enter company name (optional)"
            {...register('client.company')}
          />
        </div>

        {/* Long Answer Description */}
        <div className="mb-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter description"
            className="mt-4 w-full"
            rows={5}
            {...register('description', { required: true })}
          />
          {errors.description && <p className="text-red-500 text-sm">Description is required</p>}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default GenContract;