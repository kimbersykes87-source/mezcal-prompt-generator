'use client';

import { useState, useEffect } from 'react';
import type { Step0Selection, PillarId } from '@/types';
import { loadAllPrinciples, loadAllPillars } from '@/lib/configLoader';
import { getSubModesForPillar } from '@/lib/pillarSubModes';
import type { Principle, Pillar } from '@/types';

interface Step0SelectorProps {
  onSelectionChange: (selection: Step0Selection) => void;
}

export default function Step0Selector({ onSelectionChange }: Step0SelectorProps) {
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [selection, setSelection] = useState<Step0Selection>({
    outputType: 'still',
    platformFormat: '9x16',
    intensity: 35,
    peopleMode: 'none',
    facesAllowed: false,
    principleId: '',
    pillarId: 'discover',
    subModeId: '',
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

  const handleChange = <K extends keyof Step0Selection>(field: K, value: Step0Selection[K]) => {
    const newSelection = { ...selection, [field]: value };
    
    // If people mode changes to fullBody, keep facesAllowed as-is, otherwise force false
    if (field === 'peopleMode' && value !== 'fullBody') {
      newSelection.facesAllowed = false;
    }
    
    // If pillar changes, reset subMode
    if (field === 'pillarId') {
      newSelection.subModeId = '';
    }
    
    setSelection(newSelection);
    onSelectionChange(newSelection);
  };

  const [subModes, setSubModes] = useState<any[]>([]);

  // Load sub-modes when pillar changes
  useEffect(() => {
    async function loadSubModes() {
      if (selection.pillarId) {
        const modes = await getSubModesForPillar(selection.pillarId as PillarId);
        setSubModes(modes);
      } else {
        setSubModes([]);
      }
    }
    loadSubModes();
  }, [selection.pillarId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-white">STEP 0: PROMPT SETUP</h2>

      {/* Output Type */}
      <div>
        <label className="block text-sm mb-2 text-white">output type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="outputType"
              value="still"
              checked={selection.outputType === 'still'}
              onChange={(e) => handleChange('outputType', e.target.value as 'still' | 'video')}
              className="accent-muted-olive"
            />
            <span>Still Image</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="outputType"
              value="video"
              checked={selection.outputType === 'video'}
              onChange={(e) => handleChange('outputType', e.target.value as 'still' | 'video')}
              className="accent-muted-olive"
            />
            <span>Video (First Frame)</span>
          </label>
        </div>
      </div>

      {/* Platform Format */}
      <div>
        <label className="block text-sm mb-2 text-white">platform format</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="platformFormat"
              value="9x16"
              checked={selection.platformFormat === '9x16'}
              onChange={(e) => handleChange('platformFormat', e.target.value as '9x16' | '4x5')}
              className="accent-muted-olive"
            />
            <div>
              <div className="font-medium">TikTok / Instagram Reels: 9:16 (1080x1920)</div>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="platformFormat"
              value="4x5"
              checked={selection.platformFormat === '4x5'}
              onChange={(e) => handleChange('platformFormat', e.target.value as '9x16' | '4x5')}
              className="accent-muted-olive"
            />
            <div>
              <div className="font-medium">Instagram Feed Portrait: 4:5 (1080x1350)</div>
              {selection.outputType === 'video' && (
                <div className="text-sm text-white opacity-80">also for IG carousel cover frames</div>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Intensity Slider */}
      <div>
        <label className="block text-sm mb-2 text-white">
          intensity: {selection.intensity} (calm → kinetic)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={selection.intensity}
          onChange={(e) => handleChange('intensity', parseInt(e.target.value))}
          className="w-full accent-muted-olive"
        />
        <div className="flex justify-between text-xs text-white opacity-70 mt-1">
          <span>calm (0)</span>
          <span>social (35)</span>
          <span>kinetic (100)</span>
        </div>
      </div>

      {/* People Mode */}
      <div>
        <label className="block text-sm mb-2 text-white">people</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="peopleMode"
              value="none"
              checked={selection.peopleMode === 'none'}
              onChange={(e) => handleChange('peopleMode', e.target.value as any)}
              className="accent-muted-olive"
            />
            <span>None (default)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="peopleMode"
              value="hands"
              checked={selection.peopleMode === 'hands'}
              onChange={(e) => handleChange('peopleMode', e.target.value as any)}
              className="accent-muted-olive"
            />
            <span>Hands</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="peopleMode"
              value="partialNoFace"
              checked={selection.peopleMode === 'partialNoFace'}
              onChange={(e) => handleChange('peopleMode', e.target.value as any)}
              className="accent-muted-olive"
            />
            <span>Partial Body (no faces)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="peopleMode"
              value="fullBody"
              checked={selection.peopleMode === 'fullBody'}
              onChange={(e) => handleChange('peopleMode', e.target.value as any)}
              className="accent-muted-olive"
            />
            <span>Full Body</span>
          </label>
        </div>
        
        {/* Faces Allowed Toggle */}
        {selection.peopleMode === 'fullBody' && (
          <div className="mt-3 pl-6">
            <label className="flex items-center gap-2 cursor-pointer text-white">
              <input
                type="checkbox"
                checked={selection.facesAllowed}
                onChange={(e) => handleChange('facesAllowed', e.target.checked)}
                className="accent-muted-olive"
              />
              <span>Allow faces (default OFF)</span>
            </label>
          </div>
        )}
      </div>

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
                onChange={(e) => handleChange('pillarId', e.target.value as PillarId)}
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

      {/* Sub-Mode Selection */}
      {subModes.length > 0 && (
        <div>
          <label className="block text-sm mb-2 text-white">sub-mode</label>
          <div className="space-y-2">
            {subModes.map(subMode => (
              <label key={subMode.id} className="flex items-start gap-2 cursor-pointer text-white">
                <input
                  type="radio"
                  name="subMode"
                  value={subMode.id}
                  checked={selection.subModeId === subMode.id}
                  onChange={(e) => handleChange('subModeId', e.target.value)}
                  className="mt-1 accent-muted-olive"
                />
                <div>
                  <div className="font-medium">{subMode.name.toUpperCase()}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
