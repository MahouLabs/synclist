import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createId } from "@/utils/ids";
import { createClient } from "@/utils/supabase.server";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { Form, useNavigation } from "@remix-run/react";
import { ScrollText } from "lucide-react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/signin");
  }

  const { id, email } = session.user;

  return json({ user: { id, email } });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const supabase = createClient(request, context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return redirect("/signin");

  const body = await request.formData();
  const homeName = body.get("home-name");

  if (!homeName) return json({ error: "Home name is required" }, { status: 400 });

  const homeId = createId("home");
  const { error: createHomeError } = await supabase.from("homes").insert({
    id: homeId,
    owner_id: session.user.id,
    name: String(homeName),
  });

  if (createHomeError) return json({ error: createHomeError }, { status: 500 });

  const { error: createHomeUserError } = await supabase.from("home_members").insert({
    home_id: homeId,
    user_id: session.user.id,
    active: true,
  });

  if (createHomeUserError) return json({ error: createHomeUserError }, { status: 500 });

  return redirect("/home");
}

export default function OnboardingPage() {
  const { state } = useNavigation();

  return (
    <section className="flex h-screen w-full items-center justify-center">
      <Form method="post">
        <Card>
          <CardHeader>
            <h1 className="flex items-center font-semibold text-3xl">
              Welcome to SyncList <ScrollText className="ml-1" />
            </h1>
          </CardHeader>
          <CardContent>
            <h3 className="my-4">Let's set up your home:</h3>

            <Label>Home Name</Label>
            <Input name="home-name" />
          </CardContent>
          <CardFooter>
            <Button type="submit" loading={state !== "idle"}>
              Create Home
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </section>
  );
}
