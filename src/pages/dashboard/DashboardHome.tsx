import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  Users, 
  Shield, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface StatCard {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export default function DashboardHome() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Different dashboard views based on role
  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard greeting={getGreeting()} userName={user.name} />;
  }
  
  if (user?.role === 'company_admin') {
    return <CompanyAdminDashboard greeting={getGreeting()} userName={user.name} />;
  }

  return <EmployeeDashboard greeting={getGreeting()} userName={user?.name || ''} />;
}

function SuperAdminDashboard({ greeting, userName }: { greeting: string; userName: string }) {
  const stats: StatCard[] = [
    { title: "Total Companies", value: "0", icon: Building2 },
    { title: "Total Employees", value: "0", icon: Users },
    { title: "Active Insurers", value: "0", icon: Shield },
    { title: "Premiums This Month", value: "₹0", icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of the platform activity
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/companies">
            <Button variant="accent">
              <Building2 className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No companies registered yet</p>
              <Link to="/dashboard/companies">
                <Button variant="link" className="mt-2">Add your first company</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/10">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-foreground">All systems operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">0 Insurers connected</span>
                </div>
                <Link to="/dashboard/insurers">
                  <Button variant="ghost" size="sm">
                    Configure <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CompanyAdminDashboard({ greeting, userName }: { greeting: string; userName: string }) {
  const stats: StatCard[] = [
    { title: "Total Employees", value: "0", icon: Users },
    { title: "Active Policies", value: "0", icon: Shield },
    { title: "Pending Premiums", value: "₹0", icon: CreditCard },
    { title: "Paid This Month", value: "₹0", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's insurance premiums
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/employees">
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Upload Employees
            </Button>
          </Link>
          <Link to="/dashboard/premiums">
            <Button variant="accent">
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Premiums
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Employees</CardTitle>
            <Link to="/dashboard/employees">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No employees uploaded yet</p>
              <Link to="/dashboard/employees">
                <Button variant="link" className="mt-2">Upload employees via CSV</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/dashboard/salary-bands" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Configure Salary Bands</p>
                    <p className="text-sm text-muted-foreground">Set up salary ranges for plans</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
            <Link to="/dashboard/plan-mapping" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Map Plans to Bands</p>
                    <p className="text-sm text-muted-foreground">Link insurance plans to salary bands</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmployeeDashboard({ greeting, userName }: { greeting: string; userName: string }) {
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground">
          {greeting}, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage your insurance coverage
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Your Insurance Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="mb-2">No plan assigned yet</p>
                <p className="text-sm">Your HR will assign a plan based on your salary band</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="mb-2">No premium scheduled</p>
                <p className="text-sm">Premium details will appear once you have an active plan</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Contact your HR department</p>
                <p className="text-sm text-muted-foreground mt-1">
                  If you have questions about your insurance coverage, salary band, or premium payments, 
                  please reach out to your company's HR team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
