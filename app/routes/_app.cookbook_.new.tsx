import { RecipeForm } from "@/components/recipe-form";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";

export async function action({ request }: ActionFunctionArgs) {
  const body = request.body;
  console.log(body);

  return null;
}

export default function NewRecipePage() {
  return <RecipeForm />;
}
