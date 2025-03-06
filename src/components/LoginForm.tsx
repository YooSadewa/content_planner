import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserRound, Lock, LogIn, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const { replace } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "username_not_verified"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        username: formData.get("username"),
        password: formData.get("password"),
      });

      if (!res?.error) {
        setStatus("success");
        Swal.fire({
          title: "Good job!",
          text: "You successfully logged in!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          replace("/");
        });
      } else if (res?.status === 401) {
        setStatus("error");
      } else if (res?.status === 403) {
        setStatus("username_not_verified");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 mt-5">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                />
              </div>
            </div>

            {status === "error" && (
              <Alert variant="destructive" className="">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="mt-1">
                  Login tidak sesuai. Silahkan Coba lagi.
                </AlertDescription>
              </Alert>
            )}

            {status === "username_not_verified" && (
              <div className="flex items-center gap-2 text-sm p-3 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span>Please verify your username before logging in.</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign in</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-col space-y-2 pt-4">
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign up
            </a>
          </div>
          <div className="text-center text-sm text-gray-500">
            <a
              href="/forgot-password"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Forgot your password?
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
