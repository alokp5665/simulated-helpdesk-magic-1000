
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Users, Shield, Lock, Key } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "support";
  permissions: string[];
  lastActive: Date;
}

const PERMISSIONS = {
  admin: [
    "manage_users",
    "manage_roles",
    "view_analytics",
    "manage_settings",
    "manage_billing",
    "manage_teams",
  ],
  agent: [
    "view_tickets",
    "respond_tickets",
    "view_analytics",
    "manage_own_profile",
  ],
  support: [
    "view_tickets",
    "respond_tickets",
    "manage_own_profile",
  ],
};

const FIRST_NAMES = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

const RolesPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  // Generate random agents
  useEffect(() => {
    const generateAgent = (): Agent => {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const roles = ["admin", "agent", "support"] as const;
      const role = roles[Math.floor(Math.random() * roles.length)];

      return {
        id: Date.now().toString(),
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        role,
        permissions: [...PERMISSIONS[role]],
        lastActive: new Date(Date.now() - Math.random() * 86400000),
      };
    };

    // Generate initial agents
    const initialAgents = Array(10).fill(null).map(generateAgent);
    setAgents(initialAgents);

    // Add new agent every 10 seconds
    const interval = setInterval(() => {
      setAgents(prev => [...prev.slice(0, 14), generateAgent()]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = (agentId: string, newRole: "admin" | "agent" | "support") => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, role: newRole, permissions: [...PERMISSIONS[newRole]] }
        : agent
    ));
  };

  const handlePermissionToggle = (agentId: string, permission: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId
        ? {
            ...agent,
            permissions: agent.permissions.includes(permission)
              ? agent.permissions.filter(p => p !== permission)
              : [...agent.permissions, permission]
          }
        : agent
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Agents List */}
            <Card className="col-span-12 lg:col-span-8 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Team Members</span>
                  </div>
                  <Badge variant="secondary" className="animate-pulse">
                    {agents.length} Active Agents
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {agents.map(agent => (
                      <div key={agent.id} 
                        className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={`/placeholder.svg`} />
                              <AvatarFallback>{agent.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                              <p className="text-sm text-muted-foreground">{agent.email}</p>
                            </div>
                          </div>
                          <Select
                            defaultValue={agent.role}
                            onValueChange={(value: "admin" | "agent" | "support") => 
                              handleRoleChange(agent.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="agent">Agent</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {PERMISSIONS[agent.role].map(permission => (
                              <Toggle
                                key={permission}
                                pressed={agent.permissions.includes(permission)}
                                onPressedChange={() => handlePermissionToggle(agent.id, permission)}
                                variant="outline"
                                size="sm"
                              >
                                <Lock className="h-3 w-3 mr-1" />
                                {permission.split("_").join(" ")}
                              </Toggle>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Role Overview */}
            <Card className="col-span-12 lg:col-span-4 glass-card hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Role Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(["admin", "agent", "support"] as const).map(role => (
                    <div key={role} className="p-4 rounded-lg bg-accent/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold capitalize">{role}</h3>
                        <Badge variant="outline">
                          {agents.filter(a => a.role === role).length} Members
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {PERMISSIONS[role].map(permission => (
                          <div key={permission} className="flex items-center space-x-2 text-sm">
                            <Key className="h-3 w-3 text-primary" />
                            <span>{permission.split("_").join(" ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RolesPage;
