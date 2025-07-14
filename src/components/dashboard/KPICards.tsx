
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { analyticsApi, marketDataApi } from "@/lib/api";
import webSocketService from "@/lib/websocket";

interface KPIData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean | null;
  loading?: boolean;
}

const KPICards = () => {
  const [kpiData, setKpiData] = useState<KPIData[]>([
    {
      title: "Monthly Investment",
      value: "$0.00",
      change: "Loading...",
      isPositive: null,
      loading: true
    },
    {
      title: "Market Volume (24h)",
      value: "$0.00",
      change: "Loading...",
      isPositive: null,
      loading: true
    },
    {
      title: "Market Cap",
      value: "$0.00",
      change: "Loading...",
      isPositive: null,
      loading: true
    },
    {
      title: "Avg. Monthly Growth",
      value: "0.0%",
      change: "Loading...",
      isPositive: null,
      loading: true
    },
  ]);
  
  // Fetch initial KPI data
  useEffect(() => {
    fetchKpiData();
  }, []);
  
  // Subscribe to real-time market updates
  useEffect(() => {
    const unsubscribeMarket = webSocketService.subscribe('market', (data) => {
      if (data && data.type === 'market_update') {
        updateMarketKpis(data);
      }
    });
    
    const unsubscribeInvestment = webSocketService.subscribe('investment', (data) => {
      if (data && data.type === 'investment_update') {
        updateInvestmentKpis(data);
      }
    });
    
    return () => {
      unsubscribeMarket();
      unsubscribeInvestment();
    };
  }, []);
  
  const fetchKpiData = async () => {
    try {
      // Fetch investment data
      const investmentResponse = await analyticsApi.getPortfolioAnalytics();
      
      // Fetch market data
      const marketResponse = await marketDataApi.getMultipleAssetPrices(['BTC-USD', 'ETH-USD', 'TOTAL-MARKET']);
      
      // Update KPIs with real data
      if (investmentResponse.data?.success && marketResponse.data?.success) {
        const investmentData = investmentResponse.data.data;
        const marketData = marketResponse.data.data;
        
        setKpiData(prevData => {
          const newData = [...prevData];
          
          // Update Monthly Investment
          if (investmentData.monthlyInvestment !== undefined) {
            newData[0] = {
              ...newData[0],
              value: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
              }).format(investmentData.monthlyInvestment),
              change: `${investmentData.monthlyChange >= 0 ? '+' : ''}${investmentData.monthlyChange.toFixed(1)}% vs last month`,
              isPositive: investmentData.monthlyChange >= 0,
              loading: false
            };
          }
          
          // Update Market Volume
          if (marketData && marketData['TOTAL-MARKET']) {
            newData[1] = {
              ...newData[1],
              value: formatLargeNumber(marketData['TOTAL-MARKET'].volume),
              change: `${marketData['TOTAL-MARKET'].volumeChangePercent >= 0 ? '+' : ''}${marketData['TOTAL-MARKET'].volumeChangePercent.toFixed(1)}%`,
              isPositive: marketData['TOTAL-MARKET'].volumeChangePercent >= 0,
              loading: false
            };
          }
          
          // Update Market Cap
          if (marketData && marketData['TOTAL-MARKET']) {
            newData[2] = {
              ...newData[2],
              value: formatLargeNumber(marketData['TOTAL-MARKET'].marketCap),
              change: `${marketData['TOTAL-MARKET'].marketCapChangePercent >= 0 ? '+' : ''}${marketData['TOTAL-MARKET'].marketCapChangePercent.toFixed(1)}%`,
              isPositive: marketData['TOTAL-MARKET'].marketCapChangePercent >= 0,
              loading: false
            };
          }
          
          // Update Average Monthly Growth
          if (investmentData.averageMonthlyGrowth !== undefined) {
            newData[3] = {
              ...newData[3],
              value: `${investmentData.averageMonthlyGrowth >= 0 ? '+' : ''}${investmentData.averageMonthlyGrowth.toFixed(1)}%`,
              change: 'Based on last 6 months',
              isPositive: investmentData.averageMonthlyGrowth >= 0,
              loading: false
            };
          }
          
          return newData;
        });
      }
    } catch (err) {
      console.error('Failed to fetch KPI data:', err);
      
      // Set error state or fallback to sample data
      setKpiData(prevData => {
        return prevData.map(kpi => ({
          ...kpi,
          loading: false
        }));
      });
    }
  };
  
  const updateMarketKpis = (data: any) => {
    if (!data || !data.marketData) return;
    
    setKpiData(prevData => {
      const newData = [...prevData];
      
      // Update Market Volume
      if (data.marketData.volume !== undefined) {
        newData[1] = {
          ...newData[1],
          value: formatLargeNumber(data.marketData.volume),
          change: `${data.marketData.volumeChangePercent >= 0 ? '+' : ''}${data.marketData.volumeChangePercent.toFixed(1)}%`,
          isPositive: data.marketData.volumeChangePercent >= 0,
          loading: false
        };
      }
      
      // Update Market Cap
      if (data.marketData.marketCap !== undefined) {
        newData[2] = {
          ...newData[2],
          value: formatLargeNumber(data.marketData.marketCap),
          change: `${data.marketData.marketCapChangePercent >= 0 ? '+' : ''}${data.marketData.marketCapChangePercent.toFixed(1)}%`,
          isPositive: data.marketData.marketCapChangePercent >= 0,
          loading: false
        };
      }
      
      return newData;
    });
  };
  
  const updateInvestmentKpis = (data: any) => {
    if (!data || !data.investmentData) return;
    
    setKpiData(prevData => {
      const newData = [...prevData];
      
      // Update Monthly Investment
      if (data.investmentData.monthlyInvestment !== undefined) {
        newData[0] = {
          ...newData[0],
          value: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
          }).format(data.investmentData.monthlyInvestment),
          change: `${data.investmentData.monthlyChange >= 0 ? '+' : ''}${data.investmentData.monthlyChange.toFixed(1)}% vs last month`,
          isPositive: data.investmentData.monthlyChange >= 0,
          loading: false
        };
      }
      
      // Update Average Monthly Growth
      if (data.investmentData.averageMonthlyGrowth !== undefined) {
        newData[3] = {
          ...newData[3],
          value: `${data.investmentData.averageMonthlyGrowth >= 0 ? '+' : ''}${data.investmentData.averageMonthlyGrowth.toFixed(1)}%`,
          change: 'Based on last 6 months',
          isPositive: data.investmentData.averageMonthlyGrowth >= 0,
          loading: false
        };
      }
      
      return newData;
    });
  };
  
  // Helper to format large numbers like $1.2T, $350M, etc.
  const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass p-4 md:p-5 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300"
        >
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            {kpi.title}
          </p>
          <p className="text-xl md:text-2xl font-semibold text-gray-100">{kpi.value}</p>
          <p className={`text-sm mt-1 flex items-center ${
            kpi.isPositive === true ? "text-green-400" : 
            kpi.isPositive === false ? "text-red-400" : "text-gray-400"
          }`}>
            {kpi.isPositive === true && <ArrowUp className="w-4 h-4 mr-1" />}
            {kpi.isPositive === false && <ArrowDown className="w-4 h-4 mr-1" />}
            {kpi.change}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default KPICards;
