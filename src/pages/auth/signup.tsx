
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowRight, Github, Twitter } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created",
        description: "Welcome to EduCare. Your account has been created successfully.",
      });
      // Redirect to dashboard after successful signup
      navigate("/dashboard");
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
                    className="bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full"
                    required
                  />
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
                    className="bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full"
                    required
                  />
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full"
                  required
                />
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-indigo-300/50 w-full"
                  required
                />
                <p className="mt-1 text-xs text-indigo-300/70">
                  Must be at least 8 characters and include a number and symbol
                </p>
              </div>
              
              <div className="flex items-start">
                <Checkbox id="terms" className="border-white/20 data-[state=checked]:bg-indigo-500 mt-1" />
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
