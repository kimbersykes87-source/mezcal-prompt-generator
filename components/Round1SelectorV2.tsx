'use client';

import { useEffect, useState } from 'react';
import type { Principle, Pillar } from '@/types';
import { getPrincipleOptions, getPillarOptions } from '@/lib/configLoader';

export interface Round1SelectionV2 {
  locationId: string;
  cameraId: string;
  lightingId: string;
  productFocus: string;
}

interface Round1SelectorV2Props {
  principle: Principle | null;
  pillar: Pillar | null;
  onSelectionChange: (selection: Round1SelectionV2) => void;
}

export default function Round1SelectorV2({ principle, pillar, onSelectionChange }: Round1SelectorV2Props) {
  const [selection, setSelection] = useState<Round1SelectionV2>({
    locationId: '',
    cameraId: '',
    lightingId: '',
    productFocus: '',
  });

  // Reset selection when principle or pillar changes
  useEffect(() => {
    setSelection({
      locationId: '',
      cameraId: '',
      lightingId: '',
      productFocus: '',
    });
  }, [principle?.id, pillar?.id]);

  const handleChange = (field: keyof Round1SelectionV2, value: string) => {
    const newSelection = { ...selection, [field]: value };
    setSelection(newSelection);
    onSelectionChange(newSelection);
  };

  if (!principle || !pillar) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl text-white">ROUND 1: SCENE OPTIONS</h2>
        <div className="p-4 border border-muted-olive rounded text-white opacity-70">
          Please complete Step 0 first (select Principle and Pillar)
        </div>
      </div>
    );
  }

  const principleOptions = getPrincipleOptions(principle);
  const pillarOptions = getPillarOptions(pillar);

  // Merge camera/lighting options from principle and pillar
  const cameraOptions = [...principle.camera.preferred_angles];
  if (pillarOptions?.camera.length) {
    pillarOptions.camera.forEach(pillarCamera => {
      const existing = cameraOptions.find(c => c.id === pillarCamera.id);
      if (existing) {
        existing.weight = (existing.weight + pillarCamera.weight) / 2;
      } else {
        cameraOptions.push(pillarCamera);
      }
    });
  }
  cameraOptions.sort((a, b) => (b.weight || 0) - (a.weight || 0));

  const lightingOptions = [...principle.lighting.preferred];
  if (pillarOptions?.lighting.length) {
    pillarOptions.lighting.forEach(pillarLighting => {
      const existing = lightingOptions.find(l => l.id === pillarLighting.id);
      if (existing) {
        existing.weight = (existing.weight + pillarLighting.weight) / 2;
      } else {
        lightingOptions.push(pillarLighting);
      }
    });
  }
  lightingOptions.sort((a, b) => (b.weight || 0) - (a.weight || 0));

  const productOptions = pillar.product_focus_rules.allowed_primary_subjects || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white">ROUND 1: SCENE OPTIONS</h2>

      {/* Location */}
      <div>
        <label className="block text-sm mb-2 text-white">location</label>
        <div className="space-y-2">
          {principleOptions?.locations.map(location => (
            <label key={location.id} className="flex items-start gap-2 cursor-pointer text-white">
              <input
                type="radio"
                name="location"
                value={location.id}
                checked={selection.locationId === location.id}
                onChange={(e) => handleChange('locationId', e.target.value)}
                className="mt-1 accent-muted-olive"
              />
              <div>
                <div className="font-medium">{location.label.toUpperCase()}</div>
                {location.notes && <div className="text-sm text-white opacity-80">{location.notes.toLowerCase()}</div>}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Camera */}
      {cameraOptions.length > 0 && (
        <div>
          <label className="block text-sm mb-2 text-white">camera</label>
          <div className="space-y-2">
            {cameraOptions.map(camera => (
              <label key={camera.id} className="flex items-start gap-2 cursor-pointer text-white">
                <input
                  type="radio"
                  name="camera"
                  value={camera.id}
                  checked={selection.cameraId === camera.id}
                  onChange={(e) => handleChange('cameraId', e.target.value)}
                  className="mt-1 accent-muted-olive"
                />
                <div>
                  <div className="font-medium">{camera.label.toUpperCase()}</div>
                  {camera.notes && <div className="text-sm text-white opacity-80">{camera.notes.toLowerCase()}</div>}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Lighting */}
      {lightingOptions.length > 0 && (
        <div>
          <label className="block text-sm mb-2 text-white">lighting</label>
          <div className="space-y-2">
            {lightingOptions.map(lighting => (
              <label key={lighting.id} className="flex items-start gap-2 cursor-pointer text-white">
                <input
                  type="radio"
                  name="lighting"
                  value={lighting.id}
                  checked={selection.lightingId === lighting.id}
                  onChange={(e) => handleChange('lightingId', e.target.value)}
                  className="mt-1 accent-muted-olive"
                />
                <div>
                  <div className="font-medium">{lighting.label.toUpperCase()}</div>
                  {lighting.notes && <div className="text-sm text-white opacity-80">{lighting.notes.toLowerCase()}</div>}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Product */}
      {productOptions.length > 0 && (
        <div>
          <label className="block text-sm mb-2 text-white">product focus</label>
          <div className="space-y-2">
            {productOptions.map((product, index) => (
              <label key={index} className="flex items-start gap-2 cursor-pointer text-white">
                <input
                  type="radio"
                  name="product"
                  value={product}
                  checked={selection.productFocus === product}
                  onChange={(e) => handleChange('productFocus', e.target.value)}
                  className="mt-1 accent-muted-olive"
                />
                <div className="font-medium">{product.toUpperCase()}</div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
