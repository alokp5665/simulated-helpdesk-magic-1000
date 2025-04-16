
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import './styles.css';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              PrimeCare Project Management
              <span className="block text-base font-medium text-primary/70 mt-2">
                Streamline Your Team's Workflow
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              The ultimate project management solution for high-performing teams, designed to boost productivity and collaboration.
            </p>
            
            <div className="space-x-4">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                See Features <Sparkles className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="mt-12 flex items-center space-x-6">
              <div>
                <p className="text-3xl font-bold text-primary">5,000+</p>
                <p className="text-gray-600">Companies Worldwide</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="text-gray-600">Customer Satisfaction</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="bg-primary/10 rounded-2xl overflow-hidden p-6">
              <div className="aspect-video bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-semibold mb-4">Interactive Project Dashboard</p>
                  <Button variant="secondary">Explore Demo</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
