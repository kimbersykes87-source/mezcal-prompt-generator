import type { Principle, Pillar } from '@/types';

const PRINCIPLES = ['agaveculture', 'atmosphere', 'action'] as const;
const PILLARS = ['discover', 'levelup', 'play'] as const;

let principlesCache: Map<string, Principle> | null = null;
let pillarsCache: Map<string, Pillar> | null = null;

export async function loadPrinciple(id: string): Promise<Principle> {
  if (principlesCache && principlesCache.has(id)) {
    return principlesCache.get(id)!;
  }

  try {
    const response = await fetch(`/config/principles/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load principle ${id}: ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!principlesCache) {
      principlesCache = new Map();
    }
    principlesCache.set(id, data);
    
    return data;
  } catch (error) {
    console.error(`Error loading principle ${id}:`, error);
    throw error;
  }
}

export async function loadAllPrinciples(): Promise<Principle[]> {
  if (principlesCache && principlesCache.size === PRINCIPLES.length) {
    return Array.from(principlesCache.values());
  }

  const principles = await Promise.all(
    PRINCIPLES.map(id => loadPrinciple(id))
  );
  
  return principles;
}

export async function loadPillar(id: string): Promise<Pillar> {
  if (pillarsCache && pillarsCache.has(id)) {
    return pillarsCache.get(id)!;
  }

  try {
    const response = await fetch(`/config/pillars/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load pillar ${id}: ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!pillarsCache) {
      pillarsCache = new Map();
    }
    pillarsCache.set(id, data);
    
    return data;
  } catch (error) {
    console.error(`Error loading pillar ${id}:`, error);
    throw error;
  }
}

export async function loadAllPillars(): Promise<Pillar[]> {
  if (pillarsCache && pillarsCache.size === PILLARS.length) {
    return Array.from(pillarsCache.values());
  }

  const pillars = await Promise.all(
    PILLARS.map(id => loadPillar(id))
  );
  
  return pillars;
}

export function getPrincipleOptions(principle: Principle) {
  return {
    locations: principle.locations.preferred,
    camera: principle.camera.preferred_angles,
    lighting: principle.lighting.preferred,
    people: principle.casting.allowed_humans || [],
  };
}

export function getPillarOptions(pillar: Pillar) {
  return {
    locations: pillar.locations?.preferred || [],
    camera: pillar.camera_and_lighting_preferences?.camera_angles_ranked || [],
    lighting: pillar.camera_and_lighting_preferences?.lighting_ranked || [],
    people: pillar.people_and_framing?.allowed_people_modes_ranked || [],
  };
}