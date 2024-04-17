import { createClient } from "@/utils/supabase.server";
import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);
  const { data } = await supabase.from("homes").select("*");

  return json({ home: data }, { headers: { "Cache-Control": "max-age=3600, public" } });
}

export default function Home() {
  const { home } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2">
      <h1>Home</h1>
    </div>
  );
}
