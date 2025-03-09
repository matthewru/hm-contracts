import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;
    const userId = formData.get('userId') as string;
    
    if (!file || !userId) {
      return NextResponse.json(
        { message: 'Missing file or user ID' },
        { status: 400 }
      );
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const filename = `${userId}-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = path.join(uploadsDir, filename);
    
    // Write file to disk
    await writeFile(filePath, buffer);
    
    // In a real app, you would update the user's profile in the database
    // with the path to their logo
    
    return NextResponse.json({
      message: 'File uploaded successfully',
      logoUrl: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Error uploading file' },
      { status: 500 }
    );
  }
} 