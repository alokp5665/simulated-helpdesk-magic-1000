
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { 
  Send, MapPin, Phone, Mail, CheckCircle, Facebook, 
  Twitter, Instagram, Linkedin, ArrowUp, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formState.name.trim()) errors.name = "Name is required";
    
    if (!formState.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!formState.subject.trim()) errors.subject = "Subject is required";
    if (!formState.message.trim()) errors.message = "Message is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form after success
      setTimeout(() => {
        setFormState({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page loader (initially hidden) */}
          <div className="page-loader loader-hidden">
            <div className="loader-circle"></div>
          </div>
          
          {/* Hero Section */}
          <div className="mb-12">
            <div className="rounded-xl overflow-hidden glass-card p-8 hover-scale">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-foreground">
                  Get in Touch with EduCare
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Have questions about our educational helpdesk solutions? We're here to help you.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8 rounded-xl hover-scale">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className={`space-y-6 ${isSuccess ? 'form-success' : ''}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="input-focus-effect">
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className={formErrors.name ? "border-red-500" : ""}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="input-focus-effect">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          className={formErrors.email ? "border-red-500" : ""}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number (Optional)
                      </label>
                      <div className="input-focus-effect">
                        <Input
                          id="phone"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <div className="input-focus-effect">
                        <Input
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          placeholder="Enter message subject"
                          className={formErrors.subject ? "border-red-500" : ""}
                        />
                      </div>
                      {formErrors.subject && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <div className="input-focus-effect">
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Enter your message here..."
                        className={`min-h-[150px] resize-y ${formErrors.message ? "border-red-500" : ""}`}
                      />
                    </div>
                    {formErrors.message && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="premium-button education-primary w-full md:w-auto"
                      disabled={isSubmitting || isSuccess}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="glass-card p-8 rounded-xl hover-scale h-full">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Our Address</h3>
                      <p className="text-muted-foreground">
                        123 Education Street, Tech Park<br />
                        Bangalore, Karnataka 560001<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Call Us</h3>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                      <p className="text-muted-foreground">+91 80 4321 0987</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email Us</h3>
                      <p className="text-muted-foreground">support@educare.com</p>
                      <p className="text-muted-foreground">info@educare.com</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <h3 className="font-medium mb-3">Connect With Us</h3>
                    <div className="flex gap-3">
                      <a href="#" className="social-link">
                        <Facebook className="h-4 w-4 text-foreground" />
                      </a>
                      <a href="#" className="social-link">
                        <Twitter className="h-4 w-4 text-foreground" />
                      </a>
                      <a href="#" className="social-link">
                        <Instagram className="h-4 w-4 text-foreground" />
                      </a>
                      <a href="#" className="social-link">
                        <Linkedin className="h-4 w-4 text-foreground" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mb-12">
            <div className="glass-card p-8 rounded-xl hover-scale">
              <h2 className="text-2xl font-bold mb-6">Find Us</h2>
              
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                {/* Placeholder for map - In a real app, you'd use a map component here */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mb-12">
            <div className="glass-card p-8 rounded-xl hover-scale">
              <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-primary/5 rounded-lg">
                  <h3 className="font-bold mb-2">How quickly can we implement EduCare?</h3>
                  <p className="text-muted-foreground">
                    EduCare can be implemented within 2-4 weeks, depending on your institution's size and specific requirements. Our team will guide you through the entire process.
                  </p>
                </div>
                
                <div className="p-6 bg-primary/5 rounded-lg">
                  <h3 className="font-bold mb-2">Is EduCare suitable for all educational institutions?</h3>
                  <p className="text-muted-foreground">
                    Yes, EduCare is designed to scale from small coaching centers to large universities. Our flexible platform adapts to your specific needs and grows with your institution.
                  </p>
                </div>
                
                <div className="p-6 bg-primary/5 rounded-lg">
                  <h3 className="font-bold mb-2">How secure is our student data with EduCare?</h3>
                  <p className="text-muted-foreground">
                    EduCare implements enterprise-grade security measures including encryption, role-based access controls, and regular security audits to ensure your data remains protected.
                  </p>
                </div>
                
                <div className="p-6 bg-primary/5 rounded-lg">
                  <h3 className="font-bold mb-2">Do you offer training for our staff?</h3>
                  <p className="text-muted-foreground">
                    Absolutely! We provide comprehensive training sessions, documentation, and ongoing support to ensure your team can maximize the benefits of EduCare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="pl-64 py-12 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">EduCare</h3>
              <p className="text-muted-foreground mb-4">
                The complete education helpdesk solution for growing institutions.
              </p>
              <div className="flex gap-3">
                <a href="#" className="social-link">
                  <Facebook className="h-4 w-4 text-foreground" />
                </a>
                <a href="#" className="social-link">
                  <Twitter className="h-4 w-4 text-foreground" />
                </a>
                <a href="#" className="social-link">
                  <Instagram className="h-4 w-4 text-foreground" />
                </a>
                <a href="#" className="social-link">
                  <Linkedin className="h-4 w-4 text-foreground" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground transition">Testimonials</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition">Pricing</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Community</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Bangalore, India</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">info@educare.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} EduCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Back to top button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ContactPage;
