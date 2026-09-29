"use server";

import { revalidatePath } from "next/cache";
import { requireOsUser } from "@/lib/auth";

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export async function createTask(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const estimate = Number(formData.get("estimated_minutes") ?? 0);

  const { error } = await supabase.from("os_tasks").insert({
    title,
    description: nullable(formData.get("description")),
    project_id: nullable(formData.get("project_id")),
    owner_id: nullable(formData.get("owner_id")) ?? osUser.id,
    status: String(formData.get("status") ?? "pending"),
    priority: String(formData.get("priority") ?? "P2"),
    scheduled_date: nullable(formData.get("scheduled_date")),
    deadline: nullable(formData.get("deadline")),
    estimated_minutes: estimate > 0 ? estimate : null,
    source_type: "manual",
    created_by: osUser.id,
    updated_by: osUser.id
  });

  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function setTaskStatus(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending");

  const payload: Record<string, unknown> = { status, updated_by: osUser.id };

  if (status === "in_progress") payload.started_at = new Date().toISOString();
  if (status === "completed") payload.completed_at = new Date().toISOString();
  else payload.completed_at = null;

  const { error } = await supabase.from("os_tasks").update(payload as never).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function rescheduleTask(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const id = String(formData.get("id") ?? "");
  const scheduledDate = nullable(formData.get("scheduled_date"));

  const { error } = await supabase
    .from("os_tasks")
    .update({
      scheduled_date: scheduledDate,
      status: scheduledDate ? "scheduled" : "pending",
      updated_by: osUser.id
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
  revalidatePath("/");
}
