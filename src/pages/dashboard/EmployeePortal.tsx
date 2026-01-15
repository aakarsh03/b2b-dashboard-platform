import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Shield, 
  CreditCard, 
  Users, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Dependent } from "@/types";

export default function EmployeePortal() {
  const { user } = useAuth();
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [isAddingDependent, setIsAddingDependent] = useState(false);
  const [dependentForm, setDependentForm] = useState({
    name: "",
    relationship: "",
    date_of_birth: "",
  });

  // Mock data - in production this would come from API
  const currentPlan = null; // No plan assigned yet
  const premiumStatus = null;

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dependentForm.name || !dependentForm.relationship || !dependentForm.date_of_birth) {
      toast.error("Please fill in all fields");
      return;
    }

    const newDependent: Dependent = {
      name: dependentForm.name,
      relationship: dependentForm.relationship as Dependent['relationship'],
      date_of_birth: dependentForm.date_of_birth,
    };

    setDependents(prev => [...prev, newDependent]);
    setIsAddingDependent(false);
    setDependentForm({ name: "", relationship: "", date_of_birth: "" });
    toast.success("Dependent added successfully");
  };

  const removeDependent = (index: number) => {
    setDependents(prev => prev.filter((_, i) => i !== index));
    toast.success("Dependent removed");
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground">My Insurance Plan</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your insurance coverage
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentPlan ? (
                <div className="space-y-4">
                  {/* Plan details would go here */}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Plan Assigned</h3>
                  <p className="text-sm text-muted-foreground">
                    Your HR team will assign an insurance plan based on your salary band.
                    Please contact HR if you have questions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Premium Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-accent" />
                Premium Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {premiumStatus ? (
                <div className="space-y-4">
                  {/* Premium details would go here */}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Premium Due</h3>
                  <p className="text-sm text-muted-foreground">
                    Premium information will appear here once you have an active plan.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dependents Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Dependents
            </CardTitle>
            <Dialog open={isAddingDependent} onOpenChange={setIsAddingDependent}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Dependent
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Dependent</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddDependent} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="dep-name">Full Name *</Label>
                    <Input
                      id="dep-name"
                      placeholder="Enter full name"
                      value={dependentForm.name}
                      onChange={(e) => setDependentForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dep-relationship">Relationship *</Label>
                    <Select 
                      value={dependentForm.relationship} 
                      onValueChange={(value) => setDependentForm(prev => ({ ...prev, relationship: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dep-dob">Date of Birth *</Label>
                    <Input
                      id="dep-dob"
                      type="date"
                      value={dependentForm.date_of_birth}
                      onChange={(e) => setDependentForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddingDependent(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="accent">
                      Add Dependent
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {dependents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No dependents added yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add family members to include them in your insurance coverage
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dependents.map((dependent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="font-semibold text-accent">
                          {dependent.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{dependent.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {dependent.relationship} • {new Date(dependent.date_of_birth).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeDependent(index)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Need to change your plan?</p>
            <p className="text-sm text-muted-foreground mt-1">
              If you'd like to upgrade or change your insurance plan, please contact your HR department. 
              Plan changes are subject to eligibility based on your salary band.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
