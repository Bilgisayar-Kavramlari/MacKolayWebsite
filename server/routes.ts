import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = insertUserSchema.extend({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  fullName: z.string().min(2, "Ad soyad gereklidir"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  position: z.string().min(1, "Mevki seçiniz"),
});

const loginSchema = z.object({
  username: z.string().min(1, "Kullanıcı adı gereklidir"),
  password: z.string().min(1, "Şifre gereklidir"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/matches", async (req, res) => {
    try {
      const { location, date, skillLevel, position } = req.query;
      const filters = {
        location: location as string | undefined,
        date: date as string | undefined,
        skillLevel: skillLevel as string | undefined,
        position: position as string | undefined,
      };
      
      const matches = await storage.getMatches(filters);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.getMatch(req.params.id);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  app.get("/api/venues", async (req, res) => {
    try {
      const venues = await storage.getVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch venues" });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      const venue = await storage.getVenue(req.params.id);
      if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
      }
      res.json(venue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch venue" });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const { venueName, location, date, time, maxPlayers, skillLevel, price, currentPlayers, venueId, imageUrl } = req.body;
      
      if (!venueName || !location || !date || !time || !maxPlayers || !skillLevel || price === undefined) {
        return res.status(400).json({ error: "Tüm alanları doldurunuz" });
      }

      const newMatch = await storage.createMatch({
        venueId: venueId || "custom",
        venueName,
        location,
        date,
        time,
        currentPlayers: currentPlayers || 1,
        maxPlayers: parseInt(maxPlayers),
        skillLevel,
        price: parseInt(price),
        imageUrl: imageUrl || "/placeholder-match.jpg",
      });

      res.status(201).json({
        message: "Maç ilanı başarıyla oluşturuldu!",
        match: newMatch,
      });
    } catch (error) {
      console.error("Create match error:", error);
      res.status(500).json({ error: "Maç ilanı oluşturulamadı" });
    }
  });

  app.post("/api/kayit", async (req, res) => {
    try {
      const validationResult = registerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || "Geçersiz form verisi";
        return res.status(400).json({ error: errorMessage });
      }

      const { username, password, fullName, phone, position, height, weight, age, profilePicture } = validationResult.data;

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        fullName,
        phone,
        position,
        height: height || undefined,
        weight: weight || undefined,
        age: age || undefined,
        profilePicture: profilePicture || undefined,
      });

      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json({
        message: "Kayıt başarılı! Giriş yapabilirsiniz.",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Kayıt işlemi sırasında bir hata oluştu" });
    }
  });

  app.post("/api/giris", async (req, res) => {
    try {
      const validationResult = loginSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || "Geçersiz form verisi";
        return res.status(400).json({ error: errorMessage });
      }

      const { username, password } = validationResult.data;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Hatalı Kullanıcı Adı veya Şifre" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Hatalı Kullanıcı Adı veya Şifre" });
      }

      req.session.userId = user.id;
      req.session.username = user.username;

      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        message: "Giriş başarılı!",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Giriş işlemi sırasında bir hata oluştu" });
    }
  });

  app.get("/api/profil", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Oturum açmanız gerekiyor" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Profil bilgileri alınamadı" });
    }
  });

  app.post("/api/cikis", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Çıkış yapılamadı" });
      }
      res.json({ message: "Çıkış yapıldı" });
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
