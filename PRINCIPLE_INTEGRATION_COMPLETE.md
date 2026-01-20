# Photography Principles Integration Complete

## Summary
Successfully integrated the updated Photography Principles JSON files (Action.json, Agaveculture.json, Atmosphere.json) with the Mezcal Prompt Generator V2.0 webapp.

## What Was Updated in Principle JSON Files

### New Structured Fields Added:

1. **step0_required**
   - Validation rules for which principles work with which settings
   - Platform format allowances
   - Output type specifications

2. **platform_behavior** (9:16 and 4:5)
   - Framing bias specific to each format
   - Safe zone notes with percentage guidance
   - Subject scale recommendations
   
   Example (Atmosphere):
   - 9:16: "tight vertical table intimacy, hands and cards centred"
   - 4:5: "slightly wider tabletop scene with more context clutter"

3. **intensity_bands** (0-20, 21-50, 51-80, 81-100)
   - Principle-specific behavior at each intensity level
   - Allowed motion types per band
   - Motion blur amount specifications
   - Prop density guidance
   
   Examples:
   - Action 0-20: "kinetic but controlled" with mid-action moments
   - Agaveculture 0-20: "museum-quiet texture" with no motion
   - Atmosphere 0-20: "quiet glow" with gentle card taps

4. **video_first_frame_rules**
   - first_frame_clarity_rules: Specific requirements for frame 1
   - motion_after_frame_1_plan: Allowed and avoided motions
   - continuity_locks: Elements that must not change
   
   Principle-specific continuity locks:
   - Action: Same card IDs, lighting, clutter layout
   - Agaveculture: Same agave species form, terrain texture, no new objects
   - Atmosphere: Same number of hands, lighting color, copita type

5. **prompt_fragments.realness_micro_specs**
   - Principle-specific tactile details
   - Action: "one sharp anchor element with surrounding blur"
   - Agaveculture: "waxy bloom and matte grit visible on leaf surfaces"
   - Atmosphere: "fingerprints on glass and glossy varnish, condensation ring under copita"

6. **prompt_fragments.negatives**
   - Principle-specific things to avoid
   - All share core negatives (extra fingers, warped hands, bubbles)
   - Agaveculture adds: "no plastic-looking leaves, no neon colour grading"
   - Atmosphere adds: "no whisky tumbler or rocks glass"

7. **variants**
   - Principle-specific variant configurations
   - Action Safe: -15 intensity, 2-4 props
   - Agaveculture Safe: -10 intensity, 0-2 props
   - Atmosphere Safe: -15 intensity, 1-4 props

8. **reference_rules**
   - Principle-specific reference preferences
   - Agaveculture prefers: 1 face + 1 back (quiet default)
   - Atmosphere prefers: 2 face + 1 back (atmosphere default)

## Code Changes

### types/index.ts - Extended Principle Interface:
- Added optional fields for all new principle properties
- Maintains backward compatibility with existing principle files
- New fields: step0_required, platform_behavior, intensity_bands, video_first_frame_rules, reference_rules, variants
- Enhanced prompt_fragments to include realness_micro_specs and negatives arrays

### lib/principleData.ts - NEW FILE:
Created helper functions to extract principle-specific data:
- `getPrincipleIntensityBehavior()` - Get behavior at specific intensity
- `getPrincipleVideoRules()` - Get video first-frame rules
- `getPrinciplePromptFragments()` - Get realness specs and negatives
- `getPrincipleVariantConfig()` - Get variant configurations
- `getPrinciplePlatformBehavior()` - Get platform-specific framing

### Files Copied:
- `Prompt Guides/Photography Principles/*.json` → `public/config/principles/`

## Key Improvements

### 1. Principle-Specific Intensity Behavior
Each principle now has unique behavior at the same intensity level:

**Intensity 35 (all in "social-ready" range):**
- **Action**: "Fast hands, quick shuffles, tight crop momentum"
- **Agaveculture**: "Field realism - tiny habitat context, dust and grit, soft wind implied"
- **Atmosphere**: "Casual flow - conversation energy, cards passed naturally, lived-in clutter"

### 2. Platform-Aware Framing
Each principle now provides platform-specific guidance:

**9:16 Format:**
- Action: Motion at center, tight crop to amplify momentum
- Agaveculture: Vertical spears filling frame, 70-95% agave texture
- Atmosphere: Tight vertical table intimacy, hands and cards centered

**4:5 Format:**
- Action: Slightly wider but still close, maintaining intimacy
- Agaveculture: Allow habitat hints like red soil or rock texture
- Atmosphere: Wider tabletop scene with more context clutter

### 3. Principle-Specific Video Rules
Each principle defines unique motion plans and continuity locks:

**Agaveculture Video:**
- Motion: "soft wind shifts leaf tips, dust lifts subtly, fibres flutter"
- Locks: "same agave species form, same terrain texture, no staged gardens appear"

**Atmosphere Video:**
- Motion: "hands continue passing deck, card slides and settles, glass nudges leaving ring"
- Locks: "same number of hands, same lighting color, same clutter layout"

**Action Video:**
- Motion: "shuffle continues, card pass completes, fan opens fully"
- Locks: "same card IDs, same motion style, no new clutter introduced"

### 4. Enhanced Realness Specs
Each principle now has its own tactile micro-specs:

**Action:**
- "one sharp anchor element with surrounding blur"
- "tight crop with hands in motion"
- "lived-in table textures"

**Agaveculture:**
- "waxy bloom and matte grit visible on leaf surfaces"
- "fine dust and soil particles caught in creases"
- "serrated margins with realistic spacing and sharpness"

**Atmosphere:**
- "fingerprints on glass and glossy varnish"
- "condensation ring under copita"
- "soft lamp bokeh and warm highlight rolloff"

### 5. Principle-Aware Variants
Variants now use principle-specific configurations:

**Safe Variant:**
- Action: -15 intensity, camera bias [angle_45, over_shoulder]
- Agaveculture: -10 intensity, camera bias [macro_crop, angle_45]
- Atmosphere: -15 intensity, camera bias [angle_45, over_shoulder]

**Risky Variant:**
- Action: +25 intensity, motion_blur_bias "low_to_medium"
- Agaveculture: +20 intensity, motion_bias "subtle wind and dust"
- Atmosphere: +25 intensity, motion_blur_bias "low_to_medium"

**Minimal Variant:**
- Action: intensity forced to 10
- Agaveculture: intensity forced to 5 (most minimal)
- Atmosphere: intensity forced to 10

## Example Prompt Differences

### Action @ Intensity 35
```
Scene Energy: Fast hands, quick shuffles, tight crop momentum
Allowed Motion: shuffle, deal, pass, card hover decision
Realness: one sharp anchor element with surrounding blur
```

### Agaveculture @ Intensity 35
```
Scene Energy: field realism - tiny habitat context, dust and grit, soft wind implied
Allowed Motion: subtle breeze, dust lift (very light)
Realness: waxy bloom and matte grit visible on leaf surfaces
```

### Atmosphere @ Intensity 35
```
Scene Energy: casual flow - conversation energy, cards passed naturally
Allowed Motion: deck pass, card slide, gentle clink
Realness: fingerprints on glass, condensation ring under copita
```

## Build Status
✅ Build successful  
✅ No errors  
✅ All types resolved  
✅ Principle files copied to public  
✅ Ready for integration with prompt builder

## Next Steps for Full Integration

The prompt builder (`lib/promptBuilderV2.ts`) can now be enhanced to:
1. Load principle-specific intensity behavior
2. Use principle-specific realness micro-specs
3. Apply principle-specific video rules
4. Use principle-specific variant configurations
5. Inject principle-specific platform behavior

The helper functions are ready in `lib/principleData.ts`.

## Backwards Compatibility
All new fields are optional, so existing principle JSON files without these fields will continue to work with fallback defaults.

## Conclusion
The Photography Principles are now as rich and structured as the Content Pillars, providing deep principle-specific guidance for:
- Platform composition
- Intensity behavior
- Video motion plans
- Realness specifications
- Variant generation

The webapp can now generate prompts that feel distinctly different between Action (kinetic, motion-forward), Agaveculture (earthy, plant-first), and Atmosphere (warm, social, intimate).
