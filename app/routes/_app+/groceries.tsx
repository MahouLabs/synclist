import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createId } from "@/utils/ids";
import { createClient, getLoggedInHome, getUserSession } from "@/utils/supabase.server";
import type { Database } from "@/utils/supabase.types";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect, useLoaderData, useRevalidator, useSubmit } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import Fuse from "fuse.js";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Grocery = { id: string; amount: number; bought: boolean; name: string };

export async function loader({ request, context }: LoaderFunctionArgs) {
  const supabase = createClient(request, context);

  const session = await getUserSession(supabase);
  if (!session) return redirect("/signin");

  const loggedInHome = await getLoggedInHome(supabase, session.user.id);
  if (!loggedInHome) return redirect("/onboarding");

  const { data } = await supabase
    .from("groceries")
    .select("item_id, amount, bought, items(name)")
    .eq("home_id", loggedInHome?.home_id);

  const groceries: Grocery[] =
    data?.map((grocery) => ({
      amount: grocery.amount,
      bought: grocery.bought,
      name: grocery.items?.name || "",
      id: grocery.item_id,
    })) || [];

  const env = {
    SUPABASE_KEY: context.cloudflare.env.SUPABASE_KEY,
    SUPABASE_URL: context.cloudflare.env.SUPABASE_URL,
  };

  return { groceries, env };
}

export async function action({ request, context }: ActionFunctionArgs) {
  console.log(request);
  const supabase = createClient(request, context);
  const formData = await request.formData();
  const action = formData.get("action");
  const id = formData.get("id");
  const name = formData.get("name");
  const bought = formData.get("bought");
  const amount = formData.get("amount");

  const session = await getUserSession(supabase);
  if (!session) return redirect("/signin");

  const loggedInHome = await getLoggedInHome(supabase, session.user.id);
  if (!loggedInHome) return redirect("/onboarding");

  if (action === "add-amount" && id && amount) {
    await supabase
      .from("groceries")
      .update({ amount: Number(amount) + 1 })
      .eq("item_id", id)
      .eq("home_id", loggedInHome.home_id);
  }

  if (action === "remove-amount" && id && amount) {
    await supabase
      .from("groceries")
      .update({ amount: Number(amount) - 1 })
      .eq("item_id", id)
      .eq("home_id", loggedInHome.home_id);
  }

  if (action === "toggle" && id && bought) {
    await supabase
      .from("groceries")
      .update({ bought: !JSON.parse(bought as string) })
      .eq("item_id", id)
      .eq("home_id", loggedInHome.home_id);
  }

  if (action === "add-item" && name) {
    const { data: existingItem } = await supabase
      .from("items")
      .select("id")
      .eq("name", name)
      .single();

    if (existingItem) {
      await supabase.from("groceries").insert({
        item_id: existingItem.id,
        home_id: loggedInHome.home_id,
        amount: 1,
        bought: false,
      });
    } else {
      const { data: newItem } = await supabase
        .from("items")
        .insert({
          id: createId("item"),
          name: String(name),
          home_id: loggedInHome.home_id,
        })
        .select("id")
        .single();

      if (newItem) {
        await supabase.from("groceries").insert({
          item_id: newItem.id,
          home_id: loggedInHome.home_id,
          amount: 1,
          bought: false,
        });
      }
    }
  }

  return null;
}

function GroceryTableRow({ grocery }: { grocery: Grocery }) {
  const submit = useSubmit();

  const addAmount = () => {
    submit(
      { id: grocery.id, amount: grocery.amount, action: "add-amount" },
      { method: "put" }
    );
  };

  const removeAmount = () => {
    submit(
      { id: grocery.id, amount: grocery.amount, action: "remove-amount" },
      { method: "put" }
    );
  };

  const toggleItem = () => {
    submit(
      { id: grocery.id, bought: grocery.bought, action: "toggle" },
      { method: "put" }
    );
  };

  return (
    <TableRow>
      <TableCell className="w-1/12">
        <Checkbox
          name={grocery.name}
          id={grocery.name}
          checked={grocery.bought}
          onClick={toggleItem}
        />
      </TableCell>
      <TableCell className="w-9/12">
        <Label className={grocery.bought ? "line-through" : ""} htmlFor={grocery.name}>
          {grocery.name}
        </Label>
      </TableCell>
      <TableCell className="flex items-center gap-2">
        <Button size="xs" variant="outline" onClick={addAmount}>
          <PlusIcon className="h-4" />
        </Button>
        <span className="w-7 text-center">{grocery.amount}</span>
        <Button size="xs" variant="outline" onClick={removeAmount}>
          <MinusIcon className="h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function GroceriesPage() {
  const { groceries, env } = useLoaderData<typeof loader>();
  const supabase = createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Grocery[]>(groceries || []);
  const revalidator = useRevalidator();
  const submit = useSubmit();

  useEffect(() => {
    setSearchResults(groceries);
  }, [groceries]);

  useEffect(() => {
    supabase
      .channel("groceries")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groceries" },
        () => {
          revalidator.revalidate();
        }
      )
      .subscribe();
  }, [supabase.channel, revalidator]);

  useEffect(() => {
    if (searchQuery.length === 0 || !searchQuery) {
      setSearchResults(groceries);
      return;
    }

    const results = fuse.search(searchQuery);
    const items = results.map((result) => result.item);
    setSearchResults(items);
  }, [searchQuery, groceries]);

  const boughtItems = searchResults.filter((grocery) => grocery.bought);
  const unboughtItems = searchResults.filter((grocery) => !grocery.bought);

  const options = {
    includeScore: true,
    includeMatches: true,
    threshold: 0.2,
    keys: ["name"],
  };

  const fuse = new Fuse(groceries, options);

  const addNewItem = () => {
    if (!searchQuery) return;
    submit({ name: searchQuery, action: "add-item" }, { method: "post" });
    setSearchQuery("");
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="search-input"
          placeholder="Search or add item..."
        />
        {/* <SearchIcon className="absolute top-2.5 right-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" /> */}
        <Button
          className="absolute top-0 right-0 h-10 w-10 rounded-md border-l-0"
          size="icon"
          variant="ghost"
          onClick={addNewItem}
        >
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only">Add item</span>
        </Button>
      </div>

      {unboughtItems.length === 0 && boughtItems.length === 0 && (
        <p>
          No items found. Press the <code>+</code> button to add the current search as a
          new item.
        </p>
      )}

      {(unboughtItems.length > 0 || boughtItems.length > 0) && (
        <div className="overflow-clip rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/12" />
                <TableHead className="w-9/12">Item</TableHead>
                <TableHead className="w-2/12">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unboughtItems
                .sort((a, b) => a.name.localeCompare(b.name))
                ?.map((grocery, index) => (
                  <GroceryTableRow key={grocery.name} grocery={grocery} />
                ))}
              {boughtItems
                .sort((a, b) => a.name.localeCompare(b.name))
                ?.map((grocery, index) => (
                  <GroceryTableRow key={grocery.name} grocery={grocery} />
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
