
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-100">Welcome back, Alex!</h1>
        <p className="text-gray-400 text-sm md:text-base">Here's your investment overview for today.</p>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto justify-between md:justify-end">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors duration-300 text-xs md:text-sm">
          <Download className="w-4 h-4" />
          <span className="font-medium hidden sm:inline">Download Report</span>
          <span className="font-medium sm:hidden">Report</span>
        </Button>
        
        <img 
          alt="User avatar" 
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-indigo-400" 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        />
      </div>
    </header>
  );
};

export default Header;
