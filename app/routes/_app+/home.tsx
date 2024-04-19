import { createClient } from "@/utils/supabase.server";
import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { redirect, useLoaderData } from "@remix-run/react";

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

  return json({ home: data }, { headers: { "Cache-Control": "max-age=3600, public" } });
}

export default function HomePage() {
  const { home } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2">
      <h1>Home</h1>
    </div>
  );
}
