"use server";

import { revalidatePath } from "next/cache";
import { requireOsUser } from "@/lib/auth";

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export async function createGoal(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const target = Number(formData.get("target_value") ?? 0);
  const current = Number(formData.get("current_value") ?? 0);

  const { error } = await supabase.from("os_goals").insert({
    name,
    area_id: nullable(formData.get("area_id")),
    owner_id: nullable(formData.get("owner_id")) ?? osUser.id,
    metric_type: String(formData.get("metric_type") ?? "manual"),
    target_value: Number.isFinite(target) ? target : 0,
    current_value: Number.isFinite(current) ? current : 0,
    unit: nullable(formData.get("unit")),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? ""),
    status: "active",
    auto_calculate: false,
    notes: nullable(formData.get("notes"))
  });

  if (error) throw new Error(error.message);
  revalidatePath("/goals");
  revalidatePath("/");
}

export async function updateGoalProgress(formData: FormData) {
  const { supabase } = await requireOsUser();
  const id = String(formData.get("id") ?? "");
  const raw = Number(formData.get("current_value") ?? 0);
  const current_value = Number.isFinite(raw) ? raw : 0;

  const { data: goal } = await supabase.from("os_goals").select("target_value").eq("id",id).single();

  const payload: Record<string,unknown> = { current_value };
  if (goal && current_value >= Number(goal.target_value)) payload.status = "achieved";

  const { error } = await supabase.from("os_goals").update(payload as never).eq("id",id);
  if (error) throw new Error(error.message);

  revalidatePath("/goals");
  revalidatePath("/");
}
