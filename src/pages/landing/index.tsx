import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import "./styles.css";

const LandingPage = () => {
  const navigation = [
    { text: "Home", href: "/home" },
    { text: "Knowledge Base", href: "/knowledge" },
    { text: "Tasks", href: "/tasks" },
    { text: "Email", href: "/email" },
    { text: "Agents", href: "/agents" },
    { text: "Chat", href: "/chat" },
	{ text: "Contact", href: "/contact" },
  ];

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } },
  };

  const featuresVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } },
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            EduCare AI
          </Link>
          <ul className="flex space-x-6">
            {navigation.map((item) => (
              <li key={item.text}>
                <Link
                  to={item.href}
                  className="hover:text-indigo-500 transition-colors duration-300"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
          <div>
            <Button asChild>
              <Link to="/auth/login">Login</Link>
            </Button>
            <Button variant="secondary" className="ml-4" asChild>
              <Link to="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section
        className="container mx-auto px-6 py-20 text-center"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-6">
          Welcome to EduCare AI
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Empowering Education with Artificial Intelligence
        </p>
        <Button size="lg" asChild>
          <Link to="/home">
            Get Started <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="bg-gray-100 py-16"
        variants={featuresVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://source.unsplash.com/400x300/?ai,education"
                alt="AI Education"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  AI-Powered Learning
                </h3>
                <p className="text-gray-600">
                  Personalized learning paths tailored to individual student
                  needs.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://source.unsplash.com/400x300/?ai,assessment"
                alt="AI Assessment"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Smart Assessments
                </h3>
                <p className="text-gray-600">
                  Automated grading and insightful feedback to improve teaching
                  effectiveness.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://source.unsplash.com/400x300/?ai,analytics"
                alt="AI Analytics"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Predictive Analytics
                </h3>
                <p className="text-gray-600">
                  Identify at-risk students and provide timely interventions for
                  better outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="bg-indigo-100 py-24"
        variants={ctaVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-indigo-700 mb-8">
            Ready to Transform Education?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join EduCare AI and revolutionize the way you teach and learn.
          </p>
          <Button size="lg" variant="premium" asChild>
            <Link to="/auth/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} EduCare AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
