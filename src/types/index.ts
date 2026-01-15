export type UserRole = 'super_admin' | 'company_admin' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization_id?: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  created_at: string;
}

export interface Employee {
  id: string;
  organization_id: string;
  user_id?: string;
  employee_code: string;
  name: string;
  email: string;
  phone?: string;
  salary: number;
  department?: string;
  designation?: string;
  date_of_joining?: string;
  date_of_birth?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface SalaryBand {
  id: string;
  organization_id: string;
  name: string;
  min_salary: number;
  max_salary: number;
  description?: string;
  created_at: string;
}

export interface Insurer {
  id: string;
  name: string;
  code: string;
  logo_url?: string;
  api_base_url?: string;
  webhook_secret?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Plan {
  id: string;
  insurer_id: string;
  name: string;
  code: string;
  description?: string;
  base_premium: number;
  coverage_amount: number;
  features?: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

export interface BandPlanMapping {
  id: string;
  organization_id: string;
  salary_band_id: string;
  plan_id: string;
  is_default: boolean;
  created_at: string;
}

export interface EmployeePolicySelection {
  id: string;
  employee_id: string;
  plan_id: string;
  policy_number?: string;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  dependents?: Dependent[];
  effective_date?: string;
  created_at: string;
}

export interface Dependent {
  name: string;
  relationship: 'spouse' | 'child' | 'parent';
  date_of_birth: string;
}

export interface PremiumSchedule {
  id: string;
  organization_id: string;
  employee_id: string;
  plan_id: string;
  amount: number;
  month: string;
  year: number;
  status: 'pending' | 'paid' | 'failed';
  payment_session_id?: string;
  payment_url?: string;
  paid_at?: string;
  created_at: string;
}

export interface PaymentSession {
  session_id: string;
  payment_url: string;
  total_amount: number;
  employee_count: number;
  status: 'created' | 'pending' | 'completed' | 'failed';
}

export interface DashboardStats {
  totalEmployees: number;
  activePolices: number;
  pendingPremiums: number;
  totalPremiumAmount: number;
  paidThisMonth: number;
  failedPayments: number;
}
