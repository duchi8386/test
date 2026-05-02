import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadToCloudinary } from "@/lib/cloudinary";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { z } from "zod";

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
}

const schema = z.object({
  name: z.string().trim().min(1, "Tên thương hiệu là bắt buộc").max(150),
  website_url: z.string().trim().url("URL không hợp lệ").max(500).optional().or(z.literal("")),
  logo_url: z.string().optional().nullable(),
});

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState({ name: "", website_url: "", logo_url: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("brands").select("*").order("name");
    setBrands(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", website_url: "", logo_url: "" });
    setOpen(true);
  };

  const openEdit = (b: Brand) => {
    setEditing(b);
    setForm({ name: b.name, website_url: b.website_url ?? "", logo_url: b.logo_url ?? "" });
    setOpen(true);
  };

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "image", "tika/brands");
      setForm((f) => ({ ...f, logo_url: url }));
      toast({ title: "Upload thành công" });
    } catch (err) {
      toast({ title: "Upload lỗi", description: String(err), variant: "destructive" });
    } finally {
      setUploading(false);
    }
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
      website_url: parsed.data.website_url || null,
      logo_url: parsed.data.logo_url || null,
    };
    const { error } = editing
      ? await supabase.from("brands").update(payload).eq("id", editing.id)
      : await supabase.from("brands").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Lỗi lưu", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Đã cập nhật" : "Đã thêm thương hiệu" });
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Xoá thương hiệu này? Các dự án liên kết sẽ bị bỏ liên kết.")) return;
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) {
      toast({ title: "Lỗi xoá", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Đã xoá" });
    load();
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl mb-2">Thương hiệu</h1>
          <p className="text-foreground/60 text-sm">{brands.length} brands</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4" /> Thêm Brand</Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    {b.logo_url ? (
                      <img src={b.logo_url} alt={b.name} className="w-12 h-12 object-contain bg-muted/30 rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-foreground/40">—</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-sm text-foreground/70 truncate max-w-xs">{b.website_url ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa Brand" : "Thêm Brand mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên thương hiệu *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={150} />
            </div>
            <div>
              <Label>Website URL</Label>
              <Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label>Logo</Label>
              <div className="flex items-center gap-3 mt-2">
                {form.logo_url && <img src={form.logo_url} alt="" className="w-16 h-16 object-contain bg-muted/30 rounded" />}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                  />
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

export default Brands;
