
import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

// Dummy data for testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Principal, Westlake High School",
    content:
      "EduCare has transformed how we manage student information. The intuitive interface and powerful analytics have made administrative tasks much more efficient.",
  },
  {
    name: "Michael Chen",
    role: "IT Director, Riverside College",
    content:
      "Implementation was seamless and the support team was exceptional. Our faculty adapted quickly and now we couldn't imagine working without it.",
  },
  {
    name: "Amanda Rodriguez",
    role: "Department Head, Bay University",
    content:
      "The analytics provided by EduCare have given us valuable insights into student performance trends. It's been instrumental in helping us improve our teaching methodologies.",
  },
];

// Feature data
const features = [
  {
    title: "Student Information Management",
    description:
      "Centralize student data, from academic records to attendance and behavior tracking, all in one secure platform.",
  },
  {
    title: "Advanced Analytics Dashboard",
    description:
      "Gain valuable insights with comprehensive analytics and visual reports on student performance and institutional metrics.",
  },
  {
    title: "Communication Portal",
    description:
      "Foster collaboration with integrated messaging between administrators, teachers, students, and parents.",
  },
  {
    title: "Curriculum Management",
    description:
      "Plan, develop, and implement curriculum with collaborative tools designed for educational excellence.",
  },
  {
    title: "Assessment & Grading",
    description:
      "Create assessments, record grades, and provide feedback through an intuitive interface.",
  },
  {
    title: "Resource Allocation",
    description:
      "Optimize classrooms, equipment, and faculty scheduling with intelligent resource management.",
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-slate-950 to-indigo-950 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-grid-white absolute inset-0 z-0 opacity-[0.02]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500 glow-text">
              The Ultimate Education Management Solution
            </h1>
            <p className="text-xl text-slate-300 mb-8 md:text-2xl">
              Streamline administrative tasks, enhance learning experiences, and
              unlock the full potential of your educational institution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/auth/signup"
                className="premium-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 text-lg"
              >
                Sign Up for Free
              </Link>
              <Link
                to="/contact"
                className="premium-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 text-lg"
              >
                Contact Us
              </Link>
            </div>
            <p className="mt-6 text-slate-400">
              1,000+ educational institutions already using EduCare
            </p>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Features for Modern Education
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to effectively manage your educational
            institution in one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-effect p-6 rounded-xl bento-card"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-b from-indigo-950 to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Educators Worldwide
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Hear what educational professionals have to say about EduCare's
              impact on their institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass-effect p-6 rounded-xl bento-card"
              >
                <p className="text-slate-300 mb-6">{testimonial.content}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-indigo-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Educational Institution?
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
          Join thousands of educational institutions already benefiting from
          EduCare's comprehensive management solution.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/auth/signup"
            className="premium-button bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 text-lg"
          >
            Sign Up for Free
          </Link>
          <Link
            to="/contact"
            className="bg-transparent border border-indigo-400 text-indigo-400 px-8 py-3 rounded-full font-medium hover:bg-indigo-400/10 transition-all duration-300 text-lg"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="text-slate-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400">
              © {new Date().getFullYear()} EduCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
