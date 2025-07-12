import { useState } from "react";
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown, Wallet, DollarSign, Pie, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

// Define custom classes for glassmorphism effect
const glassmorphismClasses = "bg-gray-900/60 backdrop-blur-md border border-gray-700/30 shadow-xl";

const Portfolio = () => {
  const [timeframe, setTimeframe] = useState("all");

  const portfolioSummary = {
    totalValue: 148750.45,
    changePercent: 12.4,
    changeValue: 16432.20,
    allocated: 87.2,
    available: 18972.33,
  };

  const assetClasses = [
    { name: "Stocks", allocation: 45, value: 66937.70, change: 8.6, color: "from-blue-500 to-indigo-600" },
    { name: "Bonds", allocation: 20, value: 29750.09, change: 3.2, color: "from-emerald-500 to-green-600" },
    { name: "Real Estate", allocation: 15, value: 22312.57, change: 5.7, color: "from-amber-500 to-yellow-600" },
    { name: "Crypto", allocation: 10, value: 14875.05, change: 21.8, color: "from-purple-500 to-indigo-600" },
    { name: "Cash", allocation: 10, value: 14875.05, change: 0.0, color: "from-gray-400 to-gray-600" },
  ];

  const investments = [
    {
      id: "tesla-stock",
      name: "Tesla, Inc.",
      ticker: "TSLA",
      value: 12470.20,
      shares: 20,
      avgPrice: 542.65,
      currentPrice: 623.51,
      change: 14.9,
      type: "stock",
    },
    {
      id: "apple-stock",
      name: "Apple Inc.",
      ticker: "AAPL",
      value: 18650.75,
      shares: 115,
      avgPrice: 142.32,
      currentPrice: 162.18,
      change: 13.9,
      type: "stock",
    },
    {
      id: "us-treasury",
      name: "US Treasury Bond 2030",
      ticker: "USTB30",
      value: 15000.00,
      shares: "-",
      avgPrice: 980.25,
      currentPrice: 998.45,
      change: 1.9,
      type: "bond",
    },
    {
      id: "real-estate-fund",
      name: "Vanguard Real Estate ETF",
      ticker: "VNQ",
      value: 10500.80,
      shares: 98,
      avgPrice: 98.65,
      currentPrice: 107.15,
      change: 8.6,
      type: "real-estate",
    },
    {
      id: "bitcoin",
      name: "Bitcoin",
      ticker: "BTC",
      value: 8675.50,
      shares: 0.15,
      avgPrice: 47865.20,
      currentPrice: 57836.67,
      change: 20.8,
      type: "crypto",
    },
  ];
  
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-100">Portfolio</h1>
          <p className="text-gray-400">Manage and track your investments</p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-36 bg-gray-800/70 border-gray-700">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="day">24 Hours</SelectItem>
            <SelectItem value="week">1 Week</SelectItem>
            <SelectItem value="month">1 Month</SelectItem>
            <SelectItem value="year">1 Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </header>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className={glassmorphismClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full p-2 bg-indigo-500/20">
                <Wallet className="h-5 w-5 text-indigo-400" />
              </div>
              <span className={`text-sm font-medium flex items-center ${portfolioSummary.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioSummary.changePercent >= 0 ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    {portfolioSummary.changePercent}%
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    {Math.abs(portfolioSummary.changePercent)}%
                  </>
                )}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-400">Total Portfolio Value</p>
              <h3 className="text-2xl font-bold text-gray-100">
                ${portfolioSummary.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </h3>
              <p className={`text-sm mt-1 ${portfolioSummary.changeValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioSummary.changeValue >= 0 ? '+' : ''} 
                ${portfolioSummary.changeValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className={glassmorphismClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full p-2 bg-green-500/20">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-400">Available Cash</p>
              <h3 className="text-2xl font-bold text-gray-100">
                ${portfolioSummary.available.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </h3>
              <p className="text-sm mt-1 text-gray-400">
                Ready to invest
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className={glassmorphismClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full p-2 bg-blue-500/20">
                <Pie className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-400">Allocation</p>
              <h3 className="text-2xl font-bold text-gray-100">
                {portfolioSummary.allocated}%
              </h3>
              <div className="mt-2">
                <Progress value={portfolioSummary.allocated} className="h-2 bg-gray-700" indicatorClassName="bg-gradient-to-r from-indigo-500 to-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={glassmorphismClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full p-2 bg-purple-500/20">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-400">Timeframe</p>
              <h3 className="text-xl font-bold text-gray-100">
                {timeframe === 'day' && '24 Hours'}
                {timeframe === 'week' && '1 Week'}
                {timeframe === 'month' && '1 Month'}
                {timeframe === 'year' && '1 Year'}
                {timeframe === 'all' && 'All Time'}
              </h3>
              <p className="text-sm mt-1 text-gray-400">
                Performance period
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card className={glassmorphismClasses}>
              <CardHeader>
                <CardTitle className="text-gray-200">Portfolio Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Portfolio Performance Chart</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="allocation" className="space-y-6">
            <Card className={glassmorphismClasses}>
              <CardHeader>
                <CardTitle className="text-gray-200">Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Asset Allocation Pie Chart</span>
                  </div>
                  
                  <div className="space-y-4">
                    {assetClasses.map((asset, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 bg-gradient-to-r ${asset.color}`}></div>
                            <span className="text-sm text-gray-200">{asset.name}</span>
                          </div>
                          <span className="text-sm text-gray-400">{asset.allocation}%</span>
                        </div>
                        <Progress value={asset.allocation} className="h-1.5 bg-gray-700" indicatorClassName={`bg-gradient-to-r ${asset.color}`} />
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">
                            ${asset.value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </span>
                          <span className={asset.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="investments" className="space-y-6">
            <Card className={glassmorphismClasses}>
              <CardHeader>
                <CardTitle className="text-gray-200">Your Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-400 text-xs border-b border-gray-700/50">
                        <th className="text-left pb-3 font-medium">Asset</th>
                        <th className="text-right pb-3 font-medium">Current Price</th>
                        <th className="text-right pb-3 font-medium">Holdings</th>
                        <th className="text-right pb-3 font-medium">Value</th>
                        <th className="text-right pb-3 font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {investments.map((investment) => (
                        <tr key={investment.id} className="hover:bg-gray-800/30">
                          <td className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-200">{investment.name}</span>
                              <span className="text-xs text-gray-500">{investment.ticker}</span>
                            </div>
                          </td>
                          <td className="text-right py-3">
                            <span className="text-sm text-gray-300">
                              ${investment.currentPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </span>
                          </td>
                          <td className="text-right py-3">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-300">{investment.shares}</span>
                              {investment.shares !== '-' && (
                                <span className="text-xs text-gray-500">
                                  @ ${investment.avgPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-right py-3">
                            <span className="text-sm font-medium text-gray-200">
                              ${investment.value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </span>
                          </td>
                          <td className="text-right py-3">
                            <span className={`text-sm font-medium flex items-center justify-end ${investment.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {investment.change >= 0 ? (
                                <>
                                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                                  {investment.change}%
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                                  {Math.abs(investment.change)}%
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
};

export default Portfolio;
