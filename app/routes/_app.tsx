import {
  Bell,
  CircleUser,
  CookingPot,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  ScrollText,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/utils/cn";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, Outlet, json, useLoaderData, useLocation } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";

// export function loader({ context }: LoaderFunctionArgs) {
//   const env = {
//     SUPABASE_URL: context.cloudflare.env.SUPABASE_URL,
//     SUPABASE_KEY: context.cloudflare.env.SUPABASE_KEY,
//   };

//   return json({ env }, { headers: { "Cache-Control": "public, max-age=3600" } });
// }

const pathTitles = {
  "/home": "Home",
  "/groceries": "Groceries",
  "/cookbook": "Cookbook",
} as const;

export default function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] md:grid-cols-[220px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <div className="flex items-center gap-2 font-semibold">
              <ScrollText className="h-6 w-6" />
              <span className="">SyncList</span>
            </div>
            {/* TODO: add theme switcher here */}
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 font-medium text-sm lg:px-4">
              <Link
                to="/home"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  {
                    "bg-muted text-primary": pathname === "/home",
                  }
                )}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/groceries"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  {
                    "bg-muted text-primary": pathname === "/groceries",
                  }
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                Groceries
              </Link>
              <Link
                to="/cookbook"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  {
                    "bg-muted text-primary": pathname === "/cookbook",
                  }
                )}
              >
                <CookingPot className="h-4 w-4" />
                Cookbook
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <p>user card here</p>
            {/* <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 font-medium text-lg">
                <div className="mb-4 flex items-center gap-2 font-semibold text-lg">
                  <ScrollText className="h-6 w-6" />
                  <span>SyncList</span>
                </div>
                <Link
                  to="/home"
                  className={cn(
                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                    { "bg-muted text-foregroud": pathname === "/home" }
                  )}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  to="/groceries"
                  className={cn(
                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                    { "bg-muted text-foregroud": pathname === "/groceries" }
                  )}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Groceries
                </Link>
                <Link
                  to="/cookbook"
                  className={cn(
                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                    { "bg-muted text-foregroud": pathname === "/cookbook" }
                  )}
                >
                  <CookingPot className="h-5 w-5" />
                  Cookbook
                </Link>
              </nav>
              <div className="mt-auto">
                <p>user card here</p>
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card> */}
              </div>
            </SheetContent>
          </Sheet>
          <h3>{pathTitles[pathname as keyof typeof pathTitles]}</h3>
          {/* <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none lg:w-1/3 md:w-2/3"
                />
              </div>
            </form>
          </div> */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
