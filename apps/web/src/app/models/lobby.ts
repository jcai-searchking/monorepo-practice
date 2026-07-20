// Mirrors the backend `publicLobbySelect` shape returned by GET /lobbies and
// GET /lobbies/:id. Dates arrive as ISO strings over JSON.

export type SkillLevel = 'OPEN' | 'INTERMEDIATE' | 'INTERMEDIATE_PLUS';
export type GenderFormat = 'MENS' | 'WOMENS' | 'COED';
export type Role = 'ADMIN' | 'HOST' | 'PLAYER';

export interface PublicUser {
  id: string;
  name: string;
  role: Role;
  createdAt: string;
  pictureUrl: string | null;
}

export interface Lobby {
  id: string;
  lobbyName: string;
  location: string;
  startTime: string;
  endTime: string;
  price: number;
  skillLevel: SkillLevel;
  genderFormat: GenderFormat;
  allowToApply: boolean;
  createdAt: string;
  host: PublicUser;
}

// Response envelopes from the API
export interface LobbyListResponse {
  success: boolean;
  lobbies: Lobby[];
}

export interface LobbyDetailResponse {
  success: boolean;
  lobby: Lobby;
}

export interface CreateLobbyRequest {
  lobbyName: string;
  location: string;
  startTime: string;   // ISO-ish string; backend coerces to Date
  endTime: string;
  price: number;
  skillLevel: SkillLevel;
  genderFormat: GenderFormat;
  allowToApply: boolean;
}

export const SKILL_LABELS: Record<SkillLevel, string> = {
  OPEN: 'Open',
  INTERMEDIATE: 'Intermediate',
  INTERMEDIATE_PLUS: 'Intermediate+',
};

export const GENDER_LABELS: Record<GenderFormat, string> = {
  MENS: "Men's",
  WOMENS: "Women's",
  COED: 'Co-ed',
};
