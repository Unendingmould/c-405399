import { useState } from "react";
import { Download, Search, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const transactions = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
      asset: "Bitcoin",
      symbol: "BTC",
      type: "Withdrawal",
      date: "2023-11-12 05:45 PM",
      amount: "-0.1 BTC",
      pricePerUnit: "$35,050.10",
      status: "Failed",
      icon: "/lovable-uploads/86329743-ee49-4f2e-96f7-50508436273d.png"
    },
    {
      id: 5,
      asset: "Ethereum",
      symbol: "ETH",
      type: "Deposit",
      date: "2023-11-11 08:20 AM",
      amount: "+5.0 ETH",
      pricePerUnit: "$1,998.50",
      status: "Successful",
      icon: "/lovable-uploads/7cc724d4-3e14-4e7c-9e7a-8d613fde54d0.png"
    },
    {
      id: 6,
      asset: "USDT",
      symbol: "USDT",
      type: "Deposit",
      date: "2023-11-10 11:05 AM",
      amount: "+1,000 USDT",
      pricePerUnit: "$1.00",
      status: "Successful",
      icon: "/lovable-uploads/5830bd79-3511-41dc-af6c-8db32d91fc2c.png"
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

  return (
    <div className="p-6 md:p-8 space-y-8">
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
            <p className="text-2xl font-semibold text-foreground">$25,840.50</p>
          </div>
        </div>
        <div className="glassmorphism p-6 rounded-xl flex items-center space-x-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <ArrowUp className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Withdrawn</p>
            <p className="text-2xl font-semibold text-foreground">$12,300.00</p>
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
        </div>

        <div className="flex justify-between items-center mt-6 text-sm">
          <p className="text-muted-foreground">Showing 1 to 6 of 24 results</p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transactions;