import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  MessageSquare, 
  Zap, 
  BarChart3,
  Users, 
  Award, 
  Sparkles,
  Star,
  ChevronRight,
  Play
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import "./styles.css";

const LandingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);

  // Features for the rotating showcase
  const features = [
    {
      title: "Multi-channel Support",
      description: "Handle customer requests seamlessly across email, chat, voice, and social media.",
      icon: MessageSquare
    },
    {
      title: "AI-powered Assistance",
      description: "Automate routine tasks and get intelligent recommendations for faster resolution.",
      icon: Sparkles
    },
    {
      title: "Advanced Analytics",
      description: "Gain actionable insights with comprehensive reporting and visualization tools.",
      icon: BarChart3
    },
    {
      title: "Team Collaboration",
      description: "Work together efficiently with shared inboxes, internal notes and assignments.",
      icon: Users
    },
    {
      title: "Enterprise Security",
      description: "Protect sensitive customer data with industry-leading security measures.",
      icon: Shield
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "PrimeCare transformed our support workflow and reduced response times by 62%. The automation features alone saved us 20+ hours per week.",
      author: "Sarah Johnson",
      position: "Director of Customer Success",
      company: "TechGlobal",
      rating: 5
    },
    {
      quote: "The multi-channel support capabilities have allowed us to consolidate all customer interactions in one place. Implementation was smooth and our team loved it from day one.",
      author: "Michael Chen",
      position: "VP of Operations",
      company: "Innovate Inc.",
      rating: 5
    },
    {
      quote: "As a rapidly growing company, we needed a scalable solution. PrimeCare grew with us from 5 to 50 support agents without a hitch.",
      author: "Elena Rodriguez",
      position: "Customer Experience Manager",
      company: "NexGen Solutions",
      rating: 5
    }
  ];

  // Stats for the metrics section
  const stats = [
    { value: "42%", label: "Average reduction in response time" },
    { value: "3.2x", label: "Increase in customer satisfaction" },
    { value: "67%", label: "Reduction in ticket handling time" },
    { value: "99.9%", label: "Uptime guarantee" }
  ];

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mouse tracking for glassmorphism effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Handle login navigation
  const handleLogin = () => {
    navigate("/auth/login");
  };

  // Handle demo button click
  const handleWatchDemo = () => {
    toast({
      title: "Demo Access",
      description: "Demo video is opening in a new window.",
    });
    // In a real app, this would open a modal with a demo video
  };

  // Handle sign up click
  const handleSignUp = () => {
    navigate("/auth/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
      {/* Floating gradients background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px] animate-pulse" 
          style={{ 
            transform: `translate(${(cursorPosition.x - window.innerWidth / 2) / 30}px, ${(cursorPosition.y - window.innerHeight / 2) / 30}px)` 
          }}
        />
        <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" 
          style={{ 
            animationDelay: "1s", 
            transform: `translate(${-(cursorPosition.x - window.innerWidth / 2) / 40}px, ${-(cursorPosition.y - window.innerHeight / 2) / 40}px)` 
          }}
        />
        <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-indigo-700/20 rounded-full blur-[100px] animate-pulse" 
          style={{ 
            animationDelay: "2s", 
            transform: `translate(${(cursorPosition.y - window.innerHeight / 2) / 50}px, ${(cursorPosition.x - window.innerWidth / 2) / 50}px)` 
          }}
        />
      </div>

      {/* Navigation bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mr-10"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                  PrimeCare
                </span>
              </motion.div>

              <motion.nav 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:flex items-center space-x-8"
              >
                <a href="#features" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">Features</a>
                <a href="#testimonials" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">Testimonials</a>
                <a href="#pricing" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">Pricing</a>
                <a href="#faq" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">FAQ</a>
              </motion.nav>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10" 
                onClick={handleLogin}
              >
                Log in
              </Button>
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0"
                onClick={handleSignUp}
              >
                Sign Up Free
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
                  The Ultimate Helpdesk for Modern Support Teams
                </span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100/80 mb-8 leading-relaxed">
                Streamline customer support with seamless omnichannel communication, 
                AI-powered automation, and insightful analytics—all in one powerful platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 rounded-full"
                  onClick={handleSignUp}
                >
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-indigo-400/30 text-white hover:bg-white/10 rounded-full"
                  onClick={handleWatchDemo}
                >
                  <Play className="mr-2 h-4 w-4" /> Watch Demo
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-indigo-900 bg-indigo-${300 + i * 100} flex items-center justify-center text-xs font-bold`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-indigo-200/80 ml-2">
                  <span className="font-bold text-white">5,000+</span> teams already using PrimeCare
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/20 to-purple-900/20"></div>
                <div className="absolute inset-0 bg-grid-white/5 bg-[length:20px_20px]"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[90%] h-[90%] bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-xl backdrop-blur-md border border-white/10 shadow-xl flex items-center justify-center p-8">
                    <div className="w-full h-full bg-black/40 rounded-lg overflow-hidden relative">
                      {/* Mockup dashboard content */}
                      <div className="p-4 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-white/10"></div>
                          <div className="h-3 w-24 rounded-full bg-white/10"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500/50"></div>
                          <div className="h-3 w-3 rounded-full bg-indigo-500/50"></div>
                        </div>
                      </div>
                      <div className="p-4 grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white/5 h-24 rounded p-3 flex flex-col justify-between">
                            <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                            <div className="h-6 w-14 bg-indigo-500/20 rounded-md flex items-center justify-center">
                              <div className="h-2 w-8 bg-indigo-400/50 rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-12 bg-white/5 rounded flex items-center p-3 gap-3">
                            <div className="h-6 w-6 rounded-full bg-indigo-500/20"></div>
                            <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                            <div className="ml-auto h-4 w-4 rounded-full bg-green-500/20"></div>
                          </div>
                        ))}
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative UI elements floating around the dashboard */}
                <motion.div 
                  animate={{ y: [0, -10, 0], x: [0, 5, 0] }} 
                  transition={{ repeat: Infinity, duration: 5 }}
                  className="absolute top-[10%] right-[5%] bg-gradient-to-r from-purple-500/80 to-indigo-500/80 p-2 rounded-lg backdrop-blur-md shadow-xl border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs font-medium">AI Suggestions</span>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0], x: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 6, delay: 1 }}
                  className="absolute bottom-[15%] left-[10%] bg-gradient-to-r from-indigo-500/80 to-blue-500/80 p-2 rounded-lg backdrop-blur-md shadow-xl border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-medium">Task Complete</span>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 8, 0], x: [0, 8, 0] }} 
                  transition={{ repeat: Infinity, duration: 5.5, delay: 0.5 }}
                  className="absolute bottom-[30%] right-[15%] bg-gradient-to-r from-blue-500/80 to-cyan-500/80 p-2 rounded-lg backdrop-blur-md shadow-xl border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs font-medium">Analytics Updated</span>
                  </div>
                </motion.div>
              </div>

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-grid-white/5 bg-[length:30px_30px] pointer-events-none"></div>
            </motion.div>
          </div>
        </div>

        {/* Logo cloud */}
        <div className="mt-20 container mx-auto px-6">
          <p className="text-center text-sm text-indigo-300/60 mb-8">TRUSTED BY LEADING COMPANIES WORLDWIDE</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60">
            {['Acme Inc', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella', 'Massive Dynamic'].map((company) => (
              <div key={company} className="flex items-center h-6">
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-white">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bento grid */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-indigo-100/70">
              PrimeCare combines powerful features with an intuitive interface to deliver 
              the ultimate helpdesk experience for modern support teams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Ticket Management */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-purple-900/20 group"
            >
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg w-fit mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unified Ticket Management</h3>
              <p className="text-indigo-100/70 mb-4">
                Centralize all customer conversations from multiple channels in a single, 
                intuitive interface for seamless ticket resolution.
              </p>
              <div className="flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">Learn more</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>

            {/* Feature 2 - AI Assistant */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-purple-900/20 group md:row-span-2"
            >
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg w-fit mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Assistant</h3>
              <p className="text-indigo-100/70 mb-6">
                Leverage artificial intelligence to automate repetitive tasks, suggest responses, 
                and provide insights that make your support team more efficient.
              </p>
              
              <div className="p-4 bg-black/30 rounded-lg mb-6 border border-indigo-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">AI</span>
                  </div>
                  <div className="bg-indigo-900/30 p-3 rounded-lg rounded-tl-none">
                    <p className="text-sm text-indigo-100">
                      Based on the customer's history, I suggest offering our premium plan 
                      with a 20% discount. Their usage patterns indicate they would benefit from the additional features.
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-indigo-300 gap-3">
                  <Button variant="outline" size="sm" className="bg-indigo-800/30 border-indigo-700/50 hover:bg-indigo-700/50 text-xs">
                    Apply Suggestion
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Ignore
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">See how AI improves support</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>

            {/* Feature 3 - Real-time Analytics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-purple-900/20 group"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg w-fit mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-indigo-100/70 mb-4">
                Gain actionable insights with comprehensive dashboards that visualize team performance, 
                ticket metrics, and customer satisfaction data.
              </p>
              <div className="flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">Explore analytics features</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>

            {/* Feature 4 - Knowledge Base */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-purple-900/20 group lg:col-span-2"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg w-fit mb-4">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Smart Knowledge Base</h3>
                  <p className="text-indigo-100/70 mb-4">
                    Create a self-service portal with powerful search capabilities that helps customers
                    find answers quickly and reduces your ticket volume.
                  </p>
                  <div className="flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                    <span className="text-sm font-medium">Learn about knowledge management</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1 bg-black/20 rounded-lg p-4 border border-indigo-500/20">
                  <div className="mb-4">
                    <div className="h-6 w-32 bg-indigo-500/20 rounded mb-2"></div>
                    <div className="h-3 w-full bg-indigo-500/10 rounded"></div>
                    <div className="h-3 w-3/4 bg-indigo-500/10 rounded mt-1"></div>
                    <div className="h-3 w-5/6 bg-indigo-500/10 rounded mt-1"></div>
                  </div>
                  <Separator className="bg-indigo-500/20 my-3" />
                  <div className="mb-4">
                    <div className="h-6 w-36 bg-indigo-500/20 rounded mb-2"></div>
                    <div className="h-3 w-full bg-indigo-500/10 rounded"></div>
                    <div className="h-3 w-4/5 bg-indigo-500/10 rounded mt-1"></div>
                  </div>
                  <Separator className="bg-indigo-500/20 my-3" />
                  <div>
                    <div className="h-6 w-28 bg-indigo-500/20 rounded mb-2"></div>
                    <div className="h-3 w-full bg-indigo-500/10 rounded"></div>
                    <div className="h-3 w-2/3 bg-indigo-500/10 rounded mt-1"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 5 - Automation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-purple-900/20 group"
            >
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Powerful Automation</h3>
              <p className="text-indigo-100/70 mb-4">
                Create custom workflows that automatically route, tag, and prioritize tickets based on
                your business rules, saving time and ensuring consistency.
              </p>
              <div className="flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">Discover automation options</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>

            {/* Feature 6 - Team Collaboration */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-purple-900/20 group"
            >
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
              <p className="text-indigo-100/70 mb-4">
                Work together seamlessly with internal notes, @mentions, shared views, and 
                collision detection to prevent duplicate work.
              </p>
              <div className="flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">See collaboration tools</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
                Designed for the Way Modern Teams Work
              </h2>
              <p className="text-lg text-indigo-100/70 mb-8">
                PrimeCare adapts to your workflow, not the other
