
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare, PanelRight, Users, Star, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SolutionTabs = () => {
  const navigate = useNavigate();
  
  const goToContact = () => {
    navigate("/contact");
  };
  
  return (
    <div className="mb-12 fade-in">
      <h2 className="text-2xl font-bold mb-6">Solutions For Every Team</h2>
      <Tabs defaultValue="support" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="support">Customer Support</TabsTrigger>
          <TabsTrigger value="it">IT Help Desk</TabsTrigger>
          <TabsTrigger value="hr">HR Services</TabsTrigger>
          <TabsTrigger value="field">Field Service</TabsTrigger>
        </TabsList>
        
        <TabsContent value="support" className="animate-in fade-in">
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <CardContent className="p-6">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-4">Customer Support Solutions</h3>
                  <p className="text-muted-foreground mb-4">
                    Deliver exceptional customer support across all channels, reduce response times, and increase satisfaction scores.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Unified customer communication hub</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Automated ticket routing and prioritization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Customer satisfaction tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Self-service knowledge base</span>
                    </li>
                  </ul>
                  <Button className="mt-6 w-fit" onClick={goToContact}>Learn More</Button>
                </div>
              </CardContent>
              <div className="bg-primary/10 h-[300px] md:h-auto flex items-center justify-center p-6">
                <div className="p-6 glass-card text-center max-w-xs rounded-lg">
                  <div className="p-3 bg-white rounded-full w-fit mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Customer-Centric Support</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    "PrimeCare transformed our support operations, reducing our average response time by 65% and increasing CSAT scores by 28%."
                  </p>
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                  </div>
                  <p className="text-xs mt-2 font-medium">Sarah Johnson, CX Director at TechGlobal</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="it" className="animate-in fade-in">
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <CardContent className="p-6">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-4">IT Help Desk Solutions</h3>
                  <p className="text-muted-foreground mb-4">
                    Streamline internal IT support, resolve issues faster, and maintain detailed asset management.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Incident and problem management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>IT asset tracking and management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Change request workflows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Service catalog for common requests</span>
                    </li>
                  </ul>
                  <Button className="mt-6 w-fit" onClick={goToContact}>Learn More</Button>
                </div>
              </CardContent>
              <div className="bg-primary/10 h-[300px] md:h-auto flex items-center justify-center p-6">
                <div className="p-6 glass-card text-center max-w-xs rounded-lg">
                  <div className="p-3 bg-white rounded-full w-fit mx-auto mb-4">
                    <PanelRight className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">IT Support Excellence</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Our IT team now resolves tickets 40% faster, and our asset management is completely streamlined thanks to PrimeCare's IT solutions."
                  </p>
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                  </div>
                  <p className="text-xs mt-2 font-medium">Michael Chen, IT Director at Finova</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="hr" className="animate-in fade-in">
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <CardContent className="p-6">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-4">HR Service Desk Solutions</h3>
                  <p className="text-muted-foreground mb-4">
                    Simplify employee requests, automate onboarding and offboarding, and maintain detailed HR documentation.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Employee self-service portal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Onboarding & offboarding workflows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Benefits and policy management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Secure document handling</span>
                    </li>
                  </ul>
                  <Button className="mt-6 w-fit" onClick={goToContact}>Learn More</Button>
                </div>
              </CardContent>
              <div className="bg-primary/10 h-[300px] md:h-auto flex items-center justify-center p-6">
                <div className="p-6 glass-card text-center max-w-xs rounded-lg">
                  <div className="p-3 bg-white rounded-full w-fit mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">HR Process Transformation</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    "Our HR team saved over 20 hours per week by automating routine processes with PrimeCare. Employee satisfaction with HR services increased by a remarkable 42%."
                  </p>
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                  </div>
                  <p className="text-xs mt-2 font-medium">Elena Rodriguez, HR Manager at NexGen</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="field" className="animate-in fade-in">
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <CardContent className="p-6">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-4">Field Service Solutions</h3>
                  <p className="text-muted-foreground mb-4">
                    Optimize field service operations, dispatch technicians efficiently, and track service performance.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Technician scheduling and dispatch</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Mobile service management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Parts inventory tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-4 w-4" />
                      <span>Service history and reporting</span>
                    </li>
                  </ul>
                  <Button className="mt-6 w-fit" onClick={goToContact}>Learn More</Button>
                </div>
              </CardContent>
              <div className="bg-primary/10 h-[300px] md:h-auto flex items-center justify-center p-6">
                <div className="p-6 glass-card text-center max-w-xs rounded-lg">
                  <div className="p-3 bg-white rounded-full w-fit mx-auto mb-4">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Field Operations Optimization</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    "PrimeCare's field service solution improved our first-time fix rate by 35% and reduced travel time between service calls by nearly 28%."
                  </p>
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                    <Star className="fill-amber-500 h-4 w-4" />
                  </div>
                  <p className="text-xs mt-2 font-medium">Robert Patel, Operations Manager at ServicePro</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
