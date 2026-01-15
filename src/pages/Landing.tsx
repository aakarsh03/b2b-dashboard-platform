import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, 
  Users, 
  Building2, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2,
  BarChart3,
  Zap,
  Lock
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Multi-Tenant Platform",
    description: "Manage multiple companies seamlessly with isolated data and custom configurations."
  },
  {
    icon: Users,
    title: "Bulk Employee Upload",
    description: "Import employees via CSV. Auto-calculate insurance based on salary bands."
  },
  {
    icon: BarChart3,
    title: "Smart Plan Engine",
    description: "Automatic plan recommendations based on salary bands with upgrade options."
  },
  {
    icon: CreditCard,
    title: "Insurer Payment Gateway",
    description: "Secure redirect to insurer's payment gateway. Real-time status updates."
  },
  {
    icon: Shield,
    title: "Policy Management",
    description: "Track policies, renewals, and claims all in one centralized dashboard."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Role-based access control with separate portals for Admin, HR, and Employees."
  }
];

const stats = [
  { value: "500+", label: "Companies" },
  { value: "50K+", label: "Employees Covered" },
  { value: "₹100Cr+", label: "Premiums Processed" },
  { value: "15+", label: "Insurance Partners" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <span className="text-xl font-bold text-foreground">InsureGate</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/login">
              <Button variant="accent">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.03]" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Automate Insurance Premium Management
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              The Gateway Between{" "}
              <span className="text-gradient-accent">Payroll</span> and{" "}
              <span className="text-gradient-accent">Insurance</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Streamline salary-based insurance premiums for your workforce. 
              Upload employees, auto-assign plans, and process payments—all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button variant="hero" size="xl">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Insurance
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete platform for HR teams to automate insurance premium collection and policy management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How InsureGate Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to automate your company's insurance premium management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Upload Employees", desc: "Import your employee data via CSV with salary information" },
              { step: "02", title: "Configure Bands", desc: "Set up salary bands and map them to insurance plans" },
              { step: "03", title: "Auto-Calculate", desc: "System calculates premiums based on salary and selected plans" },
              { step: "04", title: "Process Payment", desc: "Redirect to insurer payment gateway for secure processing" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-7xl font-bold text-accent/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-12 right-0 w-1/2 border-t-2 border-dashed border-accent/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-primary-foreground mb-6">
              Ready to Streamline Your Insurance Management?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Join hundreds of companies already using InsureGate to automate their premium collections.
            </p>
            <Link to="/login">
              <Button variant="hero" size="xl" className="bg-accent text-accent-foreground">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <span className="font-semibold text-foreground">InsureGate</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2024 InsureGate. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
