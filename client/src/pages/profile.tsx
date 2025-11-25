import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Phone, 
  Ruler, 
  Weight, 
  Calendar, 
  LogOut,
  Trophy
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

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useQuery<Omit<UserType, 'password'>>({
    queryKey: ['/api/profil'],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cikis", {});
      return response.json();
    },
    onSuccess: () => {
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

  useEffect(() => {
    if (error) {
      setLocation("/giris");
    }
  }, [error, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
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
            
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4">
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
              </div>

              <div className="pt-4 border-t">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
