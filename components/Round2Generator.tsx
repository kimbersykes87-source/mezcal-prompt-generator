'use client';

import { useEffect, useState } from 'react';
import type { Principle, Pillar, Round2Selection } from '@/types';
import { generateSceneMoments, generateProps } from '@/lib/round2Generator';

interface Round2GeneratorProps {
  principle: Principle | null;
  pillar: Pillar | null;
  onSelectionChange: (selection: Round2Selection) => void;
}

export default function Round2Generator({ principle, pillar, onSelectionChange }: Round2GeneratorProps) {
  const [sceneMoments, setSceneMoments] = useState<string[]>(['', '', '']);
  const [props, setProps] = useState<string[][]>([[], [], []]);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [selectedPropsIndex, setSelectedPropsIndex] = useState<number>(0);

  useEffect(() => {
    if (principle && pillar) {
      regenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principle?.id, pillar?.id]);

  const regenerate = () => {
    if (!principle || !pillar) return;
    
    const newSceneMoments = generateSceneMoments(principle, pillar);
    const newProps = generateProps(principle, pillar);
    
    setSceneMoments(newSceneMoments);
    setProps(newProps);
    setSelectedSceneIndex(0);
    setSelectedPropsIndex(0);
    
    // Emit default selection
    onSelectionChange({
      sceneMoment: newSceneMoments[0] || '',
      props: newProps[0] || [],
    });
  };

  const handleSceneMomentChange = (index: number, value: string) => {
    const newSceneMoments = [...sceneMoments];
    newSceneMoments[index] = value;
    setSceneMoments(newSceneMoments);
    
    if (index === selectedSceneIndex) {
      onSelectionChange({
        sceneMoment: value,
        props: props[selectedPropsIndex] || [],
      });
    }
  };

  const handlePropsChange = (index: number, value: string) => {
    const newProps = [...props];
    newProps[index] = value.split(',').map(p => p.trim()).filter(p => p);
    setProps(newProps);
    
    if (index === selectedPropsIndex) {
      onSelectionChange({
        sceneMoment: sceneMoments[selectedSceneIndex] || '',
        props: newProps[index] || [],
      });
    }
  };

  const handleSceneMomentSelect = (index: number) => {
    setSelectedSceneIndex(index);
    onSelectionChange({
      sceneMoment: sceneMoments[index] || '',
      props: props[selectedPropsIndex] || [],
    });
  };

  const handlePropsSelect = (index: number) => {
    setSelectedPropsIndex(index);
    onSelectionChange({
      sceneMoment: sceneMoments[selectedSceneIndex] || '',
      props: props[index] || [],
    });
  };

  if (!principle || !pillar) {
    return (
      <div className="p-4 border border-muted-olive rounded bg-dark-grey">
        <p className="text-white">please select a principle and pillar in round 1 first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white">ROUND 2: SCENE MOMENTS & PROPS</h2>
        <button
          type="button"
          onClick={regenerate}
          className="cta px-4 py-2 bg-muted-olive text-white rounded hover:bg-yellow-agave transition-colors"
        >
          REGENERATE OPTIONS
        </button>
      </div>

      {/* Scene Moments */}
      <div>
        <label className="block text-sm mb-2 text-white">scene moment (select & edit)</label>
        <div className="space-y-2">
          {sceneMoments.map((moment, index) => (
            <div key={index} className="flex items-start gap-2">
              <input
                type="radio"
                name="sceneMoment"
                checked={selectedSceneIndex === index}
                onChange={() => handleSceneMomentSelect(index)}
                className="mt-2 accent-muted-olive"
              />
              <div className="flex-1">
                <label className="block text-xs mb-1 text-white opacity-80">
                  option {String.fromCharCode(65 + index)}:
                </label>
                <textarea
                  value={moment}
                  onChange={(e) => handleSceneMomentChange(index, e.target.value)}
                  className="w-full p-2 border border-muted-olive rounded resize-none bg-dark-grey text-white placeholder:text-white placeholder:opacity-50"
                  rows={2}
                  placeholder="scene moment description..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Props */}
      <div>
        <label className="block text-sm mb-2 text-white">props (select & edit)</label>
        <div className="space-y-2">
          {props.map((propSet, index) => (
            <div key={index} className="flex items-start gap-2">
              <input
                type="radio"
                name="props"
                checked={selectedPropsIndex === index}
                onChange={() => handlePropsSelect(index)}
                className="mt-2 accent-muted-olive"
              />
              <div className="flex-1">
                <label className="block text-xs mb-1 text-white opacity-80">
                  option {String.fromCharCode(65 + index)}:
                </label>
                <textarea
                  value={propSet.join(', ')}
                  onChange={(e) => handlePropsChange(index, e.target.value)}
                  className="w-full p-2 border border-muted-olive rounded resize-none bg-dark-grey text-white placeholder:text-white placeholder:opacity-50"
                  rows={2}
                  placeholder="comma-separated props list..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}