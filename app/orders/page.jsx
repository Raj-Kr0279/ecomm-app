"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgress = (status) => {
    const stages = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const index = stages.indexOf(status);
    return index === -1 ? 0 : ((index + 1) / stages.length) * 100;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <svg
          className="animate-spin h-8 w-8 mx-auto text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
          />
        </svg>
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/products">
          <Button className="mt-4">Shop Now</Button>
        </Link>
      </div>
    );
  }

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
            <div key={order._id} className="border p-6 rounded-md shadow-sm bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <p className="text-gray-600">
                    Placed on: {new Date(order.date).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    Status:{' '}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.deliveryStatus
                      )}`}
                    >
                      {order.deliveryStatus}
                    </span>
                  </p>
                  <div className="mt-4">
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
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Order Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${getProgress(order.deliveryStatus)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}