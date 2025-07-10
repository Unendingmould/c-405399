import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleCodeInput = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    if (paste.length === 6 && /^\d+$/.test(paste)) {
      setCode(paste.split(''));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md mx-auto p-4">
        {step === 1 && (
          <div className="glassmorphism rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-block bg-muted p-3 rounded-full mb-4">
                <div className="text-3xl font-bold text-primary">P</div>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Create your account</h1>
              <p className="text-muted-foreground">Start your journey with us.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="name">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="email">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" required />
                <div className="text-sm">
                  <label className="text-muted-foreground" htmlFor="terms">
                    I accept the{" "}
                    <a className="font-medium text-primary hover:underline" href="#">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <div className="pt-2">
                <Button className="w-full" type="submit">
                  Create Account
                </Button>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <a className="font-medium text-primary hover:underline" href="/login">
                  Log in
                </a>
              </p>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="glassmorphism rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 mb-4">
                <Mail className="text-primary h-6 w-6" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Check your inbox</h1>
              <p className="text-muted-foreground">We've sent a 6-digit verification code to your email.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 sr-only" htmlFor="code">
                  Verification Code
                </label>
                <div className="flex justify-center gap-2">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      className="w-12 h-14 text-center text-lg"
                      maxLength={1}
                      type="text"
                      value={digit}
                      onChange={(e) => handleCodeInput(e.target.value, index)}
                      onPaste={index === 0 ? handleCodePaste : undefined}
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <Button className="w-full" type="submit">
                  Verify Account
                </Button>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Didn't receive the code?{" "}
                <button className="font-medium text-primary hover:underline" type="button">
                  Resend
                </button>
              </p>
              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center text-sm text-muted-foreground hover:text-primary font-medium"
                type="button"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to sign up
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;