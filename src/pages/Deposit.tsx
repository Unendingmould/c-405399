import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Wallet, Shield, Info, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Deposit = () => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(100);
  const [depositCurrency, setDepositCurrency] = useState("USD");
  const [depositMethod, setDepositMethod] = useState("Card");
  const [walletConnected, setWalletConnected] = useState(false);
  const conversionRate = 1470;

  const getConvertedAmount = () => {
    if (depositCurrency === "NGN") return depositAmount;
    if (depositCurrency === "USD") return depositAmount * conversionRate;
    if (depositCurrency === "BTC") return depositAmount * 45000 * conversionRate;
    if (depositCurrency === "ETH") return depositAmount * 3000 * conversionRate;
    return depositAmount;
  };

  const getFee = () => {
    return (depositMethod === "Card" || depositMethod === "Crypto Wallet") ? depositAmount * 0.005 : 0;
  };

  const getTotalToPay = () => {
    return depositAmount + getFee();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Return Button */}
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center text-muted-foreground hover:text-foreground" 
        onClick={() => navigate('/dashboard/portfolio')}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Return to Portfolio
      </Button>

      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold text-foreground">Deposit Funds</h1>
        <p className="text-muted-foreground">Add funds to your investment account.</p>
      </header>

      {/* Main Form */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Deposit</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={depositCurrency} onValueChange={setDepositCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="BTC">BTC (Bitcoin)</SelectItem>
                  <SelectItem value="ETH">ETH (Ethereum)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="depositMethod">Deposit Method</Label>
              <Select value={depositMethod} onValueChange={setDepositMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Card">Card Payment</SelectItem>
                  <SelectItem value="Crypto Wallet">Crypto Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {depositMethod === "Crypto Wallet" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Connect your crypto wallet to proceed.</p>
                {!walletConnected ? (
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setWalletConnected(true)}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Metamask
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setWalletConnected(true)}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      WalletConnect
                    </Button>
                  </div>
                ) : (
                  <div className="bg-green-500/10 border border-green-500 text-green-600 text-sm p-3 rounded-lg flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Wallet Connected Successfully!</span>
                  </div>
                )}
              </div>
            )}

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Realtime Conversion:</p>
                <p className="text-lg font-semibold text-primary">
                  {depositAmount} {depositCurrency} = ₦{getConvertedAmount().toLocaleString()} (approx.)
                </p>
              </CardContent>
            </Card>

            <div className="border-t pt-6 space-y-3">
              <div className="flex items-start space-x-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 mt-0.5" />
                <p>Minimum deposit: $10 (or equivalent). Maximum deposit: $10,000 (or equivalent) per transaction. For larger deposits, please contact support.</p>
              </div>
              <div className="flex items-start space-x-2 text-xs text-muted-foreground">
                <Info className="w-4 h-4 mt-0.5" />
                <p>A small transaction fee of 0.5% may apply for card and crypto deposits.</p>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <span>Proceed to Confirmation</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Your Deposit</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{depositAmount} {depositCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium">{depositMethod}</span>
            </div>
            {depositCurrency !== "NGN" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Converted Amount:</span>
                <span className="font-medium">₦{getConvertedAmount().toLocaleString()}</span>
              </div>
            )}
            {(depositMethod === "Card" || depositMethod === "Crypto Wallet") && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction Fee (0.5%):</span>
                <span className="font-medium">{getFee().toFixed(2)} {depositCurrency}</span>
              </div>
            )}
            <div className="border-t border-border my-2"></div>
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total to Pay:</span>
              <span className="font-bold text-primary">{getTotalToPay().toFixed(2)} {depositCurrency}</span>
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowConfirmModal(false);
                alert('Deposit Confirmed! You will be redirected shortly.');
              }} 
              className="flex-1"
            >
              Confirm & Deposit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deposit;