import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadToCloudinary } from "@/lib/cloudinary";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  Plus, Pencil, Trash2, Loader2, Sparkles, Camera, Video,
  Megaphone, Search, BarChart3, Users, Star, Heart, Zap,
  Award, Target, Briefcase, Upload, X, Images,
} from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { z } from "zod";

/* ─── Types ──────────────────────────────────────────────────────── */

interface Service {
  id: string;
  name: string;
  description: string | null;
  price_range: string | null;
  icon: string | null;
  sort_order: number | null;
}

interface ServiceMedia {
  id: string;
  service_id: string;
  type: string;
  url: string;
  thumbnail_url: string | null;
  label: string | null;
  handle: string | null;
  sort_order: number;
}

/* ─── Constants ──────────────────────────────────────────────────── */

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

/* ─── Image resize to 9:16 ───────────────────────────────────────── */

async function resizeImageTo916(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const TARGET_W = 720;
      const TARGET_H = 1280;
      const targetRatio = TARGET_W / TARGET_H; // 9/16
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      const srcRatio = sw / sh;
      if (srcRatio > targetRatio) {
        sw = Math.round(sh * targetRatio);
        sx = Math.round((img.naturalWidth - sw) / 2);
      } else {
        sh = Math.round(sw / targetRatio);
        sy = Math.round((img.naturalHeight - sh) / 2);
      }
      const canvas = document.createElement("canvas");
      canvas.width = TARGET_W;
      canvas.height = TARGET_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TARGET_W, TARGET_H);
      canvas.toBlob(
        (blob) => { if (blob) resolve(blob); else reject(new Error("toBlob failed")); },
        "image/jpeg",
        0.88,
      );
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

/* ─── MediaManagerDialog ─────────────────────────────────────────── */

function MediaManagerDialog({
  service,
  open,
  onClose,
}: {
  service: Service;
  open: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<ServiceMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [handleInput, setHandleInput] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("service_media")
      .select("*")
      .eq("service_id", service.id)
      .order("sort_order", { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      loadMedia();
      setLabelInput("");
      setHandleInput("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, service.id]);

  const uploadFile = async (file: File, type: "image" | "video") => {
    setUploading(true);
    try {
      let blob: Blob = file;

      if (type === "image") {
        toast({ title: "Đang resize ảnh về 9:16…" });
        blob = await resizeImageTo916(file);
      }

      const cloudinaryType = type === "video" ? "video" : "image";
      const url = await uploadToCloudinary(blob, cloudinaryType, "tika/services");

      const { error: insertError } = await supabase.from("service_media").insert({
        service_id: service.id,
        type,
        url,
        label: labelInput.trim() || null,
        handle: handleInput.trim() || null,
        sort_order: items.length,
      });

      if (insertError) {
        toast({ title: "Lỗi lưu media", description: insertError.message, variant: "destructive" });
      } else {
        toast({ title: type === "image" ? "Đã thêm ảnh (720×1280)" : "Đã thêm video" });
        setLabelInput("");
        setHandleInput("");
        await loadMedia();
      }
    } catch (err) {
      toast({ title: "Lỗi xử lý file", description: String(err), variant: "destructive" });
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const removeItem = async (item: ServiceMedia) => {
    if (!confirm("Xoá media này?")) return;
    const { error } = await supabase.from("service_media").delete().eq("id", item.id);
    if (error) {
      toast({ title: "Lỗi xoá", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Đã xoá" });
      await loadMedia();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Images className="w-5 h-5 text-primary" />
            Media — {service.name}
          </DialogTitle>
        </DialogHeader>

        {/* Upload controls */}
        <div className="space-y-3 border border-border rounded-lg p-4 bg-muted/20">
          <p className="text-sm font-medium text-foreground">Thêm media mới</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1 block">Tên / Caption</Label>
              <Input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Ví dụ: Minh Tú"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Handle</Label>
              <Input
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="@tika.network"
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "image")}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "video")}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
              Thêm ảnh (9:16)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Video className="w-4 h-4 mr-1" />}
              Thêm video
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Ảnh sẽ tự động crop &amp; resize về tỷ lệ 9:16 (720×1280px). Video upload nguyên bản.
          </p>
        </div>

        {/* Media grid */}
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-10">
            Chưa có media nào. Hãy thêm ảnh hoặc video bên trên.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                <div className="aspect-[9/16] rounded-lg overflow-hidden bg-muted border border-border/40">
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.label ?? ""}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Hover overlay with delete */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeItem(item)}
                      className="w-9 h-9 rounded-full bg-destructive flex items-center justify-center text-white hover:bg-destructive/80 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Type badge */}
                  <span className="absolute top-1.5 left-1.5 text-[9px] uppercase font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">
                    {item.type === "video" ? "video" : "ảnh"}
                  </span>
                </div>
                <div className="mt-1 px-0.5 space-y-0.5">
                  {item.label && (
                    <p className="text-xs font-medium truncate leading-tight">{item.label}</p>
                  )}
                  {item.handle && (
                    <p className="text-xs text-muted-foreground truncate leading-tight">{item.handle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Services (main admin page) ─────────────────────────────────── */

const Services = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price_range: "", icon: "Sparkles", sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<Service | null>(null);

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
    if (!confirm("Xoá dịch vụ này? Media liên quan cũng sẽ bị xoá.")) return;
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
          <p className="text-foreground/60 text-sm">
            {items.length} services · Hiển thị trên trang chủ theo thứ tự sắp xếp
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" /> Thêm Service
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Khoảng giá</TableHead>
                <TableHead className="w-36"></TableHead>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-2 gap-1"
                          onClick={() => setMediaTarget(s)}
                        >
                          <Images className="w-3.5 h-3.5" />
                          Media
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(s.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Service CRUD Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên dịch vụ *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={150}
                placeholder="Chụp ảnh sản phẩm"
              />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                maxLength={1000}
                placeholder="Mô tả ngắn gọn dịch vụ..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Khoảng giá</Label>
                <Input
                  value={form.price_range}
                  onChange={(e) => setForm({ ...form, price_range: e.target.value })}
                  placeholder="Từ 5 triệu"
                />
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
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media manager dialog */}
      {mediaTarget && (
        <MediaManagerDialog
          service={mediaTarget}
          open={!!mediaTarget}
          onClose={() => setMediaTarget(null)}
        />
      )}
    </AdminLayout>
  );
};

export default Services;
