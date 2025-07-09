
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CreditScore = () => {
  const score = 78;
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${(score / 100) * circumference}, ${circumference}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl flex flex-col items-center text-center"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-1">Credit Score</h3>
      <p className="text-xs text-gray-400 mb-3">Last checked: May 15, 2024</p>
      
      <div className="relative w-36 h-36 mb-4">
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
            stroke="#22C55E"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-gray-100">{score}%</p>
          <p className="text-xs text-green-400">Good</p>
        </div>
      </div>
      
      <Button 
        variant="link" 
        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium p-0"
      >
        View Details
      </Button>
    </motion.div>
  );
};

export default CreditScore;
