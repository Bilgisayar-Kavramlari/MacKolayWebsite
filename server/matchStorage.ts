import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const MATCHES_FILE = path.join(process.cwd(), "matches.json");

export interface MacVerisi {
  macId: string;
  konum: string;
  tarihSaat: string;
  gerekliMevkiler: string[];
  katilanOyuncular: string[];
  organizatorId: string;
}

export type YeniMac = Omit<MacVerisi, "macId" | "katilanOyuncular">;

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
    konum: newMatch.konum,
    tarihSaat: newMatch.tarihSaat,
    gerekliMevkiler: newMatch.gerekliMevkiler,
    katilanOyuncular: [],
    organizatorId: newMatch.organizatorId,
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
