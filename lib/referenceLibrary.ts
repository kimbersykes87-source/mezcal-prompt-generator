import type { CardReference } from '@/types';

// Card reference library - loads from static JSON files
let cardLibraryCache: Map<string, CardReference> | null = null;

// All card IDs in the library
const CARD_IDS = [
  '001_spades_A', '002_spades_K', '003_spades_Q', '004_spades_J',
  '005_spades_10', '006_spades_9', '007_spades_8', '008_spades_7',
  '009_spades_6', '010_spades_5', '011_spades_4', '012_spades_3', '013_spades_2',
  '014_hearts_A', '015_hearts_K', '016_hearts_Q', '017_hearts_J',
  '018_hearts_10', '019_hearts_9', '020_hearts_8', '021_hearts_7',
  '022_hearts_6', '023_hearts_5', '024_hearts_4', '025_hearts_3', '026_hearts_2',
  '027_clubs_A', '028_clubs_K', '029_clubs_Q', '030_clubs_J',
  '031_clubs_10', '032_clubs_9', '033_clubs_8', '034_clubs_7',
  '035_clubs_6', '036_clubs_5', '037_clubs_4', '038_clubs_3', '039_clubs_2',
  '040_diamonds_A', '041_diamonds_K', '042_diamonds_Q', '043_diamonds_J',
  '044_diamonds_10', '045_diamonds_9', '046_diamonds_8', '047_diamonds_7',
  '048_diamonds_6', '049_diamonds_5', '050_diamonds_4', '051_diamonds_3', '052_diamonds_2',
  '053_joker_black', '054_joker_red', '057_card-back'
] as const;

export async function loadCardReference(cardId: string): Promise<CardReference | null> {
  if (cardLibraryCache && cardLibraryCache.has(cardId)) {
    return cardLibraryCache.get(cardId)!;
  }

  try {
    // Find the filename - need to get the full filename from the directory
    const response = await fetch(`/card-data/${cardId}.json`);
    if (!response.ok) {
      console.warn(`Card ${cardId} not found`);
      return null;
    }
    const data = await response.json();
    
    // Construct paths
    const speciesName = data.text?.species_name || data.text?.tagline || cardId;
    const cleanSpeciesName = speciesName.replace(/[^a-zA-Z0-9-]/g, '-');
    const filename = `${cardId}_${cleanSpeciesName}`;
    
    const cardRef: CardReference = {
      id: data.id || cardId,
      originalFilename: data.original_filename || `${cardId}.jpg`,
      newFilename: data.new_filename || `${filename}.jpg`,
      type: data.type || 'face_card_species',
      suit: data.suit,
      rank: data.rank,
      text: {
        speciesName: data.text?.species_name,
        tagline: data.text?.tagline,
        tastingNotes: data.text?.tasting_notes || [],
        latinName: data.text?.latin_name,
        habitat: data.text?.habitat,
        size: data.text?.size,
        jobTitle: data.text?.job_title,
        actionLine: data.text?.action_line,
      },
      artworkPath: `/artwork/${filename}.png`,
      fullCardPath: `/card-images/${filename}.jpg`,
      jsonPath: `/card-data/${cardId}.json`,
    };
    
    if (!cardLibraryCache) {
      cardLibraryCache = new Map();
    }
    cardLibraryCache.set(cardId, cardRef);
    
    return cardRef;
  } catch (error) {
    console.error(`Error loading card ${cardId}:`, error);
    return null;
  }
}

export async function loadAllCardReferences(): Promise<CardReference[]> {
  const cards = await Promise.all(
    CARD_IDS.map(id => loadCardReference(id))
  );
  return cards.filter(card => card !== null) as CardReference[];
}

export function getCardDisplayName(card: CardReference): string {
  if (card.type === 'card_back') {
    return 'Card Back';
  }
  if (card.text.speciesName) {
    return `${card.text.speciesName} (${card.suit} ${card.rank})`;
  }
  if (card.text.jobTitle) {
    return `${card.text.jobTitle} (${card.suit} ${card.rank})`;
  }
  return `${card.suit} ${card.rank}`;
}

export function getFaceCards(): typeof CARD_IDS {
  return CARD_IDS;
}

export function getBackCardId(): string {
  return '057_card-back';
}

export function isBackCard(cardId: string): boolean {
  return cardId === '057_card-back';
}

export function isFaceCard(cardId: string): boolean {
  return !isBackCard(cardId);
}
