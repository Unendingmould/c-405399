import { useState } from "react";
import { Save, Upload, CheckCircle, Clock, Shield, User, Lock, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    currency: "eur",
    theme: "dark"
  });

  const [kycCompleted, setKycCompleted] = useState(false); // Toggle this to show different KYC states

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account details and preferences.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-muted-foreground">Last login: 2023-11-16 10:00 AM</span>
          <Button className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* User Information */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>User Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button variant="outline">Update Password</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="glassmorphism border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <Label htmlFor="currency">Preferred Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - United States Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound Sterling</SelectItem>
                      <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Theme</Label>
                  <div className="flex items-center space-x-2 bg-muted/50 p-1 rounded-lg mt-2">
                    <Button
                      variant={formData.theme === "light" ? "default" : "ghost"}
                      size="sm"
                      className="w-full flex justify-center items-center space-x-2"
                      onClick={() => handleInputChange("theme", "light")}
                    >
                      <span>☀️</span>
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={formData.theme === "dark" ? "default" : "ghost"}
                      size="sm"
                      className="w-full flex justify-center items-center space-x-2"
                      onClick={() => handleInputChange("theme", "dark")}
                    >
                      <span>🌙</span>
                      <span>Dark</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KYC Verification Sidebar */}
        <div className="lg:col-span-1">
          <Card className="glassmorphism border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>KYC Verification</span>
                  </CardTitle>
                  <CardDescription>
                    {kycCompleted 
                      ? "Your account is fully verified." 
                      : "Complete verification to unlock all features."
                    }
                  </CardDescription>
                </div>
                <Badge 
                  className={kycCompleted 
                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  }
                >
                  {kycCompleted ? "Completed" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!kycCompleted ? (
                <>
                  <div>
                    <Label htmlFor="id-type">ID Type</Label>
                    <Select defaultValue="passport">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="license">Driver's License</SelectItem>
                        <SelectItem value="national-id">National ID Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Upload ID Document</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop files here or <span className="font-semibold text-primary">browse</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>

                  <div>
                    <Label>Upload Proof of Address</Label>
                    <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Utility bill, bank statement, etc.</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setKycCompleted(true)}
                  >
                    Submit for Verification
                  </Button>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-2">Verification Status:</h3>
                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                      <Clock className="h-8 w-8 text-yellow-400" />
                      <div>
                        <p className="font-medium text-yellow-400">Pending Approval</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted on Nov 15, 2023. Review may take up to 3 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-10 w-10 text-green-400" />
                    <div>
                      <p className="font-medium text-green-400">Verification Complete</p>
                      <p className="text-xs text-muted-foreground">Approved on Nov 18, 2023.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Submitted Documents</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/70 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-primary">🆔</span>
                          <span className="text-sm font-medium text-foreground">Passport</span>
                        </div>
                        <span className="text-xs text-muted-foreground">passport.pdf</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/70 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-primary">📄</span>
                          <span className="text-sm font-medium text-foreground">Proof of Address</span>
                        </div>
                        <span className="text-xs text-muted-foreground">utility_bill.jpg</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      All your personal information is stored securely and encrypted. 
                      If you need to update your documents, please contact support.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;