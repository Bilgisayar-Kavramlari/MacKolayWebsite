import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import type { Testimonial } from "@shared/schema";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full" data-testid={`card-testimonial-${testimonial.id}`}>
      <CardContent className="pt-6 space-y-4">
        <Quote className="h-8 w-8 text-primary/20" />
        <p className="text-base leading-relaxed italic" data-testid={`text-quote-${testimonial.id}`}>
          "{testimonial.quote}"
        </p>
        <div className="flex items-center gap-4 pt-4">
          <Avatar>
            <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold" data-testid={`text-testimonial-name-${testimonial.id}`}>
              {testimonial.name}
            </div>
            <div className="text-sm text-muted-foreground" data-testid={`text-match-count-${testimonial.id}`}>
              {testimonial.matchCount}+ maç oynadı
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
