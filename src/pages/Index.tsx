import { useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import Footer from "@/components/Footer";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/button";
import { ArrowRight, Command } from "lucide-react";

const Index = () => {
  useEffect(() => {
    console.log("Index page mounted");
    document.title = "Crypto Trading Platform";
  }, []);
  
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative container px-4 pt-40 pb-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full glass"
        >
          <span className="text-sm font-medium">
            <Command className="w-4 h-4 inline-block mr-2" />
            Next-gen crypto trading platform
          </span>
        </motion.div>
        
        <div className="max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-normal mb-4 tracking-tight text-left">
            <span className="text-gray-200">
              <TextGenerateEffect words="Grow Your Crypto Portfolio" />
            </span>
            <br />
            <span className="text-white font-medium">
              <TextGenerateEffect words="on Autopilot" />
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl"
          >
            Our AI-powered platform analyzes market trends and automatically adjusts your portfolio to maximize returns while minimizing risks.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <Button size="lg" className="rounded-lg button-gradient" asChild>
              <a href="/signup">Start Trading Now</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg border-gray-700 hover:bg-gray-800/50" asChild>
              <a href="/login">Login to Account</a>
            </Button>
            <Button size="lg" variant="ghost" className="rounded-lg hover:bg-gray-800/50" asChild>
              <a href="#features">Learn More <ArrowRight className="ml-2 w-4 h-4" /></a>
            </Button>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Logo Carousel */}
      <LogoCarousel />
      
      {/* Features Section */}
      <div id="features" className="pt-10">
        <FeaturesSection />
      </div>
      
      {/* Pricing Section */}
      <div id="pricing" className="pt-10">
        <PricingSection />
      </div>
      
      {/* Testimonials Section */}
      <div id="testimonials" className="pt-10">
        <TestimonialsSection />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
