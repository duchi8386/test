import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, FolderKanban, Wrench, Building2, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Stats {
  leads: number;
  newLeads: number;
  projects: number;
  services: number;
  brands: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ leads: 0, newLeads: 0, projects: 0, services: 0, brands: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [leadsRes, newLeadsRes, projectsRes, servicesRes, brandsRes, recentRes] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "Mới"),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("brands").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        leads: leadsRes.count ?? 0,
        newLeads: newLeadsRes.count ?? 0,
        projects: projectsRes.count ?? 0,
        services: servicesRes.count ?? 0,
        brands: brandsRes.count ?? 0,
      });
      setRecentLeads(recentRes.data ?? []);
    })();
  }, []);

  const cards = [
    { label: "Tổng Leads", value: stats.leads, sub: `${stats.newLeads} mới`, icon: Users, color: "text-blue-500" },
    { label: "Projects", value: stats.projects, sub: "đã thực hiện", icon: FolderKanban, color: "text-primary" },
    { label: "Services", value: stats.services, sub: "đang cung cấp", icon: Wrench, color: "text-emerald-500" },
    { label: "Brands", value: stats.brands, sub: "đối tác", icon: Building2, color: "text-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-2">Tổng quan</h1>
        <p className="text-foreground/60 text-sm">Thống kê dữ liệu hoạt động của TIKA Network</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="text-xs uppercase tracking-widest text-foreground/60">{label}</div>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-3xl font-semibold mb-1">{value}</div>
            <div className="text-xs text-foreground/50">{sub}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Leads gần đây</h2>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-foreground/50 py-8 text-center">Chưa có lead nào.</p>
        ) : (
          <div className="space-y-2">
            {recentLeads.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-3 bg-muted/30 rounded text-sm">
                <div>
                  <div className="font-medium">{l.full_name}</div>
                  <div className="text-xs text-foreground/60">{l.email} · {l.phone}</div>
                </div>
                <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{l.status}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
