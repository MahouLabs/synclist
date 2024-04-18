import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase.server";
import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { PlusIcon } from "lucide-react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);

  const { data, error } = await supabase.from("recipes").select("*");
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
