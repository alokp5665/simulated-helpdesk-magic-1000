
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
  Play,
  GraduationCap,
  BookOpen,
  CalendarClock,
  FileText,
  Brain,
  School,
  Send,
  X,
  Lightbulb,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import "./styles.css";

// Type for the chat message
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

// Type for the "Did you know" tip
interface DidYouKnowTip {
  id: number;
  text: string;
}

const LandingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "welcome", text: "Hello there! I'm EduBot, your PrimeCare assistant. How can I help you today with your educational support needs?", isUser: false }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTip, setCurrentTip] = useState<DidYouKnowTip | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Features for the rotating showcase
  const features = [
    {
      title: "Student Query Management",
      description: "Efficiently handle student inquiries about courses, assignments, and exams with our centralized ticketing system.",
      icon: MessageSquare
    },
    {
      title: "AI Tutor Assistance",
      description: "Leverage our AI to provide learning resources, answer common questions, and improve student outcomes.",
      icon: Brain
    },
    {
      title: "Student Engagement Analytics",
      description: "Track participation rates, performance trends, and identify at-risk students with comprehensive reporting.",
      icon: BarChart3
    },
    {
      title: "Collaborative Teaching",
      description: "Enable faculty to work together seamlessly with shared resources, communication tools, and planning features.",
      icon: Users
    },
    {
      title: "Institutional Data Security",
      description: "Protect sensitive student information with industry-leading security measures and compliance features.",
      icon: Shield
    }
  ];

  // Testimonials from educational institutions with Indian names
  const testimonials = [
    {
      quote: "EduCare transformed our student support workflow and reduced response times by 62%. The automation features alone saved our administrative staff 20+ hours per week.",
      author: "Dr. Rajesh Kumar",
      position: "Director of Student Success",
      institution: "Westfield University",
      rating: 5
    },
    {
      quote: "The multi-channel support capabilities have allowed us to consolidate all student interactions in one place. Implementation was smooth and our faculty loved it from day one.",
      author: "Prof. Ananya Sharma",
      position: "Dean of Academic Affairs",
      institution: "Lakeside College",
      rating: 5
    },
    {
      quote: "As a rapidly growing K-12 school district, we needed a scalable solution. EduCare grew with us from 5 to 50 support agents without a hitch and improved our parent communication significantly.",
      author: "Vikram Patel",
      position: "District Technology Coordinator",
      institution: "Greenwood School District",
      rating: 5
    }
  ];

  // Stats for the metrics section
  const stats = [
    { value: "42%", label: "Average reduction in administrative workload" },
    { value: "3.2x", label: "Increase in student satisfaction scores" },
    { value: "67%", label: "Faster response to student inquiries" },
    { value: "99.9%", label: "Uptime guarantee for critical periods" }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "How does EduCare help with student inquiries?",
      answer: "EduCare centralizes all student queries across email, chat, and help desk tickets into a single interface, allowing administrators and faculty to respond quickly and track the status of each inquiry. Our AI-powered system can also automatically answer common questions, freeing up staff time."
    },
    {
      question: "Can EduCare integrate with our existing LMS?",
      answer: "Yes, EduCare seamlessly integrates with popular Learning Management Systems like Canvas, Blackboard, Moodle, and more. This integration allows for synchronized data, unified login experiences, and comprehensive student support directly within your existing educational ecosystem."
    },
    {
      question: "What kind of analytics does EduCare provide?",
      answer: "Our analytics dashboard provides comprehensive insights into student engagement, support team performance, common inquiry topics, resolution times, and satisfaction ratings. These metrics can be filtered by department, course, time period, and other parameters to help identify trends and areas for improvement."
    },
    {
      question: "How secure is student data in EduCare?",
      answer: "EduCare is fully FERPA compliant and employs bank-level encryption for all data. We implement role-based access controls, regular security audits, and maintain strict data handling policies to ensure student information remains protected at all times."
    },
    {
      question: "Do you offer special pricing for educational institutions?",
      answer: "Yes, we offer special educational pricing tiers based on institution size and needs. We provide significant discounts for K-12 schools, colleges, universities, and non-profit educational organizations. Contact our sales team for a customized quote."
    }
  ];

  // Pricing plans with INR
  const pricingPlans = [
    {
      name: "Starter",
      price: "₹24,999",
      period: "per month",
      features: [
        "Up to 1,000 students",
        "Basic student query management",
        "Email support",
        "Knowledge base",
        "5 staff accounts"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "₹49,999",
      period: "per month",
      features: [
        "Up to 5,000 students",
        "Advanced query management",
        "AI Tutor assistance",
        "Analytics dashboard",
        "LMS integration",
        "20 staff accounts",
        "Priority support"
      ],
      cta: "Most Popular Choice",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored pricing",
      features: [
        "Unlimited students",
        "Full platform access",
        "Dedicated success manager",
        "Custom integrations",
        "Advanced analytics",
        "Unlimited staff accounts",
        "24/7 premium support",
        "On-site training"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  // Pre-written chat responses
  const chatResponses = [
    {
      keywords: ["price", "cost", "pricing", "plan"],
      response: "We offer flexible pricing plans designed specifically for educational institutions. Our Starter plan begins at ₹24,999/month, while our Professional plan is ₹49,999/month. For larger institutions, we provide custom Enterprise pricing. Would you like me to tell you more about what's included in each plan?"
    },
    {
      keywords: ["demo", "try", "trial", "see"],
      response: "We'd be happy to show you how EduCare works! You can schedule a personalized demo with our education specialists, or start a 14-day free trial to explore the platform yourself. Which option would work better for you?"
    },
    {
      keywords: ["integration", "connect", "lms", "blackboard", "canvas", "moodle"],
      response: "EduCare integrates seamlessly with all major Learning Management Systems, including Canvas, Blackboard, Moodle, D2L Brightspace, and Google Classroom. We also offer API access for custom integrations with your institutional systems."
    },
    {
      keywords: ["security", "data", "privacy", "ferpa", "compliance"],
      response: "Student data security is our top priority. EduCare is fully FERPA compliant and employs end-to-end encryption for all data. We implement role-based access controls, regular security audits, and maintain strict data handling policies."
    },
    {
      keywords: ["ai", "tutor", "automation", "automated"],
      response: "Our AI Tutor feature uses advanced natural language processing to provide instant answers to common student questions, suggest relevant learning resources, and identify knowledge gaps. It learns from interactions to continuously improve its responses while always keeping faculty in the loop."
    },
    {
      keywords: ["analytics", "reporting", "data", "insights", "track"],
      response: "EduCare's analytics dashboard gives you real-time insights into student engagement, support team performance, and institutional trends. You can track response times, satisfaction ratings, common issues, and more—all with customizable reports for different stakeholders."
    },
    {
      keywords: ["implementation", "setup", "start", "deploy", "onboard"],
      response: "Our typical implementation takes 2-4 weeks depending on your institution's size and requirements. We assign a dedicated implementation specialist who will guide you through data migration, integration setup, staff training, and best practices to ensure a smooth transition."
    },
    {
      keywords: ["compare", "competitor", "different", "better"],
      response: "Unlike generic helpdesk solutions, EduCare is built specifically for educational institutions. Our platform includes features tailored to academic workflows, FERPA compliance, LMS integrations, and tools designed for student success. Would you like me to highlight specific differences from another solution you're considering?"
    },
    {
      keywords: ["mobile", "app", "phone", "tablet"],
      response: "Yes, EduCare offers fully responsive web access plus dedicated mobile apps for iOS and Android. Students can submit questions, check knowledge base articles, and receive notifications on their devices. Faculty and staff can manage queries on the go, perfect for office hours or remote support."
    },
    {
      keywords: ["training", "learn", "help", "support", "resources"],
      response: "We provide comprehensive training for all users. Our onboarding package includes live training sessions, on-demand video tutorials, a detailed knowledge base, and regular webinars on best practices. Plus, our customer success team is available for ongoing support and additional training as needed."
    },
    {
      keywords: ["student", "experience", "interface", "easy", "usability"],
      response: "Students love EduCare's intuitive interface! They can easily submit questions through multiple channels (web, mobile, email), track their inquiry status, access self-help resources, and receive personalized assistance. Our average student satisfaction rating is 4.8/5."
    },
    {
      keywords: ["k12", "school", "district", "primary", "secondary", "high school"],
      response: "EduCare works great for K-12 environments! Our platform supports parent communication, district-wide knowledge sharing, and specialized tools for younger students. We also offer special pricing for K-12 institutions and can customize the platform to match your specific needs."
    },
    {
      keywords: ["multilingual", "language", "international", "translate"],
      response: "EduCare supports over 40 languages through our built-in translation capabilities. This allows international students to submit inquiries in their native language while staff can respond in theirs—all automatically translated in real-time to facilitate clear communication."
    },
    {
      keywords: ["help", "assistance", "support"],
      response: "I'd be happy to help! EduCare offers comprehensive support for educational institutions. Could you tell me more specifically what you're looking for assistance with today?"
    },
    {
      keywords: ["hello", "hi", "hey", "greetings"],
      response: "Hello! Welcome to EduCare. I'm here to answer any questions you might have about our educational support platform. How can I assist you today?"
    }
  ];

  // "Did you know" tips
  const didYouKnowTips = [
    { id: 1, text: "You can automate attendance notifications with EduCare's scheduling system!" },
    { id: 2, text: "Our AI Tutor suggests personalized learning resources based on student questions!" },
    { id: 3, text: "EduCare integrates with 40+ educational tools and platforms out of the box!" },
    { id: 4, text: "Institutions using EduCare report a 42% reduction in administrative workload!" },
    { id: 5, text: "You can create custom workflows for different departments or academic programs!" },
    { id: 6, text: "EduCare's mobile app allows students to get support anytime, anywhere!" },
    { id: 7, text: "Our analytics can help identify at-risk students before they fall behind!" },
    { id: 8, text: "Faculty can share knowledge base articles across departments to ensure consistency!" },
    { id: 9, text: "EduCare is fully FERPA compliant to protect student information!" },
    { id: 10, text: "Automated grading notifications can be sent directly through EduCare!" }
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

  // Rotate through "Did you know" tips every 15 seconds
  useEffect(() => {
    if (isChatOpen) {
      setCurrentTip(didYouKnowTips[Math.floor(Math.random() * didYouKnowTips.length)]);
      
      const interval = setInterval(() => {
        const randomTip = didYouKnowTips[Math.floor(Math.random() * didYouKnowTips.length)];
        setCurrentTip(randomTip);
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, [isChatOpen]);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Scroll to chat end when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Navigation functions for scroll
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  // Handle navigating to contact page
  const handleContactPage = () => {
    navigate("/contact");
  };

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);
    
    // Simulate bot "thinking" and typing
    setTimeout(() => {
      // Find matching response
      let botResponse = "I'm not sure I understand. Could you rephrase your question about our educational support platform?";
      
      // Check for keyword matches
      for (const response of chatResponses) {
        if (response.keywords.some(keyword => 
          userMessage.text.toLowerCase().includes(keyword.toLowerCase())
        )) {
          botResponse = response.response;
          break;
        }
      }
      
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: botResponse,
        isUser: false
      }]);
    }, 1500); // Simulate typing delay
  };

  // Handle chat box opening and closing
  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    if (!isChatOpen) {
      setCurrentTip(didYouKnowTips[Math.floor(Math.random() * didYouKnowTips.length)]);
    }
  };

  // Handle testimonial navigation
  const nextTestimonial = () => {
    setCurrentTestimonialIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
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
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                  EduCare
                </span>
              </motion.div>

              <motion.nav 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:flex items-center space-x-8"
              >
                <button onClick={() => scrollToSection(featuresRef)} className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">Features</button>
                <button onClick={() => scrollToSection(testimonialsRef)} className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">Testimonials</button>
                <button onClick={() => scrollToSection(pricingRef)} className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">Pricing</button>
                <button onClick={() => scrollToSection(faqRef)} className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">FAQ</button>
                <button onClick={handleContactPage} className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">Contact</button>
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
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 premium-button"
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
                  The Ultimate Helpdesk for Modern Educational Institutions
                </span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100/80 mb-8 leading-relaxed">
                Streamline student support with seamless omnichannel communication, 
                AI-powered tutoring assistance, and insightful analytics—all in one powerful platform designed specifically for education.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 rounded-full premium-button"
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
                  <span className="font-bold text-white">1,000+</span> educational institutions already using EduCare
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
                      {/* Mockup dashboard content - Education themed */}
                      <div className="p-4 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-indigo-400" />
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
                            <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <BookOpen className="h-3 w-3 text-indigo-300" />
                            </div>
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
                    <Brain className="h-4 w-4" />
                    <span className="text-xs font-medium">AI Tutor</span>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0], x: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 6, delay: 1 }}
                  className="absolute bottom-[15%] left-[10%] bg-gradient-to-r from-indigo-500/80 to-blue-500/80 p-2 rounded-lg backdrop-blur-md shadow-xl border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-medium">Assignment Submitted</span>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 8, 0], x: [0, 8, 0] }} 
                  transition={{ repeat: Infinity, duration: 5.5, delay: 0.5 }}
                  className="absolute bottom-[30%] right-[15%] bg-gradient-to-r from-blue-500/80 to-cyan-500/80 p-2 rounded-lg backdrop-blur-md shadow-xl border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    <span className="text-xs font-medium">Class Schedule Updated</span>
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
          <p className="text-center text-sm text-indigo-300/60 mb-8">TRUSTED BY LEADING EDUCATIONAL INSTITUTIONS</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60">
            {['Westfield University', 'Greenwood Schools', 'Lakeside College', 'Tech Institute', 'Northern Academy', 'Global Learning Center'].map((institution) => (
              <div key={institution} className="flex items-center h-6">
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-white">{institution}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bento grid */}
      <section id="features" ref={featuresRef} className="py-20 relative">
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
              EduCare combines powerful features with an intuitive interface to deliver 
              the ultimate support experience for modern educational institutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Student Query Management */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bento-card bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group h-full"
            >
              <div className="bento-icon p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg w-fit mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Student Query Management</h3>
              <p className="text-indigo-100/70 mb-4">
                Centralize all student inquiries about courses, assignments, and administrative requests
                in a single, intuitive interface for seamless resolution.
              </p>
              <div className="flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors mt-auto">
                <span className="text-sm font-medium">Learn more</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>

            {/* Feature 2 - AI Tutor */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bento-card bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group md:row-span-2 h-full flex flex-col"
            >
              <div className="bento-icon p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg w-fit mb-4">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Tutor Assistance</h3>
              <p className="text-indigo-100/70 mb-6">
                Leverage artificial intelligence to suggest learning resources, answer common student questions,
                and provide insights that improve educational outcomes.
              </p>
              
              <div className="mt-auto flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">See how AI improves learning outcomes</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>

            {/* Feature 3 - Student Engagement Analytics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bento-card bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group h-full flex flex-col"
            >
              <div className="bento-icon p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg w-fit mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Student Engagement Analytics</h3>
              <p className="text-indigo-100/70 mb-4">
                Gain actionable insights with comprehensive dashboards that visualize participation rates, 
                performance trends, and identify at-risk students.
              </p>
              <div className="mt-auto flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">Explore analytics features</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>

            {/* Feature 4 - Learning Resource Center */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bento-card bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group lg:col-span-2 h-full"
            >
              <div className="bento-icon p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg w-fit mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Learning Resource Center</h3>
              <p className="text-indigo-100/70 mb-4">
                Create a self-service portal with powerful search capabilities that helps students
                find educational materials quickly and reduces your support workload.
              </p>
              <div className="flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">Learn about our knowledge management</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>

            {/* Feature 5 - Administrative Task Automation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bento-card bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group h-full flex flex-col"
            >
              <div className="bento-icon p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Administrative Task Automation</h3>
              <p className="text-indigo-100/70 mb-4">
                Create custom workflows that automatically handle attendance tracking, fee reminders, and 
                timetable management, saving administrative staff valuable time.
              </p>
              <div className="mt-auto flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">Discover automation options</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>

            {/* Feature 6 - Faculty Collaboration */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bento-card bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group h-full flex flex-col"
            >
              <div className="bento-icon p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Faculty Collaboration</h3>
              <p className="text-indigo-100/70 mb-4">
                Enable seamless teamwork among faculty with shared resources, internal notes, curriculum planning, 
                and coordinated student support strategies.
              </p>
              <div className="mt-auto flex items-center gap-1 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm font-medium">See collaboration tools</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section ref={testimonialsRef} className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
              Trusted by Educational Leaders
            </h2>
            <p className="text-lg text-indigo-100/70">
              See how institutions like yours are transforming student support and administrative efficiency with EduCare.
            </p>
          </motion.div>
          
          {/* Testimonial carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <motion.div 
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonialIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-md rounded-xl p-8 border border-white/10 min-h-[300px] flex flex-col justify-between w-full"
                  >
                    <div className="flex mb-4">
                      {[...Array(testimonials[currentTestimonialIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-indigo-100 mb-6 italic text-lg">"{testimonials[currentTestimonialIndex].quote}"</p>
                    <div>
                      <p className="font-medium text-white text-lg">{testimonials[currentTestimonialIndex].author}</p>
                      <p className="text-indigo-300">{testimonials[currentTestimonialIndex].position}</p>
                      <p className="text-indigo-300">{testimonials[currentTestimonialIndex].institution}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
            {/* Navigation buttons */}
            <div className="flex justify-between absolute top-1/2 left-0 right-0 -mx-4 transform -translate-y-1/2 pointer-events-none">
              <Button 
                onClick={prevTestimonial} 
                variant="ghost" 
                className="rounded-full bg-black/20 backdrop-blur-sm border border-white/10 h-10 w-10 p-0 pointer-events-auto"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                onClick={nextTestimonial} 
                variant="ghost" 
                className="rounded-full bg-black/20 backdrop-blur-sm border border-white/10 h-10 w-10 p-0 pointer-events-auto"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentTestimonialIndex ? "w-8 bg-indigo-500" : "w-2 bg-indigo-500/30"
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">{stat.value}</p>
                <p className="text-indigo-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing section */}
      <section ref={pricingRef} className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
              Plans Designed for Education
            </h2>
            <p className="text-lg text-indigo-100/70">
              Choose the right plan for your institution's size and needs with special educational pricing.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative bg-gradient-to-br ${plan.popular ? 'from-indigo-800/40 to-purple-800/40 border-indigo-500/30' : 'from-indigo-900/30 to-purple-900/30 border-white/10'} backdrop-blur-md rounded-xl p-8 border`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full py-1 px-4 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-indigo-300 ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-indigo-100">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700' : 'bg-white/10 hover:bg-white/20'} premium-button`}
                  onClick={handleContactPage}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-indigo-300 mb-4">Need a custom plan for your unique requirements?</p>
            <Button 
              variant="outline" 
              className="border-indigo-400/30 text-white hover:bg-white/10"
              onClick={handleContactPage}
            >
              Contact Our Education Specialists
            </Button>
          </div>
        </div>
      </section>
      
      {/* FAQ section */}
      <section ref={faqRef} className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-indigo-100/70">
              Find answers to common questions about EduCare and how it can benefit your institution.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-md rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-bold mb-3">{item.question}</h3>
                <p className="text-indigo-100/80">{item.answer}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-indigo-300 mb-4">Don't see your question here?</p>
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 premium-button"
              onClick={handleContactPage}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-gradient-to-b from-transparent to-black/50 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                EduCare
              </span>
            </div>
            
            <div className="flex space-x-8">
              <button onClick={() => scrollToSection(featuresRef)} className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection(testimonialsRef)} className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">Testimonials</button>
              <button onClick={() => scrollToSection(pricingRef)} className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">Pricing</button>
              <button onClick={() => scrollToSection(faqRef)} className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">FAQ</button>
              <button onClick={handleContactPage} className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">Contact</button>
            </div>
          </div>
          
          <Separator className="bg-indigo-900/50 mb-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-400 text-sm mb-4 md:mb-0">© 2023 EduCare. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="/contact" className="text-indigo-300 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* AI Chatbot */}
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end`}>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-4 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-lg rounded-xl w-full max-w-sm overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                  <School className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">EduCare Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 h-80 overflow-y-auto bg-black/20">
              {chatMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'} chat-message`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white/10 text-white rounded-tl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="mb-4 flex justify-start chat-message">
                  <div className="max-w-[80%] p-3 rounded-lg bg-white/10 text-white rounded-tl-none">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
            
            {currentTip && (
              <div className="px-4 py-3 bg-indigo-800/50 border-t border-b border-indigo-700/50 flex items-start">
                <Lightbulb className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-100">{currentTip.text}</p>
              </div>
            )}
            
            <div className="p-4 flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about EduCare..."
                className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-4 py-2 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-l-none"
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
        
        <Button
          onClick={toggleChat}
          className={`h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg flex items-center justify-center transition-all`}
        >
          {isChatOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
