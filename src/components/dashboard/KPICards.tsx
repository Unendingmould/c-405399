
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

const KPICards = () => {
  const kpiData = [
    {
      title: "Monthly Investment",
      value: "$3,500.00",
      change: "+5.2% vs last month",
      isPositive: true,
    },
    {
      title: "Market Volume (24h)",
      value: "$1.2T",
      change: "-1.8%",
      isPositive: false,
    },
    {
      title: "Market Cap",
      value: "$2.5T",
      change: "+0.5%",
      isPositive: true,
    },
    {
      title: "Avg. Monthly Growth",
      value: "+3.5%",
      change: "Based on last 6 months",
      isPositive: null,
    },
  ];

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
