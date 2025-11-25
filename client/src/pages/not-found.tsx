import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-404-title">
            404
          </h1>
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">
            Sayfa Bulunamadı
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link href="/">
            <Button data-testid="button-go-home">
              Ana Sayfaya Dön
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
