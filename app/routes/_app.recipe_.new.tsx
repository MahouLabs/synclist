import { RecipeForm } from "@/components/recipe-form";
import { createId } from "@/utils/ids";
import { createClient } from "@/utils/supabase.server";
import { type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = createClient(request, context);
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

  const { error } = await supabase.from("recipes").insert({
    id: createId("recipe"),
    title: String(title),
    description: String(description),
    ingredients,
    steps,
  });

  if (error) console.error(error);

  return redirect("/recipe");
}

export default function NewRecipePage() {
  return <RecipeForm />;
}
