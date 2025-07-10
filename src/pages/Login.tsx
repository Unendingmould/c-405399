import React, { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const [view, setView] = useState<'login' | '2fa'>('login');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 bg-background">
      <div className="w-full max-w-md mx-auto">
        <div className="glassmorphism rounded-xl p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-muted p-4 rounded-full mb-4 border border-border">
              <div className="text-4xl font-bold text-primary">P</div>
            </div>
            <h1 className="text-3xl font-semibold text-foreground">Sign in to your account</h1>
            <p className="text-muted-foreground mt-2">Welcome back! Please enter your details.</p>
          </div>

          {view === 'login' && (
            <div>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      className="pl-10"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      className="pl-10"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" />
                    <label className="text-sm text-muted-foreground" htmlFor="remember-me">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a className="font-medium text-primary hover:text-primary/80" href="#">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div>
                  <Button 
                    className="w-full" 
                    onClick={(e) => {
                      e.preventDefault();
                      setView('2fa');
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              </form>
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a className="font-medium text-primary hover:text-primary/80" href="/signup">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          )}

          {view === '2fa' && (
            <div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">Two-Factor Authentication</h2>
                <p className="text-muted-foreground mt-2">Enter the code from your authenticator app.</p>
              </div>
              <form className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 sr-only" htmlFor="2fa-code">
                    2FA Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      className="pl-10 text-center tracking-[0.5em]"
                      id="2fa-code"
                      maxLength={6}
                      name="2fa-code"
                      placeholder="_ _ _ _ _ _"
                      type="text"
                    />
                  </div>
                </div>
                <div>
                  <Button className="w-full" type="submit">
                    Verify
                  </Button>
                </div>
              </form>
              <div className="text-center mt-6">
                <button
                  onClick={() => setView('login')}
                  className="font-medium text-sm text-primary hover:text-primary/80 inline-flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;