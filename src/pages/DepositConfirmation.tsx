import { useState, useEffect } from "react";
import { Copy, Timer, Info, Hourglass, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DepositConfirmation = () => {
  const [walletAddress] = useState("0x1A2b3c4D5e6F7g8H9i0Jk1L2m3N4o5P6q7R8s9T0");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(1800); // 30 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
      <Card className="max-w-lg w-full">
        <CardContent className="p-6 md:p-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Deposit Confirmation</h1>
          <p className="text-muted-foreground mb-6">Complete your deposit by sending funds to the address below.</p>
          
          <div className="bg-muted/50 p-6 rounded-xl flex flex-col items-center mb-6">
            <div className="mb-4">
              <img 
                alt="QR Code" 
                className="rounded-lg border-4 border-border w-32 h-32"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' fill='%23ffffff'/%3E%3Cpath d='M0 0h8v8H0zm16 0h8v8h-8zm32 0h8v8h-8zm48 0h8v8h-8zm64 0h8v8h-8zm80 0h8v8h-8zm96 0h8v8h-8zm112 0h8v8h-8zM8 8h8v8H8zm24 0h8v8h-8zm40 0h8v8h-8zm56 0h8v8h-8zm72 0h8v8h-8zm88 0h8v8h-8zm104 0h8v8h-8zm120 0h8v8h-8z' fill='%23000000'/%3E%3C/svg%3E"
              />
            </div>
            
            <div className="text-center mb-4">
              <p className="text-muted-foreground text-sm">Send exactly</p>
              <p className="text-3xl font-bold text-green-400">0.025 ETH</p>
              <p className="text-foreground">Network: Ethereum (ERC20)</p>
            </div>
            
            <div className="w-full mb-4">
              <Label className="text-xs text-muted-foreground text-left block mb-1">Wallet Address</Label>
              <div className="relative">
                <Input 
                  value={walletAddress} 
                  readOnly 
                  className="pr-12 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="absolute right-0 top-0 h-full px-3"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={copyToClipboard} 
              className="w-full"
            >
              Copy Address
            </Button>
          </div>

          <div className="border-t border-border my-6"></div>

          <div className="space-y-3 text-sm text-left mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium">Crypto Wallet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference ID:</span>
              <span className="font-medium">DEP-8A4B2C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exchange Rate:</span>
              <span className="font-medium">1 ETH ≈ $3,050.75</span>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-600 p-3 rounded-lg mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4" />
                <span>Time left to pay:</span>
              </div>
              <span className="font-bold text-lg">{formatTime(countdown)}</span>
            </div>
          </div>

          <div className="text-left text-xs text-muted-foreground space-y-4 mb-8">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <p>
                <span className="font-semibold text-foreground">Payment Instructions:</span> Send only ETH on the Ethereum (ERC20) network to this address. Sending any other currency to this address may result in the loss of your deposit.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Hourglass className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <p>
                <span className="font-semibold text-foreground">Processing Time:</span> Your deposit will be credited after 3 network confirmations. This usually takes 5-15 minutes but can vary depending on network congestion.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <p>
                <span className="font-semibold text-foreground">Security:</span> Ensure the URL is correct and you are on our official platform. Do not share your private keys or seed phrase with anyone.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <Button className="flex-1">
              Mark as Paid
            </Button>
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositConfirmation;