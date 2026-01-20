'use client';

import type { Principle, Pillar, Step0Selection, OutputType, PlatformFormat, PeopleMode, PillarId } from '@/types';
import { Round1SelectionV2 } from './Round1SelectorV2';
import { weightedRandomSelect } from '@/lib/logicRules';
import { getSubModesForPillar } from '@/lib/pillarSubModes';

interface SurpriseMeButtonV2Props {
  principles: Principle[];
  pillars: Pillar[];
  onSurpriseStep0: (selection: Step0Selection) => void;
  onSurpriseRound1: (selection: Round1SelectionV2) => void;
}

export default function SurpriseMeButtonV2({ 
  principles, 
  pillars, 
  onSurpriseStep0,
  onSurpriseRound1 
}: SurpriseMeButtonV2Props) {
  const handleSurprise = async () => {
    if (principles.length === 0 || pillars.length === 0) {
      return;
    }

    // Randomly select output type (70% still, 30% video)
    const outputType: OutputType = Math.random() < 0.7 ? 'still' : 'video';

    // Randomly select platform format (NO SQUARE!)
    // 60% vertical 9:16, 40% portrait 4:5
    const platformFormat: PlatformFormat = Math.random() < 0.6 ? '9x16' : '4x5';

    // Random intensity (weighted toward middle range 20-60)
    const intensity = Math.floor(Math.random() * 60) + 20; // 20-80 range

    // Random people mode (weighted: 50% none, 25% hands, 15% partial, 10% full)
    const rand = Math.random();
    let peopleMode: PeopleMode;
    if (rand < 0.5) peopleMode = 'none';
    else if (rand < 0.75) peopleMode = 'hands';
    else if (rand < 0.9) peopleMode = 'partialNoFace';
    else peopleMode = 'fullBody';

    // Faces allowed only if fullBody and 20% chance
    const facesAllowed = peopleMode === 'fullBody' && Math.random() < 0.2;

    // Weighted random select principle (weighted by priority)
    const totalPriority = principles.reduce((sum, p) => sum + p.priority, 0);
    const principleWeights = principles.map(p => ({
      principle: p,
      weight: p.priority / totalPriority,
    }));
    const selectedPrinciple = weightedRandomSelect(principleWeights).principle;

    // Equal weight random select pillar
    const selectedPillar = pillars[Math.floor(Math.random() * pillars.length)];
    const pillarId = selectedPillar.id as PillarId;

    // Random sub-mode (async call)
    const subModes = await getSubModesForPillar(pillarId);
    const selectedSubMode = subModes.length > 0 
      ? subModes[Math.floor(Math.random() * subModes.length)]
      : null;

    const step0Selection: Step0Selection = {
      outputType,
      platformFormat,
      intensity,
      peopleMode,
      facesAllowed,
      principleId: selectedPrinciple.id,
      pillarId,
      subModeId: selectedSubMode?.id || '',
    };

    onSurpriseStep0(step0Selection);

    // Generate Round1 selection
    // Random select location
    const locationOptions = selectedPrinciple.locations.preferred;
    const selectedLocation = locationOptions.length > 0
      ? locationOptions[Math.floor(Math.random() * locationOptions.length)]
      : null;

    // Weighted random select camera (merged weights from principle + pillar)
    let cameraOptions = [...selectedPrinciple.camera.preferred_angles];
    const pillarCamera = selectedPillar.camera_and_lighting_preferences?.camera_angles_ranked || [];
    pillarCamera.forEach(pillarCam => {
      const existing = cameraOptions.find(c => c.id === pillarCam.id);
      if (existing) {
        existing.weight = (existing.weight + pillarCam.weight) / 2;
      } else {
        cameraOptions.push(pillarCam);
      }
    });
    const selectedCamera = weightedRandomSelect(cameraOptions.length > 0 ? cameraOptions : []);

    // Weighted random select lighting (merged weights)
    let lightingOptions = [...selectedPrinciple.lighting.preferred];
    const pillarLighting = selectedPillar.camera_and_lighting_preferences?.lighting_ranked || [];
    pillarLighting.forEach(pillarLight => {
      const existing = lightingOptions.find(l => l.id === pillarLight.id);
      if (existing) {
        existing.weight = (existing.weight + pillarLight.weight) / 2;
      } else {
        lightingOptions.push(pillarLight);
      }
    });
    const selectedLighting = weightedRandomSelect(lightingOptions.length > 0 ? lightingOptions : []);

    // Select product from pillar
    const productOptions = selectedPillar.product_focus_rules?.allowed_primary_subjects || [];
    const selectedProduct = productOptions.length > 0
      ? productOptions[Math.floor(Math.random() * productOptions.length)]
      : '';

    const round1Selection: Round1SelectionV2 = {
      locationId: selectedLocation ? selectedLocation.id : '',
      cameraId: selectedCamera?.id || '',
      lightingId: selectedLighting?.id || '',
      productFocus: selectedProduct || '',
    };

    onSurpriseRound1(round1Selection);
  };

  return (
    <button
      type="button"
      onClick={handleSurprise}
      disabled={principles.length === 0 || pillars.length === 0}
      className="cta px-6 py-3 bg-muted-olive text-white rounded-lg hover:bg-yellow-agave disabled:bg-dark-grey disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
    >
      🎲 SURPRISE ME
    </button>
  );
}
