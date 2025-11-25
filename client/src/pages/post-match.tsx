import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Trophy,
  Megaphone,
  Clock
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const postMatchSchema = z.object({
  venueName: z.string().min(3, "Saha adı en az 3 karakter olmalıdır"),
  location: z.string().min(2, "Konum gereklidir"),
  date: z.string().min(1, "Tarih gereklidir"),
  time: z.string().min(1, "Saat gereklidir"),
  maxPlayers: z.string().min(1, "Oyuncu sayısı gereklidir"),
  skillLevel: z.string().min(1, "Seviye seçiniz"),
  price: z.string().min(1, "Fiyat gereklidir"),
  neededPositions: z.array(z.string()).min(1, "En az bir mevki seçiniz"),
});

type PostMatchForm = z.infer<typeof postMatchSchema>;

const positionOptions = [
  { id: "kaleci", label: "Kaleci" },
  { id: "defans", label: "Defans" },
  { id: "orta-saha", label: "Orta Saha" },
  { id: "forvet", label: "Forvet" },
];

const skillLevelOptions = [
  { value: "beginner", label: "Başlangıç" },
  { value: "intermediate", label: "Orta" },
  { value: "advanced", label: "İleri" },
  { value: "all", label: "Tüm Seviyeler" },
];

export default function PostMatch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PostMatchForm>({
    resolver: zodResolver(postMatchSchema),
    defaultValues: {
      venueName: "",
      location: "",
      date: "",
      time: "",
      maxPlayers: "",
      skillLevel: "",
      price: "",
      neededPositions: [],
    },
  });

  const postMatchMutation = useMutation({
    mutationFn: async (data: PostMatchForm) => {
      const response = await apiRequest("POST", "/api/matches", {
        venueName: data.venueName,
        location: data.location,
        date: data.date,
        time: data.time,
        maxPlayers: parseInt(data.maxPlayers),
        skillLevel: data.skillLevel,
        price: parseInt(data.price),
        currentPlayers: 1,
        venueId: "custom",
        imageUrl: "/placeholder-match.jpg",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: "Başarılı",
        description: "Maç ilanınız yayınlandı!",
      });
      setLocation("/mac-bul");
    },
    onError: (error: any) => {
      let errorMessage = "Maç ilanı oluşturulamadı";
      if (error.message) {
        try {
          const parsed = JSON.parse(error.message);
          errorMessage = parsed.error || errorMessage;
        } catch {
          errorMessage = error.message;
        }
      }
      toast({
        variant: "destructive",
        title: "Hata",
        description: errorMessage,
      });
    },
  });

  const onSubmit = (data: PostMatchForm) => {
    setIsSubmitting(true);
    postMatchMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <Megaphone className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Maç İlanı Ver</h1>
            <p className="text-muted-foreground">
              Maç organize et ve oyuncu bul
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Maç Bilgileri</CardTitle>
              <CardDescription>
                Maç detaylarını doldurun ve yayınlayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="venueName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saha Adı</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Örn: Arena Spor Tesisleri"
                            data-testid="input-venue-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                              placeholder="Saha adresi veya semt"
                              className="pl-10"
                              data-testid="input-location"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saat</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="time"
                                className="pl-10"
                                data-testid="input-time"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="maxPlayers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İhtiyaç Duyulan Oyuncu Sayısı</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                min="1"
                                max="22"
                                placeholder="Örn: 10"
                                className="pl-10"
                                data-testid="input-max-players"
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
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kişi Başı Ücret (TL)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Örn: 50"
                              data-testid="input-price"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="neededPositions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Gerekli Mevkiler</FormLabel>
                          <FormDescription>
                            İhtiyaç duyduğunuz mevkileri seçin
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {positionOptions.map((position) => (
                            <FormField
                              key={position.id}
                              control={form.control}
                              name="neededPositions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={position.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(position.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, position.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== position.id
                                                )
                                              );
                                        }}
                                        data-testid={`checkbox-position-${position.id}`}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-normal cursor-pointer">
                                        {position.label}
                                      </FormLabel>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full gap-2"
                    disabled={postMatchMutation.isPending}
                    data-testid="button-publish-match"
                  >
                    <Megaphone className="w-4 h-4" />
                    {postMatchMutation.isPending ? "Yayınlanıyor..." : "Maç Yayınla"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
