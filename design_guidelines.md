# Design Guidelines: Halı Saha Maç Uygulaması

## Design Approach
**Reference-Based Design** inspired by Airbnb's booking experience and Meetup's community feel, creating an energetic, sports-focused platform that makes finding and joining matches effortless and exciting.

## Core Design Principles
- **Action-First**: Prioritize "Maç Bul" (Find Match) as the primary user journey
- **Energy & Community**: Vibrant, active atmosphere that reflects the excitement of sports
- **Instant Clarity**: Users should understand how to find/join matches within 3 seconds
- **Mobile-Ready**: Responsive design optimized for on-the-go match finding

## Typography
**Font Stack**: 
- Headlines: Inter Bold/Black (800-900 weight) for impact
- Body: Inter Regular/Medium (400-500)
- Accents: Inter SemiBold (600)

**Hierarchy**:
- Hero Title: text-5xl md:text-7xl font-black
- Section Headers: text-3xl md:text-4xl font-bold
- Card Titles: text-xl font-semibold
- Body Text: text-base leading-relaxed
- Buttons/CTAs: text-base font-semibold

## Layout System
**Spacing Units**: Tailwind 4, 6, 8, 12, 16, 24 (maintaining consistent rhythm)
- Section padding: py-16 md:py-24
- Card spacing: p-6
- Element gaps: gap-4 to gap-8

**Container Strategy**:
- Full-width hero: w-full
- Content sections: max-w-7xl mx-auto px-4

## Component Library

### Navigation
**Sticky Header** with:
- Logo + "Halı Saha Maç" branding (left)
- "Maç Bul", "Saha Kirala", "Hakkımızda" links (center)
- "Giriş Yap" + "Kayıt Ol" buttons (right, prominent CTA styling)
- Mobile: Hamburger menu with full-screen overlay

### Hero Section
**Full-width impactful hero** featuring:
- Large background image of active football match or modern halı saha field
- Overlay gradient for text readability
- Centered content with:
  - Bold headline: "Yakınındaki Halı Saha Maçlarını Bul"
  - Subheading: "Arkadaşlarınla oyna, yeni insanlarla tanış"
  - Search bar with location + date picker + "Maç Ara" button (backdrop-blur-md bg-white/90 treatment)
  - Quick stats: "500+ Aktif Maç", "2000+ Oyuncu", "50+ Saha"

### Match Cards (2-column desktop, 1-column mobile)
- Card image showing field/venue
- Match date/time badge (top-right overlay)
- Venue name + location
- Player count indicator: "8/12 Oyuncu" with visual progress
- Skill level tag: "Orta Seviye"
- Price prominently displayed
- "Katıl" CTA button

### Feature Sections
**Three-Column Grid**:
1. "Hızlı Maç Bul" - Icon + description
2. "Güvenli Ödeme" - Icon + description
3. "Topluluk Desteği" - Icon + description

### Venue/Field Cards
- High-quality field photos (masonry grid layout)
- Venue name + location
- Amenities icons (parking, shower, cafe)
- Availability status
- "Detayları Gör" link

### Social Proof Section
**Player Testimonials** (2-column):
- User photo (circular)
- Quote in Turkish
- Name + match count: "150+ maç oynadı"

### Footer
**Multi-column layout**:
- Column 1: Logo + tagline
- Column 2: "Hızlı Linkler" (Maç Bul, Saha Kirala, Fiyatlar)
- Column 3: "Destek" (SSS, İletişim, Şartlar)
- Column 4: Social media icons + newsletter signup
- Bottom: Copyright + language selector

## Interactive Elements
- Hover states on cards: subtle lift (transform translateY(-2px))
- CTA buttons: Bold, solid backgrounds with subtle shadows
- Search inputs: Clean borders with focus states (ring-2)
- Match cards: Clickable with cursor-pointer

## Images

### Required Images:
1. **Hero Background**: Dynamic action shot of players on halı saha field (high-energy, modern facility). Full-width, height 80vh. Use overlay gradient (from-black/60 to-black/30)

2. **Match Card Thumbnails**: 6-8 images of various halı saha venues showing well-maintained fields from appealing angles. Aspect ratio 16:9, rounded corners (rounded-lg)

3. **Feature Section Icons**: Use Heroicons for "Hızlı Maç Bul" (MagnifyingGlassIcon), "Güvenli Ödeme" (ShieldCheckIcon), "Topluluk" (UsersIcon)

4. **Venue Showcase**: 4-6 professional photos of popular halı saha facilities in masonry grid layout

5. **Testimonial Photos**: 4 circular user avatars (diverse, authentic)

## Page Structure
1. Sticky Navigation
2. Hero with Search (80vh with hero image)
3. Upcoming Matches Grid (py-16)
4. How It Works (3 features, py-16)
5. Popular Venues Masonry (py-16)
6. Testimonials (py-16, subtle background treatment)
7. Final CTA Banner (py-20, bold colored background)
8. Comprehensive Footer

**Total estimated sections**: 8 comprehensive sections creating a complete, engaging experience for Turkish football match booking platform.