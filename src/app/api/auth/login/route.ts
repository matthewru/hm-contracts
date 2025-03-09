import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { MongoClient, ServerApiVersion } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// MongoDB connection
const uri = "mongodb+srv://matthewru07:hU2b3yphXGxhXykY@hm-contracts.s1zza.mongodb.net/?retryWrites=true&w=majority&appName=hm-contracts";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Connect to MongoDB
    await client.connect();
    const db = client.db("hm-contracts");
    const usersCollection = db.collection('users');
    
    // Find user
    const user = await usersCollection.findOne({ email });
    
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
        id: user.user_id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user info and token
    return NextResponse.json({
      user: {
        id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companyName: user.companyName
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Close the connection when done
    await client.close();
  }
} 