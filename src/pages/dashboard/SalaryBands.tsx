import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Layers, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { SalaryBand } from "@/types";

export default function SalaryBands() {
  const [bands, setBands] = useState<SalaryBand[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBand, setEditingBand] = useState<SalaryBand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    min_salary: "",
    max_salary: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({ name: "", min_salary: "", max_salary: "", description: "" });
    setEditingBand(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const minSalary = parseFloat(formData.min_salary);
    const maxSalary = parseFloat(formData.max_salary);

    if (!formData.name || isNaN(minSalary) || isNaN(maxSalary)) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (minSalary >= maxSalary) {
      toast.error("Maximum salary must be greater than minimum salary");
      return;
    }

    // Check for overlapping bands
    const hasOverlap = bands.some(band => {
      if (editingBand && band.id === editingBand.id) return false;
      return (minSalary <= band.max_salary && maxSalary >= band.min_salary);
    });

    if (hasOverlap) {
      toast.error("This salary range overlaps with an existing band");
      return;
    }

    if (editingBand) {
      setBands(prev => prev.map(b => 
        b.id === editingBand.id 
          ? { ...b, name: formData.name, min_salary: minSalary, max_salary: maxSalary, description: formData.description }
          : b
      ));
      toast.success("Salary band updated successfully");
    } else {
      const newBand: SalaryBand = {
        id: `band-${Date.now()}`,
        organization_id: 'org-1',
        name: formData.name,
        min_salary: minSalary,
        max_salary: maxSalary,
        description: formData.description,
        created_at: new Date().toISOString(),
      };
      setBands(prev => [...prev, newBand].sort((a, b) => a.min_salary - b.min_salary));
      toast.success("Salary band created successfully");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (band: SalaryBand) => {
    setEditingBand(band);
    setFormData({
      name: band.name,
      min_salary: band.min_salary.toString(),
      max_salary: band.max_salary.toString(),
      description: band.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (bandId: string) => {
    setBands(prev => prev.filter(b => b.id !== bandId));
    toast.success("Salary band deleted");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Salary Bands</h1>
          <p className="text-muted-foreground mt-1">
            Define salary ranges to auto-assign insurance plans
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="accent">
              <Plus className="w-4 h-4 mr-2" />
              Add Salary Band
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBand ? "Edit Salary Band" : "Create Salary Band"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Band Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Entry Level, Mid Level, Senior"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_salary">Min Salary (₹) *</Label>
                  <Input
                    id="min_salary"
                    type="number"
                    placeholder="e.g., 300000"
                    value={formData.min_salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_salary: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_salary">Max Salary (₹) *</Label>
                  <Input
                    id="max_salary"
                    type="number"
                    placeholder="e.g., 600000"
                    value={formData.max_salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_salary: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description of this band"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" variant="accent">
                  {editingBand ? "Update Band" : "Create Band"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Card>
        <CardContent className="p-0">
          {bands.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No salary bands configured</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create salary bands to automatically assign insurance plans based on employee salary ranges.
              </p>
              <Button variant="accent" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Band
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Band Name</TableHead>
                    <TableHead>Salary Range</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bands.map((band) => (
                    <TableRow key={band.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-accent" />
                          </div>
                          <span className="font-medium text-foreground">{band.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {formatCurrency(band.min_salary)} - {formatCurrency(band.max_salary)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {band.description || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(band)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(band.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {bands.length > 0 && (
        <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Next Step: Map Plans</p>
            <p className="text-sm text-muted-foreground mt-1">
              After creating salary bands, go to{" "}
              <a href="/dashboard/plan-mapping" className="text-accent hover:underline">Plan Mapping</a>{" "}
              to assign insurance plans to each band.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
