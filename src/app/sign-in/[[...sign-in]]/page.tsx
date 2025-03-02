"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface ClerkError {
  message: string;
  meta?: {
    paramName?: string;
  };
}

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Redirect if user is already signed in
  useEffect(() => {
    if (isAuthLoaded) {
      if (isSignedIn) {
        router.push("/dashboard");
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [isAuthLoaded, isSignedIn, router]);

  // Handle OAuth sign-in with Google
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  // Handle OAuth sign-in with Apple
  const handleAppleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Failed to sign in with Apple. Please try again.");
    }
  };

  // Handle form submission for email/password sign-in
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    if (!isLoaded) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        // Handle 2FA or other verification steps if needed
        console.log("Additional verification steps required");
      }
    } catch (error: unknown) {
      console.error("Sign in error:", error);

      // Type guard to check if error has the expected structure
      if (
        error &&
        typeof error === "object" &&
        "errors" in error &&
        Array.isArray((error as { errors: ClerkError[] }).errors)
      ) {
        const clerkError = error as { errors: ClerkError[] };
        const newErrors: FormErrors = {};

        clerkError.errors.forEach((err: ClerkError) => {
          if (err.meta?.paramName === "identifier") {
            newErrors.email = err.message;
          } else if (err.meta?.paramName === "password") {
            newErrors.password = err.message;
          } else {
            newErrors.general = err.message;
          }
        });

        setFormErrors(newErrors);

        // If there's a general error, also show a toast
        if (newErrors.general) {
          toast.error(newErrors.general);
        }
      } else {
        // Fallback for unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Show loading spinner while checking auth status
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <div className={cn("flex w-full max-w-sm flex-col gap-6 md:max-w-md")}>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <CardDescription>
              Sign in with your account or email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={!isLoaded}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Sign in with Google
                  </Button>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleAppleSignIn}
                    disabled={!isLoaded}
                    variant="outline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                    </svg>
                    Sign in with Apple
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className={formErrors.email ? "border-destructive" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className={
                        formErrors.password ? "border-destructive" : ""
                      }
                    />
                    {formErrors.password && (
                      <p className="text-sm text-destructive">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                  {formErrors.general && (
                    <p className="text-center text-sm text-destructive">
                      {formErrors.general}
                    </p>
                  )}
                  <div className="flex items-center justify-end">
                    <Link href="/forgot-password">
                      <a className="text-sm underline underline-offset-4">
                        Forgot password?
                      </a>
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={!isLoaded}>
                    Sign in
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up">
                    <a className="underline underline-offset-4">Sign up</a>
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
