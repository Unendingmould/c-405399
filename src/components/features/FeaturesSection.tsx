
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureTab } from "./FeatureTab";
import { FeatureContent } from "./FeatureContent";
import { features } from "@/config/features";
import { BarChart3, ShieldCheck, Wallet, ArrowUpDown } from "lucide-react";
import { ReactNode } from "react";

// Define the type for our features with iconName
type FeatureWithIconName = {
  title: string;
  description: string;
  iconName: string;
  image: string;
};

// Type assertion to help TypeScript understand our features structure
const featuresWithIconName = features as unknown as FeatureWithIconName[];

// Function to convert icon name string to the actual icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "BarChart3":
      return <BarChart3 className="w-6 h-6" />;
    case "ShieldCheck":
      return <ShieldCheck className="w-6 h-6" />;
    case "Wallet":
      return <Wallet className="w-6 h-6" />;
    case "ArrowUpDown":
      return <ArrowUpDown className="w-6 h-6" />;
    default:
      return <BarChart3 className="w-6 h-6" />; // Default icon
  }
};

export const FeaturesSection = () => {
  return (
    <section className="container px-4 py-24">
      {/* Header Section */}
      <div className="max-w-2xl mb-20">
        <h2 className="text-5xl md:text-6xl font-normal mb-6 tracking-tight text-left">
          Advanced Investment
          <br />
          <span className="text-gradient font-medium">Features & Tools</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 text-left">
          Experience professional-grade Investment tools and features designed for both novice and experienced crypto investors.
        </p>
      </div>

      <Tabs defaultValue={features[0].title} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left side - Tab triggers */}
          <div className="md:col-span-5 space-y-3">
            <TabsList className="flex flex-col w-full bg-transparent h-auto p-0 space-y-3">
              {featuresWithIconName.map((feature) => (
                <TabsTrigger
                  key={feature.title}
                  value={feature.title}
                  className="w-full data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  <FeatureTab
                    title={feature.title}
                    description={feature.description}
                    icon={getIconComponent(feature.iconName)}
                    isActive={false}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Right side - Tab content with images */}
          <div className="md:col-span-7">
            {featuresWithIconName.map((feature) => (
              <TabsContent
                key={feature.title}
                value={feature.title}
                className="mt-0 h-full"
              >
                <FeatureContent
                  image={feature.image}
                  title={feature.title}
                />
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </section>
  );
};
