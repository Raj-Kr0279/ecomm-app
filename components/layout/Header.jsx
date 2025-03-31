"use client";

import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import Button from "@/components/ui/Button";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import logo from "@/public/logo.jpeg";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <nav className="space-x-4 flex items-center">
        <Link href="/" className="text-2xl flex items-center font-bold">
          <img src={logo.src} alt="Logo" className="h-8 rounded-full object-cover w-8 inline-block mr-2" />
        </Link>
          <div className="space-x-4 hidden md:flex">
          <Link href="/" className="hover:text-gray-500">
            About
          </Link>
          <Link href="/" className="hover:text-gray-500">
            Services
          </Link>
          <Link href="/" className="hover:text-gray-500">
            Contact
          </Link>
          <Link href="/" className="hover:text-gray-500">
            Blog
          </Link>
          </div>

          </nav>
        {/* Navigation */}
          {/* <Link href="/products" className="hover:text-gray-500">
            Products
          </Link> */}

          {/* Conditional Rendering Based on User Authentication */}
          {/* {user ? ( */}
            <>
              {/* User Profile Icon */}
              {/* <Link href="/orders" className="hover:text-gray-500">
                Orders
              </Link> */}
              <div className="right flex gap-6 items-center">
            

              <Link href="/wishlist" className="hover:text-gray-500">
                <IoHeartOutline size={20} />
              </Link>
              <Link href="/" className="hover:text-gray-500">
                <AiOutlineUser size={20} />
              </Link>
              <Link href="/cart" className="hover:text-gray-500">
                <IoCartOutline size={20} />
              </Link>
              </div>

              {/* Logout Button */}
              {/* <Button onClick={logout} className="">
                Logout
              </Button> */}
            </>
          
          

        {/* <div className="right">
          <Link href="/login" className="hover:text-gray-500">
            <FaHeart size={20} />
          </Link>
          <Link href="/login" className="hover:text-gray-500">
            <FaCartShopping size={20} />
          </Link>
          <Link href="/login" className="hover:text-gray-500">
            Login
          </Link>
          <Link href="/register" className="hover:text-gray-500">
            Register
          </Link>
        </div> */}
      </div>
    </header>
  );
}
