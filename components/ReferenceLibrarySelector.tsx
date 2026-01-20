'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { SelectedReferences, CardReference, OutputType } from '@/types';
import { loadAllCardReferences, getCardDisplayName, isBackCard } from '@/lib/referenceLibrary';

interface ReferenceLibrarySelectorProps {
  outputType: OutputType;
  onSelectionChange: (selection: SelectedReferences) => void;
  onReferencesLoad: (references: CardReference[]) => void;
}

export default function ReferenceLibrarySelector({ 
  outputType, 
  onSelectionChange,
  onReferencesLoad 
}: ReferenceLibrarySelectorProps) {
  const [allCards, setAllCards] = useState<CardReference[]>([]);
  const [selection, setSelection] = useState<SelectedReferences>({
    faceCardIds: [],
    backCardId: undefined,
  });
  const [warning, setWarning] = useState<string>('');
  const [query, setQuery] = useState('');
  const [suitFilter, setSuitFilter] = useState<'all' | 'spades' | 'hearts' | 'clubs' | 'diamonds'>('all');

  useEffect(() => {
    async function loadCards() {
      try {
        const cards = await loadAllCardReferences();
        setAllCards(cards);
      } catch (error) {
        console.error('Error loading card references:', error);
      }
    }
    loadCards();
  }, []);

  const faceCards = allCards.filter(card => !isBackCard(card.id));
  const backCard = allCards.find(card => isBackCard(card.id));

  const filteredFaceCards = useMemo(() => {
    const q = query.toLowerCase();
    return faceCards.filter(card => {
      const matchesSuit = suitFilter === 'all' || card.suit === suitFilter;
      const label = getCardDisplayName(card).toLowerCase();
      return matchesSuit && label.includes(q);
    });
  }, [faceCards, query, suitFilter]);

  const maxTotalRefs = outputType === 'video' ? 3 : 4;
  const maxFaceCards = outputType === 'video' ? 3 : 3;

  const exceedsLimit = (nextFaceIds: string[], nextBackId?: string) => {
    const totalRefs = nextFaceIds.filter(Boolean).length + (nextBackId ? 1 : 0);
    return totalRefs > maxTotalRefs;
  };

  const handleFaceCardChange = (slotIndex: number, cardId: string) => {
    const newFaceCardIds = [...selection.faceCardIds];
    
    if (cardId === '') {
      // Remove this slot
      newFaceCardIds.splice(slotIndex, 1);
    } else {
      // Update or add
      newFaceCardIds[slotIndex] = cardId;
    }
    
    const newSelection = { ...selection, faceCardIds: newFaceCardIds };
    if (exceedsLimit(newFaceCardIds, newSelection.backCardId)) {
      setWarning(outputType === 'video'
        ? '⚠️ Video mode supports max 3 references for reliability. Remove one card.'
        : '⚠️ Still mode supports max 4 references (3 face + 1 back). Remove one card.');
      return;
    }
    setWarning('');
    
    setSelection(newSelection);
    onSelectionChange(newSelection);
    
    // Load the selected references
    const selectedRefs = allCards.filter(card => 
      newFaceCardIds.includes(card.id) || card.id === newSelection.backCardId
    );
    onReferencesLoad(selectedRefs);
  };

  const handleBackCardChange = (checked: boolean) => {
    const newSelection = { 
      ...selection, 
      backCardId: checked ? backCard?.id : undefined 
    };
    
    if (exceedsLimit(newSelection.faceCardIds, newSelection.backCardId)) {
      setWarning(outputType === 'video'
        ? '⚠️ Video mode supports max 3 references for reliability. Remove one card before adding the back.'
        : '⚠️ Still mode supports max 4 references (3 face + 1 back). Remove one card before adding the back.');
      return;
    }
    setWarning('');
    
    setSelection(newSelection);
    onSelectionChange(newSelection);
    
    // Load the selected references
    const selectedRefs = allCards.filter(card => 
      newSelection.faceCardIds.includes(card.id) || card.id === newSelection.backCardId
    );
    onReferencesLoad(selectedRefs);
  };

  const showAddButton = selection.faceCardIds.length < maxFaceCards;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-white">Reference Library</h3>
        <span className="text-sm text-white opacity-70">
          {outputType === 'video' ? 'Max 3 refs total for video' : 'Max 4 refs (3 face + 1 back)'}
        </span>
      </div>

      {warning && (
        <div className="p-3 bg-terracotta border border-yellow-agave text-white rounded text-sm">
          {warning}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Search by name, species, or rank"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 bg-dark-grey border border-muted-olive rounded text-white"
        />
        <select
          value={suitFilter}
          onChange={(e) => setSuitFilter(e.target.value as typeof suitFilter)}
          className="w-full px-3 py-2 bg-dark-grey border border-muted-olive rounded text-white"
        >
          <option value="all">All suits</option>
          <option value="spades">Spades</option>
          <option value="hearts">Hearts</option>
          <option value="clubs">Clubs</option>
          <option value="diamonds">Diamonds</option>
        </select>
        <div className="flex items-center text-sm text-white opacity-70">
          {outputType === 'video'
            ? 'Tip: Max 3 refs for reliability.'
            : 'Tip: Up to 3 face cards + 1 back.'}
        </div>
      </div>

      {/* Face Card Selectors */}
      <div className="space-y-3">
        {[0, 1, 2].map(slotIndex => {
          const cardId = selection.faceCardIds[slotIndex];
          const isVisible = slotIndex === 0 || selection.faceCardIds[slotIndex - 1];
          
          if (!isVisible) return null;
          
          return (
            <div key={slotIndex}>
              <label className="block text-sm mb-1 text-white">
                Face Card {slotIndex + 1} {slotIndex === 0 && '(required)'}
              </label>
              <select
                value={cardId || ''}
                onChange={(e) => handleFaceCardChange(slotIndex, e.target.value)}
                className="w-full px-3 py-2 bg-dark-grey border border-muted-olive rounded text-white"
                required={slotIndex === 0}
              >
                <option value="">-- Select a card --</option>
                {filteredFaceCards.map(card => (
                  <option 
                    key={card.id} 
                    value={card.id}
                    disabled={selection.faceCardIds.includes(card.id) && cardId !== card.id}
                  >
                    {getCardDisplayName(card)}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Card Back */}
      {backCard && (
        <div>
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="checkbox"
              checked={!!selection.backCardId}
              onChange={(e) => handleBackCardChange(e.target.checked)}
              className="accent-muted-olive"
              disabled={exceedsLimit(selection.faceCardIds, backCard.id)}
            />
            <span>Include Card Back (optional but recommended)</span>
          </label>
        </div>
      )}

      {/* Selection Summary */}
      {selection.faceCardIds.length > 0 && (
        <div className="mt-4 p-3 bg-dark-grey border border-muted-olive rounded">
          <div className="text-sm text-white">
            <strong>Selected:</strong> {selection.faceCardIds.length} face card(s)
            {selection.backCardId && ' + card back'}
            {' '}= {selection.faceCardIds.length + (selection.backCardId ? 1 : 0)} total references
          </div>
        </div>
      )}

      {/* Preview Grid */}
      {selection.faceCardIds.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-white mb-2">Preview:</div>
          <div className="grid grid-cols-3 gap-3">
            {selection.faceCardIds.map(cardId => {
              const card = allCards.find(c => c.id === cardId);
              if (!card) return null;
              // Use artwork if available, otherwise fall back to card image (face cards don't have artwork)
              const imageSrc = (card.artworkPng || card.artworkPath) || (card.fullCardJpg || card.fullCardPath || '/card-images/057_card-back.jpg');
              
              return (
                <div key={cardId} className="text-center space-y-1">
                  <div className="aspect-[2.5/3.5] relative overflow-hidden rounded border border-yellow-agave bg-dark-grey">
                    <Image
                      src={imageSrc}
                      alt={getCardDisplayName(card)}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs text-white opacity-80 flex items-center gap-1 justify-center">
                    <span className="px-2 py-[2px] rounded bg-muted-olive/60">{card.suit} {card.rank}</span>
                    <span className="truncate">{card.text?.speciesName || card.text?.jobTitle || 'Card'}</span>
                  </div>
                </div>
              );
            })}
            {selection.backCardId && backCard && (
              <div className="text-center space-y-1">
                <div className="aspect-[2.5/3.5] relative overflow-hidden rounded border border-yellow-agave bg-dark-grey">
                  <Image
                    src={(backCard.artworkPng || backCard.artworkPath) || (backCard.fullCardJpg || backCard.fullCardPath || '/card-images/057_card-back.jpg')}
                    alt="Card Back"
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </div>
                <div className="text-xs text-white opacity-70">
                  Back
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
