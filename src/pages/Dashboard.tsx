
import { motion } from "framer-motion";
import Header from "@/components/dashboard/Header";
import KPICards from "@/components/dashboard/KPICards";
import AssetPerformanceChart from "@/components/dashboard/AssetPerformanceChart";
import CreditScore from "@/components/dashboard/CreditScore";
import TopCoins from "@/components/dashboard/TopCoins";

const Dashboard = () => {
  return (
    <main className="flex-1 p-6 md:p-8 space-y-8">
      <Header />
      
      <section>
        {/* Total Investment Value */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-xl mb-8"
        >
          <p className="text-sm text-gray-400 mb-1">TOTAL INVESTMENT VALUE</p>
          <p className="text-4xl font-bold text-gray-100">$125,780.50</p>
        </motion.div>

        <KPICards />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AssetPerformanceChart />
        </div>
        
        <div className="space-y-6">
          <CreditScore />
          <TopCoins />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
