
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneCall, PhoneMissed, PhoneOff, Clock, User } from "lucide-react";

interface Call {
  id: string;
  type: "incoming" | "outgoing" | "missed";
  status: "ongoing" | "completed" | "missed";
  customerName: string;
  agentName: string;
  duration?: string;
  timestamp: Date;
}

const AGENT_NAMES = ["Sarah Johnson", "Mike Chen", "Priya Patel", "Alex Thompson"];
const CUSTOMER_NAMES = ["John Smith", "Emma Davis", "Carlos Rodriguez", "Lisa Wang"];

const CallsPage = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Simulate new calls
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeCall && Math.random() > 0.7) {
        const newCall: Call = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? "incoming" : "outgoing",
          status: "ongoing",
          customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
          agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
          timestamp: new Date()
        };
        setActiveCall(newCall);
        setCalls(prev => [newCall, ...prev.slice(0, 19)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeCall]);

  // Handle active call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      setCallDuration(0);
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // End call after random duration
      const timeout = setTimeout(() => {
        setActiveCall(prev => {
          if (prev) {
            setCalls(calls => calls.map(call => 
              call.id === prev.id 
                ? { ...call, status: "completed", duration: `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}` }
                : call
            ));
          }
          return null;
        });
      }, Math.random() * 10000 + 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [activeCall]);

  // Simulate missed calls
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const missedCall: Call = {
          id: Date.now().toString(),
          type: "incoming",
          status: "missed",
          customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
          agentName: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
          timestamp: new Date()
        };
        setCalls(prev => [missedCall, ...prev.slice(0, 19)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Active Call */}
            <Card className="col-span-12 lg:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PhoneCall className="h-5 w-5 text-primary" />
                    <span>Active Call</span>
                  </div>
                  {activeCall && (
                    <Badge variant="default" className="animate-pulse">
                      On Call
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeCall ? (
                  <div className="flex flex-col items-center justify-center space-y-6 py-12">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {activeCall.customerName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold mb-2">{activeCall.customerName}</h2>
                      <p className="text-muted-foreground">
                        {activeCall.type === "incoming" ? "Incoming Call" : "Outgoing Call"}
                      </p>
                    </div>
                    <div className="text-3xl font-mono">
                      {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <PhoneOff className="h-12 w-12 mb-4" />
                    <p>No active calls</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Call Logs */}
            <Card className="col-span-12 lg:col-span-6 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Call History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {calls.map(call => (
                      <div key={call.id} className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>
                                {call.customerName.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{call.customerName}</p>
                              <p className="text-sm text-muted-foreground">with {call.agentName}</p>
                            </div>
                          </div>
                          <Badge variant={
                            call.status === "ongoing" ? "default" :
                            call.status === "completed" ? "secondary" :
                            "destructive"
                          }>
                            {call.status === "ongoing" ? (
                              <PhoneCall className="h-4 w-4" />
                            ) : call.status === "missed" ? (
                              <PhoneMissed className="h-4 w-4" />
                            ) : (
                              <Phone className="h-4 w-4" />
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{call.timestamp.toLocaleTimeString()}</span>
                          {call.duration && <span>Duration: {call.duration}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CallsPage;
