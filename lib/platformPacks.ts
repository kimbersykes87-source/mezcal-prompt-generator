import type { PlatformCompositionPack, PlatformFormat } from '@/types';

// Platform-specific composition rules and constraints

export const PLATFORM_PACKS: Record<PlatformFormat, PlatformCompositionPack> = {
  '9x16': {
    format: '9x16',
    resolution: { width: 1080, height: 1920 },
    safeZones: {
      top: 8,      // 8% from top (TikTok/IG UI)
      bottom: 18,  // 18% from bottom (captions, interactions)
      right: 12,   // 12% from right (side UI)
    },
    subjectScale: {
      min: 55,  // Hero occupies 55% minimum
      max: 70,  // Hero occupies 70% maximum
    },
    croppingRules: [
      'never crop card corners',
      'never crop glass rim or copita top',
      'keep all critical card details visible',
      'maintain complete border visibility on hero card',
      'avoid cutting off hands at wrist - show full gesture or none',
      'props must not be bisected at frame edge',
    ],
  },
  '4x5': {
    format: '4x5',
    resolution: { width: 1080, height: 1350 },
    safeZones: {
      top: 6,     // 6% from top
      bottom: 6,  // 6% from bottom
      left: 5,    // 5% from left
      right: 5,   // 5% from right
    },
    subjectScale: {
      min: 60,  // Hero occupies 60% minimum
      max: 75,  // Hero occupies 75% maximum
    },
    croppingRules: [
      'never crop card corners',
      'never crop glass rim or copita top',
      'keep all critical card details visible',
      'maintain complete border visibility on hero card',
      'avoid cutting off hands at wrist - show full gesture or none',
      'props must not be bisected at frame edge',
      'suitable for IG carousel cover - ensure key subject stays centered',
    ],
  },
};

export function getPlatformPack(format: PlatformFormat): PlatformCompositionPack {
  return PLATFORM_PACKS[format];
}

export function getPlatformResolution(format: PlatformFormat): string {
  const pack = getPlatformPack(format);
  return `${pack.resolution.width}x${pack.resolution.height}`;
}

export function getSafeZoneInstructions(format: PlatformFormat): string {
  const pack = getPlatformPack(format);
  const parts: string[] = [];
  
  if (pack.safeZones.top) {
    parts.push(`keep critical content ${pack.safeZones.top}% clear from top edge`);
  }
  if (pack.safeZones.bottom) {
    parts.push(`keep critical content ${pack.safeZones.bottom}% clear from bottom edge`);
  }
  if (pack.safeZones.left) {
    parts.push(`keep critical content ${pack.safeZones.left}% clear from left edge`);
  }
  if (pack.safeZones.right) {
    parts.push(`keep critical content ${pack.safeZones.right}% clear from right edge`);
  }
  
  return parts.join(', ');
}

export function getSubjectScaleInstructions(format: PlatformFormat): string {
  const pack = getPlatformPack(format);
  return `hero subject must occupy ${pack.subjectScale.min}% to ${pack.subjectScale.max}% of frame height`;
}

export function getCroppingInstructions(format: PlatformFormat): string[] {
  const pack = getPlatformPack(format);
  return pack.croppingRules;
}

// Intensity to visual language mapping
export interface IntensityMapping {
  range: string;
  sceneEnergy: string[];
  propDensity: string;
  cameraStyle: string[];
  motionPlanIntensity: string; // for video only
}

export const INTENSITY_MAPPINGS: IntensityMapping[] = [
  {
    range: '0-20',
    sceneEnergy: ['museum calm', 'meditative stillness', 'minimal movement', 'zen precision'],
    propDensity: '0-2 props maximum, extreme restraint',
    cameraStyle: ['locked tripod', 'static composition', 'formal symmetry', 'architectural precision'],
    motionPlanIntensity: 'minimal: subtle focus pulls only, no camera movement',
  },
  {
    range: '21-50',
    sceneEnergy: ['social ready', 'approachable energy', 'subtle action', 'inviting presence'],
    propDensity: '2-4 props, intentional placement',
    cameraStyle: ['steady handheld feel', 'slight dynamic angles', 'balanced asymmetry', 'editorial polish'],
    motionPlanIntensity: 'gentle: slow push-ins, subtle orbits, rack focus transitions',
  },
  {
    range: '51-80',
    sceneEnergy: ['kinetic engagement', 'mid-action capture', 'dramatic momentum', 'bold presence'],
    propDensity: '4-6 props, layered depth',
    cameraStyle: ['dynamic angles', 'dutch tilt allowed', 'bold diagonals', 'dramatic perspective'],
    motionPlanIntensity: 'active: motivated camera moves, following action, dynamic reframing',
  },
  {
    range: '81-100',
    sceneEnergy: ['controlled chaos', 'explosive moment', 'peak action', 'visceral impact'],
    propDensity: '6+ props, organized chaos',
    cameraStyle: ['extreme angles', 'crash zoom aesthetic', 'radical perspective', 'handheld energy'],
    motionPlanIntensity: 'intense: rapid movement, motion blur after frame 1, chaotic energy',
  },
];

export function getIntensityMapping(intensity: number): IntensityMapping {
  if (intensity <= 20) return INTENSITY_MAPPINGS[0];
  if (intensity <= 50) return INTENSITY_MAPPINGS[1];
  if (intensity <= 80) return INTENSITY_MAPPINGS[2];
  return INTENSITY_MAPPINGS[3];
}

export function getIntensityForVariant(baseIntensity: number, variant: 'safe' | 'risky' | 'minimal'): number {
  switch (variant) {
    case 'safe':
      return Math.max(0, baseIntensity - 15);
    case 'risky':
      return Math.min(100, baseIntensity + 25);
    case 'minimal':
      return 10;
    default:
      return baseIntensity;
  }
}
