import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  user_id: string;
  title: string;
  niche: string | null;
  topic: string | null;
  script: string | null;
  voice: string | null;
  style: string | null;
  status: string;
  video_url: string | null;
  audio_base64: string | null;
  trend_data: unknown;
  captions: unknown;
  compliance_score: number | null;
  platforms: string[] | null;
  selected_media: unknown;
  trim_data: unknown;
  overlays_data: unknown;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Project[];
}

export async function fetchProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Project | null;
}

export async function createProject(fields: Partial<Project>): Promise<Project> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...fields, user_id: user.id } as any)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Project;
}

export async function updateProject(id: string, fields: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update(fields as any)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchScheduledPosts(projectId?: string) {
  let query = supabase.from("scheduled_posts").select("*").order("scheduled_at", { ascending: true });
  if (projectId) query = query.eq("project_id", projectId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createScheduledPost(fields: { project_id: string; platform: string; scheduled_at: string; caption_data?: unknown }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("scheduled_posts")
    .insert({ ...fields, user_id: user.id } as any)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteScheduledPost(id: string) {
  const { error } = await supabase.from("scheduled_posts").delete().eq("id", id);
  if (error) throw error;
}
