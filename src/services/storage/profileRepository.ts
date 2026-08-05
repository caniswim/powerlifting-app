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
};

export function getProfile(): AthleteProfile {
  return getItem<AthleteProfile>(KEYS.PROFILE, defaultProfile);
}

export function saveProfile(profile: AthleteProfile): void {
  setItem(KEYS.PROFILE, profile);
}
