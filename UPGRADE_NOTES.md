# Mezcal Prompt Generator V2.0 - Upgrade Complete

## Overview
This is a major upgrade from V1 to V2, transforming the app to generate significantly better prompts for Google Gemini image/video generation with high hit-rate optimization.

## Key Changes

### NEW: Step 0 - Prompt Setup (Top-Level Gate)
- **Output Type**: Still Image or Video (First Frame)
- **Platform Format**: 9:16 (TikTok/IG Reels) or 4:5 (IG Feed/Carousel)
  - ❌ **REMOVED**: Square 1:1 format permanently eliminated
- **Intensity Slider**: 0-100 (Calm → Kinetic) - Default 35
- **People Control**: None/Hands/Partial Body/Full Body + Faces toggle
- **Principle Selection**: Moved from Round 1 to Step 0
- **Pillar Selection**: Moved from Round 1 to Step 0 with new sub-modes

### NEW: Pillar Sub-Modes
Each pillar now has specialized sub-modes with unique templates:

**Discover:**
- Species Reveal
- Terroir Evidence
- Comparative Tasting
- Maker's Hands

**Level Up:**
- Tasting Ritual
- How to Hold Copita
- Aroma Notes Mapping
- Palate Progression

**Play:**
- Quick Draw
- Tabletop Challenge
- Happy Accident Moments
- Card Flick Near-Miss

Each sub-mode provides 6+ moment templates, 6+ prop logic rules, and separate hooks for still vs video.

### NEW: Reference Library System
- Replaced upload with on-site reference library
- 55 card references from Card JSON directory
- Dropdown selection: Face Card 1-3 + optional Card Back
- **Still mode**: Max 4 refs (3 face + 1 back)
- **Video mode**: Max 3 refs total (hard limit for reliability)
- Automatic validation and warnings

### NEW: Image Analysis Feature
- Manual tagging fallback always available
- Optional "Analyze Selected Images" button
- Extracts: dominant palette, lighting cues, border rules, texture cues
- localStorage caching to avoid re-analysis
- Fully local - no API calls
- Analysis informs prompt generation without rendering readable text

### NEW: Prompt Variants System
From one selection, generates 4 instant variants:
1. **Primary**: Your exact selection
2. **Safe**: -15 intensity, fewer props, highest hit-rate
3. **Risky**: +25 intensity, more props, bold moves
4. **Minimal**: Intensity 10, max 1 prop, museum-grade

Each variant shown in tabs with individual Copy buttons.

### NEW: Platform Composition Packs
Automatic injection of platform-specific rules:

**9:16 (1080x1920):**
- Safe zones: Top 8%, Bottom 18%, Right 12%
- Subject scale: 55-70% of frame height
- Cropping rules enforced

**4:5 (1080x1350):**
- Safe zones: Top/Bottom 6%, Left/Right 5%
- Subject scale: 60-75% of frame height
- IG carousel cover optimized

### NEW: Separate Still vs Video Prompts
**Still prompts emphasize:**
- Scroll-stopping hook
- Premium tactile realism micro-specs
- Single perfect frame

**Video prompts include:**
- Crisp readable Frame 1 (like premium still)
- Motion Plan (after Frame 1)
- Continuity Locks (elements that must NOT change)
- 3 reference max for reliability

### Enhanced Features

**Intensity Mapping:**
- 0-20: Museum calm, minimal props, steady camera
- 21-50: Social ready, subtle action
- 51-80: Kinetic, dramatic angles
- 81-100: Controlled chaos, motion blur allowed after frame 1

**People Mapping:**
- None: Product only
- Hands: Exactly 5 fingers, anatomically correct
- Partial: Torso/arms, no faces
- Full Body: With faces toggle (default OFF)

**Brand Constraints (Always Enforced):**
- Blank mezcal labels
- Never bubbly/foamy mezcal
- 2.5"x3.5" card size
- No text/logos/UI icons
- Correct anatomy (no extra fingers)

**Realness Micro-Specs (Always Included):**
- Dust particles
- Fingerprints
- Condensation rings
- Liquid refraction/meniscus
- Micro scratches
- Contact shadows
- Crisp card edges

**Negative Constraints:**
- No extra fingers/warped hands
- No melted borders
- No incorrect proportions
- No surreal floating objects
- No text overlays

### Updated Round 1
- Principle and Pillar selection moved to Step 0
- Now focuses on: Location, Camera, Lighting, Product Focus
- Auto-merges options from both Principle and Pillar

### Updated Round 2
- Still uses existing Round2Generator
- Scene Moment + Props selection
- Now informed by selected sub-mode templates

### Updated Surprise Me
- Randomizes Step 0 + Round 1 together
- NO square format ever
- Video mode respects 3-ref limit
- Weighted randomization preserves quality

### File Structure

**New Core Libraries:**
- `lib/referenceLibrary.ts` - Card reference loading
- `lib/pillarSubModes.ts` - Sub-mode templates and hooks
- `lib/platformPacks.ts` - Platform composition rules & intensity mapping
- `lib/promptBuilderV2.ts` - Unified prompt builder with still/video templates + variant generator

**New Components:**
- `components/Step0Selector.tsx` - Step 0 UI with all new controls
- `components/ReferenceLibrarySelector.tsx` - Reference library dropdown selection
- `components/ReferenceAnalysis.tsx` - Analysis feature with localStorage caching
- `components/Round1SelectorV2.tsx` - Updated Round 1 (no Principle/Pillar)
- `components/PromptOutputV2.tsx` - Variant tabs with Copy buttons
- `components/SurpriseMeButtonV2.tsx` - Updated randomizer

**Updated:**
- `app/page.tsx` - Complete integration of new workflow
- `types/index.ts` - New types for SceneBlueprint, Step0Selection, etc.

**Public Assets:**
- `public/card-data/` - 55 card JSON files
- `public/artwork/` - Species artwork PNGs
- `public/card-images/` - Full card JPGs

**Preserved:**
- `lib/configLoader.ts` - Unchanged, loads Principles/Pillars
- `lib/round2Generator.ts` - Unchanged
- `components/Round2Generator.tsx` - Unchanged
- All existing Principle and Pillar JSON files

**Backup:**
- `app/page-old.tsx` - Original page.tsx backed up

## Hard Rules Enforced
1. ❌ **NO square 1:1 format anywhere**
2. ❌ **NO AI or external API calls** - All processing is local
3. ✅ **Video mode max 3 refs** - Hard validated
4. ✅ **Brand constraints always present** in every prompt
5. ✅ **Separate templates for still vs video**
6. ✅ **Variants generated instantly** without re-selection

## Testing Recommendations
1. Test Step 0 → Round 1 → Round 2 flow
2. Verify reference library dropdown selection
3. Test analysis caching (select refs, analyze, clear, re-select same refs)
4. Generate variants and copy each
5. Test Surprise Me randomization
6. Verify video mode blocks 4th reference
7. Test intensity slider effects on prompt language
8. Verify people mode + faces toggle interaction

## Notes
- All prompts are deterministic text generation from templates
- No external dependencies added
- Existing configs and data preserved
- Clean module boundaries maintained
- Ready for production deployment
