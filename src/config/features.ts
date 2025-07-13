// Using string identifiers instead of JSX for icons
export interface Feature {
  title: string;
  description: string;
  iconName: string;
  image: string;
}

export const features: Feature[] = [
  {
    title: "Advanced Investment Interface",
    description: "Professional-grade investment tools with real-time market data.",
    iconName: "BarChart3",
    image: "/lovable-uploads/86329743-ee49-4f2e-96f7-50508436273d.png"
  },
  {
    title: "Portfolio Management",
    description: "Track your investments with our comprehensive portfolio dashboard.",
    iconName: "Wallet",
    image: "/lovable-uploads/7335619d-58a9-41ad-a233-f7826f56f3e9.png"
  },
  {
    title: "Security & Verification",
    description: "Industry-leading security measures with KYC verification process.",
    iconName: "ShieldCheck",
    image: "/lovable-uploads/b6436838-5c1a-419a-9cdc-1f9867df073d.png"
  },
  {
    title: "Performance Analytics",
    description: "Detailed analytics to help you make informed decisions.",
    iconName: "ArrowUpDown",
    image: "/lovable-uploads/79f2b901-8a4e-42a5-939f-fae0828e0aef.png"
  }
];
