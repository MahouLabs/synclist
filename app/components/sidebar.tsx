import { cn } from "@/utils/cn";
import { Link, useLocation } from "@remix-run/react";
import { CookingPot, Home, ScrollText, ShoppingCart } from "lucide-react";

type SidebarProps = {
  homeName?: string;
};

export function Sidebar({ homeName }: SidebarProps) {
  const { pathname } = useLocation();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <ScrollText className="h-6 w-6" />
            <span className="">SyncList</span>
          </div>
          {/* TODO: add theme switcher here */}
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 font-medium text-sm lg:px-4">
            <Link
              to="/home"
              prefetch="intent"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                {
                  "bg-muted text-primary": pathname.includes("/home"),
                }
              )}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/groceries"
              prefetch="intent"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                {
                  "bg-muted text-primary": pathname.includes("/groceries"),
                }
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              Groceries
            </Link>
            <Link
              to="/recipes"
              prefetch="intent"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                {
                  "bg-muted text-primary": pathname.includes("/recipe"),
                }
              )}
            >
              <CookingPot className="h-4 w-4" />
              Recipes
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          {homeName && (
            <p className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Home className="h-4 w-4" />
              {homeName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
