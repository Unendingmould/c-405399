
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Receipt, 
  BarChart3, 
  User,
  HelpCircle,
  Settings,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
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
    <aside className="w-20 bg-gray-900 p-4 flex flex-col items-center sticky top-0 h-screen border-r border-gray-700/50">
      <div className="text-3xl font-bold text-indigo-400">P</div>
      
      <nav className="flex flex-col space-y-4 mt-8 flex-grow">
        {navigationItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`sidebar-icon p-3 rounded-lg transition-all duration-300 relative ${
                isActive 
                  ? "text-indigo-400 bg-gray-800" 
                  : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
              }`}
              title={item.title}
            >
              <item.icon className="w-6 h-6" />
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4/5 bg-indigo-400 rounded-r-lg" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="flex flex-col space-y-4">
        {bottomItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`sidebar-icon p-3 rounded-lg transition-all duration-300 relative ${
                isActive 
                  ? "text-indigo-400 bg-gray-800" 
                  : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
              }`}
              title={item.title}
            >
              <item.icon className="w-6 h-6" />
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
