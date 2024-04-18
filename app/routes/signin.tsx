import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { toast } from "sonner";

export async function loader({ context }: LoaderFunctionArgs) {
  const { SUPABASE_URL, SUPABASE_KEY } = context.cloudflare.env;
  return json({ SUPABASE_URL, SUPABASE_KEY });
}

export default function SigninPage() {
  const { SUPABASE_URL, SUPABASE_KEY } = useLoaderData<typeof loader>();
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);

  const signin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) {
      toast("OTP code sent to your email");
      setMode("otp");
    } else {
      toast("Failed to send OTP code, please try again later");
    }

    setLoading(false);
  };

  const verifyOtp = async (token: string) => {
    // TODO: handle error
    const { data } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (data.user) {
      const { data: userHome } = await supabase
        .from("home_members")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (userHome) {
        return navigate("/home");
      }
    }

    navigate("/onboarding");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-[330px]">
        <CardHeader>
          <CardTitle className="text-2xl">Signin</CardTitle>
          <CardDescription>
            {mode === "email" && "Enter your email below to signin to your account"}
            {mode === "otp" && "Enter the OTP code below to finish signing in"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "email" && (
            <form onSubmit={signin} className="flex flex-col gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send magic link"}
              </Button>
            </form>
          )}

          {mode === "otp" && (
            <div className="flex flex-col gap-4">
              <Label>OTP Code</Label>
              <div className="flex items-center">
                <InputOTP maxLength={6} onComplete={verifyOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            </div>
          )}
          {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
        </CardContent>
      </Card>
    </div>
  );
}
