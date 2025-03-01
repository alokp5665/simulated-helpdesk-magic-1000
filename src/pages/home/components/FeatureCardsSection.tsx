
import { FeatureCard } from "./FeatureCard";
import { MessageSquare, Zap, BarChart3, BookOpen, Users, Shield } from "lucide-react";

export const FeatureCardsSection = () => {
  return (
    <div className="mb-12 fade-in">
      <h2 className="text-2xl font-bold mb-6">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={MessageSquare}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
          title="Omnichannel Support"
          description="Manage customer conversations across email, chat, phone, and social media"
        />
        
        <FeatureCard
          icon={Zap}
          iconColor="text-amber-600"
          bgColor="bg-amber-100"
          title="Smart Automation"
          description="Create intelligent workflows to handle routine tasks automatically"
        />
        
        <FeatureCard
          icon={BarChart3}
          iconColor="text-green-600"
          bgColor="bg-green-100"
          title="Advanced Analytics"
          description="Comprehensive reporting to track performance and identify trends"
        />
        
        <FeatureCard
          icon={BookOpen}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
          title="Knowledge Base"
          description="Create a self-service support center with searchable articles"
        />
        
        <FeatureCard
          icon={Users}
          iconColor="text-red-600"
          bgColor="bg-red-100"
          title="Team Collaboration"
          description="Tools to help your support team work together efficiently"
        />
        
        <FeatureCard
          icon={Shield}
          iconColor="text-pink-600"
          bgColor="bg-pink-100"
          title="SLA Management"
          description="Define and track service level agreements for customer support"
        />
      </div>
    </div>
  );
};
