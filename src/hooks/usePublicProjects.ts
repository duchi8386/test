import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PublicProject = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  year: string | null;
  brands: { name: string } | null;
};

export function usePublicProjectsList() {
  return useQuery({
    queryKey: ["public-projects"],
    queryFn: async (): Promise<PublicProject[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, image_url, year, brands(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as PublicProject[]) ?? [];
    },
    staleTime: 60_000,
  });
}

export function usePublicProjectById(id: string | undefined) {
  return useQuery({
    queryKey: ["public-project", id],
    queryFn: async (): Promise<PublicProject | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, image_url, year, brands(name)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as PublicProject | null;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}
