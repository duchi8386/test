import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { uploadToCloudinary, isSupabaseStorageUrl } from "@/lib/cloudinary";
import {
  Loader2,
  CloudUpload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface MigrationTask {
  id: string;
  table: string;
  field: string;
  label: string;
  oldUrl: string;
  newUrl?: string;
  status: "pending" | "running" | "done" | "error";
  error?: string;
}

const CLOUDINARY_FOLDERS: Record<string, string> = {
  "projects/image_url": "tika/projects",
  "projects/gallery_urls": "tika/projects/gallery",
  "brands/logo_url": "tika/brands",
  "service_media/url": "tika/services",
};

function getResourceType(url: string): "image" | "video" | "auto" {
  const lower = url.toLowerCase();
  if (/\.(mp4|mov|webm|avi|mkv|m4v)(\?|$)/.test(lower)) return "video";
  return "image";
}

const MediaMigration = () => {
  const [tasks, setTasks] = useState<MigrationTask[]>([]);
  const [scanning, setScanning] = useState(false);
  const [migrating, setMigrating] = useState(false);

  const updateTask = (id: string, patch: Partial<MigrationTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const scanDatabase = async () => {
    setScanning(true);
    setTasks([]);
    const collected: MigrationTask[] = [];

    try {
      // projects — image_url
      const { data: projects } = await supabase
        .from("projects")
        .select("id, title, image_url, gallery_urls");
      for (const p of projects ?? []) {
        if (p.image_url && isSupabaseStorageUrl(p.image_url)) {
          collected.push({
            id: `proj-img-${p.id}`,
            table: "projects",
            field: "image_url",
            label: `Project "${p.title}" — ảnh bìa`,
            oldUrl: p.image_url,
            status: "pending",
          });
        }
        const gallery = Array.isArray(p.gallery_urls) ? p.gallery_urls : [];
        gallery.forEach((url: string, idx: number) => {
          if (isSupabaseStorageUrl(url)) {
            collected.push({
              id: `proj-gal-${p.id}-${idx}`,
              table: "projects",
              field: `gallery_urls[${idx}]`,
              label: `Project "${p.title}" — gallery #${idx + 1}`,
              oldUrl: url,
              status: "pending",
            });
          }
        });
      }

      // brands — logo_url
      const { data: brands } = await supabase
        .from("brands")
        .select("id, name, logo_url");
      for (const b of brands ?? []) {
        if (b.logo_url && isSupabaseStorageUrl(b.logo_url)) {
          collected.push({
            id: `brand-${b.id}`,
            table: "brands",
            field: "logo_url",
            label: `Brand "${b.name}" — logo`,
            oldUrl: b.logo_url,
            status: "pending",
          });
        }
      }

      // service_media — url
      const { data: media } = await supabase
        .from("service_media")
        .select("id, type, url, label");
      for (const m of media ?? []) {
        if (m.url && isSupabaseStorageUrl(m.url)) {
          collected.push({
            id: `svc-${m.id}`,
            table: "service_media",
            field: "url",
            label: `Service media "${m.label ?? m.id}" (${m.type})`,
            oldUrl: m.url,
            status: "pending",
          });
        }
      }

      setTasks(collected);
      if (collected.length === 0) {
        toast({ title: "Không có gì cần migrate", description: "Tất cả media đã ở Cloudinary." });
      } else {
        toast({ title: `Tìm thấy ${collected.length} file cần migrate` });
      }
    } catch (err) {
      toast({ title: "Lỗi scan", description: String(err), variant: "destructive" });
    } finally {
      setScanning(false);
    }
  };

  const migrateAll = async () => {
    const pending = tasks.filter((t) => t.status === "pending" || t.status === "error");
    if (!pending.length) return;

    setMigrating(true);

    for (const task of pending) {
      updateTask(task.id, { status: "running" });
      try {
        // Fetch the old file as blob
        const res = await fetch(task.oldUrl);
        if (!res.ok) throw new Error(`Không fetch được file: ${res.status}`);
        const blob = await res.blob();

        // Determine Cloudinary folder
        const folderKey = `${task.table}/${task.field.replace(/\[\d+\]$/, "")}`;
        const folder = CLOUDINARY_FOLDERS[folderKey] ?? "tika/misc";
        const resourceType = getResourceType(task.oldUrl);

        const newUrl = await uploadToCloudinary(blob, resourceType, folder);

        // Update database
        await updateDatabaseUrl(task, newUrl);

        updateTask(task.id, { status: "done", newUrl });
      } catch (err) {
        updateTask(task.id, { status: "error", error: String(err) });
      }
    }

    setMigrating(false);
    toast({ title: "Migration hoàn tất" });
  };

  const updateDatabaseUrl = async (task: MigrationTask, newUrl: string) => {
    const recordId = extractRecordId(task.id, task.table);

    if (task.table === "projects" && task.field === "image_url") {
      const { data, error } = await supabase
        .from("projects")
        .update({ image_url: newUrl })
        .eq("id", recordId)
        .select("id");
      if (error) throw new Error(error.message);
      if (!data?.length) throw new Error("Không cập nhật được — kiểm tra quyền RLS");
    } else if (task.table === "projects" && task.field.startsWith("gallery_urls")) {
      const { data: proj, error: fetchError } = await supabase
        .from("projects")
        .select("gallery_urls")
        .eq("id", recordId)
        .single();
      if (fetchError) throw new Error(fetchError.message);
      const gallery: string[] = Array.isArray(proj?.gallery_urls) ? (proj.gallery_urls as string[]) : [];
      const updated = gallery.map((u: string) => (u === task.oldUrl ? newUrl : u));
      const { data, error } = await supabase
        .from("projects")
        .update({ gallery_urls: updated })
        .eq("id", recordId)
        .select("id");
      if (error) throw new Error(error.message);
      if (!data?.length) throw new Error("Không cập nhật được — kiểm tra quyền RLS");
    } else if (task.table === "brands" && task.field === "logo_url") {
      const { data, error } = await supabase
        .from("brands")
        .update({ logo_url: newUrl })
        .eq("id", recordId)
        .select("id");
      if (error) throw new Error(error.message);
      if (!data?.length) throw new Error("Không cập nhật được — kiểm tra quyền RLS");
    } else if (task.table === "service_media" && task.field === "url") {
      const { data, error } = await supabase
        .from("service_media")
        .update({ url: newUrl })
        .eq("id", recordId)
        .select("id");
      if (error) throw new Error(error.message);
      if (!data?.length) throw new Error("Không cập nhật được — kiểm tra quyền RLS");
    }
  };

  const extractRecordId = (taskId: string, table: string): string => {
    if (table === "projects" && taskId.startsWith("proj-img-")) {
      return taskId.replace("proj-img-", "");
    }
    if (table === "projects" && taskId.startsWith("proj-gal-")) {
      // proj-gal-{uuid}-{idx}
      const parts = taskId.replace("proj-gal-", "").split("-");
      // UUID has 5 parts joined by '-'
      return parts.slice(0, 5).join("-");
    }
    if (table === "brands") return taskId.replace("brand-", "");
    if (table === "service_media") return taskId.replace("svc-", "");
    return taskId;
  };

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const errorCount = tasks.filter((t) => t.status === "error").length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const runningCount = tasks.filter((t) => t.status === "running").length;

  return (
    <AdminLayout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl mb-2">Migration Media → Cloudinary</h1>
          <p className="text-foreground/60 text-sm">
            Chuyển toàn bộ ảnh/video từ Supabase Storage sang Cloudinary
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={scanDatabase} disabled={scanning || migrating}>
            {scanning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Quét Database
          </Button>
          {tasks.length > 0 && (
            <Button
              onClick={migrateAll}
              disabled={migrating || pendingCount + errorCount === 0}
            >
              {migrating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CloudUpload className="w-4 h-4" />
              )}
              {migrating ? "Đang migrate..." : `Migrate ${pendingCount + errorCount} file`}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Tổng", value: tasks.length, color: "text-foreground" },
            { label: "Hoàn thành", value: doneCount, color: "text-green-500" },
            { label: "Đang chạy", value: runningCount, color: "text-blue-500" },
            { label: "Lỗi", value: errorCount, color: "text-destructive" },
          ].map(({ label, value, color }) => (
            <Card key={label} className="p-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-foreground/60 mt-1">{label}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Task list */}
      {tasks.length === 0 ? (
        <Card className="p-16 flex flex-col items-center justify-center text-center gap-4">
          <CloudUpload className="w-12 h-12 text-foreground/20" />
          <div>
            <p className="font-medium">Chưa có dữ liệu scan</p>
            <p className="text-sm text-foreground/50 mt-1">
              Nhấn <strong>Quét Database</strong> để tìm các file cần migrate từ Supabase Storage sang Cloudinary.
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-4 px-5 py-3.5">
                <div className="mt-0.5 shrink-0">
                  {task.status === "done" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {task.status === "error" && <XCircle className="w-5 h-5 text-destructive" />}
                  {task.status === "running" && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                  {task.status === "pending" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.label}</p>
                  <p className="text-xs text-foreground/40 truncate mt-0.5">{task.oldUrl}</p>
                  {task.status === "done" && task.newUrl && (
                    <a
                      href={task.newUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-green-600 hover:underline truncate block mt-0.5"
                    >
                      {task.newUrl}
                    </a>
                  )}
                  {task.status === "error" && (
                    <p className="text-xs text-destructive mt-0.5">{task.error}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full ${
                    task.status === "done"
                      ? "bg-green-500/10 text-green-600"
                      : task.status === "error"
                      ? "bg-destructive/10 text-destructive"
                      : task.status === "running"
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {task.status === "done"
                    ? "Done"
                    : task.status === "error"
                    ? "Lỗi"
                    : task.status === "running"
                    ? "Đang chạy"
                    : "Chờ"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AdminLayout>
  );
};

export default MediaMigration;
