'use client';

import { useState, useEffect, useCallback } from 'react';
import type { 
  Principle, 
  Pillar, 
  Step0Selection, 
  SelectedReferences, 
  CardReference,
  AnalysisTags,
  Round2Selection,
  SceneBlueprint,
  PromptVariant
} from '@/types';
import { loadAllPrinciples, loadAllPillars, loadPrinciple, loadPillar } from '@/lib/configLoader';
import { buildPromptForBlueprint, generateVariants } from '@/lib/promptBuilderV2';
import Step0Selector from '@/components/Step0Selector';
import Round1SelectorV2, { Round1SelectionV2 } from '@/components/Round1SelectorV2';
import Round2Generator from '@/components/Round2Generator';
import ReferenceLibrarySelector from '@/components/ReferenceLibrarySelector';
import ReferenceAnalysis from '@/components/ReferenceAnalysis';
import PromptOutputV2 from '@/components/PromptOutputV2';
import SurpriseMeButtonV2 from '@/components/SurpriseMeButtonV2';

export default function Home() {
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Step 0
  const [step0Selection, setStep0Selection] = useState<Step0Selection | null>(null);
  
  // References
  const [selectedReferences, setSelectedReferences] = useState<SelectedReferences>({
    faceCardIds: [],
    backCardId: undefined,
  });
  const [loadedReferences, setLoadedReferences] = useState<CardReference[]>([]);
  const [analysisTags, setAnalysisTags] = useState<AnalysisTags | undefined>(undefined);

  // Round 1
  const [round1Selection, setRound1Selection] = useState<Round1SelectionV2 | null>(null);
  
  // Round 2
  const [round2Selection, setRound2Selection] = useState<Round2Selection | null>(null);

  // Loaded principle and pillar
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  // Variants
  const [variants, setVariants] = useState<PromptVariant[]>([]);

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

  // Load selected principle and pillar when step0 changes
  useEffect(() => {
    async function loadSelected() {
      if (step0Selection?.principleId && step0Selection?.pillarId) {
        try {
          const [principle, pillar] = await Promise.all([
            loadPrinciple(step0Selection.principleId),
            loadPillar(step0Selection.pillarId),
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
  }, [step0Selection?.principleId, step0Selection?.pillarId]);

  // Build variants when all selections are complete
  useEffect(() => {
    async function buildVariants() {
      if (
        step0Selection && 
        selectedPrinciple && 
        selectedPillar && 
        round1Selection && 
        round2Selection &&
        loadedReferences.length > 0
      ) {
        try {
          const blueprint: SceneBlueprint = {
            step0: step0Selection,
            round1: round1Selection,
            round2: round2Selection,
            selectedReferences,
            analysisTags,
          };

          const generatedVariants = await generateVariants({
            blueprint,
            principle: selectedPrinciple,
            pillar: selectedPillar,
            references: loadedReferences,
          });

          setVariants(generatedVariants);
        } catch (error) {
          console.error('Error building variants:', error);
          setErrors(['Failed to build prompts. Please check your selections.']);
        }
      } else {
        setVariants([]);
      }
    }
    buildVariants();
  }, [
    step0Selection, 
    selectedPrinciple, 
    selectedPillar, 
    round1Selection, 
    round2Selection, 
    selectedReferences,
    loadedReferences,
    analysisTags
  ]);

  const handleStep0Change = useCallback((selection: Step0Selection) => {
    setStep0Selection(selection);
    // Reset downstream selections when step0 changes
    setRound1Selection(null);
    setRound2Selection(null);
  }, []);

  const handleRound1Change = useCallback((selection: Round1SelectionV2) => {
    setRound1Selection(selection);
    // Reset round2 when round1 changes
    setRound2Selection(null);
  }, []);

  const handleRound2Change = useCallback((selection: Round2Selection) => {
    setRound2Selection(selection);
  }, []);

  const handleReferencesChange = useCallback((selection: SelectedReferences) => {
    setSelectedReferences(selection);
  }, []);

  const handleReferencesLoad = useCallback((refs: CardReference[]) => {
    setLoadedReferences(refs);
  }, []);

  const handleAnalysisComplete = useCallback((tags: AnalysisTags) => {
    setAnalysisTags(tags);
  }, []);

  const handleSurpriseStep0 = useCallback((selection: Step0Selection) => {
    setStep0Selection(selection);
  }, []);

  const handleSurpriseRound1 = useCallback((selection: Round1SelectionV2) => {
    setRound1Selection(selection);
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
            <SurpriseMeButtonV2
              principles={principles}
              pillars={pillars}
              onSurpriseStep0={handleSurpriseStep0}
              onSurpriseRound1={handleSurpriseRound1}
            />
          </div>

          {/* Step 0: Prompt Setup */}
          <section className="bg-dark-grey border border-yellow-agave p-6 rounded-lg">
            <Step0Selector onSelectionChange={handleStep0Change} />
          </section>

          {/* Reference Library */}
          <section className="bg-dark-grey border border-muted-olive p-6 rounded-lg">
            <h2 className="text-2xl mb-4 text-white">REFERENCE IMAGES</h2>
            {step0Selection && (
              <>
                <ReferenceLibrarySelector
                  outputType={step0Selection.outputType}
                  onSelectionChange={handleReferencesChange}
                  onReferencesLoad={handleReferencesLoad}
                />
                
                {loadedReferences.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-muted-olive">
                    <ReferenceAnalysis
                      selectedReferences={loadedReferences}
                      onAnalysisComplete={handleAnalysisComplete}
                    />
                  </div>
                )}
              </>
            )}
            {!step0Selection && (
              <div className="p-4 border border-muted-olive rounded text-white opacity-70">
                Complete Step 0 first
              </div>
            )}
          </section>

          {/* Round 1 Selector */}
          <section className="bg-dark-grey border border-muted-olive p-6 rounded-lg">
            <Round1SelectorV2 
              principle={selectedPrinciple}
              pillar={selectedPillar}
              onSelectionChange={handleRound1Change} 
            />
          </section>

          {/* Round 2 Generator */}
          <section className="bg-dark-grey border border-muted-olive p-6 rounded-lg">
            <Round2Generator
              principle={selectedPrinciple}
              pillar={selectedPillar}
              onSelectionChange={handleRound2Change}
            />
          </section>

          {/* Prompt Output with Variants */}
          <section className="bg-dark-grey border border-yellow-agave p-6 rounded-lg">
            <PromptOutputV2 variants={variants} />
          </section>
        </div>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-white opacity-60 text-sm">
          <p>Mezcal Prompt Generator v2.0 - Optimized for Gemini AI</p>
          <p className="mt-2">No square formats. High hit-rate prompts. Still + Video support.</p>
        </footer>
      </div>
    </div>
  );
}
