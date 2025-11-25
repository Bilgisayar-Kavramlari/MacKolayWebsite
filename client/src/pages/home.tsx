import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { MatchCard } from "@/components/match-card";
import { VenueCard } from "@/components/venue-card";
import { FeatureSection } from "@/components/feature-section";
import { TestimonialCard } from "@/components/testimonial-card";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Match, Venue, Testimonial } from "@shared/schema";

import venue1 from "@assets/generated_images/venue_card_thumbnail_1.png";
import venue2 from "@assets/generated_images/venue_card_thumbnail_2.png";
import venue3 from "@assets/generated_images/venue_card_thumbnail_3.png";
import venue4 from "@assets/generated_images/venue_card_thumbnail_4.png";
import venue5 from "@assets/generated_images/venue_card_thumbnail_5.png";
import venue6 from "@assets/generated_images/venue_card_thumbnail_6.png";

export default function Home() {
  const { data: matches, isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const { data: venues, isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />

      <section className="py-16 md:py-24" id="matches">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-upcoming-matches">
              Yaklaşan Maçlar
            </h2>
            <p className="text-lg text-muted-foreground">
              Senin için en uygun maçları seçtik
            </p>
          </div>

          {matchesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : matches && matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.slice(0, 6).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Henüz maç bulunmuyor</p>
              <Button>İlk Maçı Oluştur</Button>
            </div>
          )}
        </div>
      </section>

      <FeatureSection />

      <section className="py-16 md:py-24" id="venues">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-popular-venues">
              Popüler Sahalar
            </h2>
            <p className="text-lg text-muted-foreground">
              Şehrin en iyi halı saha tesisleri
            </p>
          </div>

          {venuesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-56 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : venues && venues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Henüz saha bulunmuyor</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials">
              Oyuncularımız Ne Diyor?
            </h2>
            <p className="text-lg text-muted-foreground">
              Binlerce mutlu oyuncudan geri bildirimler
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                </div>
              ))}
            </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Henüz yorum bulunmuyor</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4" data-testid="text-cta-title">
            Hemen Başla!
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Şimdi kayıt ol, yakınındaki halı saha maçlarına katıl. İlk maçın seni bekliyor!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8"
              data-testid="button-cta-register"
            >
              Ücretsiz Kayıt Ol
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground hover:bg-white/20"
              data-testid="button-cta-learn-more"
            >
              Daha Fazla Bilgi
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
