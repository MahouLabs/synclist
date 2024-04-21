import { Toaster } from "@/components/ui/sonner";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, json } from "@remix-run/react";
import "./global.css";
import { getHints, useHints } from "./utils/client-hints";
import { cn } from "./utils/cn";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    requestInfo: {
      hints: getHints(request),
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const hints = useHints();
  const theme = hints.theme || "dark";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body className={cn(theme)}>
        {/* <ScreenSize /> */}
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
