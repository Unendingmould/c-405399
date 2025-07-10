
import { useState } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Receipt, 
  BarChart3, 
  User,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const navigationItems = [
    { icon: LayoutDashboard, title: "Dashboard", path: "/" },
    { icon: TrendingUp, title: "Investments", path: "/investments" },
    { icon: Wallet, title: "Portfolio", path: "/portfolio" },
    { icon: Receipt, title: "Transactions", path: "/transactions" },
    { icon: BarChart3, title: "Reports", path: "/reports" },
    { icon: User, title: "Profile", path: "/profile" },
  ];

  const bottomItems = [
    { icon: HelpCircle, title: "Help Center", path: "/help" },
    { icon: Settings, title: "Settings", path: "/settings" },
    { icon: LogOut, title: "Logout", path: "/login" },
  ];

  return (
    <aside 
      className={`${
        isExpanded ? "w-64" : "w-20"
      } bg-gray-900 p-4 flex flex-col sticky top-0 h-screen border-r border-gray-700/50 transition-all duration-300 ease-in-out`}
    >
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className={`text-3xl font-bold text-indigo-400 ${!isExpanded && "mx-auto"}`}>
          P
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-all duration-300"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex flex-col space-y-2 flex-grow">
        {navigationItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`sidebar-icon p-3 rounded-lg transition-all duration-300 relative flex items-center ${
                isActive 
                  ? "text-indigo-400 bg-gray-800" 
                  : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
              } ${!isExpanded && "justify-center"}`}
              title={!isExpanded ? item.title : undefined}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {isExpanded && (
                <span className="ml-3 font-medium animate-fade-in">{item.title}</span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4/5 bg-indigo-400 rounded-r-lg" />
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Bottom Items */}
      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-700/50">
        {bottomItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`sidebar-icon p-3 rounded-lg transition-all duration-300 relative flex items-center ${
                isActive 
                  ? "text-indigo-400 bg-gray-800" 
                  : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
              } ${!isExpanded && "justify-center"}`}
              title={!isExpanded ? item.title : undefined}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {isExpanded && (
                <span className="ml-3 font-medium animate-fade-in">{item.title}</span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4/5 bg-indigo-400 rounded-r-lg" />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
