
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      <div>
        <h1 className="text-3xl font-semibold text-gray-100">Welcome back, Alex!</h1>
        <p className="text-gray-400">Here's your investment overview for today.</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors duration-300">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Download Report</span>
        </Button>
        
        <img 
          alt="User avatar" 
          className="w-10 h-10 rounded-full border-2 border-indigo-400" 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        />
      </div>
    </header>
  );
};

export default Header;
