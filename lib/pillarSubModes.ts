import type { PillarSubMode, PillarId } from '@/types';
import type { Pillar } from '@/types';

// Load sub-modes dynamically from pillar JSON files
// This replaces the hardcoded sub-modes with data from the actual pillar configs

let pillarCache: Map<string, Pillar> | null = null;

async function loadPillarForSubModes(pillarId: PillarId): Promise<Pillar | null> {
  if (pillarCache && pillarCache.has(pillarId)) {
    return pillarCache.get(pillarId)!;
  }

  try {
    const response = await fetch(`/config/pillars/${pillarId}.json`);
    if (!response.ok) {
      console.warn(`Pillar ${pillarId} not found`);
      return null;
    }
    const data = await response.json();
    
    if (!pillarCache) {
      pillarCache = new Map();
    }
    pillarCache.set(pillarId, data);
    
    return data;
  } catch (error) {
    console.error(`Error loading pillar ${pillarId} for sub-modes:`, error);
    return null;
  }
}

export async function getSubModesForPillar(pillarId: PillarId): Promise<PillarSubMode[]> {
  const pillar = await loadPillarForSubModes(pillarId);
  if (!pillar || !pillar.sub_modes) {
    return [];
  }

  // Transform pillar sub_modes to our PillarSubMode type
  return pillar.sub_modes.map((sm: any) => ({
    id: sm.id,
    name: sm.name,
    momentTemplates: [
      ...(sm.moment_templates_still || []),
      ...(sm.moment_templates_video || [])
    ],
    propLogic: sm.prop_logic || [],
    hookPatternsStill: sm.hook_patterns_still || [],
    hookPatternsVideo: sm.hook_patterns_video || [],
  }));
}

export async function getSubMode(pillarId: PillarId, subModeId: string): Promise<PillarSubMode | null> {
  const subModes = await getSubModesForPillar(pillarId);
  return subModes.find(sm => sm.id === subModeId) || null;
}

// Get intensity behavior for a pillar at a specific intensity level
export async function getIntensityBehavior(pillarId: PillarId, intensity: number): Promise<any> {
  const pillar = await loadPillarForSubModes(pillarId);
  if (!pillar || !pillar.intensity_bands) {
    return null;
  }

  const band = pillar.intensity_bands.find((b: any) => 
    intensity >= b.range[0] && intensity <= b.range[1]
  );

  return band || null;
}

// Get variant configuration for a pillar
export async function getVariantConfig(pillarId: PillarId, variantType: 'safe_commercial' | 'risky_chaotic' | 'ultra_minimal_hero'): Promise<any> {
  const pillar = await loadPillarForSubModes(pillarId);
  if (!pillar || !pillar.variants) {
    return null;
  }

  return pillar.variants[variantType] || null;
}

// Get video first frame rules for a pillar
export async function getVideoFirstFrameRules(pillarId: PillarId): Promise<any> {
  const pillar = await loadPillarForSubModes(pillarId);
  if (!pillar) {
    return null;
  }

  return pillar.video_first_frame_rules || null;
}

// Get prompt fragments from pillar
export async function getPromptFragments(pillarId: PillarId): Promise<any> {
  const pillar = await loadPillarForSubModes(pillarId);
  if (!pillar) {
    return null;
  }

  return pillar.prompt_fragments || null;
}
