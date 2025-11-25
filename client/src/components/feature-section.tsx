import { Search, Shield, Users } from "lucide-react";

export function FeatureSection() {
  const features = [
    {
      icon: Search,
      title: "Hızlı Maç Bul",
      description: "Yakınındaki maçları anında keşfet, seviyene uygun oyunlara katıl.",
    },
    {
      icon: Shield,
      title: "Güvenli Ödeme",
      description: "SSL korumalı ödeme sistemi ile güvenle işlem yap.",
    },
    {
      icon: Users,
      title: "Topluluk Desteği",
      description: "Yeni arkadaşlar edin, aktif futbol topluluğuna katıl.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30" id="about">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
            Neden Bizi Seçmelisiniz?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Halı saha maçlarını bulmanın en kolay ve güvenli yolu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="text-center space-y-4"
                data-testid={`feature-${index}`}
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold" data-testid={`text-feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed" data-testid={`text-feature-desc-${index}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
