import { cn } from "@/utils/cn";
import { pathTitles } from "@/utils/path";
import { Link, useLocation } from "@remix-run/react";
import {
  ArrowLeft,
  CookingPot,
  Home,
  Menu,
  ScrollText,
  ShoppingCart,
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Tables } from "@/utils/supabase.types";

type HomeProps = {
  home: Tables<"homes"> | null;
}

export function Header({ home }: HomeProps) {
  const { pathname } = useLocation();
  const subroute = pathname.slice(1).includes("/");

  return (
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
                { "bg-muted text-foregroud": pathname.includes("/home") }
              )}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            <Link
              to="/groceries"
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                { "bg-muted text-foregroud": pathname.includes("/groceries") }
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              Groceries
            </Link>
            <Link
              to="/recipe"
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                { "bg-muted text-foregroud": pathname.includes("/recipe") }
              )}
            >
              <CookingPot className="h-5 w-5" />
              Recipes
            </Link>
          </nav>
          <div className="mt-auto">
            {home && (
              <Link
                to="/home"
                prefetch="viewport"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  {
                    "bg-muted text-primary": pathname.includes("/home"),
                  }
                )}
              >
                <Home className="h-4 w-4" />
                {home.name}
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
      {subroute && (
        <Link to={pathname.split("/").slice(0, -1).join("/")}>
          <Button variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      )}
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
  );
}
