import { NextResponse } from 'next/server';

// Mock product data (replace with a database later)
const products = [
  { id: 1, name: 'Product 1', price: 29.99 },
  { id: 2, name: 'Product 2', price: 39.99 },
  { id: 3, name: 'Product 3', price: 19.99 },
  
];

export async function GET() {
  return NextResponse.json(products);
}