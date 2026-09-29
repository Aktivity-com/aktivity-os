"use server";

import { revalidatePath } from "next/cache";
import { requireOsUser } from "@/lib/auth";

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export async function createOsUser(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  if (osUser.role !== "admin") throw new Error("Solo un Admin puede gestionar usuarios internos.");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!name || !email) return;

  const { error } = await supabase.from("os_users").insert({
    name,
    email,
    role: String(formData.get("role") ?? "viewer"),
    status: "active",
    auth_user_id: nullable(formData.get("auth_user_id")),
    is_default: false
  });

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function updateOsUser(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  if (osUser.role !== "admin") throw new Error("Solo un Admin puede gestionar usuarios internos.");

  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "viewer");
  const status = String(formData.get("status") ?? "active");
  const auth_user_id = nullable(formData.get("auth_user_id"));

  const { error } = await supabase.from("os_users").update({
    role,
    status,
    auth_user_id
  }).eq("id",id);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
