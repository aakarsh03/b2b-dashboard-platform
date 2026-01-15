import { useState } from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon, Shield, Layers, AlertCircle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SalaryBand, Plan, BandPlanMapping } from "@/types";

// Sample plans - in production, these would come from the database
const samplePlans: Plan[] = [
  {
    id: 'plan-1',
    insurer_id: 'ins-1',
    name: 'Basic Health Cover',
    code: 'BHC-100',
    description: 'Essential health coverage for individuals',
    base_premium: 5000,
    coverage_amount: 300000,
    features: ['Hospitalization', 'Day Care', 'Pre/Post Hospitalization'],
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'plan-2',
    insurer_id: 'ins-1',
    name: 'Standard Health Cover',
    code: 'SHC-200',
    description: 'Comprehensive health coverage with added benefits',
    base_premium: 8000,
    coverage_amount: 500000,
    features: ['Hospitalization', 'Day Care', 'Pre/Post Hospitalization', 'Maternity', 'OPD'],
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'plan-3',
    insurer_id: 'ins-1',
    name: 'Premium Health Cover',
    code: 'PHC-300',
    description: 'Premium coverage with global benefits',
    base_premium: 15000,
    coverage_amount: 1000000,
    features: ['Hospitalization', 'Day Care', 'Pre/Post Hospitalization', 'Maternity', 'OPD', 'International Coverage', 'Wellness Benefits'],
    status: 'active',
    created_at: new Date().toISOString(),
  },
];

export default function PlanMapping() {
  // In production, these would come from context/API
  const [salaryBands] = useState<SalaryBand[]>([]);
  const [mappings, setMappings] = useState<BandPlanMapping[]>([]);
  const [selectedMappings, setSelectedMappings] = useState<Record<string, string>>({});

  const handlePlanSelect = (bandId: string, planId: string) => {
    setSelectedMappings(prev => ({ ...prev, [bandId]: planId }));
  };

  const saveMappings = () => {
    const newMappings: BandPlanMapping[] = Object.entries(selectedMappings).map(([bandId, planId]) => ({
      id: `mapping-${Date.now()}-${bandId}`,
      organization_id: 'org-1',
      salary_band_id: bandId,
      plan_id: planId,
      is_default: true,
      created_at: new Date().toISOString(),
    }));

    setMappings(newMappings);
    toast.success("Plan mappings saved successfully");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMappedPlan = (bandId: string) => {
    const mapping = mappings.find(m => m.salary_band_id === bandId);
    if (mapping) {
      return samplePlans.find(p => p.id === mapping.plan_id);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plan Mapping</h1>
          <p className="text-muted-foreground mt-1">
            Map insurance plans to salary bands for auto-assignment
          </p>
        </div>
        {salaryBands.length > 0 && Object.keys(selectedMappings).length > 0 && (
          <Button variant="accent" onClick={saveMappings}>
            <Check className="w-4 h-4 mr-2" />
            Save Mappings
          </Button>
        )}
      </motion.div>

      {salaryBands.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Layers className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No salary bands configured</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You need to create salary bands before you can map insurance plans to them.
              </p>
              <a href="/dashboard/salary-bands">
                <Button variant="accent">
                  <Layers className="w-4 h-4 mr-2" />
                  Create Salary Bands
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Available Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Insurance Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {samplePlans.map((plan) => (
                  <div key={plan.id} className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-accent" />
                      </div>
                      <Badge variant="secondary">{plan.code}</Badge>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coverage:</span>
                        <span className="font-medium text-foreground">{formatCurrency(plan.coverage_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Premium:</span>
                        <span className="font-medium text-foreground">{formatCurrency(plan.base_premium)}/month</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mapping Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-accent" />
                Band to Plan Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salaryBands.map((band) => {
                  const mappedPlan = getMappedPlan(band.id);
                  return (
                    <div key={band.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{band.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(band.min_salary)} - {formatCurrency(band.max_salary)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-64">
                          <Label className="text-xs text-muted-foreground mb-1 block">Assign Plan</Label>
                          <Select
                            value={selectedMappings[band.id] || mappedPlan?.id || ""}
                            onValueChange={(value) => handlePlanSelect(band.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {samplePlans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  {plan.name} ({formatCurrency(plan.base_premium)}/mo)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {mappedPlan && (
                          <Badge variant="default" className="bg-success text-success-foreground">
                            <Check className="w-3 h-3 mr-1" />
                            Mapped
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">How Plan Mapping Works</p>
              <p className="text-sm text-muted-foreground mt-1">
                Once mapped, employees within a salary band will automatically be assigned the corresponding insurance plan. 
                They can later upgrade or downgrade within allowed options from their portal.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
