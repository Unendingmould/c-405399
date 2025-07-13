
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Deposit from "./pages/Deposit";
import DepositConfirmation from "./pages/DepositConfirmation";
import Withdraw from "./pages/Withdraw";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import Portfolio from "./pages/Portfolio";
import TermsAndConditions from "./pages/TermsAndConditions";
import InvestmentConfirmed from "./pages/InvestmentConfirmed";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordReset from "./pages/PasswordReset";
import KYCVerification from "./pages/KYCVerification";
import WithdrawalConfirmation from "./pages/WithdrawalConfirmation";
import TransactionDetails from "./pages/TransactionDetails";
import InvestmentPlans from "./pages/InvestmentPlans";
import InvestmentDetails from "./pages/InvestmentDetails";
import Sidebar from "./components/dashboard/Sidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes - No Sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            
            {/* Dashboard Routes - With Sidebar */}
            <Route path="/dashboard/*" element={
              <div className="flex">
                <Sidebar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/deposit" element={<Deposit />} />
                    <Route path="/deposit-confirmation" element={<DepositConfirmation />} />
                    <Route path="/withdraw" element={<Withdraw />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<EditProfile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/investment-confirmed" element={<InvestmentConfirmed />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/kyc" element={<KYCVerification />} />
                    <Route path="/withdrawal-confirmation" element={<WithdrawalConfirmation />} />
                    <Route path="/transaction-details/:id" element={<TransactionDetails />} />
                    <Route path="/investment-plans" element={<InvestmentPlans />} />
                    <Route path="/investment-details/:id" element={<InvestmentDetails />} />
                  </Routes>
                </main>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
