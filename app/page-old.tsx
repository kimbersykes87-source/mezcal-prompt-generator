'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Principle, Pillar, Round1Selection, Round2Selection } from '@/types';
import { loadAllPrinciples, loadAllPillars, loadPrinciple, loadPillar } from '@/lib/configLoader';
import { buildPrompt } from '@/lib/promptBuilder';
import ImageUpload from '@/components/ImageUpload';
import Round1Selector from '@/components/Round1Selector';
import Round2Generator from '@/components/Round2Generator';
import PromptOutput from '@/components/PromptOutput';
import SurpriseMeButton from '@/components/SurpriseMeButton';

export default function Home() {
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [round1Selection, setRound1Selection] = useState<Round1Selection | null>(null);
  const [round2Selection, setRound2Selection] = useState<Round2Selection | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  // Load configs on mount
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
        setErrors(['Failed to load configuration files. Please refresh the page.']);
      }
    }
    loadConfigs();
  }, []);

  // Load selected principle and pillar when round1Selection changes
  useEffect(() => {
    async function loadSelected() {
      if (round1Selection?.principleId && round1Selection?.pillarId) {
        try {
          const [principle, pillar] = await Promise.all([
            loadPrinciple(round1Selection.principleId),
            loadPillar(round1Selection.pillarId),
          ]);
          setSelectedPrinciple(principle);
          setSelectedPillar(pillar);
        } catch (error) {
          console.error('Error loading selected principle/pillar:', error);
        }
      } else {
        setSelectedPrinciple(null);
        setSelectedPillar(null);
      }
    }
    loadSelected();
  }, [round1Selection?.principleId, round1Selection?.pillarId]);

  // Build prompt when selections change
  useEffect(() => {
    if (selectedPrinciple && selectedPillar && round1Selection && round2Selection) {
      try {
        const generatedPrompt = buildPrompt({
          principle: selectedPrinciple,
          pillar: selectedPillar,
          round1: round1Selection,
          round2: round2Selection,
          referenceImages: images,
        });
        setPrompt(generatedPrompt);
      } catch (error) {
        console.error('Error building prompt:', error);
        setErrors(['Failed to build prompt. Please check your selections.']);
      }
    } else {
      setPrompt('');
    }
  }, [selectedPrinciple, selectedPillar, round1Selection, round2Selection, images]);

  const handleRound1Change = useCallback((selection: Round1Selection) => {
    setRound1Selection(selection);
  }, []);

  const handleRound2Change = useCallback((selection: Round2Selection) => {
    setRound2Selection(selection);
  }, []);

  const handleImagesChange = useCallback((files: File[]) => {
    setImages(files);
  }, []);

  const handleSurprise = useCallback((selection: Round1Selection) => {
    setRound1Selection(selection);
    // Round 2 will auto-generate when principle/pillar changes
  }, []);

  return (
    <div className="min-h-screen bg-dark-grey">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-12 flex justify-center py-6">
          <img 
            src="/logo.svg" 
            alt="Mezcalomano Logo" 
            className="h-auto w-auto max-w-full"
            style={{ maxHeight: '150px', width: 'auto' }}
          />
        </header>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-terracotta border border-yellow-agave text-white rounded">
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index} className="body-text">{error.toLowerCase()}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-8">
          {/* Surprise Me Button */}
          <div className="flex justify-center">
            <SurpriseMeButton
              principles={principles}
              pillars={pillars}
              onSurprise={handleSurprise}
            />
          </div>

          {/* Image Upload */}
          <section className="bg-dark-grey border border-muted-olive p-6 rounded-lg">
            <h2 className="text-2xl mb-4 text-white">REFERENCE IMAGES</h2>
            <ImageUpload
              onImagesChange={handleImagesChange}
              onError={setErrors}
            />
          </section>

          {/* Round 1 Selector */}
          <section className="bg-dark-grey border border-muted-olive p-6 rounded-lg">
            <Round1Selector onSelectionChange={handleRound1Change} />
          </section>

          {/* Round 2 Generator */}
          <section className="bg-dark-grey border border-muted-olive p-6 rounded-lg">
            <Round2Generator
              principle={selectedPrinciple}
              pillar={selectedPillar}
              onSelectionChange={handleRound2Change}
            />
          </section>

          {/* Prompt Output */}
          <section className="bg-dark-grey border border-muted-olive p-6 rounded-lg">
            <PromptOutput prompt={prompt} />
          </section>
        </div>
      </div>
    </div>
  );
}