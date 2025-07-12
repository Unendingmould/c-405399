import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface InvestmentConfirmationProps {
  plan?: string;
  amount?: number;
  transactionId?: string;
  date?: string;
}

const InvestmentConfirmed = ({ 
  plan = "Balanced Portfolio",
  amount = 5000,
  transactionId = "TXN7B391C0AD4",
  date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}: InvestmentConfirmationProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate('/investment-plans');
  };

  const handleViewPortfolio = () => {
    setOpen(false);
    navigate('/portfolio');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl w-full max-w-md mx-4 p-8 border-2 border-primary/30 shadow-2xl shadow-primary/20"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-green-500/10 rounded-full mb-5">
            <div className="p-3 bg-green-500/20 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">Investment Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your investment in the {plan} has been successfully processed.
          </p>
          
          <div className="w-full bg-muted/50 rounded-lg p-6 text-left space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-semibold text-primary">{plan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount Invested</span>
              <span className="font-semibold text-foreground">
                ${amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-sm text-muted-foreground">{transactionId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold text-foreground">{date}</span>
            </div>
          </div>
          
          <div className="flex space-x-4 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button 
              className="flex-1 flex items-center justify-center space-x-2"
              onClick={handleViewPortfolio}
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvestmentConfirmed;
