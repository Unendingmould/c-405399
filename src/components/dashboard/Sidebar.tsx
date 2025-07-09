
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

const Sidebar = () => {
  const navigationItems = [
    { icon: LayoutDashboard, title: "Dashboard", active: true, path: "/" },
    { icon: TrendingUp, title: "Investments", path: "/investments" },
    { icon: Wallet, title: "Portfolio", path: "/portfolio" },
    { icon: Receipt, title: "Transactions", path: "/transactions" },
    { icon: BarChart3, title: "Reports", path: "/reports" },
    { icon: User, title: "Profile", path: "/profile" },
  ];

  const bottomItems = [
    { icon: HelpCircle, title: "Help Center" },
    { icon: Settings, title: "Settings" },
    { icon: LogOut, title: "Logout" },
  ];

  return (
    <aside className="w-20 bg-gray-900 p-4 flex flex-col items-center sticky top-0 h-screen border-r border-gray-700/50">
      <div className="text-3xl font-bold text-indigo-400">P</div>
      
      <nav className="flex flex-col space-y-4 mt-8 flex-grow">
        {navigationItems.map((item, index) => (
          <a
            key={index}
            className={`sidebar-icon p-3 rounded-lg transition-all duration-300 ${
              item.active 
                ? "text-indigo-400 bg-gray-800 relative" 
                : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
            }`}
            href="#"
            title={item.title}
          >
            <item.icon className="w-6 h-6" />
            {item.active && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4/5 bg-indigo-400 rounded-r-lg" />
            )}
          </a>
        ))}
      </nav>
      
      <div className="flex flex-col space-y-4">
        {bottomItems.map((item, index) => (
          <a
            key={index}
            className="sidebar-icon p-3 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-all duration-300"
            href="#"
            title={item.title}
          >
            <item.icon className="w-6 h-6" />
          </a>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
