'use client';

import { useState } from 'react';
import type { AnalysisTags, CardReference } from '@/types';

interface ReferenceAnalysisProps {
  selectedReferences: CardReference[];
  onAnalysisComplete: (tags: AnalysisTags) => void;
}

// Simple hash function for creating refSetId
function hashReferenceIds(ids: string[]): string {
  return ids.sort().join('_');
}

// Predefined color palettes based on card suits (heuristic approach)
const SUIT_PALETTES: Record<string, string[]> = {
  spades: ['deep charcoal', 'slate grey', 'midnight blue', 'cool neutrals'],
  hearts: ['warm terracotta', 'burnt sienna', 'clay red', 'earth tones'],
  clubs: ['forest green', 'sage', 'olive', 'natural greens'],
  diamonds: ['golden amber', 'honey', 'desert sand', 'warm yellows'],
  default: ['neutral grey', 'warm beige', 'natural tones'],
};

// Predefined lighting cues
const LIGHTING_OPTIONS = [
  'natural daylight, soft shadows',
  'golden hour warmth, long shadows',
  'overcast diffused, minimal shadows',
  'dramatic side lighting, high contrast',
  'studio lighting, controlled highlights',
];

// Border consistency rules
const BORDER_RULES = [
  'maintain consistent border thickness across all cards',
  'preserve crisp card edges as shown in reference',
  'match corner radius style from reference cards',
];

export default function ReferenceAnalysis({ selectedReferences, onAnalysisComplete }: ReferenceAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisTags | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualPalette, setManualPalette] = useState<string[]>([]);
  const [manualLighting, setManualLighting] = useState('');

  const refSetId = hashReferenceIds(selectedReferences.map(r => r.id));

  // Check if we have cached analysis
  const getCachedAnalysis = (): AnalysisTags | null => {
    try {
      const cached = localStorage.getItem(`analysis_${refSetId}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error reading cached analysis:', error);
    }
    return null;
  };

  const saveAnalysisToCache = (tags: AnalysisTags) => {
    try {
      localStorage.setItem(`analysis_${refSetId}`, JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving analysis to cache:', error);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Check cache first
    const cached = getCachedAnalysis();
    if (cached) {
      setAnalysisResult(cached);
      onAnalysisComplete(cached);
      setIsAnalyzing(false);
      return;
    }

    // Perform heuristic analysis (local only, no API calls)
    setTimeout(() => {
      const tags = performHeuristicAnalysis(selectedReferences);
      setAnalysisResult(tags);
      saveAnalysisToCache(tags);
      onAnalysisComplete(tags);
      setIsAnalyzing(false);
    }, 500);
  };

  const performHeuristicAnalysis = (refs: CardReference[]): AnalysisTags => {
    // Determine dominant palette based on suits present
    const suits = refs.map(r => r.suit).filter(Boolean) as string[];
    const paletteSet = new Set<string>();
    
    suits.forEach(suit => {
      const palette = SUIT_PALETTES[suit] || SUIT_PALETTES.default;
      palette.forEach(color => paletteSet.add(color));
    });
    
    // If multiple suits, blend palettes
    let dominantPalette = Array.from(paletteSet).slice(0, 4);
    if (dominantPalette.length === 0) {
      dominantPalette = SUIT_PALETTES.default;
    }
    
    // Lighting summary - default to natural daylight
    const lightingSummary = LIGHTING_OPTIONS[0];
    
    // Texture cues from card types
    const textureCues = [
      'smooth card stock texture',
      'matte finish on cards',
      'printed ink surface detail',
    ];
    
    if (refs.some(r => r.text.speciesName)) {
      textureCues.push('organic agave textures implied');
    }
    
    const tags: AnalysisTags = {
      refSetId,
      dominantPalette,
      lightingSummary,
      borderRules: BORDER_RULES,
      textureCues,
    };
    
    return tags;
  };

  const handleManualTag = () => {
    if (manualPalette.length === 0 || !manualLighting) {
      alert('Please select palette colors and lighting');
      return;
    }
    
    const tags: AnalysisTags = {
      refSetId,
      dominantPalette: manualPalette,
      lightingSummary: manualLighting,
      borderRules: BORDER_RULES,
      textureCues: ['manually tagged textures'],
    };
    
    setAnalysisResult(tags);
    saveAnalysisToCache(tags);
    onAnalysisComplete(tags);
    setManualMode(false);
  };

  const handleTogglePaletteColor = (color: string) => {
    if (manualPalette.includes(color)) {
      setManualPalette(manualPalette.filter(c => c !== color));
    } else {
      if (manualPalette.length < 4) {
        setManualPalette([...manualPalette, color]);
      }
    }
  };

  if (selectedReferences.length === 0) {
    return (
      <div className="p-4 border border-muted-olive rounded text-white opacity-50">
        Select reference images first to enable analysis
      </div>
    );
  }

  const cached = getCachedAnalysis();
  const hasCached = !!cached;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-white">Image Analysis</h3>
        {hasCached && (
          <span className="text-xs text-yellow-agave">✓ Cached</span>
        )}
      </div>

      {!analysisResult && !manualMode && (
        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-muted-olive text-white rounded hover:bg-yellow-agave disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : hasCached ? 'Load Cached Analysis' : 'Analyze Selected Images'}
          </button>
          <button
            onClick={() => setManualMode(true)}
            className="px-4 py-2 bg-dark-grey border border-muted-olive text-white rounded hover:bg-muted-olive transition-colors"
          >
            Manual Tag
          </button>
        </div>
      )}

      {manualMode && (
        <div className="p-4 border border-yellow-agave rounded space-y-4">
          <h4 className="text-white font-medium">Manual Tagging</h4>
          
          <div>
            <label className="block text-sm mb-2 text-white">Dominant Palette (select up to 4)</label>
            <div className="grid grid-cols-2 gap-2">
              {[...Object.values(SUIT_PALETTES).flat(), ...SUIT_PALETTES.default].filter((v, i, a) => a.indexOf(v) === i).map(color => (
                <label key={color} className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={manualPalette.includes(color)}
                    onChange={() => handleTogglePaletteColor(color)}
                    disabled={!manualPalette.includes(color) && manualPalette.length >= 4}
                    className="accent-muted-olive"
                  />
                  <span className="text-sm">{color}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-white">Lighting Cue</label>
            <select
              value={manualLighting}
              onChange={(e) => setManualLighting(e.target.value)}
              className="w-full px-3 py-2 bg-dark-grey border border-muted-olive rounded text-white"
            >
              <option value="">-- Select lighting --</option>
              {LIGHTING_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleManualTag}
              className="px-4 py-2 bg-muted-olive text-white rounded hover:bg-yellow-agave transition-colors"
            >
              Apply Manual Tags
            </button>
            <button
              onClick={() => setManualMode(false)}
              className="px-4 py-2 bg-dark-grey border border-muted-olive text-white rounded hover:bg-muted-olive transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="p-4 border border-muted-olive rounded bg-dark-grey">
          <h4 className="text-white font-medium mb-3">Analysis Result</h4>
          <div className="space-y-3 text-sm text-white">
            <div className="flex flex-wrap gap-2">
              {analysisResult.dominantPalette.map(color => (
                <span key={color} className="px-2 py-1 rounded bg-muted-olive/40 text-xs">{color}</span>
              ))}
              <span className="px-2 py-1 rounded bg-yellow-agave/30 text-xs">
                Lighting: {analysisResult.lightingSummary}
              </span>
            </div>
            <div>
              <strong>Border Rules:</strong>
              <ul className="list-disc list-inside ml-2">
                {analysisResult.borderRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Texture Cues:</strong> {analysisResult.textureCues.join(', ')}
            </div>
          </div>
          <button
            onClick={() => {
              setAnalysisResult(null);
              setManualMode(false);
            }}
            className="mt-3 text-xs text-yellow-agave hover:underline"
          >
            Clear and re-analyze
          </button>
        </div>
      )}
    </div>
  );
}
