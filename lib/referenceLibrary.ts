import type { CardReference } from '@/types';

// Card reference library - loads from static JSON files
let cardLibraryCache: Map<string, CardReference> | null = null;

// All card IDs in the library (match the actual filenames in /public/card-data)
const CARD_IDS = [
  '001_spades_A_Pulquero', '002_spades_K_Maestro', '003_spades_Q_Maestra', '004_spades_J_Jimedor',
  '005_spades_10_Salmiana', '006_spades_9_Alto', '007_spades_8_Papalote', '008_spades_7_Masparillo',
  '009_spades_6_Mexicano', '010_spades_5_Coyote', '011_spades_4_Sierra-Negra', '012_spades_3_Arroqueno', '013_spades_2_Mountain-Agave',
  '014_hearts_A_Castilla', '015_hearts_K_Maestro', '016_hearts_Q_Maestra', '017_hearts_J_Jimedor',
  '018_hearts_10_Lumbre', '019_hearts_9_Tobaziche', '020_hearts_8_Bicuixe', '021_hearts_7_Madrecuixe',
  '022_hearts_6_Barril', '023_hearts_5_Cuishe', '024_hearts_4_Tepeztate', '025_hearts_3_Tobala', '026_hearts_2_Espadin',
  '027_clubs_A_Pulque-Chino', '028_clubs_K_Maestro', '029_clubs_Q_Maestra', '030_clubs_J_Jimedor',
  '031_clubs_10_Cinceganero', '032_clubs_9_Espadita', '033_clubs_8_Chahuiqui', '034_clubs_7_Tepemete',
  '035_clubs_6_Lamparillo', '036_clubs_5_Jabalí', '037_clubs_4_Wocomahi', '038_clubs_3_Pacifica', '039_clubs_2_Henequen',
  '040_diamonds_A_Chuparrosa', '041_diamonds_K_Maestro', '042_diamonds_Q_Maestra', '043_diamonds_J_Jimedor',
  '044_diamonds_10_Rayo', '045_diamonds_9_Warash', '046_diamonds_8_Maguey_Verde', '047_diamonds_7_Blue_Weber',
  '048_diamonds_6_Lechuguilla_Ceniza', '049_diamonds_5_Lechuguilla_de_la_Sierra', '050_diamonds_4_Chato_de_Sahuayo', '051_diamonds_3_Cenizo_Durangensis', '052_diamonds_2_Cimarron',
  '053_joker_black', '054_joker_red', '057_card-back'
] as const;

export async function loadCardReference(cardId: string): Promise<CardReference | null> {
  if (cardLibraryCache && cardLibraryCache.has(cardId)) {
    return cardLibraryCache.get(cardId)!;
  }

  try {
    const response = await fetch(`/card-data/${cardId}.json`);
    if (!response.ok) {
      console.warn(`Card ${cardId} not found`);
      return null;
    }
    const data = await response.json();
    
    // Only species cards (numbered ranks) have artwork PNGs, not face cards (K, Q, J)
    const isSpeciesCard = data.rank && !['K', 'Q', 'J', 'A'].includes(data.rank);
    const hasArtwork = isSpeciesCard || data.type === 'joker';
    
    const cardRef: CardReference = {
      id: cardId, // use the filename/id that matches the assets
      originalFilename: data.original_filename || `${cardId}.jpg`,
      newFilename: data.new_filename || `${cardId}.jpg`,
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
      artworkPath: hasArtwork ? `/artwork/${cardId}.png` : '',
      fullCardPath: `/card-images/${cardId}.jpg`,
      artworkPng: hasArtwork ? `/artwork/${cardId}.png` : undefined,
      fullCardJpg: `/card-images/${cardId}.jpg`,
      // Thumbnail paths (all cards have thumbnails)
      artworkThumbnail: hasArtwork ? `/artwork/thumbnails/${cardId}.png` : undefined,
      cardImageThumbnail: `/card-images/thumbnails/${cardId}.jpg`,
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
