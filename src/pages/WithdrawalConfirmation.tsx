import React, { useState, useRef, useEffect } from 'react';
import { Lock, LockOpen, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const WithdrawalConfirmation = () => {
  const [authMethod, setAuthMethod] = useState<'pin' | '2fa'>('pin');
  const [pins, setPins] = useState(['', '', '', '', '', '']);
  const [twoFACode, setTwoFACode] = useState('');
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newPins = [...pins];
      newPins[index] = value;
      setPins(newPins);

      // Auto-focus next input
      if (value && index < 5) {
        pinRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pins[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    // Handle withdrawal confirmation
    console.log('Withdrawal confirmed');
  };

  useEffect(() => {
    if (authMethod === 'pin') {
      pinRefs.current[0]?.focus();
    }
  }, [authMethod]);

  return (
    <div className="min-h-screen">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Withdrawal Confirmation</h1>
      </div>
      
      <main className="p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <section className="glass p-6 md:p-8 rounded-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Confirm Withdrawal</h1>
              <p className="text-muted-foreground">
                Please review the details and confirm your withdrawal.
              </p>
            </div>
            
            {/* Transaction Summary */}
            <div className="bg-card/50 p-4 rounded-lg space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <p className="font-medium text-muted-foreground">Amount</p>
                <p className="font-semibold text-foreground text-lg">$500.00 USD</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium text-muted-foreground">Fee</p>
                <p className="font-semibold text-foreground">$5.00 USD</p>
              </div>
              <div className="border-t border-border my-2"></div>
              <div className="flex justify-between items-center">
                <p className="font-medium text-foreground">You will receive</p>
                <p className="font-bold text-primary text-xl">$495.00 USD</p>
              </div>
              <div className="pt-2">
                <p className="font-medium text-muted-foreground text-sm">To Bank Account:</p>
                <div className="flex items-center mt-1">
                  <CreditCard className="w-4 h-4 text-muted-foreground mr-2" />
                  <p className="text-foreground">**** **** **** 1234</p>
                </div>
              </div>
            </div>

            {/* Auth Method Toggle */}
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                variant={authMethod === 'pin' ? 'default' : 'outline'}
                onClick={() => setAuthMethod('pin')}
                size="sm"
              >
                Use PIN
              </Button>
              <Button
                variant={authMethod === '2fa' ? 'default' : 'outline'}
                onClick={() => setAuthMethod('2fa')}
                size="sm"
              >
                Use 2FA
              </Button>
            </div>

            {/* PIN Input */}
            {authMethod === 'pin' && (
              <form className="space-y-6">
                <div>
                  <Label className="block text-center mb-4">Enter your 6-digit PIN</Label>
                  <div className="flex justify-center space-x-2">
                    {pins.map((pin, index) => (
                      <Input
                        key={index}
                        ref={(el) => (pinRefs.current[index] = el)}
                        type="password"
                        maxLength={1}
                        value={pin}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        onKeyDown={(e) => handlePinKeyDown(index, e)}
                        className="w-12 h-14 text-center text-lg font-semibold"
                      />
                    ))}
                  </div>
                </div>
                
                <Button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full"
                  disabled={pins.some(pin => !pin)}
                >
                  <LockOpen className="w-4 h-4 mr-2" />
                  Confirm & Withdraw
                </Button>
              </form>
            )}

            {/* 2FA Input */}
            {authMethod === '2fa' && (
              <form className="space-y-6">
                <div>
                  <Label htmlFor="2fa-code" className="block text-center mb-4">
                    Enter 6-digit code from your authenticator app
                  </Label>
                  <Input
                    id="2fa-code"
                    type="text"
                    maxLength={6}
                    placeholder="------"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value)}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                
                <Button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full"
                  disabled={twoFACode.length !== 6}
                >
                  <LockOpen className="w-4 h-4 mr-2" />
                  Confirm & Withdraw
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cancel Withdrawal
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default WithdrawalConfirmation;