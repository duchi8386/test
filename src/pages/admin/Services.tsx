import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Sparkles, Camera, Video, Megaphone, Search, BarChart3, Users, Star, Heart, Zap, Award, Target, Briefcase } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { z } from "zod";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price_range: string | null;
  icon: string | null;
  sort_order: number | null;
}

const ICON_CHOICES = [
  "Sparkles", "Camera", "Video", "Megaphone", "Search", "BarChart3",
  "Users", "Star", "Heart", "Zap", "Award", "Target", "Briefcase",
  "TrendingUp", "Mic", "PenTool", "Image", "Film", "ShoppingBag", "Globe",
];

const getIcon = (name: string | null | undefined): LucideIcon => {
  if (!name) return Sparkles;
  const Comp = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Comp ?? Sparkles;
};

const schema = z.object({
  name: z.string().trim().min(1, "Tên dịch vụ là bắt buộc").max(150),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  price_range: z.string().trim().max(150).optional().or(z.literal("")),
  icon: z.string().trim().min(1).max(50),
  sort_order: z.number().int().min(0).max(9999),
});

const Services = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price_range: "", icon: "Sparkles", sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", price_range: "", icon: "Sparkles", sort_order: items.length });
    setOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description ?? "",
      price_range: s.price_range ?? "",
      icon: s.icon ?? "Sparkles",
      sort_order: s.sort_order ?? 0,
    });
    setOpen(true);
  };

  const save = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Dữ liệu lỗi", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price_range: parsed.data.price_range || null,
      icon: parsed.data.icon,
      sort_order: parsed.data.sort_order,
    };
    const { error } = editing
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Đã cập nhật" : "Đã thêm dịch vụ" });
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Xoá dịch vụ này?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast({ title: "Lỗi xoá", description: error.message, variant: "destructive" });
    toast({ title: "Đã xoá" });
    load();
  };

  const SelectedIcon = getIcon(form.icon);

  return (
    <AdminLayout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl mb-2">Dịch vụ</h1>
          <p className="text-foreground/60 text-sm">{items.length} services · Hiển thị trên trang chủ theo thứ tự sắp xếp</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4" /> Thêm Service</Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Khoảng giá</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="text-foreground/50 text-sm">{s.sort_order ?? 0}</TableCell>
                    <TableCell>
                      <div className="w-9 h-9 border border-primary/40 flex items-center justify-center text-primary">
                        <Icon className="w-4 h-4" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="max-w-md text-sm text-foreground/70">
                      <div className="line-clamp-2">{s.description ?? "—"}</div>
                    </TableCell>
                    <TableCell className="text-sm">{s.price_range ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên dịch vụ *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={150} placeholder="Chụp ảnh sản phẩm" />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} maxLength={1000} placeholder="Mô tả ngắn gọn dịch vụ..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Khoảng giá</Label>
                <Input value={form.price_range} onChange={(e) => setForm({ ...form, price_range: e.target.value })} placeholder="Từ 5 triệu" />
              </div>
              <div>
                <Label>Thứ tự hiển thị</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2">
                Icon
                <span className="text-foreground/50 text-xs">(đang chọn:</span>
                <SelectedIcon className="w-4 h-4 text-primary" />
                <span className="text-foreground/50 text-xs">{form.icon})</span>
              </Label>
              <div className="grid grid-cols-10 gap-2 p-2 border border-border rounded">
                {ICON_CHOICES.map((iconName) => {
                  const Icon = getIcon(iconName);
                  const active = form.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setForm({ ...form, icon: iconName })}
                      title={iconName}
                      className={`aspect-square flex items-center justify-center border transition-all ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 text-foreground/60"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Services;
