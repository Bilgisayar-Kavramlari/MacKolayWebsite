import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link 
            href="/"
            className="flex items-center gap-2 text-xl font-black text-primary" 
            data-testid="link-home"
          >
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-black">HS</span>
            </div>
            Halı Saha Maç
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
            href="#matches"
            className="text-base font-semibold leading-6 text-foreground hover:text-primary" 
            data-testid="link-matches"
          >
            Maç Bul
          </Link>
          <Link 
            href="#venues"
            className="text-base font-semibold leading-6 text-foreground hover:text-primary" 
            data-testid="link-venues"
          >
            Saha Kirala
          </Link>
          <Link 
            href="#about"
            className="text-base font-semibold leading-6 text-foreground hover:text-primary" 
            data-testid="link-about"
          >
            Hakkımızda
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="ghost" data-testid="button-login">
            Giriş Yap
          </Button>
          <Button data-testid="button-register">
            Kayıt Ol
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="space-y-2 p-4">
            <Link 
              href="#matches"
              className="block rounded-md px-3 py-2 text-base font-semibold hover:bg-accent" 
              data-testid="link-mobile-matches"
            >
              Maç Bul
            </Link>
            <Link 
              href="#venues"
              className="block rounded-md px-3 py-2 text-base font-semibold hover:bg-accent" 
              data-testid="link-mobile-venues"
            >
              Saha Kirala
            </Link>
            <Link 
              href="#about"
              className="block rounded-md px-3 py-2 text-base font-semibold hover:bg-accent" 
              data-testid="link-mobile-about"
            >
              Hakkımızda
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" className="w-full" data-testid="button-mobile-login">
                Giriş Yap
              </Button>
              <Button className="w-full" data-testid="button-mobile-register">
                Kayıt Ol
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
