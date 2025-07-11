import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the reset link
    setStep('reset');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically change the password
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8">
        {step === 'request' ? (
          <section className="glass rounded-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-card p-3 rounded-full mb-4">
                <div className="text-4xl font-bold text-primary">P</div>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Reset your password</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email and we'll send you a link to get back into your account.
              </p>
            </div>
            
            <form onSubmit={handleSendResetLink} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="mt-2"
                />
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full">
                  Send reset link
                </Button>
              </div>
            </form>
            
            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to login
              </button>
            </div>
          </section>
        ) : (
          <section className="glass rounded-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-card p-3 rounded-full mb-4">
                <div className="text-4xl font-bold text-primary">P</div>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Set a new password</h1>
              <p className="text-muted-foreground mt-2">
                Your new password must be different from previous used passwords.
              </p>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <Label htmlFor="new-password" className="text-foreground">New Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="new-password"
                    name="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirm-password" className="text-foreground">Confirm New Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full">
                  Change Password
                </Button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;