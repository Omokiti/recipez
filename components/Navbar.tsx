"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter,usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router =useRouter()

  const showLogout = isLoggedIn && pathname.startsWith("/dashboard");


  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);
  
  const handleLogout=()=>{
    localStorage.removeItem('token')
    router.push('/login')

  }

  return (
    <nav className="bg-orange-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          Recipez<span className="text-yellow-200">🍴</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 font-medium">
          <Link href="/" className="hover:text-yellow-200 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-yellow-200 transition">
            About
          </Link>
          <Link href="/signup" className="hover:text-yellow-200 transition">
            Sign Up
          </Link>
          <Link href="/login" className="hover:text-yellow-200 transition">
            Login
          </Link>
          {showLogout &&(
             <Link href="#" className="hover:text-yellow-200 transition" onClick={(e)=>{
              e.preventDefault();
              handleLogout()
            }}>
              Logout
            </Link>
           )}
         
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-orange-600 space-y-2 px-6 py-4 font-medium">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block hover:text-yellow-200 transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block hover:text-yellow-200 transition"
          >
            About
          </Link>
          <Link
            href="/signup"
            onClick={() => setIsOpen(false)}
            className="block hover:text-yellow-200 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block hover:text-yellow-200 transition"
          >
            Login
          </Link>
          {showLogout && (
             <Link href="#" className="hover:text-yellow-200 transition" onClick={(e)=>{
              e.preventDefault();
              handleLogout()
            }}>
              Logout
            </Link>
          )}
         
        </div>
      )}
    </nav>
  );
}
