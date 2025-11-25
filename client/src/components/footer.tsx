import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-black">HS</span>
              </div>
              <span className="text-xl font-black text-primary">Halı Saha Maç</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Yakınındaki halı saha maçlarını bul, arkadaşlarınla oyna, yeni insanlarla tanış.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-quick-links">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="#matches"
                  className="text-muted-foreground hover:text-primary" 
                  data-testid="link-footer-matches"
                >
                  Maç Bul
                </Link>
              </li>
              <li>
                <Link 
                  href="#venues"
                  className="text-muted-foreground hover:text-primary" 
                  data-testid="link-footer-venues"
                >
                  Saha Kirala
                </Link>
              </li>
              <li>
                <Link 
                  href="#pricing"
                  className="text-muted-foreground hover:text-primary" 
                  data-testid="link-footer-pricing"
                >
                  Fiyatlar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-support">Destek</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="#faq"
                  className="text-muted-foreground hover:text-primary" 
                  data-testid="link-footer-faq"
                >
                  SSS
                </Link>
              </li>
              <li>
                <Link 
                  href="#contact"
                  className="text-muted-foreground hover:text-primary" 
                  data-testid="link-footer-contact"
                >
                  İletişim
                </Link>
              </li>
              <li>
                <Link 
                  href="#terms"
                  className="text-muted-foreground hover:text-primary" 
                  data-testid="link-footer-terms"
                >
                  Kullanım Şartları
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold" data-testid="text-footer-newsletter">Bülten</h3>
            <p className="text-sm text-muted-foreground">
              Yeni maçlardan haberdar ol
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="E-posta adresiniz"
                className="text-sm"
                data-testid="input-newsletter"
              />
              <Button data-testid="button-subscribe">
                Abone Ol
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="button-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-youtube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2024 Halı Saha Maç. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4 text-sm">
            <Link 
              href="#privacy"
              className="text-muted-foreground hover:text-primary" 
              data-testid="link-privacy"
            >
              Gizlilik Politikası
            </Link>
            <Link 
              href="#cookies"
              className="text-muted-foreground hover:text-primary" 
              data-testid="link-cookies"
            >
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
