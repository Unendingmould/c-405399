import { useState, useEffect } from "react";
import { Download, Search, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { transactionApi } from "@/lib/api";
import webSocketService from "@/lib/websocket";
import { useToast } from "@/components/ui/use-toast";

interface TransactionData {
  id: string;
  asset: string;
  symbol: string;
  type: string;
  date: string;
  amount: string;
  pricePerUnit: string;
  status: string;
  icon: string;
}

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Fetch transactions on initial load and when filters change
  useEffect(() => {
    fetchTransactions();
  }, [selectedDate, selectedCoin, selectedType, currentPage, pageSize]);

  // Subscribe to WebSocket updates for real-time transaction updates
  useEffect(() => {
    const unsubscribe = webSocketService.subscribe('transaction', (data) => {
      if (data && data.type === 'transaction_update') {
        // Refresh transactions when we get an update
        fetchTransactions();
        
        // Show toast notification for new transactions
        if (data.action === 'new') {
          toast({
            title: "New Transaction",
            description: `${data.transactionData.type}: ${data.transactionData.amount} ${data.transactionData.symbol}`,
            variant: "default",
          });
        }
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare filter params
      const params: any = {
        page: currentPage,
        limit: pageSize
      };
      
      if (searchTerm) params.search = searchTerm;
      if (selectedDate) params.date = selectedDate;
      if (selectedCoin && selectedCoin !== 'all') params.asset = selectedCoin;
      if (selectedType && selectedType !== 'all') params.type = selectedType;
      
      const response = await transactionApi.getTransactions(params);
      
      if (response.data?.success) {
        // Format the transactions for display
        const formattedTransactions = response.data.data.transactions.map((tx: any) => ({
          id: tx.id,
          asset: tx.asset.name,
          symbol: tx.asset.symbol,
          type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
          date: formatDate(tx.createdAt),
          amount: formatAmount(tx.amount, tx.type, tx.asset.symbol),
          pricePerUnit: formatCurrency(tx.pricePerUnit),
          status: tx.status,
          icon: getAssetIcon(tx.asset.symbol)
        }));
        
        setTransactions(formattedTransactions);
        setTotalPages(Math.ceil(response.data.data.total / pageSize));
      } else {
        // If API call succeeded but returned an error
        setError("Failed to load transactions");
        // Fall back to empty array
        setTransactions([]);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError("Failed to load transactions");
      
      // Since we're still developing, fall back to sample data for demo purposes
      setTransactions(getSampleTransactions());
    } finally {
      setLoading(false);
    }
  };
  
  // Format date from ISO string to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format amount based on transaction type
  const formatAmount = (amount: number, type: string, symbol: string): string => {
    const prefix = type.toLowerCase() === 'deposit' ? '+' : '-';
    return `${prefix}${amount} ${symbol}`;
  };
  
  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Get asset icon based on symbol
  const getAssetIcon = (symbol: string): string => {
    const iconMap: {[key: string]: string} = {
      'BTC': "/lovable-uploads/86329743-ee49-4f2e-96f7-50508436273d.png",
      'ETH': "/lovable-uploads/7cc724d4-3e14-4e7c-9e7a-8d613fde54d0.png",
      'USDT': "/lovable-uploads/5830bd79-3511-41dc-af6c-8db32d91fc2c.png"
      // Add more mappings as needed
    };
    
    return iconMap[symbol] || "/placeholder-coin.png";
  };
  
  // Sample data for fallback
  const getSampleTransactions = (): TransactionData[] => [
    {
      id: "1",
      asset: "Bitcoin",
      symbol: "BTC",
      type: "Deposit",
      date: "2023-11-15 10:30 AM",
      amount: "+0.5 BTC",
      pricePerUnit: "$35,280.45",
      status: "Successful",
      icon: "/lovable-uploads/86329743-ee49-4f2e-96f7-50508436273d.png"
    },
    {
      id: "2",
      asset: "Ethereum",
      symbol: "ETH",
      type: "Withdrawal",
      date: "2023-11-14 02:15 PM",
      amount: "-2.0 ETH",
      pricePerUnit: "$2,015.78",
      status: "Successful",
      icon: "/lovable-uploads/7cc724d4-3e14-4e7c-9e7a-8d613fde54d0.png"
    },
    {
      id: "3",
      asset: "USDT",
      symbol: "USDT",
      type: "Transfer",
      date: "2023-11-13 09:00 AM",
      amount: "+500 USDT",
      pricePerUnit: "$1.00",
      status: "Pending",
      icon: "/lovable-uploads/5830bd79-3511-41dc-af6c-8db32d91fc2c.png"
    },
    {
      id: "4",
      asset: "Bitcoin",
      symbol: "BTC",
      type: "Withdrawal",
      date: "2023-11-12 05:45 PM",
      amount: "-0.1 BTC",
      pricePerUnit: "$35,050.10",
      status: "Failed",
      icon: "/lovable-uploads/86329743-ee49-4f2e-96f7-50508436273d.png"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Successful":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Successful</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Pending</Badge>;
      case "Failed":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Summary data for deposits and withdrawals
  const [summary, setSummary] = useState({
    totalDeposited: 0,
    totalWithdrawn: 0
  });
  
  // Fetch transaction summary data
  useEffect(() => {
    async function fetchTransactionSummary() {
      try {
        // Instead of using a dedicated summary endpoint, we'll aggregate from transactions
        const response = await transactionApi.getTransactions({
          limit: 100, // Get enough transactions to calculate a meaningful summary
        });
        
        if (response.data?.success) {
          // Calculate totals from transaction data
          const transactions = response.data.data.transactions || [];
          let deposited = 0;
          let withdrawn = 0;
          
          transactions.forEach((tx: any) => {
            if (tx.type === 'deposit') {
              deposited += tx.amount * tx.pricePerUnit;
            } else if (tx.type === 'withdrawal') {
              withdrawn += tx.amount * tx.pricePerUnit;
            }
          });
          
          setSummary({
            totalDeposited: deposited,
            totalWithdrawn: withdrawn
          });
        }
      } catch (error) {
        console.error('Failed to calculate transaction summary:', error);
        // Use fallback values
        setSummary({
          totalDeposited: 25840.5,
          totalWithdrawn: 12300.0
        });
      }
    }
    
    fetchTransactionSummary();
    
    // Also subscribe to transaction updates via WebSocket
    const unsubscribe = webSocketService.subscribe('transaction', (data) => {
      // When transactions update, refresh the summary
      if (data && data.type === 'transaction_update') {
        fetchTransactionSummary();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Transaction History</h1>
          <p className="text-muted-foreground">View and manage your financial activity.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export History</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <span className="flex items-center space-x-2">
                <span>📄</span>
                <span>Export as CSV</span>
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="flex items-center space-x-2">
                <span>📋</span>
                <span>Export as PDF</span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glassmorphism p-6 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-green-500/20 rounded-full">
            <ArrowDown className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Deposited</p>
            <p className="text-2xl font-semibold text-foreground">{formatCurrency(summary.totalDeposited)}</p>
          </div>
        </div>
        <div className="glassmorphism p-6 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <ArrowUp className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Withdrawn</p>
            <p className="text-2xl font-semibold text-foreground">{formatCurrency(summary.totalWithdrawn)}</p>
          </div>
        </div>
      </div>

      <section className="glassmorphism p-6 md:p-8 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-6">
          <div className="relative w-full md:w-auto md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by asset..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <Input
              type="date"
              className="w-full md:w-auto"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="All Coins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coins</SelectItem>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading transactions...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-10 text-red-400">
              <p>{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex justify-center items-center py-10 text-muted-foreground">
              <p>No transactions found. Try different filters or make your first transaction.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Price per Unit</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src={transaction.icon}
                          alt={`${transaction.asset} logo`}
                          className="h-6 w-6 rounded-full"
                        />
                        {transaction.asset}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell className="hidden md:table-cell">{transaction.date}</TableCell>
                    <TableCell className="font-mono">{transaction.amount}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono">{transaction.pricePerUnit}</TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Show</span>
            <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
              <SelectTrigger className="w-16">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">per page</span>
          </div>

          <p className="text-muted-foreground">
            {transactions.length > 0 ? (
              <>Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, (currentPage - 1) * pageSize + transactions.length)} of many results</>
            ) : (
              <>No results</>
            )}
          </p>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage <= 1 || loading}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-8 text-center">{currentPage} / {totalPages || 1}</span>
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transactions;