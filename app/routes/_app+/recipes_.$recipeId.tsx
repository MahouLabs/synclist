import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { breakpoints, useWindowWidth } from "@/hooks/useWindowWidth";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase.server";
import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const recipeId = params.recipeId;

  if (!recipeId) {
    return json({ error: "Recipe not found", recipe: null }, { status: 404 });
  }

  const supabase = createClient(request, context);

  const { data: partialRecipe, error: getRecipeError } = await supabase
    .from("recipes")
    .select(
      "title, description, steps, recipes_items(amount, item_id, weight), items(id, name)"
    )
    .eq("id", recipeId)
    .single();

  if (getRecipeError || !partialRecipe) {
    return json({ error: getRecipeError, recipe: null }, { status: 500 });
  }

  const recipe = {
    title: partialRecipe.title,
    description: partialRecipe.description,
    steps: partialRecipe.steps as string[],
    ingredients: partialRecipe.recipes_items.map((recipeItem) => ({
      name: partialRecipe.items.find((item) => item.id === recipeItem.item_id)?.name,
      amount: recipeItem.amount,
      weight: recipeItem.weight,
    })),
  };

  return json({ error: null, recipe }, { status: 200 });
}

export default function RecipePage() {
  const { error, recipe } = useLoaderData<typeof loader>();
  const width = useWindowWidth();
  const mobileLayout = width < breakpoints.xl;

  if (!recipe) {
    console.error(error);

    return (
      <div className="p-4 lg:p-6">
        <h2>Something went wrong when fetching recipe :(</h2>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="h-full grow">
        <ResizablePanelGroup
          direction={mobileLayout ? "vertical" : "horizontal"}
          className="hidden"
        >
          <ResizablePanel minSize={mobileLayout ? 0 : 30} className="p-4 lg:p-6">
            <>
              <div className="flex flex-col gap-4">
                <h1>{recipe.title}</h1>
                <h3>{recipe.description}</h3>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <ul className="list-disc">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={`ingredient-${index + 1}`}
                      className="flex items-center gap-2"
                    >
                      <span className="text-muted-foreground text-sm">
                        x{ingredient.amount}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {ingredient.weight}
                      </span>
                      <span>-</span>
                      <span>{ingredient.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className={cn({
              "mx-4": !mobileLayout,
              "my-4": mobileLayout,
            })}
          />
          <ResizablePanel minSize={mobileLayout ? 0 : 30} className="p-4 lg:p-6">
            <div className="flex flex-col items-start justify-stretch gap-4">
              {recipe.steps.map((step, index) => (
                <div
                  key={`step-${index + 1}`}
                  className="flex w-full items-center gap-4 rounded-md border p-4"
                >
                  <p className="text-muted-foreground text-sm">{index + 1}</p>
                  <h4>{step}</h4>
                </div>
              ))}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
