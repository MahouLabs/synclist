import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createId } from "@/utils/ids";
import { createClient, getLoggedInHome, getUserSession } from "@/utils/supabase.server";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/cloudflare";
import {
  Link,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import Fuse from "fuse.js";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);

  const session = await getUserSession(supabase);
  if (!session) return redirect("/signin");

  const loggedInHome = await getLoggedInHome(supabase, session.user.id);
  if (!loggedInHome) return redirect("/onboarding");

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("title, description, id, servings")
    .eq("home_id", loggedInHome.home_id);

  return error
    ? json({ error, recipes: null }, { status: 500 })
    : json({ error: null, recipes }, { status: 200 });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = createClient(request, context);

  const session = await getUserSession(supabase);
  if (!session) return redirect("/signin");

  const loggedInHome = await getLoggedInHome(supabase, session.user.id);
  if (!loggedInHome) return redirect("/onboarding");

  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "add-serving" || action === "remove-serving") {
    const recipeId = String(formData.get("recipeId"));
    const currentServings = Number(formData.get("servings")) || 0;
    const newServings =
      action === "add-serving" ? currentServings + 1 : currentServings - 1;

    if (newServings < 0) return null;

    const { error: updateError } = await supabase
      .from("recipes")
      .update({ servings: newServings })
      .eq("id", recipeId);

    if (updateError) {
      return json({ error: updateError }, { status: 500 });
    }

    const { data: recipeItems } = await supabase
      .from("recipes")
      .select("recipes_items(item_id, amount)")
      .eq("id", recipeId)
      .single();

    const itemsToAdd = recipeItems?.recipes_items.map((item) => ({
      item_id: item.item_id,
      amount: item.amount * newServings,
      home_id: loggedInHome.home_id,
      bought: false,
    }));

    if (itemsToAdd && itemsToAdd.length > 0) {
      await supabase
        .from("groceries")
        .upsert(itemsToAdd)
        .eq("home_id", loggedInHome.home_id);
    }

    return null;
  }

  const stepPattern = /^step-\d+$/;
  const ingredientNamePattern = /^ingredient-name-\d+$/;
  const ingredientAmountPattern = /^ingredient-amount-\d+$/;
  const ingredientWeightPattern = /^ingredient-weight-\d+$/;

  const title = formData.get("title");
  const description = formData.get("description");
  const steps: string[] = [];
  const ingredients: { name: string; amount: number; weight: string }[] = [];

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

    if (ingredientWeightPattern.test(key)) {
      const index = Number.parseInt(key.split("-")[2], 10) - 1;
      ingredients[index] = { ...ingredients[index], weight: String(value) };
    }
  }

  const { data } = await supabase
    .from("items")
    .select("id, name")
    .eq("home_id", loggedInHome.home_id);

  const items = data || [];

  const normalizedItemsMap = new Map<string, string>();
  for (const item of items) {
    normalizedItemsMap.set(item.name.toLowerCase(), item.id);
  }

  const mergedData = ingredients.map((ingredient) => {
    const ingredientNameLower = ingredient.name.toLowerCase();
    const matchedId = normalizedItemsMap.get(ingredientNameLower);
    return {
      name: ingredient.name,
      amount: ingredient.amount,
      matchedId: matchedId || null,
      weight: ingredient.weight,
    };
  });

  const unmatchedItems = mergedData.filter((item) => !item.matchedId);

  const { error: insertItemsError, data: insertedItems } = await supabase
    .from("items")
    .insert(
      unmatchedItems.map((item) => ({
        id: createId("item"),
        name: item.name,
        home_id: loggedInHome.home_id,
      }))
    )
    .select("id, name");

  if (insertItemsError) {
    return json({ error: insertItemsError }, { status: 500 });
  }

  const finalItems = mergedData.map((item) => {
    const matchedItem = insertedItems.find(
      (insertedItem) => insertedItem.name === item.name
    );

    return {
      id: matchedItem?.id || item.matchedId || "",
      amount: item.amount,
      weight: item.weight,
    };
  });

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

  const { error: insertRecipesItemsError } = await supabase.from("recipes_items").insert(
    finalItems.map((item) => ({
      recipe_id: createdRecipe.id,
      item_id: item.id,
      amount: item.amount,
      weight: item.weight,
    }))
  );

  if (insertRecipesItemsError) {
    return json({ error: insertRecipesItemsError }, { status: 500 });
  }

  return redirect("/recipes");
}

export default function RecipesPage() {
  const { error, recipes } = useLoaderData<typeof loader>();
  const [searchResults, setSearchResults] = useState<typeof recipes>(recipes);
  const submit = useSubmit();
  const navigation = useNavigation();

  if (!recipes) return null;

  const options = {
    includeScore: true,
    includeMatches: true,
    threshold: 0.2,
    keys: ["title", "description"],
  };

  const fuse = new Fuse(recipes, options);

  useEffect(() => {
    setSearchResults(recipes);
  }, [recipes]);

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
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex gap-4">
        <Input placeholder="Search..." onChange={handleSearch} />
        <Button asChild>
          <Link to="/recipes/new" className="min-w-32">
            <PlusIcon className="mr-1 h-4 shrink-0" /> New Recipe
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 2xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4">
        {searchResults
          ?.sort((a, b) => a.title.localeCompare(b.title))
          .map((recipe) => (
            <div key={recipe.id} className="flex flex-col">
              <RecipeCard recipe={recipe} />
              <div className="mt-2 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  disabled={navigation.state !== "idle"}
                  onClick={() =>
                    submit(
                      {
                        recipeId: recipe.id,
                        servings: recipe.servings,
                        action: "remove-serving",
                      },
                      { method: "post", replace: true }
                    )
                  }
                >
                  <MinusIcon className="h-4" />
                </Button>
                <p>{recipe.servings || 0}</p>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={navigation.state !== "idle"}
                  onClick={() =>
                    submit(
                      {
                        recipeId: recipe.id,
                        servings: recipe.servings,
                        action: "add-serving",
                      },
                      { method: "post" }
                    )
                  }
                >
                  <PlusIcon className="h-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
