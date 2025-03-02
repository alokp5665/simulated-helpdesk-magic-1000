
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Lock,
  Mail,
  Phone,
  Shield,
  UserCog,
  Calendar,
  MessageSquare,
  Trash2,
  BookOpen,
  AlertTriangle,
  Save,
} from "lucide-react";

const SettingsPage = () => {
  // Use localStorage for persistence if available
  const getSavedUserData = () => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('userData');
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (e) {
          console.error('Error parsing saved user data:', e);
        }
      }
    }
    
    // Default data if nothing is saved
    return {
      name: "Arjun Sharma",
      email: "arjun.sharma@company.com",
      phone: "+1 (555) 123-4567",
      role: "Admin",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  };

  const [formData, setFormData] = useState(getSavedUserData());

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [integrations, setIntegrations] = useState({
    googleCalendar: true,
    slack: false,
    lms: true,
  });

  // Load integrations from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedIntegrations = localStorage.getItem('integrations');
      if (savedIntegrations) {
        try {
          setIntegrations(JSON.parse(savedIntegrations));
        } catch (e) {
          console.error('Error parsing saved integrations:', e);
        }
      }
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Basic phone validation - allows different formats with optional country code
    const phoneRegex = /^(?:\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleProfileUpdate = () => {
    // Reset errors
    setErrors({
      name: "",
      email: "",
      phone: "",
    });

    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: "Name is required" }));
      isValid = false;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: "Invalid email format" }));
      isValid = false;
    }

    // Validate phone
    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: "Invalid phone number format" }));
      isValid = false;
    }

    if (isValid) {
      // Save profile data to localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(formData));
      
      toast.success("Profile Updated Successfully", {
        description: "Your profile changes have been saved permanently.",
      });
    } else {
      toast.error("Please fix the errors in the form", {
        description: "There are validation errors that need to be addressed.",
      });
    }
  };

  const handlePasswordUpdate = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Update password in the formData
    const updatedData = {
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    
    // Save updated data to localStorage
    localStorage.setItem('userData', JSON.stringify(updatedData));
    setFormData(updatedData);
    
    toast.success("Password Updated Successfully", {
      description: "Your password has been changed and saved permanently.",
    });
  };

  const handleIntegrationToggle = (integration: keyof typeof integrations) => {
    setIntegrations(prev => {
      const newState = { ...prev, [integration]: !prev[integration] };
      
      // Save integrations to localStorage
      localStorage.setItem('integrations', JSON.stringify(newState));
      
      toast.success(
        `${integration} ${newState[integration] ? "Connected" : "Disconnected"}`,
        {
          description: `Successfully ${
            newState[integration] ? "connected to" : "disconnected from"
          } ${integration}`,
        }
      );
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Profile Overview */}
            <Card className="col-span-12 lg:col-span-8 glass-card hover-scale">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center space-x-2">
                      <UserCog className="h-5 w-5 text-primary" />
                      <span>Profile Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your profile information and preferences
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="animate-pulse">
                    {formData.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{formData.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={formData.name}
                          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className={`pl-9 ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className={`pl-9 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={formData.phone}
                          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className={`pl-9 ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                    <Button 
                      onClick={handleProfileUpdate} 
                      className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="col-span-12 lg:col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={formData.currentPassword}
                        onChange={e => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={formData.newPassword}
                        onChange={e => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handlePasswordUpdate} 
                    variant="outline" 
                    className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Integrations */}
            <Card className="col-span-12 lg:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Integrations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Google Calendar</h3>
                        <p className="text-sm text-muted-foreground">Sync your meetings and events</p>
                      </div>
                    </div>
                    <Button
                      variant={integrations.googleCalendar ? "destructive" : "default"}
                      onClick={() => handleIntegrationToggle("googleCalendar")}
                    >
                      {integrations.googleCalendar ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center space-x-4">
                      <MessageSquare className="h-8 w-8 text-purple-500" />
                      <div>
                        <h3 className="font-medium">Slack</h3>
                        <p className="text-sm text-muted-foreground">Connect with your team</p>
                      </div>
                    </div>
                    <Button
                      variant={integrations.slack ? "destructive" : "default"}
                      onClick={() => handleIntegrationToggle("slack")}
                    >
                      {integrations.slack ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center space-x-4">
                      <BookOpen className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-medium">Learning Management System</h3>
                        <p className="text-sm text-muted-foreground">Access your learning resources</p>
                      </div>
                    </div>
                    <Button
                      variant={integrations.lms ? "destructive" : "default"}
                      onClick={() => handleIntegrationToggle("lms")}
                    >
                      {integrations.lms ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card className="col-span-12 lg:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                    <h3 className="font-medium mb-2">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. All your data will be permanently deleted.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              // Clear localStorage data
                              localStorage.removeItem('userData');
                              localStorage.removeItem('integrations');
                              
                              toast.error("Account Deletion Initiated", {
                                description: "Your account will be permanently deleted.",
                              });
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
