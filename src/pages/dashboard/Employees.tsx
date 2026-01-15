import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { 
  Users, 
  Upload, 
  Download, 
  Search, 
  MoreHorizontal,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Employee } from "@/types";

interface CSVEmployee {
  employee_code: string;
  name: string;
  email: string;
  phone?: string;
  salary: string;
  department?: string;
  designation?: string;
  date_of_joining?: string;
  date_of_birth?: string;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<CSVEmployee[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsUploading(true);

    Papa.parse<CSVEmployee>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error("Error parsing CSV file");
          setIsUploading(false);
          return;
        }

        // Validate required fields
        const validRows = results.data.filter(row => 
          row.employee_code && row.name && row.email && row.salary
        );

        if (validRows.length === 0) {
          toast.error("No valid rows found. Ensure CSV has: employee_code, name, email, salary");
          setIsUploading(false);
          return;
        }

        setUploadPreview(validRows);
        setIsUploading(false);
      },
      error: () => {
        toast.error("Failed to read CSV file");
        setIsUploading(false);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmUpload = () => {
    if (!uploadPreview) return;

    const newEmployees: Employee[] = uploadPreview.map((row, index) => ({
      id: `emp-${Date.now()}-${index}`,
      organization_id: 'org-1',
      employee_code: row.employee_code,
      name: row.name,
      email: row.email,
      phone: row.phone,
      salary: parseFloat(row.salary) || 0,
      department: row.department,
      designation: row.designation,
      date_of_joining: row.date_of_joining,
      date_of_birth: row.date_of_birth,
      status: 'active',
      created_at: new Date().toISOString(),
    }));

    setEmployees(prev => [...prev, ...newEmployees]);
    setUploadPreview(null);
    toast.success(`Successfully imported ${newEmployees.length} employees`);
  };

  const downloadTemplate = () => {
    const template = "employee_code,name,email,phone,salary,department,designation,date_of_joining,date_of_birth\nEMP001,John Doe,john@company.com,9876543210,50000,Engineering,Software Engineer,2024-01-15,1990-05-20";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your employee data
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button variant="accent" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </motion.div>

      {/* Upload Preview Modal */}
      {uploadPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Preview Import</CardTitle>
                  <p className="text-sm text-muted-foreground">{uploadPreview.length} employees found</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setUploadPreview(null)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadPreview.slice(0, 10).map((emp, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-sm">{emp.employee_code}</TableCell>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{formatCurrency(parseFloat(emp.salary) || 0)}</TableCell>
                        <TableCell>{emp.department || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {uploadPreview.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center py-3">
                    ...and {uploadPreview.length - 10} more employees
                  </p>
                )}
              </div>
              <div className="p-4 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => setUploadPreview(null)}>Cancel</Button>
                <Button variant="accent" onClick={confirmUpload}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Employee Table */}
      <Card>
        <CardContent className="p-0">
          {employees.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No employees uploaded yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Upload a CSV file to import your employee data. Each employee needs: 
                employee_code, name, email, and salary.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
                <Button variant="accent" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="font-semibold text-accent">
                              {employee.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{employee.employee_code}</TableCell>
                      <TableCell>{employee.department || '-'}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(employee.salary)}</TableCell>
                      <TableCell>
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign Plan</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">CSV Upload Requirements</p>
          <p className="text-sm text-muted-foreground mt-1">
            Required columns: <code className="px-1 py-0.5 rounded bg-muted text-xs">employee_code</code>,{" "}
            <code className="px-1 py-0.5 rounded bg-muted text-xs">name</code>,{" "}
            <code className="px-1 py-0.5 rounded bg-muted text-xs">email</code>,{" "}
            <code className="px-1 py-0.5 rounded bg-muted text-xs">salary</code>. 
            Optional: phone, department, designation, date_of_joining, date_of_birth.
          </p>
        </div>
      </div>
    </div>
  );
}
