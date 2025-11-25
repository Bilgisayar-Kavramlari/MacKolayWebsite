import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const MATCHES_FILE = path.join(process.cwd(), "matches.json");

export interface GeriBildirim {
  userId: string;
  yorum: string;
  oylama: number;
}

export interface MacVerisi {
  macId: string;
  sahaAdi: string;
  konum: string;
  tarih: string;
  saat: string;
  oyuncuSayisi: number;
  mevcutOyuncuSayisi: number;
  seviye: string;
  fiyat: number;
  gerekliMevkiler: string[];
  katilanOyuncular: string[];
  organizatorId: string;
  geriBildirimler: GeriBildirim[];
}

export type YeniMac = Omit<MacVerisi, "macId" | "katilanOyuncular" | "mevcutOyuncuSayisi" | "geriBildirimler">;

function readMatchesFromFile(): MacVerisi[] {
  try {
    if (!fs.existsSync(MATCHES_FILE)) {
      fs.writeFileSync(MATCHES_FILE, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(MATCHES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading matches.json:", error);
    return [];
  }
}

function writeMatchesToFile(matches: MacVerisi[]): void {
  try {
    fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to matches.json:", error);
    throw new Error("Maç kaydedilemedi");
  }
}

export function getAllMatches(): MacVerisi[] {
  return readMatchesFromFile();
}

export function getMatchById(macId: string): MacVerisi | undefined {
  const matches = readMatchesFromFile();
  return matches.find(m => m.macId === macId);
}

export function saveMatch(newMatch: YeniMac): MacVerisi {
  const matches = readMatchesFromFile();
  const macId = randomUUID();
  
  const match: MacVerisi = {
    macId,
    sahaAdi: newMatch.sahaAdi,
    konum: newMatch.konum,
    tarih: newMatch.tarih,
    saat: newMatch.saat,
    oyuncuSayisi: newMatch.oyuncuSayisi,
    mevcutOyuncuSayisi: 1,
    seviye: newMatch.seviye,
    fiyat: newMatch.fiyat,
    gerekliMevkiler: newMatch.gerekliMevkiler,
    katilanOyuncular: [],
    organizatorId: newMatch.organizatorId,
    geriBildirimler: [],
  };
  
  matches.push(match);
  writeMatchesToFile(matches);
  
  return match;
}

export function addPlayerToMatch(macId: string, oyuncuId: string): MacVerisi | null {
  const matches = readMatchesFromFile();
  const matchIndex = matches.findIndex(m => m.macId === macId);
  
  if (matchIndex === -1) {
    return null;
  }
  
  if (!matches[matchIndex].katilanOyuncular.includes(oyuncuId)) {
    matches[matchIndex].katilanOyuncular.push(oyuncuId);
    matches[matchIndex].mevcutOyuncuSayisi = matches[matchIndex].katilanOyuncular.length + 1;
    writeMatchesToFile(matches);
  }
  
  return matches[matchIndex];
}

export function removePlayerFromMatch(macId: string, oyuncuId: string): MacVerisi | null {
  const matches = readMatchesFromFile();
  const matchIndex = matches.findIndex(m => m.macId === macId);
  
  if (matchIndex === -1) {
    return null;
  }
  
  matches[matchIndex].katilanOyuncular = matches[matchIndex].katilanOyuncular.filter(
    id => id !== oyuncuId
  );
  matches[matchIndex].mevcutOyuncuSayisi = matches[matchIndex].katilanOyuncular.length + 1;
  writeMatchesToFile(matches);
  
  return matches[matchIndex];
}

export function deleteMatch(macId: string): boolean {
  const matches = readMatchesFromFile();
  const filteredMatches = matches.filter(m => m.macId !== macId);
  
  if (filteredMatches.length === matches.length) {
    return false;
  }
  
  writeMatchesToFile(filteredMatches);
  return true;
}

/**
 * Maça geri bildirim ekler
 * @param macId - Maç ID'si
 * @param odaklar - Geri bildirim yapan kullanıcı ID'si
 * @param yorum - Kullanıcı yorumu
 * @param oylama - Oylama puanı (1-5 arası)
 * @returns Güncellenmiş maç objesi veya null (maç bulunamazsa)
 */
export function addFeedbackToMatch(
  macId: string, 
  odaklar: string, 
  yorum: string, 
  oylama: number
): MacVerisi | null {
  const matches = readMatchesFromFile();
  const matchIndex = matches.findIndex(m => m.macId === macId);
  
  if (matchIndex === -1) {
    return null;
  }
  
  // Ensure geriBildirimler array exists (for backward compatibility)
  if (!matches[matchIndex].geriBildirimler) {
    matches[matchIndex].geriBildirimler = [];
  }
  
  const geriBildirim: GeriBildirim = {
    userId: odaklar,
    yorum,
    oylama,
  };
  
  matches[matchIndex].geriBildirimler.push(geriBildirim);
  writeMatchesToFile(matches);
  
  console.log(`Geri bildirim eklendi: Maç ${macId}, Kullanıcı ${odaklar}`);
  
  return matches[matchIndex];
}
