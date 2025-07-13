
import { User } from "lucide-react";


const Header = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-100">Welcome back, Alex!</h1>
        <p className="text-gray-400 text-sm md:text-base">Here's your investment overview for today.</p>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto justify-between md:justify-end">
        <div className="hidden md:flex items-center text-sm text-gray-300 font-medium">
          <span className="mr-2">Alex Thompson</span>
          <User className="w-4 h-4 text-gray-400" />
        </div>
        
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
