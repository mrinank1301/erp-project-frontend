"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Car, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, signOut, getUserRole } = useAuth();
  const role = getUserRole();

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold hover:scale-105 transition-transform">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
            <Car className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
            Car Showcase
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          
          {user ? (
            <>
              {role === 'admin' && (
                <Link href="/admin">
                  <Button variant="ghost">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-purple-50">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

