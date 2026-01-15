import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Shield,
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Layers,
  UserCircle,
  BarChart3
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["super_admin", "company_admin", "employee"] },
  { label: "Companies", href: "/dashboard/companies", icon: Building2, roles: ["super_admin"] },
  { label: "Insurers", href: "/dashboard/insurers", icon: Shield, roles: ["super_admin"] },
  { label: "Employees", href: "/dashboard/employees", icon: Users, roles: ["company_admin"] },
  { label: "Salary Bands", href: "/dashboard/salary-bands", icon: Layers, roles: ["company_admin"] },
  { label: "Plan Mapping", href: "/dashboard/plan-mapping", icon: FileText, roles: ["company_admin"] },
  { label: "Premiums", href: "/dashboard/premiums", icon: CreditCard, roles: ["company_admin"] },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["company_admin", "super_admin"] },
  { label: "My Plan", href: "/dashboard/my-plan", icon: Shield, roles: ["employee"] },
  { label: "Profile", href: "/dashboard/profile", icon: UserCircle, roles: ["employee"] },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["super_admin", "company_admin"] },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin": return "Super Admin";
      case "company_admin": return "Company Admin";
      case "employee": return "Employee";
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <span className="font-bold text-foreground">InsureGate</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 w-72 bg-sidebar z-40 transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-sidebar-border">
            <div className="w-11 h-11 rounded-xl bg-sidebar-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-sidebar-primary" />
            </div>
            <div>
              <span className="font-bold text-sidebar-foreground text-lg">InsureGate</span>
              <p className="text-xs text-sidebar-foreground/60">{getRoleLabel(user?.role || '')}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 overflow-y-auto">
            <div className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sidebar-foreground font-semibold">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
