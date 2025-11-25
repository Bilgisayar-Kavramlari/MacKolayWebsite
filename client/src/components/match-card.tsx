import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import type { Match } from "@shared/schema";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const playerPercentage = (match.currentPlayers / match.maxPlayers) * 100;

  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid={`card-match-${match.id}`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={match.imageUrl} 
          alt={match.venueName}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary text-primary-foreground shadow-lg" data-testid={`badge-date-${match.id}`}>
            {match.date}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-2">
        <h3 className="text-xl font-semibold line-clamp-1" data-testid={`text-venue-${match.id}`}>
          {match.venueName}
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span data-testid={`text-location-${match.id}`}>{match.location}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span data-testid={`text-time-${match.id}`}>{match.time}</span>
          </div>
          <Badge variant="secondary" data-testid={`badge-skill-${match.id}`}>
            {match.skillLevel}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium" data-testid={`text-players-${match.id}`}>
                {match.currentPlayers}/{match.maxPlayers} Oyuncu
              </span>
            </div>
          </div>
          <Progress value={playerPercentage} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary" data-testid={`text-price-${match.id}`}>
            ₺{match.price}
          </div>
          <span className="text-sm text-muted-foreground">/ kişi</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" data-testid={`button-join-${match.id}`}>
          Katıl
        </Button>
      </CardFooter>
    </Card>
  );
}
