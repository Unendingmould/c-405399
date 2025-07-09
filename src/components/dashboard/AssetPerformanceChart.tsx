
import { useState } from "react";
import { motion } from "framer-motion";

const AssetPerformanceChart = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("1M");
  const timeframes = ["1M", "6M", "1Y", "All"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-100">Asset Performance</h3>
        <div className="flex space-x-1 bg-gray-700/50 p-1 rounded-lg">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeTimeframe === timeframe
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-600/70"
              }`}
              onClick={() => setActiveTimeframe(timeframe)}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80 relative">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 500 250"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {[30, 80, 130, 180, 230].map((y, index) => (
            <g key={index}>
              <line x1="50" y1={y} x2="490" y2={y} stroke="#374151" strokeWidth="0.5" />
              <text x="10" y={y + 5} fill="#9CA3AF" fontSize="10">
                ${index === 0 ? "60k" : index === 1 ? "40k" : index === 2 ? "20k" : index === 3 ? "10k" : "0"}
              </text>
            </g>
          ))}
          
          {/* Month labels */}
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => (
            <text key={month} x={60 + index * 70} y="245" fill="#9CA3AF" fontSize="10">
              {month}
            </text>
          ))}
          
          {/* Bitcoin line */}
          <polyline
            fill="none"
            points="60,180 130,130 200,150 270,100 340,80 410,50"
            stroke="#FBBF24"
            strokeWidth="2.5"
          />
          <circle cx="410" cy="50" fill="#FBBF24" r="4" stroke="#111827" strokeWidth="2" />
          
          {/* Ethereum line */}
          <polyline
            fill="none"
            points="60,200 130,190 200,160 270,140 340,110 410,100"
            stroke="#60A5FA"
            strokeWidth="2.5"
          />
          <circle cx="410" cy="100" fill="#60A5FA" r="4" stroke="#111827" strokeWidth="2" />
          
          {/* Tooltip */}
          <g style={{ transform: "translateX(380px) translateY(30px)" }}>
            <rect
              x="0"
              y="0"
              width="100"
              height="55"
              fill="#1F2937"
              stroke="#374151"
              strokeWidth="1"
              rx="5"
              ry="5"
            />
            <g transform="translate(10,15)">
              <circle cx="0" cy="5" fill="#FBBF24" r="4" />
              <text x="10" y="8" fill="#F3F4F6" fontSize="10">BTC: $58,300</text>
            </g>
            <g transform="translate(10,35)">
              <circle cx="0" cy="5" fill="#60A5FA" r="4" />
              <text x="10" y="8" fill="#F3F4F6" fontSize="10">ETH: $3,900</text>
            </g>
          </g>
        </svg>
      </div>
      
      <div className="flex justify-center space-x-6 mt-3">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="text-xs text-gray-300">Bitcoin (BTC)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-blue-400"></span>
          <span className="text-xs text-gray-300">Ethereum (ETH)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetPerformanceChart;
