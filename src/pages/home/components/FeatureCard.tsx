
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, iconColor, bgColor, title, description }: FeatureCardProps) => {
  const navigate = useNavigate();
  
  const goToContact = () => {
    navigate("/contact");
  };

  return (
    <Card className="glass-card hover-scale">
      <CardHeader>
        <div className={`p-2 w-fit rounded-full ${bgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {/* This could be enhanced with more detailed content */}
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full justify-between" onClick={goToContact}>
          Learn More <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
