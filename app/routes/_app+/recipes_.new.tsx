import { RecipeForm } from "@/components/recipe-form";
import { createClient } from "@/utils/supabase.server";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/signin");
  }

  const { data: items } = await supabase.from("items").select("id, name");
  return { items };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = createClient(request, context);

  const body = await request.formData();
  console.log(body.get("item"));
  return null;
}

export default function NewRecipePage() {
  const { items } = useLoaderData<typeof loader>();
  return <RecipeForm ingredients={items || []} />;
}
