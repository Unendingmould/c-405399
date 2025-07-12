import { useState } from "react";
import { Save, Bell, Lock, EyeOff, Sun, Moon, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

// Define custom classes for glassmorphism effect
const glassmorphismClasses = "bg-gray-900/60 backdrop-blur-md border border-gray-700/30 shadow-xl";

const Settings = () => {
  const [theme, setTheme] = useState("dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [language, setLanguage] = useState("english");
  const [currency, setCurrency] = useState("usd");

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-100">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>
        <Button 
          className="bg-indigo-500 hover:bg-indigo-600 text-gray-100 font-medium"
          onClick={handleSaveSettings}
        >
          <Save className="h-4 w-4 mr-2" />
          <span>Save Changes</span>
        </Button>
      </header>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card className={glassmorphismClasses}>
              <CardHeader>
                <CardTitle className="text-gray-200">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="language" className="text-gray-400">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="currency" className="text-gray-400">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="jpy">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="theme" className="text-gray-400">Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className={`border-gray-700 h-20 ${theme === "light" ? "ring-2 ring-indigo-500" : ""}`}
                        onClick={() => setTheme("light")}
                      >
                        <div className="flex flex-col items-center">
                          <Sun className="h-6 w-6 text-yellow-400 mb-2" />
                          <span className="text-xs text-gray-300">Light</span>
                          {theme === "light" && <Check className="absolute top-2 right-2 h-4 w-4 text-indigo-400" />}
                        </div>
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className={`border-gray-700 h-20 ${theme === "dark" ? "ring-2 ring-indigo-500" : ""}`}
                        onClick={() => setTheme("dark")}
                      >
                        <div className="flex flex-col items-center">
                          <Moon className="h-6 w-6 text-indigo-400 mb-2" />
                          <span className="text-xs text-gray-300">Dark</span>
                          {theme === "dark" && <Check className="absolute top-2 right-2 h-4 w-4 text-indigo-400" />}
                        </div>
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className={`border-gray-700 h-20 ${theme === "system" ? "ring-2 ring-indigo-500" : ""}`}
                        onClick={() => setTheme("system")}
                      >
                        <div className="flex flex-col items-center">
                          <Monitor className="h-6 w-6 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-300">System</span>
                          {theme === "system" && <Check className="absolute top-2 right-2 h-4 w-4 text-indigo-400" />}
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card className={glassmorphismClasses}>
              <CardHeader>
                <CardTitle className="text-gray-200">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications" className="text-gray-200 font-medium">Enable Notifications</Label>
                    <p className="text-sm text-gray-400">Receive notifications about account activity</p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notificationsEnabled} 
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <div className="space-y-4 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-gray-200">Email Notifications</Label>
                      <p className="text-xs text-gray-400">Receive updates via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                      disabled={!notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="text-gray-200">Push Notifications</Label>
                      <p className="text-xs text-gray-400">Receive updates via push notifications</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications}
                      disabled={!notificationsEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card className={glassmorphismClasses}>
              <CardHeader>
                <CardTitle className="text-gray-200">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="2fa" className="text-gray-200 font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-400">Additional security for your account</p>
                  </div>
                  <Switch 
                    id="2fa" 
                    checked={twoFactorAuth} 
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="login-alerts" className="text-gray-200 font-medium">Login Alerts</Label>
                    <p className="text-sm text-gray-400">Receive alerts for unusual login activity</p>
                  </div>
                  <Switch 
                    id="login-alerts" 
                    checked={loginAlerts} 
                    onCheckedChange={setLoginAlerts}
                  />
                </div>
                
                <div className="space-y-2 pt-4 border-t border-gray-700/50">
                  <Label htmlFor="timeout" className="text-gray-200">Session Timeout (minutes)</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-gray-700/50">
                  <Label htmlFor="current-password" className="text-gray-200">Change Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="Current password" 
                    className="bg-gray-800/50 border-gray-700 text-gray-200 mb-2"
                  />
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="New password" 
                    className="bg-gray-800/50 border-gray-700 text-gray-200 mb-2"
                  />
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm new password" 
                    className="bg-gray-800/50 border-gray-700 text-gray-200"
                  />
                  <Button className="mt-2 w-full">Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
};

export default Settings;
