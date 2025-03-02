
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowRight, Github, Twitter, User, Users } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Get saved email from localStorage if "Remember me" was selected
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      email: "",
      password: "",
    });

    // Validate fields
    let isValid = true;
    
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      isValid = false;
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: "Invalid email format" }));
      isValid = false;
    }
    
    if (!password.trim()) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    
    // Check hardcoded credentials
    const adminCredentials = { email: "admin@educare.com", password: "password123" };
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      
      if (email === adminCredentials.email && password === adminCredentials.password) {
        // Save email to localStorage if "Remember me" is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        
        // Set logged in user role
        localStorage.setItem("userRole", selectedRole);
        
        toast({
          title: `${selectedRole} Login Successful`,
          description: `Welcome back to EduCare as ${selectedRole}`,
        });
        
        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        // Check if user exists in localStorage (for users created via signup)
        const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          // Save email to localStorage if "Remember me" is checked
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }
          
          // Set logged in user role
          localStorage.setItem("userRole", selectedRole);
          
          toast({
            title: `${selectedRole} Login Successful`,
            description: `Welcome back to EduCare as ${selectedRole}`,
          });
          
          // Redirect to dashboard after successful login
          navigate("/dashboard");
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      }
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim() || !validateEmail(resetEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
      toast({
        title: "Password reset link sent",
        description: "Please check your email inbox",
      });
    }, 1500);
  };

  if (resetMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                  EduCare
                </span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h1>
            <p className="text-indigo-200/70 text-center mb-8">
              {resetSent 
                ? "Password reset link sent to your email." 
                : "Enter your email address to receive a password reset link"}
            </p>
            
            {!resetSent ? (
              <form onSubmit={handleResetPassword}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-indigo-200 mb-1">
                      Email
                    </label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="name@company.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                onClick={() => {
                  setResetMode(false);
                  setResetSent(false);
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-200"
              >
                Return to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            <p className="mt-8 text-center text-sm text-indigo-300/70">
              <a 
                href="#" 
                className="font-medium text-indigo-300 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setResetMode(false);
                }}
              >
                Back to login
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                EduCare
              </span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2 text-center">Welcome Back</h1>
          <p className="text-indigo-200/70 text-center mb-8">Log in to your account to continue</p>
          
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-indigo-200">
                    Password
                  </label>
                  <a 
                    href="#" 
                    className="text-xs text-indigo-300 hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      setResetMode(true);
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-indigo-200 mb-1">
                  Select Role
                </label>
                <Select 
                  value={selectedRole} 
                  onValueChange={setSelectedRole}
                >
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <Checkbox 
                  id="remember" 
                  className="border-white/20 data-[state=checked]:bg-indigo-500" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-indigo-200">
                  Remember me
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in to Dashboard"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-indigo-950/50 text-indigo-300 backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                <Twitter className="mr-2 h-4 w-4" /> Twitter
              </Button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-indigo-300/70">
            Don't have an account?{" "}
            <a 
              href="/auth/signup" 
              className="font-medium text-indigo-300 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/signup");
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
