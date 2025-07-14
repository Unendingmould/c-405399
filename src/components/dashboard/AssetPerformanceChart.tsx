
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { analyticsApi } from "@/lib/api";
import webSocketService from "@/lib/websocket";
import { Loader2 } from "lucide-react";

interface PerformanceData {
  dates: string[];
  values: number[];
}

const AssetPerformanceChart = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("1M");
  const timeframes = ["1M", "6M", "1Y", "All"];
  const [chartData, setChartData] = useState<PerformanceData>({ dates: [], values: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch performance data when timeframe changes
  useEffect(() => {
    fetchPerformanceData(activeTimeframe);
  }, [activeTimeframe]);
  
  // Subscribe to WebSocket updates for portfolio performance
  useEffect(() => {
    const unsubscribe = webSocketService.subscribe('market', (data) => {
      if (data && data.type === 'portfolio_performance_update') {
        // If we receive a real-time update for the current timeframe
        if (data.timeframe === activeTimeframe) {
          setChartData(data.performanceData);
        }
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [activeTimeframe]);
  
  const fetchPerformanceData = async (timeframe: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analyticsApi.getPerformanceAnalytics(timeframe);
      
      if (response.data && response.data.success) {
        setChartData(response.data.data || { dates: [], values: [] });
      } else {
        // Fallback to sample data if API doesn't return valid data
        setChartData(getSamplePerformanceData(timeframe));
      }
    } catch (err) {
      console.error('Failed to fetch performance data:', err);
      setError('Failed to load performance data');
      
      // Fallback to sample data on error
      setChartData(getSamplePerformanceData(timeframe));
    } finally {
      setLoading(false);
    }
  };
  
  // Provide sample data as fallback
  const getSamplePerformanceData = (timeframe: string): PerformanceData => {
    // Generate sample data based on timeframe
    let points = timeframe === '1M' ? 30 : timeframe === '6M' ? 180 : timeframe === '1Y' ? 365 : 500;
    points = Math.min(points, 50); // Limit data points for display
    
    const dates: string[] = [];
    const values: number[] = [];
    const today = new Date();
    
    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
      
      // Generate a somewhat realistic price movement
      const volatility = 0.02; // 2% daily volatility
      const change = (Math.random() - 0.5) * volatility;
      const lastValue = values.length > 0 ? values[values.length - 1] : 100;
      values.push(Math.max(0, lastValue * (1 + change)));
    }
    
    return { dates, values };
  };

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
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
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
            
            {/* X-axis labels (dates) */}
            {chartData.dates.length > 0 && chartData.dates.filter((_, i) => i % Math.ceil(chartData.dates.length / 6) === 0)
              .map((date, index, filteredDates) => {
                // Calculate x position based on the number of labels
                const step = 420 / (filteredDates.length - 1);
                const x = 50 + (index * step);
                
                // Format date to show month only or month and day
                const formatDate = (dateStr: string) => {
                  const date = new Date(dateStr);
                  return activeTimeframe === '1M' ? 
                    `${date.getDate()}/${date.getMonth() + 1}` : 
                    `${date.getMonth() + 1}/${date.getDate()}`;
                };
                
                return (
                  <text
                    key={index}
                    x={x}
                    y="245"
                    fill="#9CA3AF"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {formatDate(date)}
                  </text>
                );
              })
            }
            
            {/* Performance line */}
            {chartData.values.length > 0 && (
              <path
                d={generateChartPath(chartData.values)}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
            )}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        )}
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

// Helper function to generate SVG path from data points
const generateChartPath = (values: number[]): string => {
  if (values.length === 0) return '';
  
  // Find min and max values to scale properly
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // Avoid division by zero
  
  // Scale points to fit the chart area (50-470 x, 30-230 y)
  return values.map((value, index) => {
    // Calculate x position based on index and total number of points
    const x = 70 + (index * (400 / (values.length - 1 || 1)));
    
    // Scale y value (SVG y-axis is inverted: 0 at top, increasing downward)
    // 30 is top of chart, 230 is bottom of chart
    const y = 230 - ((value - min) / range * 200);
    
    return `${index === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
};

export default AssetPerformanceChart;
