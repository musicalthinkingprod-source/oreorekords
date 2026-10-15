import {
  siSpotify,
  siApplemusic,
  siYoutubemusic,
  siYoutube,
  siTidal,
  siDeezer,
  siItunes,
  siPandora,
  siSoundcloud,
  siAudiomack,
} from "simple-icons";

export type PlataformaId =
  | "spotify"
  | "appleMusic"
  | "youtubeMusic"
  | "youtube"
  | "tidal"
  | "deezer"
  | "amazonMusic"
  | "itunes"
  | "pandora"
  | "soundcloud"
  | "audiomack";

export interface Plataforma {
  id: PlataformaId;
  nombre: string;
  color: string;
  // path SVG en viewBox 0 0 24 24; null usa un ícono genérico
  path: string | null;
  principal: boolean;
}

// El orden define cómo se muestran: primero las principales, luego "Más"
export const plataformas: Plataforma[] = [
  { id: "spotify", nombre: "Spotify", color: `#${siSpotify.hex}`, path: siSpotify.path, principal: true },
  { id: "appleMusic", nombre: "Apple Music", color: `#${siApplemusic.hex}`, path: siApplemusic.path, principal: true },
  { id: "youtubeMusic", nombre: "YouTube Music", color: `#${siYoutubemusic.hex}`, path: siYoutubemusic.path, principal: true },
  { id: "youtube", nombre: "YouTube", color: `#${siYoutube.hex}`, path: siYoutube.path, principal: true },
  { id: "tidal", nombre: "Tidal", color: "#ffffff", path: siTidal.path, principal: true },
  { id: "deezer", nombre: "Deezer", color: `#${siDeezer.hex}`, path: siDeezer.path, principal: true },
  { id: "amazonMusic", nombre: "Amazon Music", color: "#25D1DA", path: null, principal: false },
  { id: "itunes", nombre: "iTunes Store", color: `#${siItunes.hex}`, path: siItunes.path, principal: false },
  { id: "pandora", nombre: "Pandora", color: "#3668FF", path: siPandora.path, principal: false },
  { id: "soundcloud", nombre: "SoundCloud", color: `#${siSoundcloud.hex}`, path: siSoundcloud.path, principal: false },
  { id: "audiomack", nombre: "Audiomack", color: `#${siAudiomack.hex}`, path: siAudiomack.path, principal: false },
];

export const principales = plataformas.filter((p) => p.principal);
export const secundarias = plataformas.filter((p) => !p.principal);
