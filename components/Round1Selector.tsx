'use client';

import { useEffect, useState } from 'react';
import type { Principle, Pillar, Round1Selection } from '@/types';
import { loadAllPrinciples, loadAllPillars, getPrincipleOptions, getPillarOptions } from '@/lib/configLoader';

interface Round1SelectorProps {
  onSelectionChange: (selection: Round1Selection) => void;
}

export default function Round1Selector({ onSelectionChange }: Round1SelectorProps) {
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [selection, setSelection] = useState<Round1Selection>({
    principleId: '',
    pillarId: '',
    locationId: '',
    peopleId: '',
    cameraId: '',
    lightingId: '',
    productId: '',
  });

  useEffect(() => {
    async function loadConfigs() {
      try {
        const [loadedPrinciples, loadedPillars] = await Promise.all([
          loadAllPrinciples(),
          loadAllPillars(),
        ]);
        setPrinciples(loadedPrinciples);
        setPillars(loadedPillars);
      } catch (error) {
        console.error('Error loading configs:', error);
      }
    }
    loadConfigs();
  }, []);

  const selectedPrinciple = principles.find(p => p.id === selection.principleId);
  const selectedPillar = pillars.find(p => p.id === selection.pillarId);

  const handleChange = (field: keyof Round1Selection, value: string) => {
    const newSelection = { ...selection, [field]: value };
    
    // Reset dependent fields when principle or pillar changes
    if (field === 'principleId') {
      newSelection.locationId = '';
      newSelection.cameraId = '';
      newSelection.lightingId = '';
      newSelection.peopleId = '';
    }
    if (field === 'pillarId') {
      newSelection.productId = '';
    }
    
    setSelection(newSelection);
    onSelectionChange(newSelection);
  };

  const principleOptions = selectedPrinciple ? getPrincipleOptions(selectedPrinciple) : null;
  const pillarOptions = selectedPillar ? getPillarOptions(selectedPillar) : null;

  // Merge camera/lighting options from principle and pillar
  const cameraOptions = selectedPrinciple ? [...selectedPrinciple.camera.preferred_angles] : [];
  if (pillarOptions?.camera.length) {
    pillarOptions.camera.forEach(pillarCamera => {
      const existing = cameraOptions.find(c => c.id === pillarCamera.id);
      if (existing) {
        // Average the weights if both exist
        existing.weight = (existing.weight + pillarCamera.weight) / 2;
      } else {
        cameraOptions.push(pillarCamera);
      }
    });
  }
  cameraOptions.sort((a, b) => (b.weight || 0) - (a.weight || 0));

  const lightingOptions = selectedPrinciple ? [...selectedPrinciple.lighting.preferred] : [];
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

  // People options - prefer pillar if available, else principle
  const peopleOptions = pillarOptions?.people.length 
    ? pillarOptions.people 
    : (principleOptions?.people || []);

  // Product options - derive from pillar
  const productOptions = selectedPillar?.product_focus_rules.allowed_primary_subjects || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white">ROUND 1: SELECT PRINCIPLE & OPTIONS</h2>

      {/* Photography Principle */}
      <div>
        <label className="block text-sm mb-2 text-white">photography principle</label>
        <div className="space-y-2">
          {principles.map(principle => (
            <label key={principle.id} className="flex items-start gap-2 cursor-pointer text-white">
              <input
                type="radio"
                name="principle"
                value={principle.id}
                checked={selection.principleId === principle.id}
                onChange={(e) => handleChange('principleId', e.target.value)}
                className="mt-1 accent-muted-olive"
              />
              <div>
                <div className="font-medium">{principle.name.toUpperCase()}</div>
                <div className="text-sm text-white opacity-80">{principle.purpose.toLowerCase()}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Content Pillar */}
      <div>
        <label className="block text-sm mb-2 text-white">content pillar</label>
        <div className="space-y-2">
          {pillars.map(pillar => (
            <label key={pillar.id} className="flex items-start gap-2 cursor-pointer text-white">
              <input
                type="radio"
                name="pillar"
                value={pillar.id}
                checked={selection.pillarId === pillar.id}
                onChange={(e) => handleChange('pillarId', e.target.value)}
                className="mt-1 accent-muted-olive"
              />
              <div>
                <div className="font-medium">{pillar.name.toUpperCase()}</div>
                <div className="text-sm text-white opacity-80">{pillar.purpose.toLowerCase()}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      {selectedPrinciple && (
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
      )}

      {/* People */}
      {selectedPrinciple && peopleOptions.length > 0 && (
        <div>
          <label className="block text-sm mb-2 text-white">people</label>
          <div className="space-y-2">
            {peopleOptions.map((person, index) => {
              const id = typeof person === 'string' ? person : person.id;
              const label = typeof person === 'string' ? person : person.label;
              const notes = typeof person === 'string' ? '' : person.notes;
              
              return (
                <label key={id || index} className="flex items-start gap-2 cursor-pointer text-white">
                  <input
                    type="radio"
                    name="people"
                    value={id}
                    checked={selection.peopleId === id}
                    onChange={(e) => handleChange('peopleId', e.target.value)}
                    className="mt-1 accent-muted-olive"
                  />
                  <div>
                    <div className="font-medium">{typeof label === 'string' ? label.toUpperCase() : label}</div>
                    {notes && <div className="text-sm text-white opacity-80">{notes.toLowerCase()}</div>}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Camera */}
      {selectedPrinciple && cameraOptions.length > 0 && (
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
      {selectedPrinciple && lightingOptions.length > 0 && (
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
      {selectedPillar && productOptions.length > 0 && (
        <div>
          <label className="block text-sm mb-2 text-white">product</label>
          <div className="space-y-2">
            {productOptions.map((product, index) => (
              <label key={index} className="flex items-start gap-2 cursor-pointer text-white">
                <input
                  type="radio"
                  name="product"
                  value={product}
                  checked={selection.productId === product}
                  onChange={(e) => handleChange('productId', e.target.value)}
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