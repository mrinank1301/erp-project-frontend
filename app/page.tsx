"use client";

import { useEffect, useState, useCallback } from 'react';
import { carApi, Car } from '@/lib/api';
import CarCard from '@/components/CarCard';
import { useToast } from '@/components/ui/use-toast';
import { ChevronDown } from 'lucide-react';
import HamburgerMenu from '@/components/HamburgerMenu';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, getUserRole } = useAuth();

  const fetchCars = useCallback(async () => {
    try {
      const data = await carApi.getAllCars();
      setCars(data);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch cars. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Only fetch cars if user is signed in
    if (user) {
      fetchCars();
    } else {
      setLoading(false);
    }
  }, [user, fetchCars]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Hamburger Menu */}
        <HamburgerMenu />
        
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          {/* Fallback gradient background */}
          <div className="absolute inset-0 "></div>
          
          {/* Video element */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>

        {/* Login/Signup Buttons or User Info (Top Right) */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                {user.email}
              </span>
              {getUserRole() === 'admin' && (
                <Link href="/admin">
                  <Button 
                    className="bg-purple-600 text-white hover:bg-purple-700 font-semibold"
                  >
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className="text-white border border-white/30 hover:bg-white/20 backdrop-blur-md"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Main Heading */}
            <h1 className="text-7xl md:text-8xl font-bold text-white tracking-tight animate-slide-up">
              Car Showcase
            </h1>
            
            {/* Subheading */}
            <p className="text-2xl md:text-3xl text-white/90 font-light animate-slide-up" style={{ animationDelay: '0.1s' }}>
              100% Electric Future
            </p>

            {/* CTA */}
            <div className="pt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <a 
                href="#cars"
                className="inline-flex items-center gap-2 text-white text-lg font-medium hover:text-white/80 transition-colors group"
              >
                Discover our cars
                <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* Cars Grid - Only visible when signed in */}
      {user ? (
        <section id="cars" className="container mx-auto px-4 py-20">
          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
              <p className="mt-6 text-xl text-slate-600 font-medium">Loading amazing cars...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-32">
              <div className="text-6xl mb-4">🚗</div>
              <p className="text-2xl text-slate-600 font-medium">No cars available at the moment.</p>
              <p className="text-slate-500 mt-2">Check back soon for new arrivals!</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                  Our Premium Collection
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Hand-picked selection of the finest automobiles from around the world
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map((car, index) => (
                  <div
                    key={car.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className="animate-slide-up"
                  >
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="container mx-auto px-4 py-32">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-7xl mb-6">🔒</div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Sign In to View Our Collection
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Create an account or log in to explore our premium car inventory
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/login">
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  size="lg"
                  className="text-lg px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
