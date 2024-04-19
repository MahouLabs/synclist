import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createId } from "@/utils/ids";
import { createClient } from "@/utils/supabase.server";
import type { Tables } from "@/utils/supabase.types";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/cloudflare";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import Fuse from "fuse.js";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

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

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("title, description, id")
    .eq("home_id", loggedInHome.home_id);

  return error
    ? json({ error, recipes: null }, { status: 500 })
    : json({ error: null, recipes }, { status: 200 });
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

  const title = formData.get("title");
  const description = formData.get("description");
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

  const items: Tables<"items">[] = ingredients.map((ingredient) => ({
    id: createId("item"),
    name: ingredient.name,
    home_id: loggedInHome.home_id,
  }));

  const { error: insertItemsError, data: insertedItems } = await supabase
    .from("items")
    .insert(items)
    .select();

  if (insertItemsError) {
    return json({ error: insertItemsError }, { status: 500 });
  }

  const { error: insertRecipeError, data: createdRecipe } = await supabase
    .from("recipes")
    .insert({
      id: createId("recipe"),
      title: String(title),
      description: String(description),
      steps,
      home_id: loggedInHome.home_id,
    })
    .select("id")
    .single();

  if (insertRecipeError) {
    return json({ error: insertRecipeError }, { status: 500 });
  }

  // const { error, data } = await supabase.from("recipes_items").insert(
  //   insertedItems.map((item) => ({
  //     recipe_id: createdRecipe.id,
  //     item_id: item.id,
  //     amount:
  //       ingredients.find((ingredient) => ingredient.name === item.name)?.amount || 1,
  //   }))
  // );

  // console.log({ error, data });

  // return redirect("/recipes");
  return null;
}

export default function RecipePage() {
  const { error, recipes } = useLoaderData<typeof loader>();
  const [searchResults, setSearchResults] = useState<typeof recipes>(recipes);

  if (!recipes) return null;

  const options = {
    includeScore: true,
    includeMatches: true,
    threshold: 0.2,
    keys: ["title", "description"],
  };

  const fuse = new Fuse(recipes, options);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.length === 0 || !value) {
      setSearchResults(recipes);
      return;
    }

    const results = fuse.search(value);
    const items = results.map((result) => result.item);
    setSearchResults(items);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Input placeholder="Search..." onChange={handleSearch} />
        <Button asChild>
          <Link to="/recipes/new" className="min-w-32">
            <PlusIcon className="mr-1 h-4 shrink-0" /> New Recipe
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 2xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4">
        {searchResults?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
