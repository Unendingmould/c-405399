
import { useState, useEffect } from "react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const navigationItems = [
    { icon: LayoutDashboard, title: "Dashboard", path: "/dashboard" },
    { icon: TrendingUp, title: "Investments", path: "/dashboard/investment-plans" },
    { icon: Wallet, title: "Portfolio", path: "/dashboard/portfolio" },
    { icon: Receipt, title: "Transactions", path: "/dashboard/transactions" },
    { icon: BarChart3, title: "Reports", path: "/dashboard/reports" },
    { icon: User, title: "Profile", path: "/dashboard/profile" },
  ];

  const bottomItems = [
    { icon: HelpCircle, title: "Help Center", path: "/dashboard/help" },
    { icon: Settings, title: "Settings", path: "/dashboard/settings" },
    { icon: LogOut, title: "Logout", path: "/login" },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSheetOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <div className="text-3xl font-bold text-indigo-400">P</div>
        {!isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-all duration-300"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      {/* Navigation Items */}
      <nav className="flex flex-col space-y-2 flex-grow p-4">
        {navigationItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsSheetOpen(false)}
              className={`sidebar-icon p-3 rounded-lg transition-all duration-300 relative flex items-center ${
                isActive 
                  ? "text-indigo-400 bg-gray-800" 
                  : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
              } ${!isExpanded && !isMobile && "justify-center"}`}
              title={!isExpanded && !isMobile ? item.title : undefined}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || isMobile) && (
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
      <div className="flex flex-col space-y-2 p-4 border-t border-gray-700/50">
        {bottomItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsSheetOpen(false)}
              className={`sidebar-icon p-3 rounded-lg transition-all duration-300 relative flex items-center ${
                isActive 
                  ? "text-indigo-400 bg-gray-800" 
                  : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
              } ${!isExpanded && !isMobile && "justify-center"}`}
              title={!isExpanded && !isMobile ? item.title : undefined}
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {(isExpanded || isMobile) && (
                <span className="ml-3 font-medium animate-fade-in">{item.title}</span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4/5 bg-indigo-400 rounded-r-lg" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700/50 p-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-400">P</div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-all duration-300">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-gray-900 border-gray-700/50 p-0">
              <NavigationContent />
            </SheetContent>
          </Sheet>
        </div>
        {/* Spacer for fixed header */}
        <div className="h-16 md:hidden"></div>
      </>
    );
  }

  return (
    <aside 
      className={`${
        isExpanded ? "w-64" : "w-20"
      } bg-gray-900 flex flex-col sticky top-0 h-screen border-r border-gray-700/50 transition-all duration-300 ease-in-out hidden md:flex`}
    >
      <NavigationContent />
    </aside>
  );
};

export default Sidebar;
