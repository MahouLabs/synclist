import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Outlet } from "@remix-run/react";

// export function loader({ context }: LoaderFunctionArgs) {
//   const env = {
//     SUPABASE_URL: context.cloudflare.env.SUPABASE_URL,
//     SUPABASE_KEY: context.cloudflare.env.SUPABASE_KEY,
//   };

//   return json({ env }, { headers: { "Cache-Control": "public, max-age=3600" } });
// }

export default function AppLayout() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] md:grid-cols-[220px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
