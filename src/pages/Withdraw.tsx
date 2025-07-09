import { useState } from "react";
import { ArrowRight, Info, Clock, CreditCard, Wallet, Bitcoin, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const Withdraw = () => {
  const [withdrawalMethod, setWithdrawalMethod] = useState("Bank");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(500);
  const [pin, setPin] = useState("");
  const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState("");

  const getFee = () => withdrawalAmount * 0.015;
  const getNetAmount = () => withdrawalAmount * 0.985;

  const getProcessingTime = () => {
    switch (withdrawalMethod) {
      case "Bank": return "1-2 Business Days";
      case "Wallet": return "1-3 Hours";
      case "USDT": return "5-30 Minutes";
      default: return "1-2 Business Days";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmWithdrawal = () => {
    setShowConfirmModal(false);
    setWithdrawalInProgress(true);
    setWithdrawalStatus("Processing...");
    setTimeout(() => setWithdrawalStatus("Completed"), 3000);
  };

  const withdrawalHistory = [
    { date: "2023-10-26", amount: "$1,200.00", method: "USDT", details: "0x...a1b2", status: "Completed" },
    { date: "2023-10-22", amount: "$500.00", method: "Bank", details: "GTB - ***1234", status: "Completed" },
    { date: "2023-10-18", amount: "$2,500.00", method: "Bank", details: "Zenith - ***5678", status: "Processing" },
    { date: "2023-10-15", amount: "$300.00", method: "Wallet", details: "Paystack", status: "Failed" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/20">Completed</Badge>;
      case "Processing":
        return <Badge className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/20">Processing</Badge>;
      case "Failed":
        return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold text-foreground">Withdraw Funds</h1>
        <p className="text-muted-foreground">Cash out from your investment balance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Withdrawal Method</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: "Bank", icon: CreditCard, label: "Bank" },
                    { key: "Wallet", icon: Wallet, label: "Wallet" },
                    { key: "USDT", icon: Bitcoin, label: "USDT" },
                  ].map((method) => (
                    <Button
                      key={method.key}
                      type="button"
                      variant={withdrawalMethod === method.key ? "default" : "outline"}
                      className="flex flex-col items-center justify-center p-4 h-auto"
                      onClick={() => setWithdrawalMethod(method.key)}
                    >
                      <method.icon className="w-6 h-6 mb-1" />
                      <span className="text-sm font-medium">{method.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Withdraw</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-muted-foreground">
                    Available: $12,500.00
                  </div>
                </div>
              </div>

              {withdrawalMethod === "Bank" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Bank Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zenith">Zenith Bank</SelectItem>
                          <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                          <SelectItem value="firstbank">First Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" placeholder="Enter Account Number" />
                    </div>
                    <div>
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input id="accountName" value="JOHN DOE" readOnly className="bg-muted/60" />
                    </div>
                  </div>
                </div>
              )}

              {withdrawalMethod === "Wallet" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Wallet Details</h3>
                  <div>
                    <Label htmlFor="walletProvider">Wallet Provider</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paystack">Paystack</SelectItem>
                        <SelectItem value="flutterwave">Flutterwave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {withdrawalMethod === "USDT" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">USDT Wallet Address</h3>
                  <div>
                    <Label htmlFor="usdtAddress">Wallet Address (TRC-20)</Label>
                    <Input id="usdtAddress" placeholder="Enter your USDT TRC-20 address" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="pin">2FA / PIN Confirmation</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your 4-digit PIN"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Withdrawal Amount:</span>
                    <span className="font-medium">${withdrawalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee (1.5%):</span>
                    <span className="font-medium">${getFee().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border my-1"></div>
                  <div className="flex justify-between text-base font-semibold">
                    <span>You Will Receive:</span>
                    <span className="text-primary">${getNetAmount().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="border-t pt-6 space-y-3">
                <div className="flex items-start space-x-2 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4 mt-0.5" />
                  <p>Processing Time: <strong className="text-foreground">{getProcessingTime()}</strong></p>
                </div>
                <div className="flex items-start space-x-2 text-xs text-muted-foreground">
                  <Info className="w-4 h-4 mt-0.5" />
                  <p>Ensure all details are correct before proceeding. Withdrawals to incorrect addresses/accounts cannot be reversed.</p>
                </div>
              </div>

              <Button type="submit" className="w-full">
                <span>Request Withdrawal</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Withdrawal Status */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Status</CardTitle>
          </CardHeader>
          <CardContent>
            {!withdrawalInProgress ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Your withdrawal request is pending submission.</p>
                <div className="h-2 bg-muted rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-primary">{withdrawalStatus}</p>
                  {withdrawalStatus === "Processing..." && <p className="text-sm font-medium text-primary">50%</p>}
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: withdrawalStatus === "Processing..." ? "50%" : withdrawalStatus === "Completed" ? "100%" : "0%" }}
                  ></div>
                </div>
                {withdrawalStatus === "Completed" && (
                  <p className="text-xs text-center text-muted-foreground">Withdrawal Successful!</p>
                )}
                {withdrawalStatus === "Failed" && (
                  <p className="text-xs text-center text-red-500">Withdrawal Failed. Please try again.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Method</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Details</th>
                  <th className="py-3 pl-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {withdrawalHistory.map((item, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-4 pr-4">{item.date}</td>
                    <td className="py-4 px-4">{item.amount}</td>
                    <td className="py-4 px-4">{item.method}</td>
                    <td className="py-4 px-4 hidden md:table-cell truncate max-w-xs">{item.details}</td>
                    <td className="py-4 pl-4 text-right">{getStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">${withdrawalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method:</span>
              <span className="font-medium">{withdrawalMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee (1.5%):</span>
              <span className="font-medium">${getFee().toFixed(2)}</span>
            </div>
            <div className="border-t border-border my-2"></div>
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total to Receive:</span>
              <span className="font-bold text-primary">${getNetAmount().toFixed(2)}</span>
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={confirmWithdrawal} className="flex-1">
              Confirm & Withdraw
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdraw;