import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar } from "lucide-react";
import heroImage from "@assets/generated_images/hero_background_football_action.png";

export function Hero() {
  const [, setLocation] = useLocation();
  const [konum, setKonum] = useState("");
  const [tarih, setTarih] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (konum.trim()) {
      params.set('konum', konum.trim());
    }
    if (tarih) {
      params.set('tarih', tarih);
    }
    const queryString = params.toString();
    setLocation(queryString ? `/mac-bul?${queryString}` : '/mac-bul');
  };

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
      
      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-black text-white md:text-7xl mb-4" data-testid="text-hero-title">
          Yakınındaki Halı Saha Maçlarını Bul
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl" data-testid="text-hero-subtitle">
          Arkadaşlarınla oyna, yeni insanlarla tanış
        </p>

        <div className="w-full max-w-3xl mb-12">
          <div className="rounded-lg bg-white/90 backdrop-blur-md p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 rounded-md border bg-background px-4 py-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Şehir veya semt" 
                  className="border-0 p-0 focus-visible:ring-0"
                  value={konum}
                  onChange={(e) => setKonum(e.target.value)}
                  data-testid="input-hero-location"
                />
              </div>
              <div className="flex items-center gap-2 rounded-md border bg-background px-4 py-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <Input 
                  type="date"
                  className="border-0 p-0 focus-visible:ring-0"
                  value={tarih}
                  onChange={(e) => setTarih(e.target.value)}
                  data-testid="input-hero-date"
                />
              </div>
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleSearch}
                data-testid="button-hero-search"
              >
                <Search className="mr-2 h-5 w-5" />
                Maç Ara
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-white">
          <div className="text-center" data-testid="stat-matches">
            <div className="text-3xl md:text-4xl font-black">500+</div>
            <div className="text-sm md:text-base text-white/80">Aktif Maç</div>
          </div>
          <div className="text-center" data-testid="stat-players">
            <div className="text-3xl md:text-4xl font-black">2000+</div>
            <div className="text-sm md:text-base text-white/80">Oyuncu</div>
          </div>
          <div className="text-center" data-testid="stat-venues">
            <div className="text-3xl md:text-4xl font-black">50+</div>
            <div className="text-sm md:text-base text-white/80">Saha</div>
          </div>
        </div>
      </div>
    </div>
  );
}
