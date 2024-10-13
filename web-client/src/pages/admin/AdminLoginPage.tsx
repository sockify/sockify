import AdminFooter from "@/components/AdminFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const adminLoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});
type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn, isAuthenticated } = useAuth();

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/home");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (data: AdminLoginForm) => {
    const { username, password } = data;

    if (isAuthenticated) {
      toast.error("Already logged in");
      return;
    }

    await login(username, password);
  };

  return (
    <>
      <section className="min-w-screen flex min-h-screen justify-center bg-gray-50">
        <div className="mt-20 h-fit w-full px-4 md:w-2/5">
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-12 w-12 text-primary" />
            </div>
            <h1 className="mb-2 text-4xl">
              <strong>Admin Login</strong>
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoggingIn || isAuthenticated}
              >
                {isLoggingIn && <LoadingSpinner size={16} className="mr-2" />}
                {isLoggingIn ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
        </div>
      </section>
      <AdminFooter />
    </>
  );
}
