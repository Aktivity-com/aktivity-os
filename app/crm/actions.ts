"use server";

import { revalidatePath } from "next/cache";
import { requireOsUser } from "@/lib/auth";

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function revalidateCrm() {
  revalidatePath("/crm");
  revalidatePath("/crm/organizations");
  revalidatePath("/crm/contacts");
  revalidatePath("/crm/opportunities");
  revalidatePath("/crm/pipeline");
  revalidatePath("/crm/activities");
  revalidatePath("/");
}

export async function createOrganization(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const domain = nullable(formData.get("domain"));
  if (domain) {
    const { data: duplicate } = await supabase
      .from("organizations")
      .select("id,name")
      .ilike("domain", domain)
      .maybeSingle();
    if (duplicate) throw new Error(`Ya existe una organización con el dominio ${domain}: ${duplicate.name}`);
  }

  const { data: organization, error } = await supabase.from("organizations").insert({
    name,
    legal_name: nullable(formData.get("legal_name")),
    organization_type: String(formData.get("organization_type") ?? "other"),
    website: nullable(formData.get("website")),
    domain,
    country: nullable(formData.get("country")),
    region: nullable(formData.get("region")),
    city: nullable(formData.get("city")),
    sector: nullable(formData.get("sector")),
    size: nullable(formData.get("size")),
    owner_id: nullable(formData.get("owner_id")) ?? osUser.id,
    status: "active",
    source: nullable(formData.get("source")),
    notes: nullable(formData.get("notes")),
    created_by: osUser.id,
    updated_by: osUser.id
  }).select("id").single();

  if (error) throw new Error(error.message);

  const roleType = nullable(formData.get("role_type"));
  if (roleType && organization) {
    const { error: roleError } = await supabase.from("organization_roles").insert({
      organization_id: organization.id,
      role_type: roleType
    });
    if (roleError) throw new Error(roleError.message);
  }

  revalidateCrm();
}

export async function createContact(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const firstName = String(formData.get("first_name") ?? "").trim();
  if (!firstName) return;

  const { data: contact, error } = await supabase.from("contacts").insert({
    first_name: firstName,
    last_name: nullable(formData.get("last_name")),
    email: nullable(formData.get("email")),
    phone: nullable(formData.get("phone")),
    linkedin_url: nullable(formData.get("linkedin_url")),
    owner_id: nullable(formData.get("owner_id")) ?? osUser.id,
    status: "active",
    source: nullable(formData.get("source")),
    notes: nullable(formData.get("notes")),
    created_by: osUser.id,
    updated_by: osUser.id
  }).select("id").single();

  if (error) throw new Error(error.message);

  const organizationId = nullable(formData.get("organization_id"));
  if (organizationId && contact) {
    const { error: relError } = await supabase.from("organization_contacts").insert({
      organization_id: organizationId,
      contact_id: contact.id,
      job_title: nullable(formData.get("job_title")),
      department: nullable(formData.get("department")),
      is_primary: formData.get("is_primary") === "on"
    });
    if (relError) throw new Error(relError.message);
  }

  revalidateCrm();
}

export async function createOpportunity(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const pipelineId = String(formData.get("pipeline_id") ?? "");
  let stageId = nullable(formData.get("stage_id"));

  if (!stageId && pipelineId) {
    const { data: firstStage } = await supabase
      .from("crm_pipeline_stages")
      .select("id")
      .eq("pipeline_id", pipelineId)
      .order("sort_order")
      .limit(1)
      .maybeSingle();
    stageId = firstStage?.id ?? null;
  }

  if (!pipelineId || !stageId) throw new Error("Pipeline y etapa son obligatorios.");

  const rawValue = Number(formData.get("value") ?? 0);

  const { data: opportunity, error } = await supabase.from("crm_opportunities").insert({
    name,
    organization_id: String(formData.get("organization_id") ?? ""),
    primary_contact_id: nullable(formData.get("primary_contact_id")),
    product_id: nullable(formData.get("product_id")),
    pipeline_id: pipelineId,
    stage_id: stageId,
    owner_id: nullable(formData.get("owner_id")) ?? osUser.id,
    value: Number.isFinite(rawValue) && rawValue > 0 ? rawValue : null,
    currency: "EUR",
    expected_close_date: nullable(formData.get("expected_close_date")),
    status: "open",
    source: nullable(formData.get("source")),
    notes: nullable(formData.get("notes")),
    created_by: osUser.id,
    updated_by: osUser.id
  }).select("id").single();

  if (error) throw new Error(error.message);

  const nextAction = nullable(formData.get("next_action"));
  const nextActionDate = nullable(formData.get("next_action_date"));

  if (opportunity && nextAction) {
    const { error: taskError } = await supabase.from("os_tasks").insert({
      title: nextAction,
      owner_id: nullable(formData.get("owner_id")) ?? osUser.id,
      status: nextActionDate ? "scheduled" : "pending",
      priority: "P1",
      scheduled_date: nextActionDate,
      source_type: "opportunity",
      source_id: opportunity.id,
      created_by: osUser.id,
      updated_by: osUser.id
    });
    if (taskError) throw new Error(taskError.message);
  }

  revalidateCrm();
}

export async function moveOpportunity(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const id = String(formData.get("id") ?? "");
  const stageId = String(formData.get("stage_id") ?? "");

  const { data: stage } = await supabase
    .from("crm_pipeline_stages")
    .select("is_closed,is_won,is_lost")
    .eq("id", stageId)
    .single();

  const payload: Record<string, unknown> = {
    stage_id: stageId,
    updated_by: osUser.id
  };

  if (stage?.is_won) {
    payload.status = "won";
    payload.closed_at = new Date().toISOString();
  } else if (stage?.is_lost) {
    payload.status = "lost";
    payload.closed_at = new Date().toISOString();
    payload.loss_reason = nullable(formData.get("loss_reason")) ?? "Sin especificar";
  } else {
    payload.status = "open";
    payload.closed_at = null;
    payload.loss_reason = null;
  }

  const { error } = await supabase.from("crm_opportunities").update(payload as never).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateCrm();
}

export async function createActivity(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const summary = String(formData.get("summary") ?? "").trim();
  if (!summary) return;

  const ownerId = nullable(formData.get("owner_id")) ?? osUser.id;

  const { error } = await supabase.from("crm_activities").insert({
    organization_id: nullable(formData.get("organization_id")),
    contact_id: nullable(formData.get("contact_id")),
    opportunity_id: nullable(formData.get("opportunity_id")),
    owner_id: ownerId,
    activity_type: String(formData.get("activity_type") ?? "note"),
    activity_date: nullable(formData.get("activity_date")) ?? new Date().toISOString(),
    summary,
    result: nullable(formData.get("result")),
    notes: nullable(formData.get("notes")),
    created_by: osUser.id
  });

  if (error) throw new Error(error.message);

  const nextAction = nullable(formData.get("next_action"));
  const nextActionDate = nullable(formData.get("next_action_date"));
  const opportunityId = nullable(formData.get("opportunity_id"));

  if (nextAction) {
    const { error: taskError } = await supabase.from("os_tasks").insert({
      title: nextAction,
      owner_id: ownerId,
      status: nextActionDate ? "scheduled" : "pending",
      priority: "P1",
      scheduled_date: nextActionDate,
      source_type: opportunityId ? "opportunity" : "crm_activity",
      source_id: opportunityId,
      created_by: osUser.id,
      updated_by: osUser.id
    });
    if (taskError) throw new Error(taskError.message);
  }

  revalidateCrm();
}
