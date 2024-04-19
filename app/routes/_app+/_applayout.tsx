import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/utils/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet, json, redirect, useLoaderData } from "@remix-run/react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/signin");
  }

  const { data } = await supabase
    .from("homes")
    .select(`
      *,
      home_members (
        last_accessed
      )
    `)
    .eq("owner_id", session.user.id)
    .eq("home_members.last_accessed", true)
    .single();

  return json(
    { home: data },
    { headers: { "Cache-Control": "max-age=3600, public" } }
  );
}

export default function AppLayout() {
  const { home } = useLoaderData<typeof loader>();

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] md:grid-cols-[220px_1fr]">
      <Sidebar homeName={home?.name} />
      <div className="flex flex-col">
        <Header homeName={home?.name} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
