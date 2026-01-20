import type { Principle, Pillar } from '@/types';

export interface PreferredOptions {
  locationIds: string[];
  cameraIds: string[];
  lightingIds: string[];
  peopleIds: string[];
}

export function getPreferredOptions(
  principle: Principle,
  pillar: Pillar
): PreferredOptions {
  const locationIds = principle.locations.preferred.map(loc => loc.id);
  
  // If pillar has preferred locations, prioritize those that match
  const pillarLocationIds = pillar.locations?.preferred?.map(loc => loc.id) || [];
  const matchingLocations = pillarLocationIds.filter(id => 
    locationIds.includes(id)
  );

  const cameraIds = principle.camera.preferred_angles
    .map(angle => angle.id);
  
  const pillarCameraIds = pillar.camera_and_lighting_preferences?.camera_angles_ranked
    ?.map(angle => angle.id) || [];
  const matchingCameras = pillarCameraIds.filter(id => cameraIds.includes(id));

  const lightingIds = principle.lighting.preferred
    .map(light => light.id);
  
  const pillarLightingIds = pillar.camera_and_lighting_preferences?.lighting_ranked
    ?.map(light => light.id) || [];
  const matchingLighting = pillarLightingIds.filter(id => lightingIds.includes(id));

  const peopleIds = principle.casting.allowed_humans?.map(h => h.id) || [];
  const pillarPeopleIds = pillar.people_and_framing?.allowed_people_modes_ranked
    ?.map(m => m.id) || [];

  return {
    locationIds: matchingLocations.length > 0 ? matchingLocations : locationIds,
    cameraIds: matchingCameras.length > 0 ? matchingCameras : cameraIds,
    lightingIds: matchingLighting.length > 0 ? matchingLighting : lightingIds,
    peopleIds: pillarPeopleIds.length > 0 ? pillarPeopleIds : peopleIds,
  };
}

export function weightedRandomSelect<T extends { weight?: number }>(
  options: T[]
): T {
  if (options.length === 0) {
    throw new Error('Cannot select from empty options array');
  }

  if (options.length === 1) {
    return options[0];
  }

  // If no weights specified, use equal weights
  const hasWeights = options.some(opt => opt.weight !== undefined);
  if (!hasWeights) {
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  // Normalize weights
  const totalWeight = options.reduce((sum, opt) => sum + (opt.weight || 0), 0);
  if (totalWeight === 0) {
    // All weights are 0, fall back to equal probability
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  // Generate random number between 0 and totalWeight
  let random = Math.random() * totalWeight;
  
  // Select option based on weighted probability
  for (const option of options) {
    const weight = option.weight || 0;
    if (random < weight) {
      return option;
    }
    random -= weight;
  }

  // Fallback (shouldn't reach here, but just in case)
  return options[options.length - 1];
}