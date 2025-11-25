import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [filters, setFilters] = useState<SearchForm>({});

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: "",
      date: "",
      skillLevel: "",
      position: "",
    },
  });

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
      if (!response.ok) throw new Error('Failed to fetch matches');
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
              {matches && (
                <Badge variant="secondary" data-testid="badge-match-count">
                  {matches.length} maç
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
            ) : matches && matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match) => (
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
                      >
                        Maça Katıl
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Maç Bulunamadı</h3>
                  <p className="text-muted-foreground">
                    Arama kriterlerinize uygun maç bulunamadı. Filtreleri değiştirmeyi deneyin.
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
