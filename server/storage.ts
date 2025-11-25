import { 
  type User, 
  type InsertUser, 
  type Match, 
  type InsertMatch,
  type Venue,
  type InsertVenue,
  type Testimonial,
  type InsertTestimonial
} from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "users.json");

function readUsersFromFile(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users.json:", error);
    return [];
  }
}

function writeUsersToFile(users: User[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to users.json:", error);
    throw new Error("Kullanıcı kaydedilemedi");
  }
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMatches(filters?: { location?: string; date?: string; skillLevel?: string }): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  
  getVenues(): Promise<Venue[]>;
  getVenue(id: string): Promise<Venue | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  
  getTestimonials(): Promise<Testimonial[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private matches: Map<string, Match>;
  private venues: Map<string, Venue>;
  private testimonials: Map<string, Testimonial>;

  constructor() {
    this.users = new Map();
    this.matches = new Map();
    this.venues = new Map();
    this.testimonials = new Map();
    this.initializeData();
  }

  private initializeData() {
    const venueImages = [
      "/assets/generated_images/venue_card_thumbnail_1.png",
      "/assets/generated_images/venue_card_thumbnail_2.png",
      "/assets/generated_images/venue_card_thumbnail_3.png",
      "/assets/generated_images/venue_card_thumbnail_4.png",
      "/assets/generated_images/venue_card_thumbnail_5.png",
      "/assets/generated_images/venue_card_thumbnail_6.png",
    ];

    const venues: InsertVenue[] = [
      {
        name: "Arena Spor Tesisleri",
        location: "Kadıköy, İstanbul",
        imageUrl: venueImages[0],
        amenities: ["Parking", "Shower", "Cafe"],
        available: 8,
      },
      {
        name: "Şampiyon Halı Saha",
        location: "Beşiktaş, İstanbul",
        imageUrl: venueImages[1],
        amenities: ["Parking", "WiFi"],
        available: 5,
      },
      {
        name: "Yıldız Sports Complex",
        location: "Çankaya, Ankara",
        imageUrl: venueImages[2],
        amenities: ["Shower", "Cafe", "WiFi"],
        available: 12,
      },
      {
        name: "Futbol Park",
        location: "Karşıyaka, İzmir",
        imageUrl: venueImages[3],
        amenities: ["Parking", "Shower"],
        available: 6,
      },
      {
        name: "Stadium Halı Saha",
        location: "Çankaya, Ankara",
        imageUrl: venueImages[4],
        amenities: ["Parking", "Cafe", "WiFi"],
        available: 10,
      },
      {
        name: "Pro Football Center",
        location: "Bornova, İzmir",
        imageUrl: venueImages[5],
        amenities: ["Shower", "WiFi", "Cafe"],
        available: 7,
      },
    ];

    venues.forEach(venue => {
      const id = randomUUID();
      this.venues.set(id, { ...venue, id });
    });

    const venueList = Array.from(this.venues.values());

    const matches: InsertMatch[] = [
      {
        venueId: venueList[0].id,
        venueName: venueList[0].name,
        location: venueList[0].location,
        date: "28 Kasım",
        time: "19:00",
        currentPlayers: 8,
        maxPlayers: 12,
        skillLevel: "Orta Seviye",
        price: 50,
        imageUrl: venueList[0].imageUrl,
      },
      {
        venueId: venueList[1].id,
        venueName: venueList[1].name,
        location: venueList[1].location,
        date: "29 Kasım",
        time: "20:30",
        currentPlayers: 10,
        maxPlayers: 14,
        skillLevel: "İleri Seviye",
        price: 60,
        imageUrl: venueList[1].imageUrl,
      },
      {
        venueId: venueList[2].id,
        venueName: venueList[2].name,
        location: venueList[2].location,
        date: "30 Kasım",
        time: "18:00",
        currentPlayers: 6,
        maxPlayers: 10,
        skillLevel: "Başlangıç",
        price: 40,
        imageUrl: venueList[2].imageUrl,
      },
      {
        venueId: venueList[3].id,
        venueName: venueList[3].name,
        location: venueList[3].location,
        date: "1 Aralık",
        time: "17:30",
        currentPlayers: 9,
        maxPlayers: 12,
        skillLevel: "Orta Seviye",
        price: 45,
        imageUrl: venueList[3].imageUrl,
      },
      {
        venueId: venueList[4].id,
        venueName: venueList[4].name,
        location: venueList[4].location,
        date: "2 Aralık",
        time: "21:00",
        currentPlayers: 7,
        maxPlayers: 12,
        skillLevel: "İleri Seviye",
        price: 55,
        imageUrl: venueList[4].imageUrl,
      },
      {
        venueId: venueList[5].id,
        venueName: venueList[5].name,
        location: venueList[5].location,
        date: "3 Aralık",
        time: "19:30",
        currentPlayers: 11,
        maxPlayers: 14,
        skillLevel: "Orta Seviye",
        price: 50,
        imageUrl: venueList[5].imageUrl,
      },
    ];

    matches.forEach(match => {
      const id = randomUUID();
      this.matches.set(id, { ...match, id });
    });

    const testimonials: InsertTestimonial[] = [
      {
        name: "Mehmet Yılmaz",
        quote: "Harika bir uygulama! Artık her hafta düzenli olarak maça katılıyorum. Yeni arkadaşlar edinmek için mükemmel bir platform.",
        matchCount: 156,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet",
      },
      {
        name: "Ayşe Demir",
        quote: "Saha bulmak hiç bu kadar kolay olmamıştı. Arayüz çok kullanışlı ve sahalar gerçekten kaliteli.",
        matchCount: 89,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse",
      },
      {
        name: "Burak Özkan",
        quote: "İş çıkışı maç bulmak için ideal. Lokasyon filtreleme özelliği sayesinde yakınımdaki maçları kolayca buluyorum.",
        matchCount: 203,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Burak",
      },
      {
        name: "Zeynep Kara",
        quote: "Hem eğlenceli hem de sağlıklı vakit geçirmek için harika bir fırsat. Topluluk çok arkadaş canlısı!",
        matchCount: 127,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep",
      },
    ];

    testimonials.forEach(testimonial => {
      const id = randomUUID();
      this.testimonials.set(id, { ...testimonial, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const users = readUsersFromFile();
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = readUsersFromFile();
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = readUsersFromFile();
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      fullName: insertUser.fullName,
      phone: insertUser.phone,
      position: insertUser.position,
      profilePicture: insertUser.profilePicture ?? null,
      height: insertUser.height ?? null,
      weight: insertUser.weight ?? null,
      age: insertUser.age ?? null,
    };
    users.push(user);
    writeUsersToFile(users);
    return user;
  }

  async getMatches(filters?: { location?: string; date?: string; skillLevel?: string }): Promise<Match[]> {
    let matches = Array.from(this.matches.values());

    if (filters) {
      if (filters.location) {
        matches = matches.filter(m => 
          m.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.date) {
        matches = matches.filter(m => m.date === filters.date);
      }
      if (filters.skillLevel) {
        matches = matches.filter(m => m.skillLevel === filters.skillLevel);
      }
    }

    return matches;
  }

  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = { ...insertMatch, id };
    this.matches.set(id, match);
    return match;
  }

  async getVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getVenue(id: string): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async createVenue(insertVenue: InsertVenue): Promise<Venue> {
    const id = randomUUID();
    const venue: Venue = { ...insertVenue, id };
    this.venues.set(id, venue);
    return venue;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
}

export const storage = new MemStorage();
