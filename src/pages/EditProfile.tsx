import { useState } from "react";
import { Save, ArrowLeft, User, Mail, Phone, Calendar, Home, MapPin, Shield, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

// Define custom classes for glassmorphism effect if not already in global CSS
const glassmorphismClasses = "bg-gray-900/60 backdrop-blur-md border border-gray-700/30 shadow-xl";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1988-08-24",
    addressLine1: "123 Market Street",
    addressLine2: "Suite 450",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    country: "United States",
    profilePicture: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profilePicture: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your API
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    navigate('/profile');
  };

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-100">Edit Profile</h1>
          <p className="text-gray-400">Update your personal information</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-300"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Cancel</span>
          </Button>
          <Button 
            className="bg-indigo-500 hover:bg-indigo-600 text-gray-100 font-medium"
            onClick={handleSubmit}
          >
            <Save className="h-4 w-4 mr-2" />
            <span>Save Changes</span>
          </Button>
        </div>
      </header>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${glassmorphismClasses} p-6 md:p-8 rounded-xl`}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:items-start md:space-x-8 mb-8">
            <div className="relative mb-6 md:mb-0 flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 mb-4">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7GwKeX4DhlcaTexHVYxMkH-k2cG4J2X8D1JSeIpe4sVTw41q59fydhVgbABduqYxvpidsPbeAttoroU_yx0r9HkMbRSbPIOrVUGsX6UizpgCtdEFANR5v26Ayc8MRClINojy_dzQFvZ1fHB3ysg3Ft7_QdraC55dY3jm7U30f0Ub4rofo89VHwKkUjy5Wks4anncs9fMMdaTs4rWwRkSvEANooELb2KEbQUhcGaezd4N2iI606N1V55PiHDENXu9h_3bxZN6GRBY" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="w-full">
                <Label htmlFor="profilePicture" className="block text-center cursor-pointer">
                  <div className="flex items-center justify-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                    <UploadCloud className="h-4 w-4" />
                    <span className="text-sm font-medium">Change Photo</span>
                  </div>
                  <Input 
                    id="profilePicture" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </Label>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="text-sm text-gray-400 mb-1 block">
                    <User className="h-4 w-4 inline mr-2 text-gray-500" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm text-gray-400 mb-1 block">
                    <Mail className="h-4 w-4 inline mr-2 text-gray-500" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm text-gray-400 mb-1 block">
                    <Phone className="h-4 w-4 inline mr-2 text-gray-500" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth" className="text-sm text-gray-400 mb-1 block">
                    <Calendar className="h-4 w-4 inline mr-2 text-gray-500" />
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    type="date"
                    className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-200 mb-6">
              <Home className="h-5 w-5 inline mr-2 text-indigo-400" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="addressLine1" className="text-sm text-gray-400 mb-1 block">
                  Address Line 1
                </Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="addressLine2" className="text-sm text-gray-400 mb-1 block">
                  Address Line 2 (Optional)
                </Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-sm text-gray-400 mb-1 block">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm text-gray-400 mb-1 block">
                  State/Province
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-sm text-gray-400 mb-1 block">
                  Zip/Postal Code
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm text-gray-400 mb-1 block">
                  <MapPin className="h-4 w-4 inline mr-2 text-gray-500" />
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="bg-gray-800/50 border-gray-700 text-gray-200 focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-200 mb-6">
              <Shield className="h-5 w-5 inline mr-2 text-indigo-400" />
              Security Information
            </h3>
            <Card className="bg-gray-800/30 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-yellow-400" />
                  <p className="text-sm text-gray-300">
                    Your account security settings are managed separately. To change your password or 2FA settings, 
                    please visit the <span className="text-indigo-400 cursor-pointer hover:underline">Security Settings</span> page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700/50 flex justify-end">
            <Button 
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-gray-100 font-medium"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </main>
  );
};

export default EditProfile;
