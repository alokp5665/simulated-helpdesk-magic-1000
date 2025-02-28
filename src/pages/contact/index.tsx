
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  MessageSquare, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin,
  Send,
  ArrowUp,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider"

const ContactPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    interestLevel: [50]
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleInterestChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, interestLevel: value }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      message: ""
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        interestLevel: [50]
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mr-10 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                  EduCare
                </span>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10" 
                onClick={() => navigate("/auth/login")}
              >
                Log in
              </Button>
              <Button 
                variant="premium"
                onClick={() => navigate("/auth/signup")}
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
                  Get in Touch with Our Team
                </span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100/80 max-w-3xl mx-auto">
                Have questions about how EduCare can transform your educational institution? 
                Our education specialists are here to help you find the perfect solution.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="lg:col-span-2 glass-effect rounded-2xl p-8 border border-white/10 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-indigo-100">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`bg-white/5 border-white/10 focus:border-indigo-500 text-white ${
                          formErrors.name ? "border-red-400" : ""
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-red-400 text-xs">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-indigo-100">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className={`bg-white/5 border-white/10 focus:border-indigo-500 text-white ${
                          formErrors.email ? "border-red-400" : ""
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-red-400 text-xs">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-indigo-100">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      className="bg-white/5 border-white/10 focus:border-indigo-500 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-indigo-100">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className={`min-h-[150px] bg-white/5 border-white/10 focus:border-indigo-500 text-white ${
                        formErrors.message ? "border-red-400" : ""
                      }`}
                    />
                    {formErrors.message && (
                      <p className="text-red-400 text-xs">{formErrors.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-indigo-100">
                      How interested are you in EduCare?
                    </label>
                    <Slider 
                      value={formData.interestLevel} 
                      onValueChange={handleInterestChange}
                      max={100}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-indigo-200">
                      <span>Just exploring</span>
                      <span>Very interested</span>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="premium"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Sending...</span>
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      </>
                    ) : (
                      <>
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
              
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="glass-effect rounded-2xl p-8 border border-white/10 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-500/20 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Email Us</h3>
                      <p className="text-indigo-200">support@educare.com</p>
                      <p className="text-indigo-200">sales@educare.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-500/20 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Call Us</h3>
                      <p className="text-indigo-200">+91 (800) 123-4567</p>
                      <p className="text-indigo-200">Mon-Fri, 9AM-6PM IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-500/20 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Visit Us</h3>
                      <p className="text-indigo-200">
                        1234 Tech Park, Cyber City<br />
                        Bangalore, Karnataka 560100<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
                    <div className="flex gap-4">
                      <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-indigo-500/30 transition-colors">
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-indigo-500/30 transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-indigo-500/30 transition-colors">
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-indigo-500/30 transition-colors">
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-indigo-500/30 transition-colors">
                        <Github className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Map or Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-16 glass-effect rounded-2xl overflow-hidden h-[400px] border border-white/10 shadow-xl"
            >
              <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">Interactive Map Coming Soon</h3>
                  <p className="text-indigo-200 max-w-md mx-auto">
                    Our development team is working on an interactive map feature to help you find our offices.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-b from-transparent to-black/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                EduCare
              </span>
            </div>
            
            <div className="flex space-x-8">
              <a href="/#features" className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">Features</a>
              <a href="/#testimonials" className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">Testimonials</a>
              <a href="/#pricing" className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">Pricing</a>
              <a href="/#faq" className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">FAQ</a>
            </div>
            
            <div className="flex gap-4 mt-6 md:mt-0">
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <Separator className="bg-indigo-900/50 mb-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-400 text-sm mb-4 md:mb-0">© 2023 EduCare. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
        
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </footer>
    </div>
  );
};

export default ContactPage;
