import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trash2, Loader2 } from "lucide-react";

type LeadStatus = "Mới" | "Đang xử lý" | "Hoàn thành";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  status: LeadStatus;
  created_at: string;
}

const STATUSES: LeadStatus[] = ["Mới", "Đang xử lý", "Hoàn thành"];

const statusColor: Record<LeadStatus, string> = {
  "Mới": "bg-blue-500/10 text-blue-600",
  "Đang xử lý": "bg-amber-500/10 text-amber-600",
  "Hoàn thành": "bg-emerald-500/10 text-emerald-600",
};

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Lỗi tải leads", description: error.message, variant: "destructive" });
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: LeadStatus) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Lỗi cập nhật", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    toast({ title: "Đã cập nhật trạng thái" });
  };

  const remove = async (id: string) => {
    if (!confirm("Xoá lead này?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast({ title: "Lỗi xoá", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast({ title: "Đã xoá lead" });
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <AdminLayout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl mb-2">Quản lý Leads</h1>
          <p className="text-foreground/60 text-sm">{leads.length} yêu cầu tư vấn</p>
        </div>
        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-foreground/50 text-sm">Không có lead nào.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.full_name}</TableCell>
                  <TableCell className="text-sm">
                    <div>{l.email}</div>
                    <div className="text-foreground/60">{l.phone}</div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm line-clamp-2">{l.message}</div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground/60 whitespace-nowrap">
                    {new Date(l.created_at).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Select value={l.status} onValueChange={(v: LeadStatus) => updateStatus(l.id, v)}>
                      <SelectTrigger className={`w-36 h-8 text-xs ${statusColor[l.status]} border-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => remove(l.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </AdminLayout>
  );
};

export default Leads;
