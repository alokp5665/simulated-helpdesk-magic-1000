
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BarChart3, RefreshCcw } from "lucide-react";
import { HeroSection } from "./components/HeroSection";
import { FeatureCardsSection } from "./components/FeatureCardsSection";
import { StatsSection } from "./components/StatsSection";
import { SolutionTabs } from "./components/SolutionTabs";
import { CTASection } from "./components/CTASection";
import { ChatbotComponent } from "./components/Chatbot/ChatbotComponent";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Feature Cards Section */}
          <FeatureCardsSection />
          
          {/* Stats Section */}
          <StatsSection />
          
          {/* Solutions Tabs */}
          <SolutionTabs />
          
          {/* CTA Section */}
          <CTASection />
        </div>
      </main>
      
      {/* AI Chatbot */}
      <ChatbotComponent />
    </div>
  );
};

export default HomePage;
