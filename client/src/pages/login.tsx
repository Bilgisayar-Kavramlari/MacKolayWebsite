import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { LogIn, User, Lock } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const loginSchema = z.object({
  username: z.string().min(1, "Kullanıcı adı gereklidir"),
  password: z.string().min(1, "Şifre gereklidir"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/giris", data);
      return response.json();
    },
    onSuccess: async (data) => {
      if (data.user) {
        setUser(data.user);
      }
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/api/auth/durum'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/profil'] }),
      ]);
      
      await queryClient.refetchQueries({ queryKey: ['/api/auth/durum'] });
      
      toast({
        title: "Başarılı",
        description: data.message || "Giriş başarılı!",
      });
      
      setLocation("/profil");
    },
    onError: async (error: any) => {
      let errorMessage = "Hatalı Kullanıcı Adı veya Şifre";
      if (error.message) {
        try {
          const parsed = JSON.parse(error.message);
          errorMessage = parsed.error || errorMessage;
        } catch {
          errorMessage = error.message;
        }
      }
      setLoginError(errorMessage);
      toast({
        variant: "destructive",
        title: "Hata",
        description: errorMessage,
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    setLoginError(null);
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl" data-testid="text-login-title">Giriş Yap</CardTitle>
            <CardDescription>
              Hesabınıza giriş yaparak maçlara katılın
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {loginError && (
                  <div 
                    className="p-3 rounded-md bg-destructive/10 text-destructive text-sm"
                    data-testid="text-login-error"
                  >
                    {loginError}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kullanıcı Adı</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Kullanıcı adınızı girin"
                            className="pl-10"
                            data-testid="input-username"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>Şifre</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Şifrenizi girin"
                            className="pl-10"
                            data-testid="input-password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Hesabınız yok mu?{" "}
                  <Link href="/kayit" className="text-primary hover:underline" data-testid="link-register">
                    Kayıt Olun
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
