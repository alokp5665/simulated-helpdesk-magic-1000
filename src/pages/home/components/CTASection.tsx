
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();
  
  const goToContact = () => {
    navigate("/contact");
  };
  
  return (
    <div className="mb-10 fade-in">
      <Card className="glass-card overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mt-20 -mr-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -mb-16 -ml-16 blur-xl"></div>
          <CardContent className="p-8 text-center relative z-10">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to transform your support operations?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of companies that are delivering exceptional support experiences with PrimeCare Helpdesk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={goToContact}>
                  Buy Now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={goToContact}>
                  Upgrade <Sparkles className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                You're Using Unlimited Free Trial
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
