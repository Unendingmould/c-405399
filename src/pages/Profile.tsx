import { useState } from "react";
import { Edit, Check, Shield, Clock, CheckCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

// Define custom classes for glassmorphism effect if not already in global CSS
const glassmorphismClasses = "bg-gray-900/60 backdrop-blur-md border border-gray-700/30 shadow-xl";

const Profile = () => {
  const navigate = useNavigate();
  const [kycCompleted, setKycCompleted] = useState(false);
  
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-100">My Profile</h1>
          <p className="text-gray-400">View and manage your profile details.</p>
        </div>
        <Button 
          className="bg-indigo-500 hover:bg-indigo-600 text-gray-100 font-medium"
          onClick={() => navigate('/dashboard/profile/edit')}
        >
          <Edit className="h-4 w-4 mr-2" />
          <span>Edit Profile</span>
        </Button>
      </header>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${glassmorphismClasses} p-6 md:p-8 rounded-xl`}
      >
        <div className="flex flex-col md:flex-row items-center md:space-x-8">
          <div className="relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7GwKeX4DhlcaTexHVYxMkH-k2cG4J2X8D1JSeIpe4sVTw41q59fydhVgbABduqYxvpidsPbeAttoroU_yx0r9HkMbRSbPIOrVUGsX6UizpgCtdEFANR5v26Ayc8MRClINojy_dzQFvZ1fHB3ysg3Ft7_QdraC55dY3jm7U30f0Ub4rofo89VHwKkUjy5Wks4anncs9fMMdaTs4rWwRkSvEANooELb2KEbQUhcGaezd4N2iI606N1V55PiHDENXu9h_3bxZN6GRBY" 
              alt="User profile picture" 
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700" 
            />
            <span 
              className="absolute bottom-2 right-2 block h-5 w-5 rounded-full bg-green-500 border-2 border-gray-800" 
              title="Online"
            ></span>
          </div>
          <div className="mt-6 md:mt-0 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">Alex Johnson</h2>
            <p className="text-indigo-300 mt-1">alex.johnson@example.com</p>
            <div className="mt-4 flex items-center justify-center md:justify-start space-x-2">
              <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30 flex items-center px-3 py-1">
                <Check className="h-3 w-3 mr-1" />
                KYC Verified
              </Badge>
              <span className="text-sm text-gray-400">Member since: Jan 2022</span>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-gray-700/50">
          <h3 className="text-xl font-semibold text-gray-200 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-gray-300">
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="font-medium">Alex Johnson</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone Number</p>
              <p className="font-medium">+1 (555) 123-4567</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Date of Birth</p>
              <p className="font-medium">August 24, 1988</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-400">Address</p>
              <p className="font-medium">123 Market Street, Suite 450, San Francisco, CA 94103</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Country</p>
              <p className="font-medium">United States</p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-gray-700/50">
          <h3 className="text-xl font-semibold text-gray-200 mb-6">Account Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-gray-300">
            <div>
              <p className="text-sm text-gray-400">Account Type</p>
              <p className="font-medium">Premium</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Account Status</p>
              <p className="font-medium text-green-400">Active</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">2FA Authentication</p>
              <p className="font-medium">Enabled</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email Notifications</p>
              <p className="font-medium">Enabled</p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-gray-700/50">
          <h3 className="text-xl font-semibold text-gray-200 mb-6">KYC Verification</h3>
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-5 w-5 text-indigo-400" />
            <span className="text-gray-300">Identity and address verification</span>
          </div>
          
          <Card className="bg-gray-800/50 border-gray-700/30">
            <CardContent className="p-6">
              {!kycCompleted ? (
                <>
                  <div>
                    <Label>Upload ID Document</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500/50 transition-colors">
                      <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Passport, ID card, or Driver's license</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Label>Upload Proof of Address</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-700/50 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500/50 transition-colors">
                      <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Utility bill, bank statement, etc.</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    variant="default"
                    onClick={() => setKycCompleted(true)}
                  >
                    Submit for Verification
                  </Button>
                  
                  <div className="pt-4 border-t border-gray-700/50 mt-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-800/70 rounded-lg">
                      <Clock className="h-8 w-8 text-yellow-400" />
                      <div>
                        <p className="font-medium text-yellow-400">Verification Status: Pending</p>
                        <p className="text-xs text-gray-400">
                          Please submit your documents for KYC verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-4 p-4 bg-gray-800/70 rounded-lg">
                    <CheckCircle className="h-10 w-10 text-green-400" />
                    <div>
                      <p className="font-medium text-green-400">Verification Complete</p>
                      <p className="text-xs text-gray-400">Approved on Nov 18, 2023.</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-200 mb-2">Submitted Documents</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800/70 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-indigo-400">🆔</span>
                          <span className="text-sm font-medium text-gray-200">Passport</span>
                        </div>
                        <span className="text-xs text-gray-400">passport.pdf</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/70 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-indigo-400">📄</span>
                          <span className="text-sm font-medium text-gray-200">Proof of Address</span>
                        </div>
                        <span className="text-xs text-gray-400">utility_bill.jpg</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700/50 mt-6">
                    <p className="text-xs text-gray-400">
                      All your personal information is stored securely and encrypted. 
                      If you need to update your documents, please contact support.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </main>
  );
};

export default Profile;