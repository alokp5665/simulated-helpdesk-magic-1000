
import React, { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ChevronDown, 
  MoreVertical, 
  Plus, 
  Search,
  ShieldCheck,
  UserCog,
  UserPlus,
  HeadsetIcon,
  UserRoundCheck,
  Trash2,
  PenLine,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Updated roles data with Indian Hindu names
const rolesData = [
  { 
    id: 1, 
    name: "Aditya Sharma", 
    email: "aditya.sharma@company.com", 
    role: "Admin", 
    department: "IT", 
    status: "Active", 
    lastActive: "Today at 2:34 PM" 
  },
  { 
    id: 2, 
    name: "Priya Patel", 
    email: "priya.patel@company.com", 
    role: "Support Agent", 
    department: "Customer Support", 
    status: "Active", 
    lastActive: "Today at 11:20 AM" 
  },
  { 
    id: 3, 
    name: "Vikram Singh", 
    email: "vikram.singh@company.com", 
    role: "Supervisor", 
    department: "Operations", 
    status: "Inactive", 
    lastActive: "Yesterday at 4:45 PM" 
  },
  { 
    id: 4, 
    name: "Meera Joshi", 
    email: "meera.joshi@company.com", 
    role: "Support Agent", 
    department: "Technical Support", 
    status: "Active", 
    lastActive: "Today at 9:15 AM" 
  },
  { 
    id: 5, 
    name: "Rahul Verma", 
    email: "rahul.verma@company.com", 
    role: "Manager", 
    department: "Sales", 
    status: "Active", 
    lastActive: "Today at 1:30 PM" 
  },
  { 
    id: 6, 
    name: "Kavita Gupta", 
    email: "kavita.gupta@company.com", 
    role: "Support Agent", 
    department: "Customer Success", 
    status: "Active", 
    lastActive: "Today at 10:45 AM" 
  },
  { 
    id: 7, 
    name: "Arjun Reddy", 
    email: "arjun.reddy@company.com", 
    role: "Developer", 
    department: "Engineering", 
    status: "Inactive", 
    lastActive: "3 days ago" 
  },
  { 
    id: 8, 
    name: "Neha Desai", 
    email: "neha.desai@company.com", 
    role: "QA Tester", 
    department: "Quality Assurance", 
    status: "Active", 
    lastActive: "Today at 3:15 PM" 
  },
  { 
    id: 9, 
    name: "Sanjay Mehta", 
    email: "sanjay.mehta@company.com", 
    role: "Product Manager", 
    department: "Product", 
    status: "Active", 
    lastActive: "Today at 12:10 PM" 
  },
  { 
    id: 10, 
    name: "Ananya Iyer", 
    email: "ananya.iyer@company.com", 
    role: "UX Designer", 
    department: "Design", 
    status: "Active", 
    lastActive: "Yesterday at 5:30 PM" 
  }
];

const RolesPage = () => {
  const [roles, setRoles] = useState(rolesData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<(typeof rolesData)[0] | null>(null);
  const [newRole, setNewRole] = useState({
    name: "",
    email: "",
    role: "Support Agent",
    department: "",
    status: "Active"
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = () => {
    if (!newRole.name || !newRole.email || !newRole.department) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const id = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    
    setRoles([
      ...roles, 
      {
        id,
        ...newRole,
        lastActive: "Just now"
      }
    ]);
    
    setIsAddDialogOpen(false);
    setNewRole({
      name: "",
      email: "",
      role: "Support Agent",
      department: "",
      status: "Active"
    });
    
    toast.success("Role Added Successfully", {
      description: `${newRole.name} has been added as a ${newRole.role}.`
    });
  };

  const handleEditRole = () => {
    if (!selectedRole) return;
    
    setRoles(roles.map(role => 
      role.id === selectedRole.id ? selectedRole : role
    ));
    
    setIsEditDialogOpen(false);
    
    toast.success("Role Updated Successfully", {
      description: `${selectedRole.name}'s information has been updated.`
    });
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;
    
    setRoles(roles.filter(role => role.id !== selectedRole.id));
    
    setIsDeleteDialogOpen(false);
    
    toast.success("Role Deleted Successfully", {
      description: `${selectedRole.name} has been removed from the system.`
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <ShieldCheck className="mr-2 h-4 w-4 text-purple-500" />;
      case "Manager":
        return <UserCog className="mr-2 h-4 w-4 text-blue-500" />;
      case "Supervisor":
        return <UserRoundCheck className="mr-2 h-4 w-4 text-green-500" />;
      case "Support Agent":
        return <HeadsetIcon className="mr-2 h-4 w-4 text-amber-500" />;
      default:
        return <UserPlus className="mr-2 h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Role Management</h1>
            
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  className="w-64 pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Role
              </Button>
            </div>
          </div>
          
          <Card className="glass-card hover-scale">
            <CardHeader>
              <CardTitle>Role Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-muted-foreground">{role.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getRoleIcon(role.role)}
                          {role.role}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{role.department}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={role.status === "Active" ? "default" : "secondary"}>
                          {role.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{role.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRole(role);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRole(role);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <PenLine className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRole(role);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Add a new user role to the system. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newRole.email}
                onChange={(e) => setNewRole({ ...newRole, email: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newRole.role}
                onValueChange={(value) => setNewRole({ ...newRole, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Support Agent">Support Agent</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="QA Tester">QA Tester</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="UX Designer">UX Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newRole.department}
                onChange={(e) => setNewRole({ ...newRole, department: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newRole.status}
                onValueChange={(value) => setNewRole({ ...newRole, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Role Dialog */}
      {selectedRole && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Role Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {getRoleIcon(selectedRole.role)}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedRole.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRole.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{selectedRole.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedRole.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedRole.status === "Active" ? "default" : "secondary"}>
                    {selectedRole.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="font-medium">{selectedRole.lastActive}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Role Dialog */}
      {selectedRole && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update the user role information. Make changes to the fields below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={selectedRole.name}
                  onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedRole.email}
                  onChange={(e) => setSelectedRole({ ...selectedRole, email: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={selectedRole.role}
                  onValueChange={(value) => setSelectedRole({ ...selectedRole, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Support Agent">Support Agent</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="QA Tester">QA Tester</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={selectedRole.department}
                  onChange={(e) => setSelectedRole({ ...selectedRole, department: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedRole.status}
                  onValueChange={(value) => setSelectedRole({ ...selectedRole, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditRole}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Role Dialog */}
      {selectedRole && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the role
                assigned to {selectedRole.name} and remove their access from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default RolesPage;
