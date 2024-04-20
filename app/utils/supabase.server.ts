import type { AppLoadContext } from "@remix-run/cloudflare";
import { createServerClient, parse, serialize } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase.types";

export function createClient(request: Request, context: AppLoadContext) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();
  const { SUPABASE_URL, SUPABASE_KEY } = context.cloudflare.env;

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      get(key) {
        return cookies[key];
      },
      set(key, value, options) {
        headers.append("Set-Cookie", serialize(key, value, options));
      },
      remove(key, options) {
        headers.append("Set-Cookie", serialize(key, "", options));
      },
    },
  });
}

export async function getUserSession(supabase: SupabaseClient<Database>) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function getLoggedInHome(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data: loggedInHome } = await supabase
    .from("home_members")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true)
    .single();

  return loggedInHome;
}
