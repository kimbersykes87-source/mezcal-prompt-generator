import type { Principle } from '@/types';

// Helper functions to extract principle-specific data

let principleCache: Map<string, Principle> | null = null;

async function loadPrincipleForData(principleId: string): Promise<Principle | null> {
  if (principleCache && principleCache.has(principleId)) {
    return principleCache.get(principleId)!;
  }

  try {
    const response = await fetch(`/config/principles/${principleId}.json`);
    if (!response.ok) {
      console.warn(`Principle ${principleId} not found`);
      return null;
    }
    const data = await response.json();
    
    if (!principleCache) {
      principleCache = new Map();
    }
    principleCache.set(principleId, data);
    
    return data;
  } catch (error) {
    console.error(`Error loading principle ${principleId}:`, error);
    return null;
  }
}

export async function getPrincipleIntensityBehavior(principleId: string, intensity: number): Promise<any> {
  const principle = await loadPrincipleForData(principleId);
  if (!principle || !principle.intensity_bands) {
    return null;
  }

  const band = principle.intensity_bands.find((b: any) => 
    intensity >= b.range[0] && intensity <= b.range[1]
  );

  return band || null;
}

export async function getPrincipleVideoRules(principleId: string): Promise<any> {
  const principle = await loadPrincipleForData(principleId);
  if (!principle) {
    return null;
  }

  return principle.video_first_frame_rules || null;
}

export async function getPrinciplePromptFragments(principleId: string): Promise<any> {
  const principle = await loadPrincipleForData(principleId);
  if (!principle) {
    return null;
  }

  return principle.prompt_fragments || null;
}

export async function getPrincipleVariantConfig(principleId: string, variantType: 'safe_commercial' | 'risky_chaotic' | 'ultra_minimal_hero'): Promise<any> {
  const principle = await loadPrincipleForData(principleId);
  if (!principle || !principle.variants) {
    return null;
  }

  return principle.variants[variantType] || null;
}

export async function getPrinciplePlatformBehavior(principleId: string, format: '9x16' | '4x5'): Promise<any> {
  const principle = await loadPrincipleForData(principleId);
  if (!principle || !principle.platform_behavior) {
    return null;
  }

  return principle.platform_behavior[format] || null;
}
