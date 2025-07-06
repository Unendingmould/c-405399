
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "./CardSpotlight";

const PricingTier = ({
  name,
  price,
  description,
  features,
  isPopular,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) => (
  <CardSpotlight className={`h-full ${isPopular ? "border-primary" : "border-white/10"} border-2`}>
    <div className="relative h-full p-6 flex flex-col">
      {isPopular && (
        <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1 w-fit mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-medium mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
      </div>
      <p className="text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="button-gradient w-full">
        Start Investing
      </Button>
    </div>
  </CardSpotlight>
);

export const PricingSection = () => {
  return (
    <section className="container px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-normal mb-6"
        >
          Choose Your{" "}
          <span className="text-gradient font-medium">Trading Plan</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-lg text-gray-400"
        >
          Select the perfect trading plan with advanced features and competitive fees
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{ width: '105%', marginLeft: '-2.5%' }}>
        <PricingTier
          name="Seedling"
          price="$1,000 - $10,000"
          description="Perfect for growing your first crypto roots"
          features={[
            "AI-powered portfolio management",
            "5-8 cryptocurrency diversification",
            "Monthly rebalancing",
            "Portfolio Health Score",
            "Market trend analysis",
            "Monthly reports",
            "Standard security"
          ]}
        />
        <PricingTier
          name="Growth"
          price="$10,000 - $100,000"
          description="Designed for serious crypto growth"
          features={[
            "Advanced AI management",
            "10-15 cryptocurrency diversification",
            "Weekly rebalancing",
            "Portfolio Health Score Plus",
            "Predictive analytics",
            "Smart entry/exit timing",
            "DeFi yield optimization",
            "Priority support",
            "Weekly detailed reports"
          ]}
          isPopular
        />
        <PricingTier
          name="Forest"
          price="$100,000+"
          description="Elite crypto wealth management"
          features={[
            "Premium AI management",
            "20+ cryptocurrency diversification",
            "Daily rebalancing",
            "Portfolio Health Score Pro",
            "Institutional-grade algorithms",
            "Multi-exchange arbitrage",
            "Advanced derivatives trading",
            "Macro-economic analysis",
            "Custom strategy development",
            "Dedicated account manager",
            "VIP support",
            "Portfolio insurance"
          ]}
        />
      </div>
    </section>
  );
};
