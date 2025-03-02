
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowRight, Github, Twitter, Users } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      name: "",
      company: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
    });

    // Validate fields
    let isValid = true;
    
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: "Full name is required" }));
      isValid = false;
    }
    
    if (!company.trim()) {
      setErrors(prev => ({ ...prev, company: "Company name is required" }));
      isValid = false;
    }
    
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
    } else if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters" }));
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      isValid = false;
    }
    
    if (!termsAccepted) {
      setErrors(prev => ({ ...prev, terms: "You must accept the terms and conditions" }));
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      // Store user data in localStorage for future logins
      const newUser = {
        name,
        email,
        password,
        company,
        role: selectedRole,
        createdAt: new Date().toISOString(),
      };
      
      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      
      // Check if email already exists
      if (existingUsers.some((user: any) => user.email === email)) {
        setIsLoading(false);
        toast({
          title: "Signup Failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        return;
      }
      
      // Add new user and save back to localStorage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
      
      setIsLoading(false);
      toast({
        title: "Account created",
        description: `Welcome to EduCare. Your ${selectedRole} account has been created successfully.`,
      });
      
      // Redirect to login page after successful signup
      navigate("/auth/login");
    }, 1500);
  };

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
          
          <h1 className="text-2xl font-bold text-white mb-2 text-center">Create Your Account</h1>
          <p className="text-indigo-200/70 text-center mb-8">Start your 14-day free trial. No credit card required.</p>
          
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-indigo-200 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-indigo-200 mb-1">
                    Company Name
                  </label>
                  <Input
                    id="company"
                    placeholder="Acme Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full ${
                      errors.company ? "border-red-500" : ""
                    }`}
                  />
                  {errors.company && (
                    <p className="text-red-400 text-xs mt-1">{errors.company}</p>
                  )}
                </div>
              </div>
              
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
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-1">
                  Password
                </label>
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
                {errors.password ? (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-indigo-300/70">
                    Must be at least 8 characters and include a number and symbol
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-200 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div className="flex items-start">
                <Checkbox 
                  id="terms" 
                  className={`border-white/20 data-[state=checked]:bg-indigo-500 mt-1 ${
                    errors.terms ? "border-red-500" : ""
                  }`}
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-indigo-200">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-300 hover:text-white">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-300 hover:text-white">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-400 text-xs mt-1">{errors.terms}</p>
              )}
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
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
            Already have an account?{" "}
            <a 
              href="/auth/login" 
              className="font-medium text-indigo-300 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/login");
              }}
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
