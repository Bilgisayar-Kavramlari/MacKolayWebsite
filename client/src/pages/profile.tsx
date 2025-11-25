import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  Ruler, 
  Weight, 
  Calendar, 
  LogOut,
  Trophy,
  Target,
  Handshake,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  History
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { User as UserType } from "@shared/schema";

const positionLabels: Record<string, string> = {
  kaleci: "Kaleci",
  defans: "Defans",
  "orta-saha": "Orta Saha",
  forvet: "Forvet",
};

type UserWithScore = Omit<UserType, 'password'>;

const placeholderStats = {
  goals: 0,
  assists: 0,
  matchesPlayed: 0,
};

const placeholderUpcomingMatches = [
  {
    id: "upcoming-1",
    venue: "Arena Spor Tesisleri",
    location: "Kadıköy, İstanbul",
    date: "28 Kasım 2025",
    time: "20:00",
  },
  {
    id: "upcoming-2",
    venue: "Şampiyon Halı Saha",
    location: "Beşiktaş, İstanbul",
    date: "2 Aralık 2025",
    time: "19:00",
  },
  {
    id: "upcoming-3",
    venue: "Yıldız Sports Complex",
    location: "Üsküdar, İstanbul",
    date: "5 Aralık 2025",
    time: "21:00",
  },
];

const placeholderPastMatches = [
  {
    id: "past-1",
    venue: "Futbol Park",
    location: "Ataşehir, İstanbul",
    date: "20 Kasım 2025",
    time: "19:00",
    result: "Galibiyet",
    score: "5-3",
  },
  {
    id: "past-2",
    venue: "Stadium Halı Saha",
    location: "Bakırköy, İstanbul",
    date: "15 Kasım 2025",
    time: "20:00",
    result: "Beraberlik",
    score: "4-4",
  },
  {
    id: "past-3",
    venue: "Gol Sahası",
    location: "Maltepe, İstanbul",
    date: "10 Kasım 2025",
    time: "18:00",
    result: "Mağlubiyet",
    score: "2-6",
  },
  {
    id: "past-4",
    venue: "Arena Spor Tesisleri",
    location: "Kadıköy, İstanbul",
    date: "5 Kasım 2025",
    time: "21:00",
    result: "Galibiyet",
    score: "7-2",
  },
];

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated, clearUser } = useAuth();

  const reliabilityScore = user?.guvenilirlikPuani ?? 100;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cikis", {});
      return response.json();
    },
    onSuccess: () => {
      clearUser();
      queryClient.invalidateQueries({ queryKey: ['/api/profil'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/durum'] });
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/giris");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-4xl space-y-6">
            <Card>
              <CardHeader className="text-center">
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getResultBadgeVariant = (result: string) => {
    switch (result) {
      case "Galibiyet":
        return "default";
      case "Beraberlik":
        return "secondary";
      case "Mağlubiyet":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  {user.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={user.fullName} />
                  ) : null}
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl" data-testid="text-profile-name">
                {user.fullName}
              </CardTitle>
              <CardDescription data-testid="text-profile-username">
                @{user.username}
              </CardDescription>
              {user.position && (
                <div className="flex justify-center mt-2">
                  <Badge variant="secondary" className="gap-1" data-testid="badge-position">
                    <Trophy className="w-3 h-3" />
                    {positionLabels[user.position] || user.position}
                  </Badge>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Kişisel Bilgiler
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kullanıcı Adı</p>
                    <p className="font-medium" data-testid="text-username-value">{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    <p className="font-medium" data-testid="text-phone-value">{user.phone}</p>
                  </div>
                </div>

                {user.height && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Ruler className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Boy</p>
                      <p className="font-medium" data-testid="text-height-value">{user.height} cm</p>
                    </div>
                  </div>
                )}

                {user.weight && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Weight className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Kilo</p>
                      <p className="font-medium" data-testid="text-weight-value">{user.weight} kg</p>
                    </div>
                  </div>
                )}

                {user.age && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Yaş</p>
                      <p className="font-medium" data-testid="text-age-value">{user.age}</p>
                    </div>
                  </div>
                )}

                {user.position && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Trophy className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mevki</p>
                      <p className="font-medium" data-testid="text-position-value">
                        {positionLabels[user.position] || user.position}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  İstatistikler
                </CardTitle>
                <CardDescription>Sezon performansınız</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-center mb-2">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold" data-testid="text-goals-count">
                      {placeholderStats.goals}
                    </p>
                    <p className="text-sm text-muted-foreground">Gol</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-center mb-2">
                      <Handshake className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold" data-testid="text-assists-count">
                      {placeholderStats.assists}
                    </p>
                    <p className="text-sm text-muted-foreground">Asist</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-center mb-2">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold" data-testid="text-matches-count">
                      {placeholderStats.matchesPlayed}
                    </p>
                    <p className="text-sm text-muted-foreground">Maç</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Güvenilirlik Puanı
                </CardTitle>
                <CardDescription>Maçlara katılım güvenilirliğiniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${(reliabilityScore / 100) * 351.86} 351.86`}
                          className="text-primary"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold" data-testid="text-reliability-score">
                          {reliabilityScore}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      100 üzerinden {reliabilityScore} puan
                    </p>
                    {reliabilityScore >= 80 ? (
                      <Badge variant="default" className="mt-2">
                        <Star className="w-3 h-3 mr-1" />
                        Güvenilir Oyuncu
                      </Badge>
                    ) : reliabilityScore >= 50 ? (
                      <Badge variant="secondary" className="mt-2">
                        <Star className="w-3 h-3 mr-1" />
                        Orta Güvenilirlik
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="mt-2">
                        <Star className="w-3 h-3 mr-1" />
                        Düşük Güvenilirlik
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Yaklaşan Maçlar
              </CardTitle>
              <CardDescription>Katılacağınız maçlar</CardDescription>
            </CardHeader>
            <CardContent>
              {placeholderUpcomingMatches.length > 0 ? (
                <div className="space-y-3">
                  {placeholderUpcomingMatches.map((match, index) => (
                    <div key={match.id}>
                      <div 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-muted/50 hover-elevate"
                        data-testid={`card-upcoming-match-${match.id}`}
                      >
                        <div className="flex-1">
                          <p className="font-semibold" data-testid={`text-venue-${match.id}`}>
                            {match.venue}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {match.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {match.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {match.time}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-details-${match.id}`}>
                          Detaylar
                        </Button>
                      </div>
                      {index < placeholderUpcomingMatches.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Henüz yaklaşan maçınız bulunmamaktadır.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5" />
                Geçmiş Maçlar
              </CardTitle>
              <CardDescription>Katıldığınız önceki maçlar</CardDescription>
            </CardHeader>
            <CardContent>
              {placeholderPastMatches.length > 0 ? (
                <div className="space-y-3">
                  {placeholderPastMatches.map((match, index) => (
                    <div key={match.id}>
                      <div 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-muted/50"
                        data-testid={`card-past-match-${match.id}`}
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold" data-testid={`text-past-venue-${match.id}`}>
                              {match.venue}
                            </p>
                            <Badge 
                              variant={getResultBadgeVariant(match.result)}
                              data-testid={`badge-result-${match.id}`}
                            >
                              {match.result}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {match.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {match.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {match.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-lg font-bold px-3 py-1 rounded bg-background"
                            data-testid={`text-score-${match.id}`}
                          >
                            {match.score}
                          </span>
                        </div>
                      </div>
                      {index < placeholderPastMatches.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Henüz geçmiş maçınız bulunmamaktadır.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button 
                variant="destructive" 
                className="w-full gap-2"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                {logoutMutation.isPending ? "Çıkış Yapılıyor..." : "Çıkış Yap"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
