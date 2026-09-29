"use server";

import { revalidatePath } from "next/cache";
import { requireOsUser } from "@/lib/auth";

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/preregistrations");
  revalidatePath("/admin/b2b-leads");
  revalidatePath("/admin/referrals");
  revalidatePath("/admin/contact-requests");
  revalidatePath("/");
}

export async function updateAdminStatus(formData: FormData) {
  const { supabase } = await requireOsUser();
  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  const admin_status = String(formData.get("admin_status") ?? "new");

  const allowed = ["pre_registrations","b2b_leads","referrals","contact_requests"];
  if (!allowed.includes(table)) throw new Error("Tabla no permitida.");

  const { error } = await supabase.from(table as "pre_registrations").update({ admin_status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function updateAdminNotes(formData: FormData) {
  const { supabase } = await requireOsUser();
  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  const admin_notes = nullable(formData.get("admin_notes"));

  const allowed = ["pre_registrations","b2b_leads","referrals","contact_requests"];
  if (!allowed.includes(table)) throw new Error("Tabla no permitida.");

  const { error } = await supabase.from(table as "pre_registrations").update({ admin_notes }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function convertB2BLeadToCrm(formData: FormData) {
  const { supabase, osUser } = await requireOsUser();
  const id = String(formData.get("id") ?? "");

  const { data: lead, error: leadError } = await supabase
    .from("b2b_leads")
    .select("*")
    .eq("id", id)
    .single();

  if (leadError || !lead) throw new Error(leadError?.message ?? "Lead no encontrado.");

  if (lead.crm_organization_id) {
    revalidateAdmin();
    return;
  }

  let organizationId: string | null = null;

  if (lead.website) {
    try {
      const domain = new URL(lead.website.startsWith("http") ? lead.website : "https://"+lead.website).hostname.replace(/^www\./,"");
      const { data: existingByDomain } = await supabase.from("organizations").select("id").ilike("domain",domain).maybeSingle();
      organizationId = existingByDomain?.id ?? null;
    } catch {}
  }

  if (!organizationId) {
    const { data: existingByName } = await supabase.from("organizations").select("id").ilike("name",lead.organization_name).limit(1).maybeSingle();
    organizationId = existingByName?.id ?? null;
  }

  if (!organizationId) {
    const typeMap: Record<string,string> = {
      company:"company", university:"university", professional_collective:"collective",
      club:"club", organizer:"organizer", business:"brand", sponsor:"brand"
    };

    let domain:string|null=null;
    if (lead.website) {
      try { domain = new URL(lead.website.startsWith("http") ? lead.website : "https://"+lead.website).hostname.replace(/^www\./,""); } catch {}
    }

    const { data: organization, error } = await supabase.from("organizations").insert({
      name: lead.organization_name,
      organization_type: typeMap[lead.lead_type] ?? "other",
      website: lead.website,
      domain,
      owner_id: osUser.id,
      source: lead.source ?? "web",
      notes: "Creado desde lead B2B del formulario web.",
      created_by: osUser.id,
      updated_by: osUser.id
    }).select("id").single();

    if (error) throw new Error(error.message);
    organizationId = organization.id;
  }

  let contactId: string | null = null;
  if (lead.contact_email) {
    const { data: existingContact } = await supabase.from("contacts").select("id").ilike("email",lead.contact_email).maybeSingle();
    contactId = existingContact?.id ?? null;
  }

  if (!contactId) {
    const parts = lead.contact_name.trim().split(/\s+/);
    const first_name = parts.shift() ?? lead.contact_name;
    const last_name = parts.join(" ") || null;

    const { data: contact, error } = await supabase.from("contacts").insert({
      first_name,
      last_name,
      email: lead.contact_email,
      phone: lead.contact_phone,
      owner_id: osUser.id,
      source: lead.source ?? "web",
      notes: "Creado desde lead B2B del formulario web.",
      created_by: osUser.id,
      updated_by: osUser.id
    }).select("id").single();

    if (error) throw new Error(error.message);
    contactId = contact.id;
  }

  if (organizationId && contactId) {
    await supabase.from("organization_contacts").upsert({
      organization_id: organizationId,
      contact_id: contactId,
      job_title: lead.contact_role,
      department: lead.contact_area,
      is_primary: true
    }, { onConflict:"organization_id,contact_id" });
  }

  const { error: updateError } = await supabase.from("b2b_leads").update({
    crm_organization_id: organizationId,
    crm_contact_id: contactId,
    admin_status: "converted"
  }).eq("id", id);

  if (updateError) throw new Error(updateError.message);
  revalidateAdmin();
  revalidatePath("/crm");
  revalidatePath("/crm/organizations");
  revalidatePath("/crm/contacts");
}
