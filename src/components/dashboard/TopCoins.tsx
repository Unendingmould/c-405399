
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

const TopCoins = () => {
  const coins = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$58,291.70",
      change: "+1.25%",
      isPositive: true,
      icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "$3,910.45",
      change: "-0.58%",
      isPositive: false,
      icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    {
      name: "Solana",
      symbol: "SOL",
      price: "$165.80",
      change: "+3.10%",
      isPositive: true,
      icon: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
  ];

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
