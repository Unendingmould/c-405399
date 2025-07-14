
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { userApi } from "@/lib/api";
import webSocketService from "@/lib/websocket";
import { Loader2 } from "lucide-react";

interface CreditScoreData {
  score: number;
  status: string;
  lastChecked: string;
}

const CreditScore = () => {
  const [creditData, setCreditData] = useState<CreditScoreData>({
    score: 0,
    status: "",
    lastChecked: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${(creditData.score / 100) * circumference}, ${circumference}`;
  
  // Determine status color based on credit score
  const getStatusColor = (score: number): string => {
    if (score >= 80) return "#22C55E"; // Green for excellent
    if (score >= 70) return "#10B981"; // Light green for good
    if (score >= 60) return "#FBBF24"; // Yellow for fair
    if (score >= 50) return "#F59E0B"; // Orange for moderate
    return "#EF4444"; // Red for poor
  };
  
  // Determine status text
  const getStatusText = (score: number): string => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 50) return "Moderate";
    return "Poor";
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  // Fetch credit score data
  useEffect(() => {
    fetchCreditScore();
  }, []);
  
  // Subscribe to WebSocket updates
  useEffect(() => {
    const unsubscribe = webSocketService.subscribe('user', (data) => {
      if (data && data.type === 'credit_score_update') {
        updateCreditScore(data.creditScoreData);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  const fetchCreditScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userApi.getCreditScore();
      
      if (response.data?.success) {
        const data = response.data.data;
        setCreditData({
          score: data.score,
          status: getStatusText(data.score),
          lastChecked: data.lastChecked
        });
      } else {
        // Fallback to sample data
        setCreditData({
          score: 78,
          status: "Good",
          lastChecked: "2024-05-15T12:00:00Z"
        });
      }
    } catch (err) {
      console.error('Failed to fetch credit score:', err);
      setError('Failed to load credit score data');
      
      // Fallback to sample data on error
      setCreditData({
        score: 78,
        status: "Good",
        lastChecked: "2024-05-15T12:00:00Z"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateCreditScore = (data: any) => {
    if (!data) return;
    
    setCreditData({
      score: data.score,
      status: getStatusText(data.score),
      lastChecked: data.lastChecked
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl flex flex-col items-center text-center"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-1">Credit Score</h3>
      <p className="text-xs text-gray-400 mb-3">
        {loading ? "Loading..." : `Last checked: ${formatDate(creditData.lastChecked)}`}
      </p>
      
      <div className="relative w-36 h-36 mb-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400 text-sm">Error loading data</p>
          </div>
        ) : (
          <>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="3.5"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={getStatusColor(creditData.score)}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset="0"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-gray-100">{creditData.score}%</p>
              <p className="text-xs" style={{ color: getStatusColor(creditData.score) }}>{creditData.status}</p>
            </div>
          </>
        )}
      </div>
      
      <Button 
        variant="link" 
        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium p-0"
        onClick={() => !loading && fetchCreditScore()} // Refresh data when clicked
        disabled={loading}
      >
        {loading ? "Loading..." : "View Details"}
      </Button>
    </motion.div>
  );
};

export default CreditScore;
