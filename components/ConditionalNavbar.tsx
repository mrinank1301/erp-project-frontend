"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on home page (we use hamburger menu instead)
  if (pathname === '/') {
    return null;
  }
  
  return <Navbar />;
}

