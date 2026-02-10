import type { BlockType } from '../types';

export interface BlockTypeStyle {
  accent: string;
  bg: string;
  border: string;
}

export const blockTypeLabels: Record<BlockType, string> = {
  accumulation: 'ACUMULAÇÃO',
  transmutation: 'TRANSMUTAÇÃO',
  intensification: 'INTENSIFICAÇÃO',
  realization: 'REALIZAÇÃO',
  deload: 'DELOAD',
};

export const blockTypeColors: Record<BlockType, BlockTypeStyle> = {
  accumulation: { accent: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/30' },
  transmutation: { accent: 'text-accent-gold', bg: 'bg-accent-gold/10', border: 'border-accent-gold/30' },
  intensification: { accent: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/30' },
  realization: { accent: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/30' },
  deload: { accent: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'border-accent-blue/30' },
};

// Badge variant mapping for existing Badge component
export const blockTypeBadgeClass: Record<BlockType, string> = {
  accumulation: 'bg-accent-green/20 text-accent-green border-accent-green/30',
  transmutation: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30',
  intensification: 'bg-accent-red/20 text-accent-red border-accent-red/30',
  realization: 'bg-accent-red/20 text-accent-red border-accent-red/30',
  deload: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
};
