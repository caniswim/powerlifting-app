import type { AthleteProfile } from '../../types';
import { getItem, setItem, KEYS } from './core';

const defaultProfile: AthleteProfile = {
  bodyweight: 84,
  squat1RM: 250,
  bench1RM: 170,
  deadlift1RM: 260,
  ohp1RM: 0,
  total: 680,
  dots: 0,
  // Máximo em padrão de competição (Bloco 1 — "Ficar Legal", baseline.md §4).
  // Deliberadamente abaixo dos 1RM acima: os declarados foram medidos em
  // condições que a IPF não aceitaria (pin squat acima do paralelo, supino sem
  // pausa real, terra com strap e touch-and-go).
  trainingMax: { squat: 215, bench: 160, deadlift: 240 },
};

export function getProfile(): AthleteProfile {
  return getItem<AthleteProfile>(KEYS.PROFILE, defaultProfile);
}

export function saveProfile(profile: AthleteProfile): void {
  setItem(KEYS.PROFILE, profile);
}
