import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, Coffee, Car, Droplet } from "lucide-react";
import type { Venue } from "@shared/schema";

interface VenueCardProps {
  venue: Venue;
}

const amenityIcons: Record<string, any> = {
  "parking": Car,
  "shower": Droplet,
  "cafe": Coffee,
  "wifi": Wifi,
};

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid={`card-venue-${venue.id}`}>
      <div className="relative h-56 overflow-hidden">
        <img 
          src={venue.imageUrl} 
          alt={venue.name}
          className="h-full w-full object-cover"
        />
      </div>

      <CardHeader className="space-y-2">
        <h3 className="text-xl font-semibold" data-testid={`text-venue-name-${venue.id}`}>
          {venue.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span data-testid={`text-venue-location-${venue.id}`}>{venue.location}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {venue.amenities.map((amenity) => {
            const Icon = amenityIcons[amenity.toLowerCase()];
            return (
              <Badge key={amenity} variant="secondary" className="gap-1" data-testid={`badge-amenity-${venue.id}-${amenity}`}>
                {Icon && <Icon className="h-3 w-3" />}
                {amenity}
              </Badge>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Müsaitlik</span>
          <span className="font-semibold text-primary" data-testid={`text-availability-${venue.id}`}>
            {venue.available} saat
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
