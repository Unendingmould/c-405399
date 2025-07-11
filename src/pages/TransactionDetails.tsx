import React from 'react';
import { ArrowLeft, Copy, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const TransactionDetails = () => {
  const navigate = useNavigate();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusBadge = (status: 'successful' | 'pending' | 'failed') => {
    const variants = {
      successful: 'bg-green-500/20 text-green-300 hover:bg-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30',
      failed: 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
    };
    
    return (
      <Badge className={variants[status]}>
        {status === 'successful' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transaction Details</h1>
            <p className="text-muted-foreground">Deposit of 0.5 BTC on Nov 15, 2023</p>
          </div>
        </div>
      </div>
      
      <main className="p-6 md:p-8 space-y-8">
        <div className="glass p-6 md:p-8 rounded-xl">
          {/* Transaction Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-4">
              <img
                alt="Bitcoin logo"
                className="h-12 w-12 rounded-full"
                src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
              />
              <div>
                <p className="text-2xl font-semibold text-foreground">+0.50000000 BTC</p>
                <p className="text-muted-foreground font-mono">$17,640.23</p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge('successful')}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground">Txn_abc123def456</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy('Txn_abc123def456')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium text-foreground">Deposit</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Asset</span>
                <span className="font-medium text-foreground">Bitcoin (BTC)</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Value at transaction</span>
                <span className="font-mono text-foreground">$35,280.45 per BTC</span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="border-t border-border pt-6 space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Timestamp (Initiated)</span>
                <span className="font-mono text-foreground">2023-11-15 10:25:10 AM UTC</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Timestamp (Confirmed)</span>
                <span className="font-mono text-foreground">2023-11-15 10:30:45 AM UTC</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Blockchain Confirmations</span>
                <span className="font-mono text-foreground">6/6</span>
              </div>
            </div>

            {/* Addresses */}
            <div className="border-t border-border pt-6 space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">From Address</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground truncate max-w-[200px]">
                    1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">To Address</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground truncate max-w-[200px]">
                    bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-border pt-6 flex justify-end gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionDetails;