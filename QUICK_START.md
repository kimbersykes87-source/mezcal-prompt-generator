# Mezcal Prompt Generator V2.0 - Quick Start

## 🎉 Upgrade Complete!

The Mezcal Prompt Generator has been successfully upgraded to V2.0 with significant improvements for Gemini image/video generation.

## What's New

### Major Features
- ✅ **Step 0 Gate**: Output type (Still/Video), Platform format (9:16/4:5), Intensity slider, People modes
- ✅ **Reference Library**: 55 card references with dropdown selection (no more uploads)
- ✅ **Pillar Sub-Modes**: 12 specialized sub-modes with rich templates
- ✅ **Prompt Variants**: 4 instant variants (Primary, Safe, Risky, Minimal) from one selection
- ✅ **Still vs Video**: Separate optimized templates with Material differences
- ✅ **Platform Packs**: Automatic safe zones and composition rules for 9:16 and 4:5
- ✅ **No Square Format**: 1:1 removed permanently per requirements

### Quality Improvements
- High hit-rate prompts optimized for limited AI Pro attempts
- Scroll-stopping hooks for still images
- Motion plans and continuity locks for video
- Tactile realism micro-specs always included
- Brand constraints strictly enforced

## Quick Start

### Running the App
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### Using the App
1. **Step 0**: Choose output type, format, intensity, people, principle, pillar, sub-mode
2. **References**: Select 1-3 face cards + optional back (max 3 for video)
3. **Analysis** (optional): Extract palette and lighting cues
4. **Round 1**: Location, camera, lighting, product
5. **Round 2**: Scene moment + props
6. **Output**: Review 4 variants, copy your preferred prompt
7. **Gemini**: Paste into Gemini AI for generation

### Try Surprise Me
Click "🎲 SURPRISE ME" to instantly randomize valid selections across all steps.

## File Structure

### New Core Files
```
lib/
  ├── referenceLibrary.ts       # Card loading (55 cards)
  ├── pillarSubModes.ts          # 12 sub-modes with templates
  ├── platformPacks.ts           # Platform rules & intensity mapping
  └── promptBuilderV2.ts         # Unified prompt builder + variants

components/
  ├── Step0Selector.tsx          # New Step 0 UI
  ├── ReferenceLibrarySelector.tsx # Reference dropdown selection
  ├── ReferenceAnalysis.tsx      # Analysis with caching
  ├── Round1SelectorV2.tsx       # Updated Round 1
  ├── PromptOutputV2.tsx         # Variant tabs
  └── SurpriseMeButtonV2.tsx     # Updated randomizer

public/
  ├── card-data/                 # 55 card JSON files
  ├── artwork/                   # Species artwork PNGs
  └── card-images/               # Full card JPGs
```

### Documentation
- `UPGRADE_NOTES.md` - Detailed upgrade documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `VALIDATION_CHECKLIST.md` - Complete validation checklist
- `QUICK_START.md` - This file

## Key Constraints

### Always Enforced
- ❌ No square 1:1 format
- ❌ No AI/external API calls
- ✅ Video mode max 3 refs
- ✅ Blank mezcal labels
- ✅ No bubbly mezcal
- ✅ Correct card size (2.5"x3.5")
- ✅ No extra fingers
- ✅ No text/logos/watermarks

### Platform Formats
- **9:16 (1080x1920)**: TikTok, IG Reels
- **4:5 (1080x1350)**: IG Feed, Carousel covers

### Intensity Scale
- **0-20**: Museum calm
- **21-50**: Social ready (default 35)
- **51-80**: Kinetic
- **81-100**: Controlled chaos

### People Modes
- **None**: Product only (default)
- **Hands**: Exactly 5 fingers per hand
- **Partial Body**: No faces
- **Full Body**: Faces toggle (default OFF)

## Pillar Sub-Modes

### Discover
- Species Reveal
- Terroir Evidence
- Comparative Tasting
- Maker's Hands

### Level Up
- Tasting Ritual
- How to Hold Copita
- Aroma Notes Mapping
- Palate Progression

### Play
- Quick Draw
- Tabletop Challenge
- Happy Accident Moments
- Card Flick Near-Miss

## Variant Types

1. **Primary**: Your exact selections
2. **Safe**: -15 intensity, fewer props, highest reliability
3. **Risky**: +25 intensity, more props, bold camera moves
4. **Minimal**: Intensity 10, max 1 prop, museum-grade

Each variant has its own Copy button.

## Tips for Best Results

### High Hit-Rate Strategy
1. Start with Safe variant for hands mode
2. Use intensity 20-50 for most reliable results
3. Keep references to 2-3 cards
4. Run analysis for palette consistency
5. Use sub-modes for context-appropriate templates

### Video Mode Tips
- Max 3 references for reliability
- Frame 1 will be crisp like a still
- Motion plan executes after Frame 1
- 4:5 format works for IG carousel covers

### Still Image Tips
- Use all 4 references if helpful
- Intensity 40-60 for social media
- Sub-mode hooks are pre-tested
- Realness specs ensure premium quality

## Troubleshooting

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### Reference Loading Issues
- Verify 55 files in `public/card-data/`
- Check browser console for 404 errors
- Ensure dev server is running

### Analysis Not Working
- Check localStorage is enabled
- Clear cache: Browser DevTools → Application → Local Storage → Clear
- Use manual tagging as fallback

## Performance

- **Build**: ~7 seconds
- **Dev ready**: ~2.4 seconds
- **Page load**: ~5 seconds (first), <100ms (subsequent)
- **Variant generation**: <100ms

## Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Responsive design

## Development

### Adding New Sub-Modes
Edit `lib/pillarSubModes.ts` and add to the appropriate pillar.

### Adding New Cards
1. Add JSON to `Prompt Guides/Card JSON/`
2. Copy to `public/card-data/`
3. Update CARD_IDS in `lib/referenceLibrary.ts`

### Modifying Intensity Mapping
Edit INTENSITY_MAPPINGS in `lib/platformPacks.ts`

### Customizing Platform Packs
Edit PLATFORM_PACKS in `lib/platformPacks.ts`

## Support

For issues or questions:
1. Check `IMPLEMENTATION_SUMMARY.md` for technical details
2. Review `VALIDATION_CHECKLIST.md` for testing scenarios
3. Inspect browser console for errors
4. Verify all 55 card files are in `public/card-data/`

## Success Metrics

The app successfully:
- ✅ Builds without errors
- ✅ Runs dev server without issues
- ✅ Loads all 55 card references
- ✅ Generates 4 variants instantly
- ✅ Enforces all hard constraints
- ✅ Produces high-quality Gemini prompts

## Version History

**V2.0** (Current)
- Complete workflow redesign with Step 0 gate
- Reference library system
- Pillar sub-modes with templates
- Prompt variants system
- Separate still/video templates
- Platform composition packs
- No square format support

**V1.0** (Previous)
- Basic two-round workflow
- Image upload references
- Single prompt output
- Square format supported

---

**Status**: ✅ Production Ready

**Upgrade Date**: January 20, 2026

**All Requirements Met**: Yes 🎉
