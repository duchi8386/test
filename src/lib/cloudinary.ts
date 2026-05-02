const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

/**
 * Upload a file/blob to Cloudinary using unsigned upload preset.
 * Returns the secure_url of the uploaded asset.
 */
export async function uploadToCloudinary(
  file: File | Blob,
  resourceType: "image" | "video" | "auto" = "auto",
  folder?: string,
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Thiếu cấu hình Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (folder) formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } })?.error?.message ?? "Cloudinary upload thất bại");
  }

  const data = await res.json();
  return data.secure_url as string;
}

/** Returns true if the URL is from Supabase Storage (needs migration). */
export function isSupabaseStorageUrl(url: string): boolean {
  return url.includes("supabase.co/storage");
}
