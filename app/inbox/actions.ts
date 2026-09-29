"use server";

import { revalidatePath } from "next/cache";
import { requireOsUser } from "@/lib/auth";

export async function captureInboxItem(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  const { error } = await supabase.from("os_inbox_items").insert({
    content,
    type: String(formData.get("type") ?? "unclassified"),
    owner_id: osUser.id,
    source: "manual",
    status: "pending"
  });

  if (error) throw new Error(error.message);
  revalidatePath("/inbox");
  revalidatePath("/");
}

export async function discardInboxItem(formData: FormData) {
  const { supabase } = await requireOsUser();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("os_inbox_items").update({
    status:"discarded",
    processed_at:new Date().toISOString()
  }).eq("id",id);
  if (error) throw new Error(error.message);
  revalidatePath("/inbox");
}

export async function convertInboxToTask(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const id = String(formData.get("id") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  const { data: task, error: taskError } = await supabase.from("os_tasks").insert({
    title: content,
    owner_id: osUser.id,
    status: "pending",
    priority: "P2",
    source_type: "inbox",
    source_id: id,
    created_by: osUser.id,
    updated_by: osUser.id
  }).select("id").single();

  if (taskError) throw new Error(taskError.message);

  const { error: inboxError } = await supabase.from("os_inbox_items").update({
    status:"processed",
    processed_at:new Date().toISOString(),
    converted_to_type:"task",
    converted_to_id:task.id
  }).eq("id",id);

  if (inboxError) throw new Error(inboxError.message);

  revalidatePath("/inbox");
  revalidatePath("/tasks");
  revalidatePath("/");
}
