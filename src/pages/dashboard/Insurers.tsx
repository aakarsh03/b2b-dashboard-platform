import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Shield, Settings, MoreHorizontal, Search, Link2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Insurer } from "@/types";

export default function Insurers() {
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    api_base_url: "",
    webhook_secret: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code) {
      toast.error("Insurer name and code are required");
      return;
    }

    const newInsurer: Insurer = {
      id: `ins-${Date.now()}`,
      name: formData.name,
      code: formData.code.toUpperCase(),
      api_base_url: formData.api_base_url,
      webhook_secret: formData.webhook_secret,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setInsurers(prev => [...prev, newInsurer]);
    setIsDialogOpen(false);
    setFormData({ name: "", code: "", api_base_url: "", webhook_secret: "" });
    toast.success("Insurer added successfully");
  };

  const filteredInsurers = insurers.filter(insurer =>
    insurer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insurer.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Insurers</h1>
          <p className="text-muted-foreground mt-1">
            Manage insurance partners and their API integrations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="accent">
              <Plus className="w-4 h-4 mr-2" />
              Add Insurer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Insurance Partner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Insurer Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., ICICI Lombard"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Insurer Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., ICICI"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_url">API Base URL</Label>
                <Input
                  id="api_url"
                  placeholder="https://api.insurer.com/v1"
                  value={formData.api_base_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, api_base_url: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook_secret">Webhook Secret</Label>
                <Input
                  id="webhook_secret"
                  type="password"
                  placeholder="Enter webhook secret"
                  value={formData.webhook_secret}
                  onChange={(e) => setFormData(prev => ({ ...prev, webhook_secret: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="accent">
                  Add Insurer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search insurers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Insurers Grid */}
      {insurers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No insurers configured</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Add insurance partners to enable plan offerings and payment integrations.
              </p>
              <Button variant="accent" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Insurer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInsurers.map((insurer) => (
            <motion.div
              key={insurer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-accent" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                        <DropdownMenuItem>Manage Plans</DropdownMenuItem>
                        <DropdownMenuItem>Test Connection</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{insurer.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono mb-4">{insurer.code}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {insurer.api_base_url ? (
                        <>
                          <Link2 className="w-4 h-4 text-success" />
                          <span>API Connected</span>
                        </>
                      ) : (
                        <>
                          <Settings className="w-4 h-4" />
                          <span>Not configured</span>
                        </>
                      )}
                    </div>
                    <Badge 
                      variant={insurer.status === 'active' ? 'default' : 'secondary'}
                      className={insurer.status === 'active' ? 'bg-success text-success-foreground' : ''}
                    >
                      {insurer.status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {insurer.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
