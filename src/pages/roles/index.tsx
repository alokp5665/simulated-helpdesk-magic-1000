
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  Users, Shield, Lock, Key, Search, Filter, Plus, Check, X, AlertCircle, 
  BellRing, Activity, BarChart, Clipboard, Settings, UserPlus, ClipboardCheck 
} from "lucide-react";

// Types
interface Agent {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "support" | string;
  permissions: string[];
  lastActive: Date;
}

interface ActivityLog {
  id: string;
  message: string;
  timestamp: Date;
  type: "role_change" | "permission_change" | "request" | "system";
  status?: "pending" | "approved" | "denied";
  agentId?: string;
}

interface CustomRole {
  name: string;
  permissions: string[];
  color: string;
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

const ROLE_COLORS = {
  admin: "bg-red-100 text-red-800 border-red-200",
  agent: "bg-blue-100 text-blue-800 border-blue-200",
  support: "bg-green-100 text-green-800 border-green-200"
};

const ALL_PERMISSIONS = [
  "manage_users",
  "manage_roles",
  "view_analytics",
  "manage_settings",
  "manage_billing",
  "manage_teams",
  "view_tickets",
  "respond_tickets",
  "manage_own_profile",
];

const FIRST_NAMES = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "Rahul", "Priya", "Anita", "Vikram", "Suresh"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Sharma", "Patel", "Desai", "Gupta", "Kumar"];

const generateRandomMessage = (agent: Agent): string => {
  const messageTemplates = [
    `${agent.name} logged in from a new device`,
    `${agent.name} updated their profile information`,
    `${agent.name} viewed the analytics dashboard`,
    `${agent.name} reviewed pending tickets`,
    `${agent.name} modified team settings`,
  ];
  return messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
};

const RolesPage = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [newRole, setNewRole] = useState<CustomRole>({
    name: "",
    permissions: [],
    color: "#4f46e5"
  });
  const [isLoading, setIsLoading] = useState(false);

  // Generate random agents
  useEffect(() => {
    const generateAgent = (): Agent => {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const roles = ["admin", "agent", "support"] as const;
      const role = roles[Math.floor(Math.random() * roles.length)];

      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
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
    setFilteredAgents(initialAgents);

    // Generate initial activity logs
    const initialLogs: ActivityLog[] = initialAgents.slice(0, 5).map(agent => ({
      id: Math.random().toString(36).substring(2),
      message: `${agent.name} joined the team as ${agent.role}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
      type: "system"
    }));
    setActivityLogs(initialLogs);

    // Add new agent every 10 seconds
    const interval = setInterval(() => {
      setAgents(prev => {
        if (prev.length >= 15) return prev;
        const newAgent = generateAgent();
        
        // Add log for new agent
        setActivityLogs(prevLogs => [
          {
            id: Math.random().toString(36).substring(2),
            message: `${newAgent.name} joined the team as ${newAgent.role}`,
            timestamp: new Date(),
            type: "system"
          },
          ...prevLogs
        ]);
        
        return [...prev, newAgent];
      });
    }, 10000);

    // Generate random permission requests
    const requestInterval = setInterval(() => {
      setAgents(prevAgents => {
        if (prevAgents.length === 0) return prevAgents;
        
        const randomIndex = Math.floor(Math.random() * prevAgents.length);
        const randomAgent = prevAgents[randomIndex];
        
        if (randomAgent.role === "admin") return prevAgents; // Admins don't request permissions
        
        const adminPermissions = PERMISSIONS.admin;
        const agentPermissions = randomAgent.permissions;
        
        // Get permissions that agent doesn't have
        const availablePermissions = adminPermissions.filter(
          p => !agentPermissions.includes(p)
        );
        
        if (availablePermissions.length === 0) return prevAgents;
        
        // Pick a random permission to request
        const requestedPermission = availablePermissions[
          Math.floor(Math.random() * availablePermissions.length)
        ];
        
        // Add to activity log
        setActivityLogs(prevLogs => [
          {
            id: Math.random().toString(36).substring(2),
            message: `${randomAgent.name} requests access to ${requestedPermission.split('_').join(' ')}`,
            timestamp: new Date(),
            type: "request",
            status: "pending",
            agentId: randomAgent.id
          },
          ...prevLogs
        ]);
        
        return prevAgents;
      });
    }, 15000);

    // Generate random activity for existing agents
    const activityInterval = setInterval(() => {
      setAgents(prevAgents => {
        if (prevAgents.length === 0) return prevAgents;
        
        const randomIndex = Math.floor(Math.random() * prevAgents.length);
        const randomAgent = prevAgents[randomIndex];
        
        // Add random activity
        setActivityLogs(prevLogs => [
          {
            id: Math.random().toString(36).substring(2),
            message: generateRandomMessage(randomAgent),
            timestamp: new Date(),
            type: "system"
          },
          ...prevLogs
        ]);
        
        return prevAgents;
      });
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(requestInterval);
      clearInterval(activityInterval);
    };
  }, []);

  // Filter agents based on search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredAgents(agents);
    } else {
      setFilteredAgents(
        agents.filter(
          agent => 
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.role.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, agents]);

  const handleRoleChange = (agentId: string, newRole: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { 
              ...agent, 
              role: newRole, 
              permissions: [...(PERMISSIONS[newRole as keyof typeof PERMISSIONS] || [])] 
            }
          : agent
      ));
      
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        setActivityLogs(prev => [
          {
            id: Math.random().toString(36).substring(2),
            message: `Role updated: ${agent.name} is now a ${newRole}`,
            timestamp: new Date(),
            type: "role_change"
          },
          ...prev
        ]);
        
        toast({
          title: "Role Updated",
          description: `${agent.name} is now a ${newRole}`,
          variant: "default",
        });
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handlePermissionToggle = (agentId: string, permission: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
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
      
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        const hasPermission = agent.permissions.includes(permission);
        setActivityLogs(prev => [
          {
            id: Math.random().toString(36).substring(2),
            message: `${hasPermission ? "Removed" : "Granted"} permission: ${permission.split('_').join(' ')} ${hasPermission ? "from" : "to"} ${agent.name}`,
            timestamp: new Date(),
            type: "permission_change"
          },
          ...prev
        ]);
        
        toast({
          title: "Permission Updated",
          description: `${hasPermission ? "Removed" : "Granted"} ${permission.split('_').join(' ')} ${hasPermission ? "from" : "to"} ${agent.name}`,
          variant: "default",
        });
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleRequestAction = (logId: string, approved: boolean) => {
    setActivityLogs(prev => prev.map(log => 
      log.id === logId 
        ? { 
            ...log, 
            status: approved ? "approved" : "denied", 
            message: `${log.message} ${approved ? "(Approved)" : "(Denied)"}` 
          }
        : log
    ));
    
    const log = activityLogs.find(l => l.id === logId);
    if (log && log.agentId && approved) {
      const permissionRequested = log.message.split('requests access to ')[1];
      const formattedPermission = permissionRequested.split(' ').join('_');
      
      setAgents(prev => prev.map(agent => 
        agent.id === log.agentId
          ? {
              ...agent,
              permissions: [...agent.permissions, formattedPermission]
            }
          : agent
      ));
      
      toast({
        title: approved ? "Request Approved" : "Request Denied",
        description: log.message,
        variant: approved ? "default" : "destructive",
      });
    } else if (log) {
      toast({
        title: "Request Denied",
        description: log.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveCustomRole = () => {
    if (!newRole.name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (newRole.permissions.length === 0) {
      toast({
        title: "Error",
        description: "Select at least one permission",
        variant: "destructive",
      });
      return;
    }
    
    setCustomRoles(prev => [...prev, { ...newRole }]);
    setNewRole({ name: "", permissions: [], color: "#4f46e5" });
    setShowRoleDialog(false);
    
    toast({
      title: "Custom Role Created",
      description: `${newRole.name} role has been created successfully`,
      variant: "default",
    });
  };

  const handleBulkAction = (action: string, permissions: string[]) => {
    if (selectedAgents.length === 0) {
      toast({
        title: "No Agents Selected",
        description: "Please select at least one agent",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (action === "permissions") {
        setAgents(prev => prev.map(agent => 
          selectedAgents.includes(agent.id)
            ? {
                ...agent,
                permissions: [...permissions]
              }
            : agent
        ));
        
        toast({
          title: "Bulk Action Completed",
          description: `Updated permissions for ${selectedAgents.length} agents`,
          variant: "default",
        });
      } else if (action === "role") {
        setAgents(prev => prev.map(agent => 
          selectedAgents.includes(agent.id)
            ? {
                ...agent,
                role: permissions[0],
                permissions: [...(PERMISSIONS[permissions[0] as keyof typeof PERMISSIONS] || [])]
              }
            : agent
        ));
        
        toast({
          title: "Bulk Action Completed",
          description: `Updated role for ${selectedAgents.length} agents to ${permissions[0]}`,
          variant: "default",
        });
      }
      
      setBulkActionOpen(false);
      setSelectedAgents([]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Header with search and filters */}
            <div className="col-span-12 flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search team members..."
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={() => setBulkActionOpen(true)} disabled={selectedAgents.length === 0}>
                  Bulk Actions ({selectedAgents.length})
                </Button>
              </div>
            </div>
            
            {/* Team Members Section */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Agents List */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
              >
                <Card className="glass-card">
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
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-4">
                        {filteredAgents.map(agent => (
                          <motion.div 
                            key={agent.id} 
                            className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-all"
                            whileHover={{ scale: 1.02 }}
                            layout
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Checkbox 
                                  checked={selectedAgents.includes(agent.id)}
                                  onCheckedChange={(checked) => {
                                    setSelectedAgents(prev => 
                                      checked 
                                        ? [...prev, agent.id] 
                                        : prev.filter(id => id !== agent.id)
                                    );
                                  }}
                                />
                                <Avatar className="h-10 w-10 border-2 border-primary/20">
                                  <AvatarImage src={`/placeholder.svg`} />
                                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                    {agent.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">{agent.name}</h3>
                                  <p className="text-sm text-muted-foreground">{agent.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  className={`${
                                    ROLE_COLORS[agent.role as keyof typeof ROLE_COLORS] || 
                                    "bg-gray-100 text-gray-800 border-gray-200"
                                  } transition-all`}
                                >
                                  {agent.role.charAt(0).toUpperCase() + agent.role.slice(1)}
                                </Badge>
                                <Select
                                  defaultValue={agent.role}
                                  onValueChange={(value) => handleRoleChange(agent.id, value)}
                                  disabled={isLoading}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="agent">Agent</SelectItem>
                                    <SelectItem value="support">Support</SelectItem>
                                    {customRoles.map(role => (
                                      <SelectItem key={role.name} value={role.name}>
                                        {role.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex flex-wrap gap-2">
                                {ALL_PERMISSIONS.map(permission => (
                                  <Toggle
                                    key={permission}
                                    pressed={agent.permissions.includes(permission)}
                                    onPressedChange={() => handlePermissionToggle(agent.id, permission)}
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoading}
                                    className="transition-all"
                                  >
                                    <Lock className="h-3 w-3 mr-1" />
                                    {permission.split("_").join(" ")}
                                  </Toggle>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Activity Feed */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>Activity Feed</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {activityLogs.map(log => (
                          <motion.div 
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start space-x-4 p-3 rounded-lg border bg-card/50"
                          >
                            <div className={`
                              p-2 rounded-full 
                              ${log.type === 'role_change' ? 'bg-blue-100 text-blue-600' : 
                                log.type === 'permission_change' ? 'bg-purple-100 text-purple-600' : 
                                log.type === 'request' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}
                            `}>
                              {log.type === 'role_change' ? <UserPlus className="h-4 w-4" /> : 
                               log.type === 'permission_change' ? <Key className="h-4 w-4" /> : 
                               log.type === 'request' ? <AlertCircle className="h-4 w-4" /> : 
                               <BellRing className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{log.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {log.timestamp.toLocaleTimeString()} - {log.timestamp.toLocaleDateString()}
                              </p>
                              
                              {log.type === 'request' && log.status === 'pending' && (
                                <div className="flex space-x-2 mt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 text-xs bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                    onClick={() => handleRequestAction(log.id, true)}
                                  >
                                    <Check className="h-3 w-3 mr-1" /> Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 text-xs bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                    onClick={() => handleRequestAction(log.id, false)}
                                  >
                                    <X className="h-3 w-3 mr-1" /> Deny
                                  </Button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Role Management Column */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Role Overview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Role Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {(["admin", "agent", "support"] as const).map(role => (
                        <motion.div 
                          key={role} 
                          className={`p-4 rounded-lg ${
                            role === 'admin' ? 'bg-red-50 border border-red-100' : 
                            role === 'agent' ? 'bg-blue-50 border border-blue-100' : 
                            'bg-green-50 border border-green-100'
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold capitalize">{role}</h3>
                            <Badge variant="outline" className={
                              role === 'admin' ? 'border-red-200 text-red-700' : 
                              role === 'agent' ? 'border-blue-200 text-blue-700' : 
                              'border-green-200 text-green-700'
                            }>
                              {agents.filter(a => a.role === role).length} Members
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {PERMISSIONS[role].map(permission => (
                              <div key={permission} className="flex items-center space-x-2 text-sm">
                                <Key className={`h-3 w-3 ${
                                  role === 'admin' ? 'text-red-500' : 
                                  role === 'agent' ? 'text-blue-500' : 
                                  'text-green-500'
                                }`} />
                                <span>{permission.split('_').join(' ')}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Custom Roles */}
                      {customRoles.map(customRole => (
                        <motion.div 
                          key={customRole.name} 
                          className="p-4 rounded-lg bg-purple-50 border border-purple-100"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold capitalize flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: customRole.color }}
                              ></div>
                              {customRole.name}
                            </h3>
                            <Badge variant="outline" className="border-purple-200 text-purple-700">
                              {agents.filter(a => a.role === customRole.name).length} Members
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {customRole.permissions.map(permission => (
                              <div key={permission} className="flex items-center space-x-2 text-sm">
                                <Key className="h-3 w-3 text-purple-500" />
                                <span>{permission.split('_').join(' ')}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Create New Role Button */}
                      <Button 
                        variant="outline" 
                        className="w-full border-dashed" 
                        onClick={() => setShowRoleDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Create Custom Role
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Role Statistics */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      <span>Role Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Admin</span>
                        <div className="flex-1 mx-4">
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div 
                              className="h-full bg-red-500" 
                              initial={{ width: '0%' }}
                              animate={{ width: `${(agents.filter(a => a.role === 'admin').length / agents.length) * 100}%` }}
                              transition={{ duration: 1 }}
                            ></motion.div>
                          </div>
                        </div>
                        <span className="text-sm">{agents.filter(a => a.role === 'admin').length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Agent</span>
                        <div className="flex-1 mx-4">
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div 
                              className="h-full bg-blue-500" 
                              initial={{ width: '0%' }}
                              animate={{ width: `${(agents.filter(a => a.role === 'agent').length / agents.length) * 100}%` }}
                              transition={{ duration: 1 }}
                            ></motion.div>
                          </div>
                        </div>
                        <span className="text-sm">{agents.filter(a => a.role === 'agent').length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Support</span>
                        <div className="flex-1 mx-4">
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div 
                              className="h-full bg-green-500" 
                              initial={{ width: '0%' }}
                              animate={{ width: `${(agents.filter(a => a.role === 'support').length / agents.length) * 100}%` }}
                              transition={{ duration: 1 }}
                            ></motion.div>
                          </div>
                        </div>
                        <span className="text-sm">{agents.filter(a => a.role === 'support').length}</span>
                      </div>
                      
                      {customRoles.map(role => (
                        <div key={role.name} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{role.name}</span>
                          <div className="flex-1 mx-4">
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <motion.div 
                                className="h-full bg-purple-500" 
                                style={{ backgroundColor: role.color }}
                                initial={{ width: '0%' }}
                                animate={{ width: `${(agents.filter(a => a.role === role.name).length / agents.length) * 100}%` }}
                                transition={{ duration: 1 }}
                              ></motion.div>
                            </div>
                          </div>
                          <span className="text-sm">{agents.filter(a => a.role === role.name).length}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Most Common Permissions</h4>
                      <div className="space-y-3">
                        {ALL_PERMISSIONS.slice(0, 4).map(permission => (
                          <div key={permission} className="flex justify-between items-center">
                            <span className="text-xs">{permission.split('_').join(' ')}</span>
                            <Badge variant="outline" className="text-xs h-5">
                              {agents.filter(a => a.permissions.includes(permission)).length} users
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Create Custom Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Custom Role</DialogTitle>
            <DialogDescription>
              Define a new role with custom permissions for your team members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="role-name" className="text-sm font-medium">
                Role Name
              </label>
              <Input 
                id="role-name" 
                value={newRole.name} 
                onChange={(e) => setNewRole({...newRole, name: e.target.value})} 
                placeholder="E.g., Senior Agent"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Role Color</label>
              <div className="flex flex-wrap gap-2">
                {["#4f46e5", "#dc2626", "#16a34a", "#ca8a04", "#9333ea", "#0891b2"].map(color => (
                  <div 
                    key={color}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                      newRole.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewRole({...newRole, color})}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Permissions</label>
              <div className="border rounded-md p-4 space-y-2 max-h-48 overflow-y-auto">
                {ALL_PERMISSIONS.map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`permission-${permission}`}
                      checked={newRole.permissions.includes(permission)}
                      onCheckedChange={(checked) => {
                        setNewRole({
                          ...newRole,
                          permissions: checked 
                            ? [...newRole.permissions, permission] 
                            : newRole.permissions.filter(p => p !== permission)
                        });
                      }}
                    />
                    <label 
                      htmlFor={`permission-${permission}`}
                      className="text-sm cursor-pointer"
                    >
                      {permission.split('_').join(' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomRole}>
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Actions Dialog */}
      <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Apply changes to {selectedAgents.length} selected team members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Select Action</label>
              <Select onValueChange={(value) => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="change_role">Change Role</SelectItem>
                  <SelectItem value="assign_permissions">Assign Permissions</SelectItem>
                  <SelectItem value="remove_permissions">Remove Permissions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Apply To</label>
              <div className="border rounded-md p-4 max-h-32 overflow-y-auto">
                <div className="space-y-2">
                  {selectedAgents.map(id => {
                    const agent = agents.find(a => a.id === id);
                    return agent ? (
                      <div key={id} className="flex items-center justify-between">
                        <span className="text-sm">{agent.name}</span>
                        <Badge className={`${
                          ROLE_COLORS[agent.role as keyof typeof ROLE_COLORS] || 
                          "bg-gray-100 text-gray-800 border-gray-200"
                        }`}>
                          {agent.role}
                        </Badge>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Select Role</label>
              <Select onValueChange={(value) => handleBulkAction("role", [value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role to assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  {customRoles.map(role => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleBulkAction("role", ["agent"])} disabled={isLoading}>
              {isLoading ? 
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </div> : 'Apply Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesPage;
