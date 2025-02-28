
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import './contact.css';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Form data:", data);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSubmitting(false);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    form.reset();
  };

  return (
    <div className="contact-page min-h-screen bg-gradient-to-b from-background/50 to-background">
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        {/* Back navigation */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        {/* Page header */}
        <motion.div 
          className="contact-header mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Get in Touch
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We're here to help and answer any questions you might have. We look forward to hearing from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form Section */}
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="form"
                className="contact-form-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <div className="contact-card bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
                  <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="contact-field">
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} className="transition-all" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="contact-field">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your.email@example.com" {...field} className="transition-all" />
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
                          <FormItem className="contact-field">
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="How can we help you?" {...field} className="transition-all" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="contact-field">
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide details about your inquiry..." 
                                rows={5} 
                                {...field} 
                                className="resize-none transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="contact-form-submit w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending message...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                  
                  {/* Decorative elements */}
                  <div className="contact-form-decoration floating-element w-32 h-32 rounded-full bg-indigo-500/5 -top-16 -right-16 z-0"></div>
                  <div className="contact-form-decoration pulse-effect w-24 h-24 rounded-full bg-purple-500/5 -bottom-12 -left-12 z-0"></div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                className="contact-success-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <div className="contact-card bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center min-h-[400px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20,
                      delay: 0.1 
                    }}
                    className="mb-6 text-green-500"
                  >
                    <CheckCircle size={72} />
                  </motion.div>
                  
                  <motion.h2 
                    className="text-2xl font-semibold mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Message Sent Successfully!
                  </motion.h2>
                  
                  <motion.p 
                    className="text-muted-foreground mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Thank you for contacting us. We will get back to you as soon as possible.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      onClick={resetForm}
                      className="contact-form-submit bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Info Section */}
          <div className="space-y-8">
            <motion.div 
              className="contact-info-item bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Email Us</h3>
                  <p className="text-muted-foreground">Our friendly team is here to help.</p>
                  <a href="mailto:contact@example.com" className="text-primary hover:underline mt-1 block font-medium">
                    contact@example.com
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="contact-info-item bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Call Us</h3>
                  <p className="text-muted-foreground">Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:+1234567890" className="text-primary hover:underline mt-1 block font-medium">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="contact-info-item bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Visit Us</h3>
                  <p className="text-muted-foreground">Come say hello at our office.</p>
                  <p className="mt-1 block font-medium">
                    123 Business Avenue, Suite 100<br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="contact-map bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-md p-2 border border-gray-200 dark:border-gray-800 h-[240px] overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Placeholder for a map - in a real app you'd use Google Maps or similar */}
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Interactive Map would be displayed here</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Alert */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Alert className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border-indigo-200 dark:border-indigo-900/30">
            <AlertDescription className="flex flex-col sm:flex-row items-center justify-between">
              <span className="mb-4 sm:mb-0">Have questions? Check out our Frequently Asked Questions section.</span>
              <Button variant="outline" className="border-indigo-300 dark:border-indigo-800">
                View FAQs
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
