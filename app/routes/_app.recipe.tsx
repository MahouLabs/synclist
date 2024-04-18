import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase.server";
import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import { PlusIcon } from "lucide-react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/signin");
  }

  const { id: userId } = session.user;
  const { data: loggedInHome } = await supabase.from("home_members").select("*").eq('user_id', userId).eq("last_accessed", true).single();

  if (!loggedInHome) return redirect("/onboarding");

  const { data, error } = await supabase.from("recipes").select("*").eq("belongs_to", loggedInHome.home_id);
  return error
    ? json({ error, data: null }, { status: 500 })
    : json({ error: null, data }, { status: 200 });
}

export default function RecipePage() {
  const { error, data } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2">
      <Link to="/recipe/new" className="ml-auto w-fit">
        <Button>
          <PlusIcon height={16} /> New Recipe
        </Button>
      </Link>

      <ul>
        {data?.map((recipe) => (
          <li key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
