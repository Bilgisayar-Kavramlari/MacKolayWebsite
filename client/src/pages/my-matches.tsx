import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  Trophy,
  UserCircle,
  Phone
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface MacVerisi {
  macId: string;
  sahaAdi: string;
  konum: string;
  tarih: string;
  saat: string;
  oyuncuSayisi: number;
  mevcutOyuncuSayisi: number;
  seviye: string;
  fiyat: number;
  gerekliMevkiler: string[];
  katilanOyuncular: string[];
  organizatorId: string;
  organizatorTelefon?: string | null;
}

interface MaclarimResponse {
  organizatorOldugum: MacVerisi[];
  katildigim: MacVerisi[];
}

const positionLabels: Record<string, string> = {
  "kaleci": "Kaleci",
  "defans": "Defans",
  "orta-saha": "Orta Saha",
  "forvet": "Forvet",
};

const skillLevelLabels: Record<string, string> = {
  "Başlangıç": "Başlangıç",
  "Orta Seviye": "Orta",
  "İleri Seviye": "İleri",
  "Tüm Seviyeler": "Tüm Seviyeler",
};

export default function MyMatches() {
  const [, setLocation] = useLocation();

  const { data: maclarim, isLoading, error, isError } = useQuery<MaclarimResponse>({
    queryKey: ['/api/maclarim'],
    queryFn: async () => {
      const response = await fetch('/api/maclarim', { credentials: 'include' });
      if (!response.ok) {
        if (response.status === 401) {
          const err = new Error('UNAUTHORIZED');
          (err as any).status = 401;
          throw err;
        }
        throw new Error('Maçlarınız yüklenemedi');
      }
      return response.json();
    },
    retry: (failureCount, error: any) => {
      if (error?.status === 401 || error?.message === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (isError && error) {
      const errorMessage = error instanceof Error ? error.message : '';
      const errorStatus = (error as any)?.status;
      if (errorStatus === 401 || errorMessage === 'UNAUTHORIZED') {
        setLocation("/giris");
      }
    }
  }, [isError, error, setLocation]);

  const renderMatchCard = (mac: MacVerisi, isOrganizer: boolean) => (
    <Card 
      key={mac.macId} 
      className="hover-elevate"
      data-testid={`card-mac-${mac.macId}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg" data-testid={`text-mac-saha-${mac.macId}`}>
              {mac.sahaAdi}
            </h3>
            {isOrganizer && (
              <Badge variant="default" className="text-xs">
                Organizatör
              </Badge>
            )}
          </div>
          <Badge variant="outline">
            {skillLevelLabels[mac.seviye] || mac.seviye}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span data-testid={`text-mac-konum-${mac.macId}`}>{mac.konum}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span data-testid={`text-mac-tarih-${mac.macId}`}>{mac.tarih}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span data-testid={`text-mac-saat-${mac.macId}`}>{mac.saat}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span data-testid={`text-mac-oyuncular-${mac.macId}`}>
              {mac.oyuncuSayisi} oyuncu aranıyor
            </span>
          </div>
        </div>

        {mac.gerekliMevkiler && mac.gerekliMevkiler.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Aranan Mevkiler:</p>
            <div className="flex flex-wrap gap-1">
              {mac.gerekliMevkiler.map((pos) => (
                <Badge key={pos} variant="outline" className="text-xs">
                  {positionLabels[pos] || pos}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!isOrganizer && mac.organizatorTelefon && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-sm bg-primary/10 p-2 rounded-md">
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">Organizatör Telefon Numarası:</span>
              <a 
                href={`tel:${mac.organizatorTelefon}`} 
                className="text-primary hover:underline font-semibold"
                data-testid={`link-organizator-telefon-${mac.macId}`}
              >
                {mac.organizatorTelefon}
              </a>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <span className="text-lg font-bold text-primary">
            {mac.fiyat} TL
          </span>
          <Badge variant="secondary">
            {Math.max(0, mac.oyuncuSayisi - (mac.mevcutOyuncuSayisi - 1))} boş yer
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Maçlarım</h1>
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const organizatorMaclari = maclarim?.organizatorOldugum || [];
  const katildigimMaclar = maclarim?.katildigim || [];
  const tumMaclar = [...organizatorMaclari, ...katildigimMaclar.filter(
    mac => !organizatorMaclari.some(org => org.macId === mac.macId)
  )];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <UserCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Maçlarım</h1>
            <p className="text-muted-foreground">
              Organize ettiğiniz ve katıldığınız maçlar
            </p>
          </div>

          <Tabs defaultValue="tumu" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="tumu" data-testid="tab-tumu">
                Tümü ({tumMaclar.length})
              </TabsTrigger>
              <TabsTrigger value="organizator" data-testid="tab-organizator">
                Organizatör ({organizatorMaclari.length})
              </TabsTrigger>
              <TabsTrigger value="katilim" data-testid="tab-katilim">
                Katıldıklarım ({katildigimMaclar.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tumu">
              {tumMaclar.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tumMaclar.map((mac) => 
                    renderMatchCard(mac, organizatorMaclari.some(org => org.macId === mac.macId))
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center" data-testid="text-no-matches">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Henüz Maçınız Yok</h3>
                    <p className="text-muted-foreground">
                      Maç organize edebilir veya mevcut maçlara katılabilirsiniz.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="organizator">
              {organizatorMaclari.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {organizatorMaclari.map((mac) => renderMatchCard(mac, true))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center" data-testid="text-no-organized">
                    <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Organize Ettiğiniz Maç Yok</h3>
                    <p className="text-muted-foreground">
                      Yeni bir maç organize etmek için "Maç İlanı Ver" sayfasını ziyaret edin.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="katilim">
              {katildigimMaclar.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {katildigimMaclar.map((mac) => 
                    renderMatchCard(mac, organizatorMaclari.some(org => org.macId === mac.macId))
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center" data-testid="text-no-joined">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Katıldığınız Maç Yok</h3>
                    <p className="text-muted-foreground">
                      "Maç Bul" sayfasından uygun maçlara katılabilirsiniz.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
