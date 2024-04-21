import { BackgroundBeams } from "@/components/background-beams";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase.server";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, json, useLoaderData } from "@remix-run/react";
import { Github, ScrollText } from "lucide-react";

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
    <section className="w-full bg-background">
      <BackgroundBeams />
      <header className="mx-auto flex max-w-screen-lg items-center justify-between gap-2 p-4">
        <ScrollText /> <span className="text-2xl">SyncList</span>
        <Button size="sm" className="ml-auto" asChild>
          <Link to={user ? "/home" : "/signin"}>{user ? "Go to home" : "Sign in"}</Link>
        </Button>
      </header>
      <div className="z-10 mx-auto mt-20 mb-10 flex max-w-md flex-col items-center px-2.5 text-center brightness-100 sm:mt-56 sm:max-w-2xl sm:px-0">
        <h1 className="font-bold text-4xl text-primary tracking-tight sm:text-6xl">
          Never forget to buy groceries again
        </h1>
        <p className="mt-6 text-md text-muted-foreground leading-8 sm:text-lg">
          SyncList helps you keep track of what you're going to cook, buy and eat. Share
          your home with anyone and keep your lists in sync.
        </p>
        <div className="mt-8 flex items-center gap-8">
          <Button asChild>
            <Link to={user ? "/home" : "/signin"}>{user ? "Go to home" : "Sign in"}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="https://github.com/mahoulabs/synclist">
              <Github className="h-4" />
              Star on github
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
