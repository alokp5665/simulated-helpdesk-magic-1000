
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  const goToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="mb-12 fade-in">
      <div className="rounded-xl overflow-hidden glass-card p-8 hover-scale">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              <span className="relative">
                Welcome to EduCare
                <div className="absolute -top-4 -right-4">
                  <div className="text-xs font-normal bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    Enterprise Edition
                  </div>
                </div>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              The complete customer support solution for growing teams
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500 h-5 w-5" />
                <span>Streamline customer conversations across all channels</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500 h-5 w-5" />
                <span>Automate routine tasks with intelligent workflows</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500 h-5 w-5" />
                <span>Gain insights with advanced reporting and analytics</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={goToContact}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-video bg-primary/10 rounded-xl overflow-hidden relative">
              {/* Placeholder for hero image or animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg text-center">
                  <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-medium">Interactive Dashboard Demo</p>
                  <Button variant="link" size="sm" className="mt-1">
                    Play Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
