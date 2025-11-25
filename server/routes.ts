import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, updateReliabilityScore } from "./storage";
import { getAllMatches, saveMatch, getMatchById, addPlayerToMatch, removePlayerFromMatch, addFeedbackToMatch, type MacVerisi, type YeniMac } from "./matchStorage";
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

// Authentication middleware
function isAuthenticated(req: any, res: any, next: any) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Oturum açmanız gerekiyor", redirect: "/giris" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth status check endpoint - no cache to ensure fresh auth state
  app.get("/api/auth/durum", (req, res) => {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    if (req.session && req.session.userId) {
      res.json({ 
        authenticated: true, 
        userId: req.session.userId,
        username: req.session.username 
      });
    } else {
      res.json({ authenticated: false });
    }
  });
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
      res.status(500).json({ error: "Maçlar yüklenemedi" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.getMatch(req.params.id);
      if (!match) {
        return res.status(404).json({ error: "Maç bulunamadı" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Maç bilgisi yüklenemedi" });
    }
  });

  app.get("/api/venues", async (req, res) => {
    try {
      const venues = await storage.getVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: "Sahalar yüklenemedi" });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      const venue = await storage.getVenue(req.params.id);
      if (!venue) {
        return res.status(404).json({ error: "Saha bulunamadı" });
      }
      res.json(venue);
    } catch (error) {
      res.status(500).json({ error: "Saha bilgisi yüklenemedi" });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Yorumlar yüklenemedi" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const { venueName, location, date, time, maxPlayers, skillLevel, price, currentPlayers, venueId, imageUrl, neededPositions } = req.body;
      
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
        neededPositions: neededPositions || [],
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
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    if (!req.session.userId) {
      return res.status(401).json({ error: "Oturum açmanız gerekiyor" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        ...userWithoutPassword,
        guvenilirlikPuani: (user as any).guvenilirlikPuani ?? 100,
      });
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

  app.get("/api/maclar", (req, res) => {
    try {
      const { konum, mevki, tarih } = req.query;
      let matches = getAllMatches();

      if (konum && typeof konum === "string") {
        matches = matches.filter(m =>
          m.konum.toLowerCase().includes(konum.toLowerCase())
        );
      }

      if (mevki && typeof mevki === "string") {
        matches = matches.filter(m =>
          m.gerekliMevkiler.some(
            pos => pos.toLowerCase() === mevki.toLowerCase()
          )
        );
      }

      if (tarih && typeof tarih === "string") {
        matches = matches.filter(m =>
          m.tarih.includes(tarih)
        );
      }

      res.json(matches);
    } catch (error) {
      console.error("Error fetching maclar:", error);
      res.status(500).json({ error: "Maçlar alınamadı" });
    }
  });

  app.post("/api/maclar", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Oturum açmanız gerekiyor" });
    }

    try {
      const { 
        sahaAdi, 
        konum, 
        tarih, 
        saat, 
        oyuncuSayisi, 
        seviye, 
        fiyat, 
        gerekliMevkiler 
      } = req.body;

      if (!sahaAdi || !konum || !tarih || !saat || !oyuncuSayisi || !seviye || fiyat === undefined || !gerekliMevkiler) {
        return res.status(400).json({ error: "Tüm alanları doldurunuz" });
      }

      const newMatch = saveMatch({
        sahaAdi,
        konum,
        tarih,
        saat,
        oyuncuSayisi: parseInt(oyuncuSayisi),
        seviye,
        fiyat: parseInt(fiyat),
        gerekliMevkiler,
        organizatorId: req.session.userId,
      });

      res.status(201).json({
        message: "Maç başarıyla yayınlandı!",
        mac: newMatch,
      });
    } catch (error) {
      console.error("Create maclar error:", error);
      res.status(500).json({ error: "Maç ilanı oluşturulamadı" });
    }
  });

  app.post("/api/maclar/:macId/katil", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Oturum açmanız gerekiyor" });
    }

    try {
      const match = addPlayerToMatch(req.params.macId, req.session.userId);
      if (!match) {
        return res.status(404).json({ error: "Maç bulunamadı" });
      }
      res.json({
        message: "Maça başarıyla katıldınız!",
        mac: match,
      });
    } catch (error) {
      console.error("Join match error:", error);
      res.status(500).json({ error: "Maça katılınamadı" });
    }
  });

  // Maçtan ayrılma / iptal etme - Güvenilirlik puanı düşürme örneği
  app.post("/api/maclar/:macId/ayril", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Oturum açmanız gerekiyor" });
    }

    try {
      const match = removePlayerFromMatch(req.params.macId, req.session.userId);
      if (!match) {
        return res.status(404).json({ error: "Maç bulunamadı" });
      }

      // Son dakika iptal durumunda güvenilirlik puanını düşür (-10 puan)
      // Örnek: Maç tarihi yakınsa daha fazla puan düşürülebilir
      const updatedUser = updateReliabilityScore(req.session.userId, -10);
      
      res.json({
        message: "Maçtan ayrıldınız. Son dakika iptali nedeniyle güvenilirlik puanınız düşürüldü.",
        mac: match,
        yeniGuvenilirlikPuani: updatedUser?.guvenilirlikPuani ?? null,
      });
    } catch (error) {
      console.error("Leave match error:", error);
      res.status(500).json({ error: "Maçtan ayrılınamadı" });
    }
  });

  // Maça geri bildirim gönderme
  app.post("/api/maclar/:macId/geri-bildirim", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Geri bildirim göndermek için oturum açmanız gerekiyor" });
    }

    try {
      const { yorum, oylama } = req.body;

      // Validation
      if (!yorum || yorum.trim().length === 0) {
        return res.status(400).json({ error: "Yorum alanı boş bırakılamaz" });
      }

      if (oylama === undefined || oylama < 1 || oylama > 5) {
        return res.status(400).json({ error: "Oylama 1-5 arasında bir değer olmalıdır" });
      }

      const updatedMatch = addFeedbackToMatch(
        req.params.macId,
        req.session.userId,
        yorum.trim(),
        parseInt(oylama)
      );

      if (!updatedMatch) {
        return res.status(404).json({ error: "Maç bulunamadı" });
      }

      res.status(201).json({
        message: "Geri bildiriminiz başarıyla gönderildi!",
        mac: updatedMatch,
      });
    } catch (error) {
      console.error("Feedback error:", error);
      res.status(500).json({ error: "Geri bildirim gönderilemedi" });
    }
  });

  // GET /api/maclar/:macId - Get single match details with organizer phone for joined users only
  app.get("/api/maclar/:macId", async (req, res) => {
    try {
      const match = getMatchById(req.params.macId);
      if (!match) {
        return res.status(404).json({ error: "Maç bulunamadı" });
      }

      const userId = req.session.userId;
      const isAuthenticated = !!userId;
      const isParticipant = isAuthenticated && match.katilanOyuncular.includes(userId);
      const isOrganizer = isAuthenticated && match.organizatorId === userId;
      const isInvolved = isParticipant || isOrganizer;

      // Only show organizer phone to authenticated users who have JOINED (not organizer themselves)
      let organizatorTelefon: string | null = null;
      if (isParticipant && !isOrganizer) {
        const organizer = await storage.getUser(match.organizatorId);
        if (organizer) {
          organizatorTelefon = organizer.phone;
        }
      }

      // Scrub sensitive fields for unauthenticated or non-involved users
      if (!isInvolved) {
        // Return public info only - no participant list or organizer ID
        res.json({
          macId: match.macId,
          sahaAdi: match.sahaAdi,
          konum: match.konum,
          tarih: match.tarih,
          saat: match.saat,
          oyuncuSayisi: match.oyuncuSayisi,
          mevcutOyuncuSayisi: match.mevcutOyuncuSayisi,
          seviye: match.seviye,
          fiyat: match.fiyat,
          gerekliMevkiler: match.gerekliMevkiler,
          organizatorTelefon: null,
        });
      } else {
        // Full info for involved users
        res.json({
          ...match,
          organizatorTelefon,
        });
      }
    } catch (error) {
      console.error("Get match error:", error);
      res.status(500).json({ error: "Maç bilgisi alınamadı" });
    }
  });

  // GET /api/maclarim - Get user's matches (organized and joined)
  app.get("/api/maclarim", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Oturum açmanız gerekiyor" });
    }

    try {
      const userId = req.session.userId;
      const tumMaclar = getAllMatches();
      
      // Matches where user is the organizer
      const organizatorOldugum = tumMaclar.filter(mac => mac.organizatorId === userId);
      
      // Matches where user has joined (includes both as participant and organizer)
      const katildigimRaw = tumMaclar.filter(mac => 
        mac.katilanOyuncular.includes(userId) || mac.organizatorId === userId
      );

      // Add organizer phone only to matches where user is a PARTICIPANT (not organizer)
      const katildigim = await Promise.all(katildigimRaw.map(async (mac) => {
        const isParticipant = mac.katilanOyuncular.includes(userId);
        const isOrganizer = mac.organizatorId === userId;
        
        // Only show phone if user is a participant but NOT the organizer
        let organizatorTelefon: string | null = null;
        if (isParticipant && !isOrganizer) {
          const organizer = await storage.getUser(mac.organizatorId);
          organizatorTelefon = organizer?.phone || null;
        }
        
        return {
          ...mac,
          organizatorTelefon,
        };
      }));

      res.json({
        organizatorOldugum,
        katildigim,
      });
    } catch (error) {
      console.error("Maclarim error:", error);
      res.status(500).json({ error: "Maçlarınız yüklenemedi" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
