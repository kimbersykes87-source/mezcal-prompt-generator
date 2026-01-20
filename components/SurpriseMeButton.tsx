'use client';

import type { Principle, Pillar, Round1Selection } from '@/types';
import { weightedRandomSelect } from '@/lib/logicRules';

interface SurpriseMeButtonProps {
  principles: Principle[];
  pillars: Pillar[];
  onSurprise: (selection: Round1Selection) => void;
}

export default function SurpriseMeButton({ principles, pillars, onSurprise }: SurpriseMeButtonProps) {
  const handleSurprise = () => {
    if (principles.length === 0 || pillars.length === 0) {
      return;
    }

    // Weighted random select principle (weighted by priority)
    const totalPriority = principles.reduce((sum, p) => sum + p.priority, 0);
    const principleWeights = principles.map(p => ({
      principle: p,
      weight: p.priority / totalPriority,
    }));
    const selectedPrinciple = weightedRandomSelect(principleWeights).principle;

    // Equal weight random select pillar
    const selectedPillar = pillars[Math.floor(Math.random() * pillars.length)];

    // Random select location (locations don't have weights, use equal probability)
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

    // Select people (prefer pillar if available, else principle)
    const pillarPeople = selectedPillar.people_and_framing?.allowed_people_modes_ranked || [];
    const principlePeople = selectedPrinciple.casting.allowed_humans || [];
    const selectedPeople = pillarPeople.length > 0
      ? weightedRandomSelect(pillarPeople)
      : (principlePeople.length > 0
          ? principlePeople[Math.floor(Math.random() * principlePeople.length)]
          : { id: '' });

    // Select product from pillar
    const productOptions = selectedPillar.product_focus_rules?.allowed_primary_subjects || [];
    const selectedProduct = productOptions.length > 0
      ? productOptions[Math.floor(Math.random() * productOptions.length)]
      : '';

    const selection: Round1Selection = {
      principleId: selectedPrinciple.id,
      pillarId: selectedPillar.id,
      locationId: selectedLocation ? selectedLocation.id : '',
      cameraId: selectedCamera?.id || '',
      lightingId: selectedLighting?.id || '',
      peopleId: (typeof selectedPeople === 'object' && 'id' in selectedPeople) ? selectedPeople.id : '',
      productId: selectedProduct || '',
    };

    onSurprise(selection);
  };

  return (
    <button
      type="button"
      onClick={handleSurprise}
      disabled={principles.length === 0 || pillars.length === 0}
      className="cta px-6 py-3 bg-muted-olive text-white rounded-lg hover:bg-yellow-agave disabled:bg-dark-grey disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      🎲 SURPRISE ME
    </button>
  );
}