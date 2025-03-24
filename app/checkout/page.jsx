"use client";

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import Button from '@/components/ui/Button';
import { clearCart } from '@/lib/redux/cartSlice';
import Link from 'next/link';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ).toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      setError('Please log in to place an order');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }
    if (!formData.name || !formData.email || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    const orderData = {
      items: cartItems,
      total: parseFloat(total),
      shipping: formData,
    };

    try {
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderResult.message || 'Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'E-Shop',
        description: 'Order Payment',
        order_id: orderResult.order.razorpayOrderId,
        handler: async (response) => {
          const paymentData = {
            ...orderData,
            paymentId: response.razorpay_payment_id,
          };

          const finalRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(paymentData),
          });

          if (finalRes.ok) {
            alert('Order placed and paid successfully!');
            dispatch(clearCart());
            router.push('/orders');
          } else {
            throw new Error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: '9999999999',
        },
        theme: {
          color: '#34D399',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-lg">Your cart is empty</p>
          <Link href="/products">
            <Button className="mt-4">Shop Now</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-md shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border p-4 rounded-md shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-4 pt-4 border-t">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </div>
            {error && (
              <p className="text-red-600 mt-4 text-center animate-pulse">{error}</p>
            )}
            <Button
              className="w-full mt-6 bg-green-600 hover:bg-green-700 flex items-center justify-center transition-colors"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                  Processing...
                </>
              ) : (
                'Pay and Place Order'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}