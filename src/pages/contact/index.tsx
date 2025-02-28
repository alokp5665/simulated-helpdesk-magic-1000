
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronLeft, Send, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // Fake API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form submitted:", data);
      
      // Show success dialog
      setShowSuccess(true);
      
      // Reset form
      form.reset();
      
      // Create toast notification
      toast("Message sent successfully", {
        description: "We'll get back to you as soon as possible",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      toast("Failed to send message", {
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header section with animated entrance */}
      <motion.div 
        className="container pt-12 pb-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link 
          to="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="space-y-1">
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="max-w-2xl text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Have questions about EduCare? We're here to help you elevate your educational institution.
          </motion.p>
        </div>
      </motion.div>
      
      <div className="container pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form Card */}
          <motion.div 
            className="glass-card p-8 rounded-xl shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your.email@example.com" 
                            className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Subject</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What is this regarding?" 
                          className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us how we can help..." 
                          className="min-h-28 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full hover-scale"
                  variant="premium"
                >
                  {isSubmitting ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center"
                    >
                      <span className="mr-2">Sending</span>
                      <div className="flex space-x-1">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </motion.div>
                  ) : (
                    <span className="flex items-center">
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
          
          {/* Contact Info Card */}
          <motion.div
            className="glass-card p-8 rounded-xl shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Contact information</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-1">General Inquiries</p>
                <p className="font-medium text-primary">info@educare.com</p>
                
                <p className="text-muted-foreground mb-1 mt-3">Support</p>
                <p className="font-medium text-primary">support@educare.com</p>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-1">Main Office</p>
                <p className="font-medium text-primary">+1 (555) 123-4567</p>
                
                <p className="text-muted-foreground mb-1 mt-3">Support Hotline</p>
                <p className="font-medium text-primary">+1 (555) 987-6543</p>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Office Location</h3>
                <p className="text-muted-foreground">EduCare Headquarters</p>
                <p className="text-muted-foreground">123 Innovation Drive</p>
                <p className="text-muted-foreground">San Francisco, CA 94103</p>
                <p className="text-muted-foreground">United States</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Connect With Us</h3>
                <div className="flex space-x-4">
                  {["LinkedIn", "Twitter", "Facebook", "Instagram"].map((platform) => (
                    <motion.a
                      key={platform}
                      href="#"
                      className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {platform}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="max-w-md rounded-xl overflow-hidden p-0">
          <motion.div
            className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle className="h-16 w-16 text-white" />
            </motion.div>
            
            <motion.h2 
              className="text-xl font-semibold text-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Message Sent Successfully!
            </motion.h2>
            
            <motion.p 
              className="text-white/80 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Thank you for reaching out. Our team will get back to you as soon as possible.
            </motion.p>
            
            <motion.div 
              className="mt-6 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={() => setShowSuccess(false)}
                variant="secondary"
                className="w-full hover-scale"
              >
                Continue Browsing
              </Button>
            </motion.div>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactPage;
