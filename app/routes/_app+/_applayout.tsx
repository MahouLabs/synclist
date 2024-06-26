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

  const { id: userId } = session.user;
  const { data } = await supabase
    .from("home_members")
    .select("homes(name)")
    .eq("user_id", userId)
    .single();

  return json(
    { home: data?.homes },
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
        <main className="flex flex-1 flex-col gap-4 lg:gap-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
