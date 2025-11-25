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

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/matches", async (req, res) => {
    try {
      const { location, date, skillLevel } = req.query;
      const filters = {
        location: location as string | undefined,
        date: date as string | undefined,
        skillLevel: skillLevel as string | undefined,
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

  const httpServer = createServer(app);

  return httpServer;
}
