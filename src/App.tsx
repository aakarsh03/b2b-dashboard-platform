import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import Employees from "./pages/dashboard/Employees";
import SalaryBands from "./pages/dashboard/SalaryBands";
import PlanMapping from "./pages/dashboard/PlanMapping";
import Premiums from "./pages/dashboard/Premiums";
import Reports from "./pages/dashboard/Reports";
import Companies from "./pages/dashboard/Companies";
import Insurers from "./pages/dashboard/Insurers";
import EmployeePortal from "./pages/dashboard/EmployeePortal";
import Settings from "./pages/dashboard/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardHome />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Super Admin Routes */}
            <Route
              path="/dashboard/companies"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <DashboardLayout>
                    <Companies />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/insurers"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <DashboardLayout>
                    <Insurers />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Company Admin Routes */}
            <Route
              path="/dashboard/employees"
              element={
                <ProtectedRoute allowedRoles={['company_admin']}>
                  <DashboardLayout>
                    <Employees />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/salary-bands"
              element={
                <ProtectedRoute allowedRoles={['company_admin']}>
                  <DashboardLayout>
                    <SalaryBands />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/plan-mapping"
              element={
                <ProtectedRoute allowedRoles={['company_admin']}>
                  <DashboardLayout>
                    <PlanMapping />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/premiums"
              element={
                <ProtectedRoute allowedRoles={['company_admin']}>
                  <DashboardLayout>
                    <Premiums />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/dashboard/my-plan"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <DashboardLayout>
                    <EmployeePortal />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Shared Routes */}
            <Route
              path="/dashboard/reports"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'company_admin']}>
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'company_admin']}>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
