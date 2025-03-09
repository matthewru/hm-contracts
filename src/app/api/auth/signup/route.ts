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
    const { firstName, lastName, companyName, companyDescription, email, password } = await request.json();
    
    // Connect to MongoDB
    await client.connect();
    const db = client.db("hm-contracts");
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Find the highest user_id to increment
    const lastUser = await usersCollection.find().sort({ user_id: -1 }).limit(1).toArray();
    const lastUserId = lastUser.length > 0 ? parseInt(lastUser[0].user_id.replace('', '')) : 0;
    const newUserId = lastUserId + 1;
    
    // Create new user document
    const newUser = {
      user_id: newUserId,
      firstName,
      lastName,
      companyName,
      companyDescription: companyDescription || '',
      email,
      password, // In a real app, this would be hashed
      documents: [] // Initialize empty documents array
    };
    
    // Insert user into database
    await usersCollection.insertOne(newUser);
    
    // Create token
    const token = jwt.sign(
      { 
        id: newUserId,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user info and token
    return NextResponse.json({
      user: {
        id: newUserId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        companyName: newUser.companyName
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Close the connection when done
    await client.close();
  }
} 