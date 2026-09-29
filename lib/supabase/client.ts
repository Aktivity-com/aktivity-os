"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://npaiebyrqowhjeeriuay.supabase.co"),
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_UHswA9c10dAMQWClcISkCQ_MNuR9uen")
  );
}
