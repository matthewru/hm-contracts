import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// In a real app, you would use a database
const USERS = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    // In a real app, this would be hashed
    password: 'password123'
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Find user
    const user = USERS.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Create token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user info and token
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 