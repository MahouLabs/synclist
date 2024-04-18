import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase.server";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, redirect } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (user) {
    const userHome = await supabase.from("homes").select("*").eq("user_id", user.id).single();

    if (userHome) {
      return redirect("/home");
    }

    return redirect("/onboarding");
  }

  return null;
}

export default function IndexPage() {
  return (
    <div>
      <h1 className="text-2xl">Welcome to SyncList</h1>
      <Link to="/signin">
        <Button>Sign in</Button>
      </Link>
    </div>
  );
}
