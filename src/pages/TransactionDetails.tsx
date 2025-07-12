import React from 'react';
import { ArrowLeft, Copy, Download, Upload, ArrowDown, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TransactionDetails = () => {
  const navigate = useNavigate();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen">
      <main className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-semibold text-foreground">Transaction Details</h1>
            </div>
            <p className="text-muted-foreground ml-9">Full information for your transaction.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Receipt</span>
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Transaction Details Card */}
        <section className="glass p-6 md:p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {/* Transaction Type */}
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <ArrowDown className="text-green-400 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transaction Type</p>
                <p className="text-lg font-semibold text-foreground">Deposit</p>
              </div>
            </div>

            {/* Asset */}
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500/10 p-3 rounded-full">
                <img 
                  alt="Bitcoin Logo" 
                  className="h-6 w-6" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_nbsQeKbesoDMsxgVPuCYL6hW_r_30qwCcuDWsIWunPsOYOmWyZSWHAaDUpghIbbrwqHGwNx87AAVBtxyQAWIsDWZDLjL6F17Xb75LeocjEAa1p9BQkuXB1Uv8Q3YjaAf54CgTsKoSceqCapVB8fy3h8LO2x2vg6RjTrk7eV0FohS3du9QgHt-q5j6644YlPbVkiz4FW20vEI8SRseY125akmHgFoTnN7174H9gl5haFLGhOrKx2pfScJMHqcwU9PA8R3klgjlXw"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Asset</p>
                <p className="text-lg font-semibold text-foreground">Bitcoin (BTC)</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Receipt className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full text-sm">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border col-span-1 md:col-span-2 lg:col-span-3 my-2"></div>

            {/* Amount */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-base text-foreground">0.5 BTC</p>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-base text-foreground">$68,543.21 per BTC</p>
            </div>

            {/* Total Value */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-base text-foreground">$34,271.60</p>
            </div>

            {/* Date & Time */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="text-base text-foreground">May 21, 2024, 10:35:12 AM</p>
            </div>

            {/* Fee */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fee</p>
              <p className="text-base text-foreground">0.0001 BTC ($6.85)</p>
            </div>

            {/* Method */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Method</p>
              <p className="text-base text-foreground">Bank Transfer</p>
            </div>

            {/* Reference ID */}
            <div className="md:col-span-2 lg:col-span-3 space-y-1">
              <p className="text-sm text-muted-foreground">Reference ID</p>
              <div className="flex items-center space-x-2">
                <p className="text-base text-muted-foreground font-mono">
                  tx-8a4d2c7b-f6e1-45a9-b3d2-0c1f9e8d7a6b
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-primary"
                  onClick={() => handleCopy('tx-8a4d2c7b-f6e1-45a9-b3d2-0c1f9e8d7a6b')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TransactionDetails;