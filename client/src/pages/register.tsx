import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, User, Upload } from "lucide-react";

const registerFormSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  fullName: z.string().min(2, "Ad soyad gereklidir"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  height: z.coerce.number().min(100, "Geçerli bir boy giriniz").max(250, "Geçerli bir boy giriniz").optional(),
  weight: z.coerce.number().min(30, "Geçerli bir kilo giriniz").max(200, "Geçerli bir kilo giriniz").optional(),
  age: z.coerce.number().min(10, "Geçerli bir yaş giriniz").max(80, "Geçerli bir yaş giriniz").optional(),
  position: z.string().min(1, "Mevki seçiniz"),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      phone: "",
      height: undefined,
      weight: undefined,
      age: undefined,
      position: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (profileFile) {
        formData.append("profilePicture", profileFile);
      }
      return apiRequest("POST", "/api/kayit", data);
    },
    onSuccess: () => {
      toast({
        title: "Kayıt Başarılı!",
        description: "Hesabınız oluşturuldu. Giriş yapabilirsiniz.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Kayıt Hatası",
        description: error.message || "Kayıt işlemi başarısız oldu.",
        variant: "destructive",
      });
    },
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-register-title">Kayıt Ol</CardTitle>
              <CardDescription data-testid="text-register-description">
                Halı saha maçlarına katılmak için hesap oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kullanıcı Adı *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ornek_kullanici"
                              data-testid="input-username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şifre *</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              data-testid="input-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Soyad *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ahmet Yılmaz"
                            data-testid="input-fullname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon Numarası *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="0555 123 45 67"
                            data-testid="input-phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Profil Resmi Yükle</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {profilePreview ? (
                          <img
                            src={profilePreview}
                            alt="Profil önizleme"
                            className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                            data-testid="img-profile-preview"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                            <User className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="cursor-pointer"
                          data-testid="input-profile-picture"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG veya GIF. Maksimum 5MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Boy (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="175"
                              data-testid="input-height"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kilo (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="70"
                              data-testid="input-weight"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yaş</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25"
                              data-testid="input-age"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mevki *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-position">
                              <SelectValue placeholder="Mevki seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kaleci" data-testid="option-kaleci">Kaleci</SelectItem>
                            <SelectItem value="defans" data-testid="option-defans">Defans</SelectItem>
                            <SelectItem value="orta-saha" data-testid="option-orta-saha">Orta Saha</SelectItem>
                            <SelectItem value="forvet" data-testid="option-forvet">Forvet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={registerMutation.isPending}
                      data-testid="button-register-submit"
                    >
                      {registerMutation.isPending ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    Zaten hesabınız var mı?{" "}
                    <Link href="/giris" className="text-primary hover:underline" data-testid="link-login">
                      Giriş Yap
                    </Link>
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
