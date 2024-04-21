import { RecipeCard } from "@/components/recipe-card";
import { createClient, getLoggedInHome, getUserSession } from "@/utils/supabase.server";
import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { redirect, useLoaderData } from "@remix-run/react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);

  const session = await getUserSession(supabase);
  if (!session) return redirect("/signin");

  const loggedInHome = await getLoggedInHome(supabase, session.user.id);
  if (!loggedInHome) return redirect("/onboarding");

  const { data: currentRecipes } = await supabase
    .from("recipes")
    .select("id, title, description, servings")
    .eq("home_id", loggedInHome?.home_id)
    .gt("servings", 0);

  return json({ currentRecipes });
}

export default function HomePage() {
  const { currentRecipes } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <h1>Welcome back!</h1>
      <h3>Here's what you have in store for this week:</h3>

      <div className="grid gap-4 2xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4">
        {currentRecipes?.map((recipe) => (
          <div className="flex flex-col gap-2">
            <RecipeCard recipe={recipe} />
            <p className="ml-2 text-muted-foreground text-sm">
              {recipe.servings} {recipe.servings > 1 ? "servings" : "serving"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
