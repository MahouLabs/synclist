import { Button } from "@/components/ui/button";
import { createId } from "@/utils/ids";
import { createClient } from "@/utils/supabase.server";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/cloudflare";
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
  const { data: loggedInHome } = await supabase
    .from("home_members")
    .select("*")
    .eq("user_id", userId)
    .eq("last_accessed", true)
    .single();

  if (!loggedInHome) return redirect("/onboarding");

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("belongs_to", loggedInHome.home_id);
  return error
    ? json({ error, data: null }, { status: 500 })
    : json({ error: null, data }, { status: 200 });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = createClient(request, context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/signin");
  }

  const { data: loggedInHome } = await supabase
    .from("home_members")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("last_accessed", true)
    .single();

  if (!loggedInHome) {
    return json({ error: "User does not belong to a home" }, { status: 400 });
  }

  const formData = await request.formData();
  const stepPattern = /^step-\d+$/;
  const ingredientNamePattern = /^ingredient-name-\d+$/;
  const ingredientAmountPattern = /^ingredient-amount-\d+$/;

  const steps: string[] = [];
  const ingredients: { name: string; amount: number }[] = [];

  for (const [key, value] of formData.entries()) {
    if (stepPattern.test(key)) {
      steps.push(String(value));
    }

    if (ingredientNamePattern.test(key)) {
      const index = Number.parseInt(key.split("-")[2], 10) - 1;
      ingredients[index] = { ...ingredients[index], name: String(value) };
    }

    if (ingredientAmountPattern.test(key)) {
      const index = Number.parseInt(key.split("-")[2], 10) - 1;
      ingredients[index] = { ...ingredients[index], amount: Number(value) };
    }
  }

  const title = formData.get("title");
  const description = formData.get("description");

  const { error: insertRecipeError } = await supabase.from("recipes").insert({
    id: createId("recipe"),
    title: String(title),
    description: String(description),
    ingredients,
    steps,
    created_by: session.user.id,
    belongs_to: loggedInHome.home_id,
  });

  if (insertRecipeError) {
    return json({ error: insertRecipeError }, { status: 500 });
  }

  return redirect("/recipes");
}

export default function RecipePage() {
  const { error, data } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2">
      <Link to="/recipes/new" className="ml-auto w-fit">
        <Button>
          <PlusIcon height={16} /> New Recipe
        </Button>
      </Link>

      <ul>
        {data?.map((recipe) => (
          <li key={recipe.id}>
            <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
