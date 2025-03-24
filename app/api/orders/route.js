import { NextResponse } from 'next/server';

// Mock orders storage (replace with a database later)
let orders = [];

export async function POST(request) {
  const order = await request.json(); // Get order data from request body
  const newOrder = { id: Date.now(), ...order, date: new Date().toISOString() };
  orders.push(newOrder);
  return NextResponse.json({ message: 'Order placed', order: newOrder }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(orders);
}