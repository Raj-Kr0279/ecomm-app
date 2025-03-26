"use client";

import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import Button from "@/components/ui/Button";
import { FaCartShopping, FaHeart, FaUser } from "react-icons/fa6";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Shoppies
        </Link>

        {/* Navigation */}
        <nav className="space-x-4 flex items-center">
          <Link href="/products" className="hover:text-gray-500">
            Products
          </Link>
         

          {/* Conditional Rendering Based on User Authentication */}
          {user ? (
            <>
              {/* User Profile Icon */}
              <Link href="/orders" className="hover:text-gray-500">
            Orders
          </Link>
              <Link href="/profile" className="hover:text-gray-500">
                <FaUser size={20} />
              </Link>

              {/* Wishlist Icon */}
              <Link href="/wishlist" className="hover:text-gray-500">
                <FaHeart size={20} />
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" className="hover:text-gray-500">
                <FaCartShopping size={20} />
              </Link>

              {/* Logout Button */}
              <Button
                onClick={logout}
                className=""
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Login and Register Links */}
              <Link href="/login" className="hover:text-gray-500">
                Login
              </Link>
              <Link href="/register" className="hover:text-gray-500">
                Register
              </Link>

              {/* Wishlist Icon (Redirect to Login) */}
              <Link href="/login" className="hover:text-gray-500">
                <FaHeart size={20} />
              </Link>

              {/* Cart Icon (Redirect to Login) */}
              <Link href="/login" className="hover:text-gray-500">
                <FaCartShopping size={20} />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
