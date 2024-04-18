import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase.server";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, json, useLoaderData } from "@remix-run/react";

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

  return json({ user });
}

export default function IndexPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl">Welcome to SyncList</h1>
      <Link to={user ? "/home" : "/signin"}>
        <Button>Go to {user ? "home" : "signin"}</Button>
      </Link>
    </div>
  );
}
