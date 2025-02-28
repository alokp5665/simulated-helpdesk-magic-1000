
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  LoaderCircle,
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

const ContactPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    institution?: string;
    message?: string;
  }>({});

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      institution?: string;
      message?: string;
    } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.institution.trim()) {
      newErrors.institution = "Institution name is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Error",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          institution: "",
          phone: "",
          message: ""
        });
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-indigo-100/70 max-w-2xl mx-auto">
              Have questions about how EduCare can transform your educational institution?
              Our team is ready to help you implement the perfect solution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="glass-effect rounded-xl p-6 hover:shadow-purple-900/20 hover:shadow-lg transition-all bento-card">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-indigo-100/70 mb-2">We'll respond within 24 hours</p>
              <a href="mailto:support@educare.com" className="text-indigo-300 hover:text-indigo-200 transition-colors">
                support@educare.com
              </a>
            </div>
            
            <div className="glass-effect rounded-xl p-6 hover:shadow-purple-900/20 hover:shadow-lg transition-all bento-card">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-indigo-100/70 mb-2">Available 9am-6pm, Mon-Fri</p>
              <a href="tel:+918001234567" className="text-indigo-300 hover:text-indigo-200 transition-colors">
                +91 800-123-4567
              </a>
            </div>
            
            <div className="glass-effect rounded-xl p-6 hover:shadow-purple-900/20 hover:shadow-lg transition-all bento-card">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-indigo-100/70 mb-2">Our headquarters</p>
              <address className="text-indigo-300 not-italic">
                EduCare Tower, Whitefield<br />
                Bangalore, 560066<br />
                India
              </address>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 glass-effect rounded-xl p-8 border border-white/10">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-indigo-100 mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`bg-indigo-950/50 border ${errors.name ? 'border-red-400' : 'border-indigo-800'} text-white`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-2">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`bg-indigo-950/50 border ${errors.email ? 'border-red-400' : 'border-indigo-800'} text-white`}
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="institution" className="block text-sm font-medium text-indigo-100 mb-2">
                        Institution Name <span className="text-red-400">*</span>
                      </label>
                      <Input
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        className={`bg-indigo-950/50 border ${errors.institution ? 'border-red-400' : 'border-indigo-800'} text-white`}
                        placeholder="Your institution"
                      />
                      {errors.institution && (
                        <p className="mt-1 text-sm text-red-400">{errors.institution}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-indigo-100 mb-2">
                        Phone Number <span className="text-indigo-400/50">(Optional)</span>
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-indigo-950/50 border border-indigo-800 text-white"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-indigo-100 mb-2">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`bg-indigo-950/50 border ${errors.message ? 'border-red-400' : 'border-indigo-800'} text-white min-h-[150px]`}
                      placeholder="Tell us about your requirements or questions..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit"
                    variant="premium"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 form-success">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-center">Message Sent Successfully!</h2>
                  <p className="text-indigo-100/70 text-center max-w-md mb-6">
                    Thank you for reaching out. Our team will review your message and get back to you shortly.
                  </p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2 glass-effect rounded-xl p-8 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                    EduCare
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Why Choose EduCare?</h3>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="bg-indigo-500/20 rounded-full p-1 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-indigo-300" />
                    </div>
                    <p className="text-indigo-100/80">Trusted by 1,000+ educational institutions across India</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-500/20 rounded-full p-1 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-indigo-300" />
                    </div>
                    <p className="text-indigo-100/80">42% average reduction in administrative workload</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-500/20 rounded-full p-1 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-indigo-300" />
                    </div>
                    <p className="text-indigo-100/80">Advanced AI Tutor to enhance student performance</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-500/20 rounded-full p-1 mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-indigo-300" />
                    </div>
                    <p className="text-indigo-100/80">Dedicated implementation and support team</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <Separator className="bg-indigo-800/50 mb-6" />
                <h4 className="text-lg font-medium mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="social-icon h-10 w-10 rounded-full bg-indigo-800/50 flex items-center justify-center hover:bg-indigo-700/50 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="social-icon h-10 w-10 rounded-full bg-indigo-800/50 flex items-center justify-center hover:bg-indigo-700/50 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="social-icon h-10 w-10 rounded-full bg-indigo-800/50 flex items-center justify-center hover:bg-indigo-700/50 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="social-icon h-10 w-10 rounded-full bg-indigo-800/50 flex items-center justify-center hover:bg-indigo-700/50 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
