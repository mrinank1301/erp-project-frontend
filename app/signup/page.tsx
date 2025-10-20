"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Car, User, Shield } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, role);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Email sent, complete verification to login",
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 px-4 animate-fade-in relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      <Card className="w-full max-w-md shadow-2xl animate-bounce-in border-2 border-white/20 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Car className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">Sign up to start exploring amazing cars</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all focus:shadow-md"
              />
            </div>
            
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Select Your Role</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* User Role Option */}
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`
                    relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${role === 'user' 
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : 'border-slate-200 bg-white hover:border-green-300 hover:bg-green-50/50'
                    }
                  `}
                >
                  <User className={`h-6 w-6 ${role === 'user' ? 'text-green-600' : 'text-slate-600'}`} />
                  <div className="text-center">
                    <div className={`font-semibold ${role === 'user' ? 'text-green-700' : 'text-slate-700'}`}>
                      User
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Browse and explore cars
                    </div>
                  </div>
                  {role === 'user' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Admin Role Option */}
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`
                    relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${role === 'admin' 
                      ? 'border-teal-500 bg-teal-50 shadow-md' 
                      : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50'
                    }
                  `}
                >
                  <Shield className={`h-6 w-6 ${role === 'admin' ? 'text-teal-600' : 'text-slate-600'}`} />
                  <div className="text-center">
                    <div className={`font-semibold ${role === 'admin' ? 'text-teal-700' : 'text-slate-700'}`}>
                      Admin
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Manage car inventory
                    </div>
                  </div>
                  {role === 'admin' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all focus:shadow-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="transition-all focus:shadow-md"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full transition-all hover:shadow-xl hover:scale-105 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-6 text-base" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-green-600 hover:text-teal-600 transition-colors underline-offset-4 hover:underline">
              Sign in
            </Link>
          </div>
          <div className="mt-4 text-center text-xs text-slate-500">
            Secure signup powered by Supabase 🔒
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

