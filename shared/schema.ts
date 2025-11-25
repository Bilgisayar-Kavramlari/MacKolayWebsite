import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id").notNull(),
  venueName: text("venue_name").notNull(),
  location: text("location").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  currentPlayers: integer("current_players").notNull(),
  maxPlayers: integer("max_players").notNull(),
  skillLevel: text("skill_level").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const venues = pgTable("venues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  amenities: text("amenities").array().notNull(),
  available: integer("available").notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  quote: text("quote").notNull(),
  matchCount: integer("match_count").notNull(),
  avatarUrl: text("avatar_url").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true });
export const insertVenueSchema = createInsertSchema(venues).omit({ id: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Venue = typeof venues.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
