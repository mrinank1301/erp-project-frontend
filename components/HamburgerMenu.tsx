"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Animate menu opening
      gsap.to(overlayRef.current, {
        x: 0,
        duration: 0.6,
        ease: "power3.inOut"
      });

      // Animate hamburger to X
      gsap.to(line1Ref.current, {
        rotate: 45,
        y: 8,
        duration: 0.3,
        ease: "power2.inOut"
      });
      gsap.to(line2Ref.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut"
      });
      gsap.to(line3Ref.current, {
        rotate: -45,
        y: -8,
        duration: 0.3,
        ease: "power2.inOut"
      });

      // Animate menu items
      gsap.fromTo(
        linksRef.current?.children || [],
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out"
        }
      );
    } else {
      // Animate menu closing
      gsap.to(overlayRef.current, {
        x: "-100%",
        duration: 0.6,
        ease: "power3.inOut"
      });

      // Animate X back to hamburger
      gsap.to(line1Ref.current, {
        rotate: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
      gsap.to(line2Ref.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.inOut"
      });
      gsap.to(line3Ref.current, {
        rotate: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-8 left-8 z-[100] w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all"
        aria-label="Menu"
      >
        <div ref={line1Ref} className="w-6 h-0.5 bg-white rounded-full"></div>
        <div ref={line2Ref} className="w-6 h-0.5 bg-white rounded-full"></div>
        <div ref={line3Ref} className="w-6 h-0.5 bg-white rounded-full"></div>
      </button>

      {/* Full Screen Menu Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-slate-900 z-[90] translate-x-[-100%]"
      >
        <div className="h-full flex items-center justify-center">
          <nav ref={linksRef} className="space-y-8">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block text-6xl font-bold text-white hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#cars"
              onClick={() => setIsOpen(false)}
              className="block text-6xl font-bold text-white hover:text-purple-400 transition-colors"
            >
              Cars
            </Link>
            <Link
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block text-6xl font-bold text-white hover:text-purple-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block text-6xl font-bold text-white hover:text-purple-400 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

