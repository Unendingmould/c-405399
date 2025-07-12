import { useState } from "react";
import { ChevronRight, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Define custom classes for glassmorphism effect
const glassmorphismClasses = "bg-gray-900/60 backdrop-blur-md border border-gray-700/30 shadow-xl";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  
  const handleContinue = () => {
    if (agreedToTerms && agreedToPrivacy) {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${glassmorphismClasses} w-full max-w-3xl p-6 md:p-8 rounded-xl`}
      >
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-100">Terms & Conditions</h1>
            <p className="text-gray-400 mt-1">Please review and agree to our terms</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>
        
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terms" className="space-y-4">
            <div className="bg-gray-800/30 p-4 rounded-lg max-h-[400px] overflow-y-auto text-gray-300">
              <h2 className="text-xl font-medium text-gray-100 mb-4">Terms of Service</h2>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">1. Introduction</h3>
              <p className="mb-3 text-sm leading-relaxed">
                Welcome to our investment platform. These Terms of Service govern your use of our website, services, and applications. By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access our services.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">2. Definitions</h3>
              <p className="mb-3 text-sm leading-relaxed">
                "Company", "We", "Us", or "Our" refers to the platform operators.
                "Content" means any information, data, text, software, images, or other materials that may be viewed on our Service.
                "Service" refers to the website, application, and services provided.
                "User", "You", or "Your" refers to the individual accessing or using the Service.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">3. Investment Risks</h3>
              <p className="mb-3 text-sm leading-relaxed">
                All investments involve risk, and the past performance of a security, investment product, or financial service is not a guarantee of future results or returns. There is always the potential of losing money when you invest in securities or other financial products. Investors should consider their investment objectives and risks carefully before investing.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">4. Account Registration</h3>
              <p className="mb-3 text-sm leading-relaxed">
                You must be at least 18 years of age to use our Service. You must register for an account to access certain features of the Service. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">5. User Responsibilities</h3>
              <p className="mb-3 text-sm leading-relaxed">
                You are responsible for safeguarding your account and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any other breach of security. We cannot and will not be liable for any loss or damage arising from your failure to comply with this instruction.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">6. Limitations of Liability</h3>
              <p className="mb-3 text-sm leading-relaxed">
                To the maximum extent permitted by applicable law, in no event shall the Company, its affiliates, or service providers be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including without limitation damages for loss of profits, goodwill, use, data, or other intangible losses, that result from the use of, or inability to use, the service.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">7. Changes to Terms</h3>
              <p className="mb-3 text-sm leading-relaxed">
                We reserve the right to modify these Terms at any time. If we make changes, we will provide notice of such changes, such as by sending an email notification, providing notice through the Service, or updating the "Last Updated" date at the beginning of these Terms. Your continued use of the Service following notification of changes represents your acceptance of such changes.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">8. Termination</h3>
              <p className="mb-3 text-sm leading-relaxed">
                We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">9. Governing Law</h3>
              <p className="mb-3 text-sm leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Company is registered, without regard to its conflict of law provisions.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">10. Contact Us</h3>
              <p className="mb-3 text-sm leading-relaxed">
                If you have any questions about these Terms, please contact us at support@example.com.
              </p>
            </div>
            
            <div className="flex items-start space-x-3 p-4">
              <Checkbox 
                id="terms-checkbox" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <Label 
                htmlFor="terms-checkbox" 
                className="text-gray-300 text-sm cursor-pointer"
              >
                I have read and agree to the Terms of Service
              </Label>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <div className="bg-gray-800/30 p-4 rounded-lg max-h-[400px] overflow-y-auto text-gray-300">
              <h2 className="text-xl font-medium text-gray-100 mb-4">Privacy Policy</h2>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">1. Information We Collect</h3>
              <p className="mb-3 text-sm leading-relaxed">
                We collect several different types of information for various purposes to provide and improve our Service to you:
                - Personal Data: While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: name, email address, phone number, address, financial information, and identification documents.
                - Usage Data: We may also collect information on how the Service is accessed and used ("Usage Data"). This may include information such as your computer's IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">2. Use of Data</h3>
              <p className="mb-3 text-sm leading-relaxed">
                We use the collected data for various purposes:
                - To provide and maintain our Service
                - To notify you about changes to our Service
                - To provide customer support
                - To gather analysis or valuable information so that we can improve our Service
                - To monitor the usage of our Service
                - To detect, prevent and address technical issues
                - To comply with applicable laws and regulations, including KYC (Know Your Customer) and AML (Anti-Money Laundering) requirements
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">3. Data Security</h3>
              <p className="mb-3 text-sm leading-relaxed">
                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">4. Data Retention</h3>
              <p className="mb-3 text-sm leading-relaxed">
                We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">5. Transfer of Data</h3>
              <p className="mb-3 text-sm leading-relaxed">
                Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. If you are located outside the United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to the United States and process it there.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">6. Disclosure of Data</h3>
              <p className="mb-3 text-sm leading-relaxed">
                We may disclose your Personal Data in the good faith belief that such action is necessary to:
                - Comply with a legal obligation
                - Protect and defend the rights or property of our Company
                - Prevent or investigate possible wrongdoing in connection with the Service
                - Protect the personal safety of users of the Service or the public
                - Protect against legal liability
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">7. Your Rights</h3>
              <p className="mb-3 text-sm leading-relaxed">
                You have certain rights related to your Personal Data:
                - The right to access, update or delete the information we have on you
                - The right of rectification - the right to correct information
                - The right to object - the right to object to our processing of your Personal Data
                - The right of restriction - the right to request that we restrict the processing of your personal information
                - The right to data portability - the right to be provided with a copy of the information we have on you
                - The right to withdraw consent - the right to withdraw your consent at any time
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">8. Changes to This Privacy Policy</h3>
              <p className="mb-3 text-sm leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
              
              <h3 className="text-lg font-medium text-gray-200 mt-6 mb-2">9. Contact Us</h3>
              <p className="mb-3 text-sm leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
              </p>
            </div>
            
            <div className="flex items-start space-x-3 p-4">
              <Checkbox 
                id="privacy-checkbox" 
                checked={agreedToPrivacy}
                onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
              />
              <Label 
                htmlFor="privacy-checkbox" 
                className="text-gray-300 text-sm cursor-pointer"
              >
                I have read and agree to the Privacy Policy
              </Label>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-6 bg-gray-700/50" />
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            className={`${agreedToTerms && agreedToPrivacy ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-700 hover:bg-gray-700 cursor-not-allowed'} text-gray-100 font-medium`}
            onClick={handleContinue}
            disabled={!(agreedToTerms && agreedToPrivacy)}
          >
            Continue
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;
