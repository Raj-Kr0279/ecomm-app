"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import Button from '@/components/ui/Button';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          E-Shop
        </Link>
        <nav className="space-x-4">
          <Link href="/products" className="hover:text-gray-300">
            Products
          </Link>
          <Link href="/cart" className="hover:text-gray-300">
            Cart
          </Link>
          <Link href="/checkout" className="hover:text-gray-300">
            Checkout
          </Link>
          <Link href="/orders" className="hover:text-gray-300">
            Orders
          </Link>
          {user ? (
            <Button onClick={logout} className="bg-red-600 hover:bg-red-700">
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}