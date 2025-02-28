
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowUp, 
  Send, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  CheckCircle,
  GraduationCap,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Focus the first input with an error
      const firstErrorField = Object.keys(errors)[0] as keyof FormErrors;
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (element) element.focus();
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Reset form after showing success message
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        
        // Show toast notification
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
      {/* Floating gradients background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" 
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-indigo-700/20 rounded-full blur-[100px] animate-pulse" 
          style={{ animationDelay: "2s" }}
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
                className="flex items-center gap-2 mr-10 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                  EduCare
                </span>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                variant="premium"
                className="flex items-center gap-2"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-32 pb-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200">
                Get in Touch
              </span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100/80 mb-8 leading-relaxed">
              Have questions about how EduCare can transform your educational institution? 
              We're here to help. Reach out to our team of education specialists.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <AnimatePresence>
                {!isSubmitted ? (
                  <motion.form
                    ref={formRef}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="glass-effect p-8 rounded-xl relative overflow-hidden"
                  >
                    <div className="mb-6">
                      <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`bg-white/10 border-white/20 text-white ${errors.name ? 'border-red-500' : 'focus:border-indigo-400'}`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-red-400 text-sm">{errors.name}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-white/10 border-white/20 text-white ${errors.email ? 'border-red-500' : 'focus:border-indigo-400'}`}
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-white text-sm font-medium mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`bg-white/10 border-white/20 text-white ${errors.subject ? 'border-red-500' : 'focus:border-indigo-400'}`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-red-400 text-sm">{errors.subject}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block text-white text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`bg-white/10 border-white/20 text-white min-h-[150px] ${errors.message ? 'border-red-500' : 'focus:border-indigo-400'}`}
                        placeholder="Tell us how we can help..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-red-400 text-sm">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      variant="premium"
                      className="w-full py-6"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-effect p-12 rounded-xl flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                    >
                      <CheckCircle className="h-10 w-10 text-green-400" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-4">Message Sent Successfully!</h3>
                    <p className="text-indigo-100/80 mb-8">
                      Thank you for reaching out to us. Our team will get back to you as soon as possible.
                    </p>
                    
                    <Button 
                      variant="premium"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="space-y-8">
                <div className="glass-effect p-8 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Educational Institutions</h3>
                  <p className="text-indigo-100/80 mb-4">
                    Discover how EduCare can transform student support and administrative efficiency at your institution.
                  </p>
                  <Button variant="premium" className="w-full">
                    Request a Demo
                  </Button>
                </div>

                <div className="glass-effect p-8 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                  <div className="space-y-3 text-indigo-100/80">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>

                <div className="glass-effect p-8 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                  <div className="flex justify-between">
                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/20 text-white hover:bg-white/10">
                      <Facebook className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/20 text-white hover:bg-white/10">
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/20 text-white hover:bg-white/10">
                      <Instagram className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/20 text-white hover:bg-white/10">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

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
              <button onClick={() => navigate("/")} className="text-sm font-medium text-indigo-300 hover:text-white transition-colors">Home</button>
              <button onClick={() => navigate("/contact")} className="text-sm font-medium text-white transition-colors">Contact</button>
            </div>
          </div>
          
          <div className="border-t border-indigo-900/50 pt-8 pb-4"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-400 text-sm mb-4 md:mb-0">© 2023 EduCare. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-indigo-300 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactPage;
