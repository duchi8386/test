import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { z } from "zod";

interface Project {
  id: string;
  brand_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  year: string | null;
  brands?: { name: string } | null;
}

interface Brand { id: string; name: string }

const schema = z.object({
  title: z.string().trim().min(1, "Tiêu đề là bắt buộc").max(200),
  brand_id: z.string().uuid().optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  year: z.string().trim().max(20).optional().or(z.literal("")),
  image_url: z.string().optional().nullable(),
});

const Projects = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: "", brand_id: "", description: "", year: "", image_url: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [pRes, bRes] = await Promise.all([
      supabase.from("projects").select("*, brands(name)").order("created_at", { ascending: false }),
      supabase.from("brands").select("id, name").order("name"),
    ]);
    setItems((pRes.data as any) ?? []);
    setBrands(bRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", brand_id: "", description: "", year: "", image_url: "" });
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      brand_id: p.brand_id ?? "",
      description: p.description ?? "",
      year: p.year ?? "",
      image_url: p.image_url ?? "",
    });
    setOpen(true);
  };

  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File quá lớn", description: "Tối đa 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `projects/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file);
    if (error) {
      toast({ title: "Upload lỗi", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast({ title: "Upload thành công" });
    }
    setUploading(false);
  };

  const save = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Dữ liệu lỗi", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: parsed.data.title,
      brand_id: parsed.data.brand_id || null,
      description: parsed.data.description || null,
      year: parsed.data.year || null,
      image_url: parsed.data.image_url || null,
    };
    const { error } = editing
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Lỗi lưu", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Đã cập nhật" : "Đã thêm dự án" });
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Xoá dự án này?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast({ title: "Lỗi xoá", description: error.message, variant: "destructive" });
    toast({ title: "Đã xoá" });
    load();
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl mb-2">Dự án</h1>
          <p className="text-foreground/60 text-sm">{items.length} projects</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4" /> Thêm Dự án</Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ảnh</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Năm</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-md">
                    <div className="line-clamp-1">{p.title}</div>
                    <div className="text-xs text-foreground/60 line-clamp-1">{p.description}</div>
                  </TableCell>
                  <TableCell className="text-sm">{p.brands?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm">{p.year ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa dự án" : "Thêm dự án mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <Label>Tiêu đề *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Brand</Label>
                <Select value={form.brand_id} onValueChange={(v) => setForm({ ...form, brand_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Chọn brand" /></SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Năm</Label>
                <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
              </div>
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} maxLength={2000} />
            </div>
            <div>
              <Label>Ảnh dự án (max 5MB)</Label>
              <div className="flex items-center gap-3 mt-2">
                {form.image_url && <img src={form.image_url} alt="" className="w-24 h-16 object-cover rounded" />}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                  <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                    <span>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading ? "Đang tải..." : "Chọn file"}
                    </span>
                  </Button>
                </label>
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

export default Projects;
