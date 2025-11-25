import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearch, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  Trophy,
  Filter
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { Match } from "@shared/schema";

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
}

const searchSchema = z.object({
  location: z.string().optional(),
  date: z.string().optional(),
  skillLevel: z.string().optional(),
  position: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const skillLevelOptions = [
  { value: "all", label: "Tümü" },
  { value: "Başlangıç", label: "Başlangıç" },
  { value: "Orta Seviye", label: "Orta" },
  { value: "İleri Seviye", label: "İleri" },
];

const positionOptions = [
  { value: "all", label: "Tümü" },
  { value: "kaleci", label: "Kaleci" },
  { value: "defans", label: "Defans" },
  { value: "orta-saha", label: "Orta Saha" },
  { value: "forvet", label: "Forvet" },
];

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
};

export default function FindMatch() {
  const searchString = useSearch();
  const urlParams = new URLSearchParams(searchString);
  const [, setNavigationLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const initialLocation = urlParams.get('konum') || urlParams.get('location') || "";
  const initialDate = urlParams.get('tarih') || urlParams.get('date') || "";
  
  const [filters, setFilters] = useState<SearchForm>({
    location: initialLocation || undefined,
    date: initialDate || undefined,
  });

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: initialLocation,
      date: initialDate,
      skillLevel: "",
      position: "",
    },
  });

  // Mutation for joining a match
  const joinMatchMutation = useMutation({
    mutationFn: async (macId: string) => {
      const response = await apiRequest("POST", `/api/maclar/${macId}/katil`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Başarılı!",
        description: data.message || "Maça başarıyla katıldınız!",
      });
      // Invalidate caches to reflect the change
      queryClient.invalidateQueries({ queryKey: ['/api/maclarim'] });
      queryClient.invalidateQueries({ queryKey: ['/api/maclar'] });
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Maça katılırken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleJoinMatch = (macId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Giriş Yapmalısınız",
        description: "Maça katılmak için önce giriş yapmalısınız.",
        variant: "destructive",
      });
      setNavigationLocation("/giris");
      return;
    }
    joinMatchMutation.mutate(macId);
  };

  useEffect(() => {
    if (initialLocation || initialDate) {
      setFilters({
        location: initialLocation || undefined,
        date: initialDate || undefined,
      });
    }
  }, []);

  const buildQueryUrl = () => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.date) params.set('date', filters.date);
    if (filters.skillLevel) params.set('skillLevel', filters.skillLevel);
    if (filters.position) params.set('position', filters.position);
    const queryString = params.toString();
    return queryString ? `/api/matches?${queryString}` : '/api/matches';
  };

  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ['/api/matches', filters.location, filters.date, filters.skillLevel, filters.position],
    queryFn: async () => {
      const response = await fetch(buildQueryUrl());
      if (!response.ok) throw new Error('Maçlar yüklenemedi');
      return response.json();
    },
  });

  const buildMaclarQueryUrl = () => {
    const params = new URLSearchParams();
    if (filters.location) params.set('konum', filters.location);
    if (filters.date) params.set('tarih', filters.date);
    if (filters.position) params.set('mevki', filters.position);
    const queryString = params.toString();
    return queryString ? `/api/maclar?${queryString}` : '/api/maclar';
  };

  const { data: maclar, isLoading: maclarLoading } = useQuery<MacVerisi[]>({
    queryKey: ['/api/maclar', filters.location, filters.date, filters.position],
    queryFn: async () => {
      const response = await fetch(buildMaclarQueryUrl());
      if (!response.ok) throw new Error('Kullanıcı maçları yüklenemedi');
      return response.json();
    },
  });

  const onSubmit = (data: SearchForm) => {
    setFilters({
      location: data.location || undefined,
      date: data.date || undefined,
      skillLevel: data.skillLevel === "all" ? undefined : data.skillLevel,
      position: data.position === "all" ? undefined : data.position,
    });
  };

  const clearFilters = () => {
    form.reset();
    setFilters({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Maç Bul</h1>
            <p className="text-muted-foreground">
              Yakınındaki maçları ara ve katıl
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Arama Filtreleri
              </CardTitle>
              <CardDescription>
                Kriterlere göre maç ara
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Konum</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Şehir veya semt girin"
                                className="pl-10"
                                data-testid="input-location"
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tarih</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="date"
                                className="pl-10"
                                data-testid="input-date"
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="skillLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seviye</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-skill-level">
                                <Trophy className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Seviye seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {skillLevelOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aranan Mevki</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-position">
                                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Mevki seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {positionOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" className="gap-2" data-testid="button-search">
                      <Search className="w-4 h-4" />
                      Maç Ara
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={clearFilters}
                      data-testid="button-clear-filters"
                    >
                      Filtreleri Temizle
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Mevcut Maçlar
              {(matches || maclar) && (
                <Badge variant="secondary" data-testid="badge-match-count">
                  {(matches?.length || 0) + (maclar?.length || 0)} maç
                </Badge>
              )}
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
            ) : (matches && matches.length > 0) || (maclar && maclar.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches?.map((match) => (
                  <Card 
                    key={match.id} 
                    className="hover-elevate cursor-pointer"
                    data-testid={`card-match-${match.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg" data-testid={`text-match-title-${match.id}`}>
                          {match.venueName}
                        </h3>
                        <Badge variant="outline">
                          {skillLevelLabels[match.skillLevel] || match.skillLevel}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span data-testid={`text-match-location-${match.id}`}>
                            {match.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span data-testid={`text-match-date-${match.id}`}>
                            {match.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span data-testid={`text-match-time-${match.id}`}>
                            {match.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span data-testid={`text-match-players-${match.id}`}>
                            {match.currentPlayers}/{match.maxPlayers} oyuncu
                          </span>
                        </div>
                      </div>

                      {match.neededPositions && match.neededPositions.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Aranan Mevkiler:</p>
                          <div className="flex flex-wrap gap-1">
                            {match.neededPositions.map((pos) => (
                              <Badge key={pos} variant="outline" className="text-xs">
                                {positionLabels[pos] || pos}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-lg font-bold text-primary">
                          {match.price} TL
                        </span>
                        <Badge variant="secondary">
                          {match.maxPlayers - match.currentPlayers} kişi aranıyor
                        </Badge>
                      </div>

                      <Button 
                        className="w-full mt-4" 
                        size="sm"
                        data-testid={`button-join-match-${match.id}`}
                        onClick={() => handleJoinMatch(match.id)}
                        disabled={joinMatchMutation.isPending}
                      >
                        {joinMatchMutation.isPending ? "Katılınıyor..." : "Maça Katıl"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {maclar?.map((mac) => (
                  <Card 
                    key={mac.macId} 
                    className="hover-elevate cursor-pointer"
                    data-testid={`card-mac-${mac.macId}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg" data-testid={`text-mac-saha-${mac.macId}`}>
                          {mac.sahaAdi}
                        </h3>
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
                          <span data-testid={`text-mac-tarih-${mac.macId}`}>
                            {mac.tarih}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span data-testid={`text-mac-saat-${mac.macId}`}>
                            {mac.saat}
                          </span>
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

                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-lg font-bold text-primary">
                          {mac.fiyat} TL
                        </span>
                        <Badge variant="secondary">
                          {Math.max(0, mac.oyuncuSayisi - (mac.mevcutOyuncuSayisi - 1))} boş yer
                        </Badge>
                      </div>

                      <Button 
                        className="w-full mt-4" 
                        size="sm"
                        data-testid={`button-join-mac-${mac.macId}`}
                        onClick={() => handleJoinMatch(mac.macId)}
                        disabled={joinMatchMutation.isPending}
                      >
                        {joinMatchMutation.isPending ? "Katılınıyor..." : "Maça Katıl"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center" data-testid="text-no-results">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Maç Bulunamadı</h3>
                  <p className="text-muted-foreground">
                    Aradığınız kriterlere uygun maç bulunamadı.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
