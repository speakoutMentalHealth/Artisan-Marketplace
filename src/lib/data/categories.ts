import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { categories as fallbackCategories } from "@/lib/demo-data";

export type ServiceCategory = {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return fallbackCategories.map((category) => ({
      id: null,
      name: category.name,
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: category.description,
      icon: category.icon,
    }));
  }

  const supabase = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("service_categories")
    .select("id, name, slug, description, icon")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackCategories.map((category) => ({
      id: null,
      name: category.name,
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: category.description,
      icon: category.icon,
    }));
  }

  return data.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    icon: category.icon ?? "🛠️",
  }));
}
