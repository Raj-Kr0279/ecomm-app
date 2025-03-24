"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchOrders() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [token]);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  if (!token) {
    return (
      <div className="container mx-auto p-4 max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>
        <p className="text-lg">Please log in to view your orders</p>
        <Link href="/login">
          <Button className="mt-4">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-lg">No orders yet</p>
          <Link href="/products">
            <Button className="mt-4">Shop Now</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border p-6 rounded-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Order #{order._id}
                  </h2>
                  <p className="text-gray-600">
                    Placed on: {new Date(order.date).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <p><strong>Shipped to:</strong> {order.shipping.name}</p>
                    <p>{order.shipping.email}</p>
                    <p>{order.shipping.address}</p>
                    {order.shipping.city && order.shipping.zip && (
                      <p>{order.shipping.city}, {order.shipping.zip}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Items</h3>
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between mb-2">
                      <span>
                        {item.product.name} (x{item.quantity})
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold mt-4 pt-4 border-t">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}