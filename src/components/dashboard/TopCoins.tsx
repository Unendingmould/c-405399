
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { marketDataApi } from "@/lib/api";
import webSocketService from "@/lib/websocket";

interface Coin {
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

const TopCoins = () => {
  const [coins, setCoins] = useState<Coin[]>([
    {
      name: "Bitcoin",
      symbol: "BTC-USD",
      price: "$--,---.--",
      change: "0.00%",
      isPositive: true,
      icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    },
    {
      name: "Ethereum",
      symbol: "ETH-USD",
      price: "$--,---.--",
      change: "0.00%",
      isPositive: true,
      icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    {
      name: "Solana",
      symbol: "SOL-USD",
      price: "$--,---.--",
      change: "0.00%",
      isPositive: true,
      icon: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch initial coin data
  useEffect(() => {
    fetchCoinData();
  }, []);
  
  // Setup WebSocket listeners for real-time updates
  useEffect(() => {
    const symbols = coins.map(coin => coin.symbol);
    
    // Subscribe to market data updates
    const unsubscribe = webSocketService.subscribe('market', (data) => {
      if (data && data.symbol && symbols.includes(data.symbol)) {
        updateCoinData(data);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [coins]);
  
  const fetchCoinData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const symbols = coins.map(coin => coin.symbol);
      const response = await marketDataApi.getMultipleAssetPrices(symbols);
      
      if (response.data && response.data.data) {
        const marketData = response.data.data;
        
        setCoins(prevCoins => {
          return prevCoins.map(coin => {
            const data = marketData[coin.symbol];
            
            if (!data) return coin;
            
            const formattedPrice = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(data.price);
            
            const formattedChange = `${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%`;
            
            return {
              ...coin,
              price: formattedPrice,
              change: formattedChange,
              isPositive: data.changePercent >= 0
            };
          });
        });
      }
    } catch (err) {
      console.error('Failed to fetch coin data:', err);
      setError('Failed to load market data');
    } finally {
      setLoading(false);
    }
  };
  
  const updateCoinData = (data: any) => {
    setCoins(prevCoins => {
      return prevCoins.map(coin => {
        if (coin.symbol !== data.symbol) return coin;
        
        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(data.price);
        
        const formattedChange = `${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%`;
        
        return {
          ...coin,
          price: formattedPrice,
          change: formattedChange,
          isPositive: data.changePercent >= 0
        };
      });
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Top Coins</h3>
      
      <div className="space-y-3">
        {coins.map((coin, index) => (
          <motion.div
            key={coin.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <img 
                alt={`${coin.name} logo`} 
                className="w-8 h-8 rounded-full" 
                src={coin.icon}
              />
              <div>
                <p className="text-sm font-medium text-gray-100">{coin.name}</p>
                <p className="text-xs text-gray-400">{coin.symbol}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-100">{coin.price}</p>
              <p className={`text-xs flex items-center justify-end ${
                coin.isPositive ? "text-green-400" : "text-red-400"
              }`}>
                {coin.isPositive ? (
                  <ArrowUp className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 mr-1" />
                )}
                {coin.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopCoins;
