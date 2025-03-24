"use client";

import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import { addToCart, removeFromCart } from '@/lib/redux/cartSlice';
import Link from 'next/link';

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleIncrease = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(addToCart({ ...item, quantity: -1 }));
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ).toFixed(2);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-lg">Your cart is empty</p>
          <Link href="/products">
            <Button className="mt-4">Shop Now</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center border p-4 rounded-md shadow-sm"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                <div className="flex items-center mt-2">
                  <Button
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                    onClick={() => handleDecrease(item)}
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                    onClick={() => handleIncrease(item)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button
                className="ml-4 bg-red-600 hover:bg-red-700"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-6 pt-4 border-t">
            <span>Total:</span>
            <span>${total}</span>
          </div>
          <Link href="/checkout">
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}