'use client'
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import { removeFromCart } from '@/lib/redux/cartSlice'; // Updated path
import Link from 'next/link';

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cartItems?.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border p-4 rounded-md"
            >
              <div>
                <h2 className="text-lg">{item.name}</h2>
                <p className="text-gray-600">
                  ${item.price} x {item.quantity}
                </p>
              </div>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Link href="/checkout">
            <Button className="mt-4 w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      )}
    </div>
  );
}