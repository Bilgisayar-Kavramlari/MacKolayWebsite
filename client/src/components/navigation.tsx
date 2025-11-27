import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, clearUser } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cikis", {});
      return response.json();
    },
    onSuccess: () => {
      clearUser();
      queryClient.invalidateQueries({ queryKey: ['/api/auth/durum'] });
      queryClient.invalidateQueries({ queryKey: ['/api/profil'] });
      toast({
        title: "Çıkış Yapıldı",
        description: "Başarıyla çıkış yaptınız.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu.",
      });
    },
  });

  const isLoggedIn = isAuthenticated;

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link 
            href="/"
            className="flex items-center gap-2 text-xl font-black text-primary" 
            data-testid="link-home"
          >
            <img 
              src="/mac_kolay_logo_transparent.png" 
              alt="Maç Kolay Logo" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-black tracking-tight">Maç Kolay</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          <Link 
            href="/"
            className="text-base font-semibold leading-6 text-foreground hover:text-primary" 
            data-testid="link-ana-sayfa"
          >
            Ana Sayfa
          </Link>
          <Link 
            href="/mac-bul"
            className="text-base font-semibold leading-6 text-foreground hover:text-primary" 
            data-testid="link-mac-bul"
          >
            Maç Bul
          </Link>
          {isLoggedIn && (
            <>
              <Link 
                href="/mac-ilan-ver"
                className="text-base font-semibold leading-6 text-foreground hover:text-primary" 
                data-testid="link-mac-ilan-ver"
              >
                Maç İlanı Ver
              </Link>
              <Link 
                href="/maclarim"
                className="text-base font-semibold leading-6 text-foreground hover:text-primary" 
                data-testid="link-maclarim"
              >
                Maçlarım
              </Link>
            </>
          )}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.username ? getInitials(user.username) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profil" className="flex items-center gap-2 cursor-pointer" data-testid="link-profil">
                    <User className="w-4 h-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2 cursor-pointer text-destructive"
                  data-testid="button-cikis"
                >
                  <LogOut className="w-4 h-4" />
                  {logoutMutation.isPending ? "Çıkış Yapılıyor..." : "Çıkış Yap"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/giris">
                <Button variant="ghost" data-testid="button-login">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/kayit">
                <Button data-testid="button-register">
                  Kayıt Ol
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="space-y-2 p-4">
            <Link 
              href="/"
              className="block rounded-md px-3 py-2 text-base font-semibold hover:bg-accent" 
              data-testid="link-mobile-ana-sayfa"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/mac-bul"
              className="block rounded-md px-3 py-2 text-base font-semibold hover:bg-accent" 
              data-testid="link-mobile-mac-bul"
              onClick={() => setMobileMenuOpen(false)}
            >
              Maç Bul
            </Link>
            {isLoggedIn && (
              <>
                <Link 
                  href="/mac-ilan-ver"
                  className="block rounded-md px-3 py-2 text-base font-semibold hover:bg-accent" 
                  data-testid="link-mobile-mac-ilan-ver"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Maç İlanı Ver
                </Link>
                <Link 
                  href="/maclarim"
                  className="block rounded-md px-3 py-2 text-base font-semibold hover:bg-accent" 
                  data-testid="link-mobile-maclarim"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Maçlarım
                </Link>
              </>
            )}
            <div className="flex flex-col gap-2 pt-4 border-t">
              {isLoggedIn ? (
                <>
                  <Link href="/profil" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full gap-2" data-testid="button-mobile-profil">
                      <User className="w-4 h-4" />
                      Profil
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="w-full gap-2"
                    onClick={() => {
                      logoutMutation.mutate();
                      setMobileMenuOpen(false);
                    }}
                    disabled={logoutMutation.isPending}
                    data-testid="button-mobile-cikis"
                  >
                    <LogOut className="w-4 h-4" />
                    {logoutMutation.isPending ? "Çıkış Yapılıyor..." : "Çıkış Yap"}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/giris" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full" data-testid="button-mobile-login">
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/kayit" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" data-testid="button-mobile-register">
                      Kayıt Ol
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
