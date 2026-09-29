import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireOsUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: osUser } = await supabase
    .from("os_users")
    .select("id,name,email,role,status")
    .eq("auth_user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!osUser) redirect("/unauthorized");

  return { supabase, authUser: user, osUser };
}
