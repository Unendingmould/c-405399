import React from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const InvestmentPlans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'conservative-growth',
      title: 'Conservative Growth',
      risk: 'Low Risk',
      riskColor: 'bg-blue-500/20 text-blue-300',
      description: 'Focuses on capital preservation with modest growth potential. Ideal for long-term, stable returns.',
      expectedReturn: '3-5%',
      progress: 40,
      featured: false
    },
    {
      id: 'balanced-portfolio',
      title: 'Balanced Portfolio',
      risk: 'Medium Risk',
      riskColor: 'bg-yellow-500/20 text-yellow-300',
      description: 'A mix of equities and fixed-income assets for balanced growth and risk management.',
      expectedReturn: '6-9%',
      progress: 75,
      featured: true
    },
    {
      id: 'aggressive-tech',
      title: 'Aggressive Tech',
      risk: 'High Risk',
      riskColor: 'bg-red-500/20 text-red-300',
      description: 'High-growth potential by investing in emerging technology sectors and innovative startups.',
      expectedReturn: '10-15%+',
      progress: 95,
      featured: false
    },
    {
      id: 'real-estate-fund',
      title: 'Real Estate Fund',
      risk: 'Low Risk',
      riskColor: 'bg-blue-500/20 text-blue-300',
      description: 'Invest in a diversified portfolio of commercial and residential properties for steady income.',
      expectedReturn: '4-6%',
      progress: 50,
      featured: false
    },
    {
      id: 'global-equities',
      title: 'Global Equities',
      risk: 'Medium Risk',
      riskColor: 'bg-yellow-500/20 text-yellow-300',
      description: 'Diversify your investments across international markets and leading global companies.',
      expectedReturn: '7-11%',
      progress: 80,
      featured: false
    },
    {
      id: 'green-energy',
      title: 'Green Energy',
      risk: 'High Growth',
      riskColor: 'bg-green-500/20 text-green-300',
      description: 'Capitalize on the renewable energy transition by investing in solar, wind, and other sustainable technologies.',
      expectedReturn: '12-18%',
      progress: 90,
      featured: false
    }
  ];

  const handleInvestNow = (planId: string) => {
    navigate(`/investment-details/${planId}`);
  };

  return (
    <div className="min-h-screen">
      <main className="p-6 md:p-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Investment Plans</h1>
              <p className="text-muted-foreground mt-1">Explore opportunities and grow your assets.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  className="pl-10 pr-4 py-2 w-full md:w-64" 
                  placeholder="Search plans..." 
                  type="text"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`glass rounded-xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 ${
                  plan.featured ? 'border-2 border-primary shadow-lg shadow-primary/10' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-primary">{plan.title}</h2>
                  <Badge className={plan.riskColor}>
                    {plan.risk}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground flex-grow mb-4">{plan.description}</p>
                
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Expected Return</span>
                    <span className="text-2xl font-semibold text-green-400">
                      {plan.expectedReturn}
                      <span className="text-base font-normal text-muted-foreground ml-1">p.a.</span>
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${plan.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <Button 
                  className="font-bold py-3 px-4 rounded-lg w-full mt-auto"
                  onClick={() => handleInvestNow(plan.id)}
                >
                  Invest Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestmentPlans;