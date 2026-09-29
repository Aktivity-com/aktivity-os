"use server";

import { revalidatePath } from "next/cache";
import { requireOsUser } from "@/lib/auth";

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export async function createProject(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const progress = Number(formData.get("progress") ?? 0);

  const { error } = await supabase.from("os_projects").insert({
    name,
    description: nullable(formData.get("description")),
    area_id: nullable(formData.get("area_id")),
    parent_project_id: nullable(formData.get("parent_project_id")),
    owner_id: nullable(formData.get("owner_id")) ?? osUser.id,
    status: String(formData.get("status") ?? "pending"),
    priority: String(formData.get("priority") ?? "P2"),
    start_date: nullable(formData.get("start_date")),
    target_date: nullable(formData.get("target_date")),
    progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0,
    created_by: osUser.id,
    updated_by: osUser.id
  });

  if (error) throw new Error(error.message);
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function updateProjectStatus(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending");

  const update: Record<string, unknown> = { status, updated_by: osUser.id };
  if (status === "completed") {
    update.completed_at = new Date().toISOString();
    update.progress = 100;
  } else {
    update.completed_at = null;
  }

  const { error } = await supabase.from("os_projects").update(update as never).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  revalidatePath("/");
}

export async function updateProjectProgress(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const id = String(formData.get("id") ?? "");
  const raw = Number(formData.get("progress") ?? 0);
  const progress = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 0;

  const { error } = await supabase
    .from("os_projects")
    .update({ progress, updated_by: osUser.id })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/projects");
}
