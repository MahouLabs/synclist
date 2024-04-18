import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase.server";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, json, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "SyncList" },
    {
      name: "description",
      content: "A minimalist, shareable list app!",
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
        <Button>{user ? "Go to home" : "Sign in"}</Button>
      </Link>
    </div>
  );
}
