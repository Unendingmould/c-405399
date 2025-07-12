import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, PieChart, Clock, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';

const InvestmentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [investmentAmount, setInvestmentAmount] = useState('1,000.00');

  // Mock data - in a real app, this would come from an API
  const investmentDetails = {
    title: 'Balanced Portfolio',
    description: 'A mix of equities and fixed-income assets for balanced growth and risk management.',
    risk: 'Medium Risk',
    riskColor: 'bg-yellow-500/20 text-yellow-300',
    expectedReturn: '6-9%',
    term: '5 Years',
    minInvestment: '$500',
    assetClass: 'Mixed',
    liquidity: 'Quarterly',
    allocations: [
      { name: 'Equities', percentage: 60, color: 'bg-primary' },
      { name: 'Fixed Income', percentage: 30, color: 'bg-teal-500' },
      { name: 'Commodities', percentage: 10, color: 'bg-yellow-500' }
    ]
  };

  const userBalance = 12450.00;
  const amount = parseFloat(investmentAmount.replace(/,/g, '')) || 0;
  const estimatedYearlyReturn = {
    min: Math.floor(amount * 0.06),
    max: Math.floor(amount * 0.09)
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    const formatted = parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setInvestmentAmount(isNaN(parseFloat(value)) ? '' : formatted);
  };

  const setPercentageAmount = (percentage: number) => {
    const amount = (userBalance * percentage / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setInvestmentAmount(amount);
  };

  return (
    <div className="min-h-screen">
      <main className="p-6 md:p-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/investment-plans')}
              className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 p-0"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="ml-2 font-medium">Back to Investment Plans</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary">{investmentDetails.title}</h1>
                    <p className="text-muted-foreground mt-2">{investmentDetails.description}</p>
                  </div>
                  <Badge className={`mt-4 md:mt-0 ${investmentDetails.riskColor} self-start`}>
                    {investmentDetails.risk}
                  </Badge>
                </div>

                <div className="space-y-6">
                  {/* Investment Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Investment Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <Calendar className="text-primary w-5 h-5" />
                        <span>
                          <span className="font-medium text-foreground">Term:</span> {investmentDetails.term}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="text-primary w-5 h-5" />
                        <span>
                          <span className="font-medium text-foreground">Min. Investment:</span> {investmentDetails.minInvestment}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <PieChart className="text-primary w-5 h-5" />
                        <span>
                          <span className="font-medium text-foreground">Asset Class:</span> {investmentDetails.assetClass}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="text-primary w-5 h-5" />
                        <span>
                          <span className="font-medium text-foreground">Liquidity:</span> {investmentDetails.liquidity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expected Return */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Expected Return</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl font-bold text-green-400">{investmentDetails.expectedReturn}</span>
                      <span className="text-lg text-muted-foreground">p.a.</span>
                    </div>
                  </div>

                  {/* Asset Allocation */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Asset Allocation</h3>
                    <div className="space-y-3">
                      {investmentDetails.allocations.map((allocation) => (
                        <div key={allocation.name} className="flex items-center">
                          <span className="w-28 text-muted-foreground">{allocation.name}</span>
                          <div className="w-full bg-muted rounded-full h-4 ml-4">
                            <div 
                              className={`${allocation.color} h-4 rounded-full transition-all duration-500`}
                              style={{ width: `${allocation.percentage}%` }}
                            ></div>
                          </div>
                          <span className="ml-4 text-foreground font-medium">{allocation.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Form */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-6 md:p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Invest in this Plan</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="investment-amount">
                      Enter Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground font-semibold">
                        $
                      </span>
                      <Input
                        className="text-right text-xl py-4 pl-10 pr-4"
                        id="investment-amount"
                        name="investment-amount"
                        placeholder="1,000.00"
                        type="text"
                        value={investmentAmount}
                        onChange={handleAmountChange}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <button 
                        onClick={() => setPercentageAmount(25)}
                        className="hover:text-primary transition-colors"
                      >
                        25%
                      </button>
                      <button 
                        onClick={() => setPercentageAmount(50)}
                        className="hover:text-primary transition-colors"
                      >
                        50%
                      </button>
                      <button 
                        onClick={() => setPercentageAmount(75)}
                        className="hover:text-primary transition-colors"
                      >
                        75%
                      </button>
                      <button 
                        onClick={() => setPercentageAmount(100)}
                        className="hover:text-primary transition-colors"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Your balance</span>
                      <span className="font-medium text-foreground">
                        ${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Estimated yearly return</span>
                      <span className="font-medium text-green-400">
                        +${estimatedYearlyReturn.min} - ${estimatedYearlyReturn.max}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button className="font-bold py-4 px-4 rounded-lg w-full text-lg">
                      Confirm Investment
                    </Button>
                    <Button variant="outline" className="font-medium py-3 px-4 rounded-lg w-full flex items-center justify-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add to Watchlist</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestmentDetails;