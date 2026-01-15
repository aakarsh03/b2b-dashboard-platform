import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Calendar, 
  Users, 
  ExternalLink, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PremiumSchedule } from "@/types";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Premiums() {
  const [premiums] = useState<PremiumSchedule[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear] = useState(new Date().getFullYear());
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePremiums = async () => {
    setIsCalculating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCalculating(false);
    toast.info("No employees with assigned plans found. Upload employees and configure plan mappings first.");
  };

  const initiatePayment = async () => {
    toast.info("No pending premiums to process. Calculate premiums first.");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success text-success-foreground"><CheckCircle2 className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const pendingPremiums = premiums.filter(p => p.status === 'pending');
  const totalPending = pendingPremiums.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Premium Management</h1>
          <p className="text-muted-foreground mt-1">
            Calculate and process monthly insurance premiums
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={calculatePremiums} disabled={isCalculating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected Period</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {selectedMonth} {selectedYear}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Employees</p>
                <p className="text-2xl font-bold text-foreground mt-1">{pendingPremiums.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalPending)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Action */}
      {pendingPremiums.length > 0 && (
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Ready to Process Payment</h3>
                <p className="text-muted-foreground">
                  {pendingPremiums.length} employees with total premium of {formatCurrency(totalPending)}
                </p>
              </div>
              <Button variant="accent" size="lg" onClick={initiatePayment}>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premiums Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Premium Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {premiums.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No premiums calculated</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Click "Calculate" to generate premium schedules for the selected month based on employee data and plan mappings.
              </p>
              <Button variant="outline" onClick={calculatePremiums} disabled={isCalculating}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
                Calculate Premiums
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Policy No.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {premiums.map((premium) => (
                    <TableRow key={premium.id}>
                      <TableCell>
                        <span className="font-medium">{premium.employee_id}</span>
                      </TableCell>
                      <TableCell>{premium.plan_id}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(premium.amount)}</TableCell>
                      <TableCell>{getStatusBadge(premium.status)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {premium.payment_session_id || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">Payment Flow</p>
          <p className="text-sm text-muted-foreground mt-1">
            When you click "Pay Now", you'll be redirected to the insurer's secure payment gateway. 
            After successful payment, policy numbers and status will be updated automatically via webhook.
          </p>
        </div>
      </div>
    </div>
  );
}
