import { createClient } from "@/utils/supabase.server";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/signin");
  }

  const { data: loggedInHome } = await supabase
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

  if (!loggedInHome) {
    return json({ error: "User does not belong to a home", groceries: [] }, { status: 400 });
  }

  const { data: groceries } = await supabase
    .from("groceries")
    .select(`
      id,
      name,
      recipes (
        ingredients
      )
    `)
    .eq("belongs_to", loggedInHome.id);

  if (!groceries) {
    return json({ error: "No groceries found", groceries: [] }, { status: 400 });
  }

  return json({ error: null, groceries }, { status: 200 });
}


export default function GroceriesPage() {
  const { groceries } = useLoaderData<typeof loader>();

  if (!groceries) return null;

  return (
    <div className="flex flex-col gap-2">
      {groceries && groceries.map((grocery) => (
        <div key={grocery!.id}>
          <h4>{grocery!.name}</h4>
          <ul>
            <li key={grocery!.id}>{JSON.stringify(grocery!.recipes)}</li>
          </ul>
        </div>
      ))}
    </div>
  );
}
