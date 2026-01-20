import type { 
  SceneBlueprint, 
  Principle, 
  Pillar, 
  CardReference, 
  PromptVariant,
  OutputType,
  PlatformFormat
} from '@/types';
import { 
  getPlatformResolution, 
  getSafeZoneInstructions, 
  getSubjectScaleInstructions,
  getCroppingInstructions,
  getIntensityMapping,
  getIntensityForVariant
} from './platformPacks';
import { getSubMode, getIntensityBehavior, getPromptFragments, getVideoFirstFrameRules, getVariantConfig } from './pillarSubModes';

interface PromptBuildConfig {
  blueprint: SceneBlueprint;
  principle: Principle;
  pillar: Pillar;
  references: CardReference[];
}

// These will be augmented by pillar-specific data loaded from JSONs
const FALLBACK_BRAND_CONSTRAINTS = [
  'mezcal bottles must have completely blank labels with no text or branding visible',
  'poured mezcal must be crystal clear still liquid, absolutely never bubbly or foamy',
  'playing cards must be accurate casino standard size 2.5 inches by 3.5 inches',
  'no UI icons, no corner marks, no sparkles, no watermarks, no logos anywhere in image',
  'mezcal must be served in small traditional clay copita or small tulip-shaped copita glass, never in tumbler or rocks glass',
];

const FALLBACK_NEGATIVE_CONSTRAINTS = [
  'no extra fingers',
  'no warped hands',
  'no deformed anatomy',
  'no melted card borders',
  'no incorrect card proportions',
  'no bubbles or foam in mezcal liquid',
  'no surreal floating objects',
  'no text overlays',
  'no watermarks',
  'no UI elements',
  'no readable text except on reference cards themselves',
];

const FALLBACK_REALNESS_MICRO_SPECS = [
  'visible dust particles on surfaces',
  'authentic fingerprints on glass or card edges',
  'condensation rings under glass base',
  'accurate liquid refraction with realistic meniscus in copita',
  'micro scratches on worn surfaces',
  'correct contact shadows with soft edges',
  'crisp card edges with consistent border thickness matching reference',
  'realistic material response to light and touch',
];

function getPeopleBlock(blueprint: SceneBlueprint): string[] {
  const { peopleMode, facesAllowed } = blueprint.step0;
  
  if (peopleMode === 'none') {
    return ['No human elements visible in frame, product and environment only'];
  }
  
  if (peopleMode === 'hands') {
    return [
      'Human hands only: show hands in frame with authentic gestures',
      'Hands must be anatomically correct with exactly 5 fingers per hand',
      'Natural skin tones and textures, work-worn or refined as appropriate',
      'No other body parts visible beyond wrists',
      'Hand positioning must feel motivated and natural, never posed artificially',
    ];
  }
  
  if (peopleMode === 'partialNoFace') {
    return [
      'Partial human presence: torso, arms, and hands visible',
      'Absolutely no faces visible - crop at neck or below shoulders',
      'No eyes, nose, mouth, or facial features of any kind',
      'Wardrobe appropriate to context: work-worn denim, leather, canvas, or refined textures',
      'Body language should communicate intent through gesture and posture',
    ];
  }
  
  if (peopleMode === 'fullBody') {
    const faceRules = facesAllowed 
      ? ['Full human figure allowed including face, age 25-55, authentic representation']
      : ['Full human figure visible but face must be turned away, obscured, or out of frame'];
    
    return [
      ...faceRules,
      'Natural posture and authentic body language',
      'Wardrobe textures: work-worn materials, traditional fabrics, contemporary casual',
      'Hands must have exactly 5 fingers each, anatomically correct',
      'Diverse representation, authentic to mezcal culture and modern enthusiasts',
    ];
  }
  
  return [];
}

function getReferenceBlock(references: CardReference[], analysistags?: any): string[] {
  if (references.length === 0) return [];
  
  const block: string[] = ['Reference Images:'];
  
  references.forEach((ref, idx) => {
    const refNum = idx + 1;
    if (ref.type === 'card_back') {
      block.push(`Reference ${refNum}: Card back design - use as reference for card backing visible in scene`);
    } else {
      const species = ref.text.speciesName || 'species';
      block.push(`Reference ${refNum}: ${species} card (${ref.suit} ${ref.rank})`);
      
      if (ref.text.latinName) {
        block.push(`  Latin name: ${ref.text.latinName} (metadata only - do not render as readable text)`);
      }
      if (ref.text.tastingNotes && ref.text.tastingNotes.length > 0) {
        block.push(`  Tasting notes: ${ref.text.tastingNotes.join(', ')} (use to guide mood and props, not as readable text)`);
      }
      if (ref.text.habitat) {
        block.push(`  Habitat context: ${ref.text.habitat} (inform terroir and environment choices)`);
      }
    }
  });
  
  block.push('Use reference images for visual style, color palette, border consistency, and card design elements');
  block.push('Card artwork should match reference style but NO readable text may appear on any surface except the reference card itself');
  
  if (analysistags) {
    block.push('');
    block.push('Analysis Tags from References:');
    if (analysistags.dominantPalette?.length) {
      block.push(`Dominant palette: ${analysistags.dominantPalette.join(', ')}`);
    }
    if (analysistags.lightingSummary) {
      block.push(`Lighting cues: ${analysistags.lightingSummary}`);
    }
    if (analysistags.borderRules?.length) {
      block.push(`Border rules: ${analysistags.borderRules.join(', ')}`);
    }
    if (analysistags.textureCues?.length) {
      block.push(`Texture cues: ${analysistags.textureCues.join(', ')}`);
    }
  }
  
  return block;
}

async function buildStillPrompt(config: PromptBuildConfig): Promise<string> {
  const { blueprint, principle, pillar, references } = config;
  const { step0, round1, round2 } = blueprint;
  
  const parts: string[] = [];
  const resolution = getPlatformResolution(step0.platformFormat);
  const intensityMap = getIntensityMapping(step0.intensity);
  const subMode = await getSubMode(step0.pillarId, step0.subModeId);
  const intensityBehavior = await getIntensityBehavior(step0.pillarId, step0.intensity);
  const promptFragments = await getPromptFragments(step0.pillarId);
  
  // Use pillar-specific fragments or fallbacks
  const realnessSpecs = promptFragments?.realness_micro_specs || FALLBACK_REALNESS_MICRO_SPECS;
  const brandConstraints = promptFragments?.brand_hard_constraints || FALLBACK_BRAND_CONSTRAINTS;
  const negativeConstraints = promptFragments?.negatives || FALLBACK_NEGATIVE_CONSTRAINTS;
  
  // Header
  parts.push('GEMINI IMAGE GENERATION PROMPT - STILL IMAGE');
  parts.push('');
  parts.push(`Output Format: ${step0.platformFormat} (${resolution})`);
  parts.push('');
  
  // Reference block
  const refBlock = getReferenceBlock(references, blueprint.analysisTags);
  if (refBlock.length > 0) {
    parts.push(...refBlock);
    parts.push('');
  }
  
  // Scene section
  parts.push('SCENE COMPOSITION:');
  const location = principle.locations.preferred.find(l => l.id === round1.locationId);
  if (location) {
    parts.push(`Location: ${location.label}`);
    if (location.notes) {
      parts.push(`Context: ${location.notes}`);
    }
  }
  parts.push('');
  
  // Hook and moment
  if (subMode && subMode.hookPatternsStill.length > 0) {
    parts.push(`Visual Hook: ${subMode.hookPatternsStill[0]}`);
    parts.push('This must be SCROLL-STOPPING and premium but punchy');
  }
  parts.push(`Scene Moment: ${round2.sceneMoment}`);
  parts.push('');
  
  // Energy and intensity (use pillar-specific behavior if available)
  if (intensityBehavior) {
    parts.push(`Scene Energy: ${intensityBehavior.label} - ${intensityBehavior[`${step0.pillarId}_behaviour`] || intensityBehavior.discover_behaviour || intensityBehavior.levelup_behaviour || intensityBehavior.play_behaviour}`);
    parts.push(`Intensity Level: ${step0.intensity}/100`);
    if (intensityBehavior.allowed_motion && intensityBehavior.allowed_motion.length > 0) {
      parts.push(`Allowed motion: ${intensityBehavior.allowed_motion.join(', ')}`);
    }
  } else {
    parts.push(`Scene Energy: ${intensityMap.sceneEnergy.join(', ')}`);
    parts.push(`Intensity Level: ${step0.intensity}/100`);
  }
  parts.push('');
  
  // Props
  if (round2.props && round2.props.length > 0) {
    parts.push(`Props: ${round2.props.join(', ')}`);
    parts.push(`Prop Density: ${intensityMap.propDensity}`);
    parts.push('');
  }
  
  // Camera
  const cameraOption = principle.camera.preferred_angles.find(c => c.id === round1.cameraId);
  if (cameraOption) {
    parts.push('CAMERA:');
    parts.push(`Angle: ${cameraOption.label}`);
    if (cameraOption.notes) {
      parts.push(`Notes: ${cameraOption.notes}`);
    }
    parts.push(`Style: ${intensityMap.cameraStyle.join(', ')}`);
    if (principle.camera.lens_language.length > 0) {
      parts.push(`Lens: ${principle.camera.lens_language.slice(0, 2).join(', ')}`);
    }
    if (principle.camera.focus_targets_ranked.length > 0) {
      parts.push(`Focus priority: ${principle.camera.focus_targets_ranked.slice(0, 3).join(' > ')}`);
    }
    parts.push('');
  }
  
  // Lighting
  const lightingOption = principle.lighting.preferred.find(l => l.id === round1.lightingId);
  if (lightingOption) {
    parts.push('LIGHTING:');
    parts.push(`Setup: ${lightingOption.label}`);
    if (lightingOption.notes) {
      parts.push(`Character: ${lightingOption.notes}`);
    }
    if (principle.lighting.shadow_notes && principle.lighting.shadow_notes.length > 0) {
      parts.push(`Shadows: ${principle.lighting.shadow_notes.slice(0, 2).join(', ')}`);
    }
    parts.push('');
  }
  
  // People block
  const peopleBlock = getPeopleBlock(blueprint);
  if (peopleBlock.length > 0) {
    parts.push('HUMAN ELEMENTS:');
    parts.push(...peopleBlock.map(line => `- ${line}`));
    parts.push('');
  }
  
  // Platform composition
  parts.push('PLATFORM COMPOSITION RULES:');
  parts.push(`Format: ${step0.platformFormat} at ${resolution}`);
  parts.push(`Safe zones: ${getSafeZoneInstructions(step0.platformFormat)}`);
  parts.push(getSubjectScaleInstructions(step0.platformFormat));
  const croppingRules = getCroppingInstructions(step0.platformFormat);
  croppingRules.forEach(rule => parts.push(`- ${rule}`));
  parts.push('');
  
  // Realness micro-specs (use pillar-specific if available)
  parts.push('TACTILE REALISM MICRO-SPECS (CRITICAL):');
  realnessSpecs.forEach((spec: string) => parts.push(`- ${spec}`));
  parts.push('');
  
  // Style and mood
  if (principle.prompt_fragments?.style_line) {
    parts.push('STYLE:');
    parts.push(principle.prompt_fragments.style_line);
    if (pillar.primary_emotion) {
      parts.push(`Mood: ${pillar.primary_emotion} with ${pillar.visual_story_rules?.hook_types_ranked?.[0] || 'authentic presence'}`);
    }
    parts.push('');
  }
  
  // Hard constraints (use pillar-specific if available)
  parts.push('HARD CONSTRAINTS (MUST ENFORCE):');
  brandConstraints.forEach((constraint: string) => parts.push(`- ${constraint}`));
  
  // Add principle and pillar locked constraints that aren't duplicates
  const allBrandConstraints = brandConstraints.map((c: string) => c.toLowerCase());
  principle.hard_constraints_locked?.slice(0, 3).forEach((constraint: string) => {
    if (!allBrandConstraints.some((bc: string) => bc.includes(constraint.toLowerCase().split(' ')[0]))) {
      parts.push(`- ${constraint}`);
    }
  });
  pillar.hard_constraints_locked?.slice(0, 3).forEach((constraint: string) => {
    if (!allBrandConstraints.some((bc: string) => bc.includes(constraint.toLowerCase().split(' ')[0]))) {
      parts.push(`- ${constraint}`);
    }
  });
  parts.push('');
  
  // Negative constraints (use pillar-specific if available)
  parts.push('NEGATIVE CONSTRAINTS (AVOID):');
  negativeConstraints.forEach((constraint: string) => parts.push(`- ${constraint}`));
  parts.push('');
  
  // Output spec
  parts.push(`OUTPUT: ${resolution}, high-quality, scroll-stopping still image optimized for social media`);
  
  return parts.join('\n');
}

async function buildVideoPrompt(config: PromptBuildConfig): Promise<string> {
  const { blueprint, principle, pillar, references } = config;
  const { step0, round1, round2 } = blueprint;
  
  const parts: string[] = [];
  const resolution = getPlatformResolution(step0.platformFormat);
  const intensityMap = getIntensityMapping(step0.intensity);
  const subMode = await getSubMode(step0.pillarId, step0.subModeId);
  const intensityBehavior = await getIntensityBehavior(step0.pillarId, step0.intensity);
  const promptFragments = await getPromptFragments(step0.pillarId);
  const videoRules = await getVideoFirstFrameRules(step0.pillarId);
  
  // Use pillar-specific fragments or fallbacks
  const realnessSpecs = promptFragments?.realness_micro_specs || FALLBACK_REALNESS_MICRO_SPECS;
  const brandConstraints = promptFragments?.brand_hard_constraints || FALLBACK_BRAND_CONSTRAINTS;
  const negativeConstraints = promptFragments?.negatives || FALLBACK_NEGATIVE_CONSTRAINTS;
  
  // Header
  parts.push('GEMINI VIDEO GENERATION PROMPT - FIRST FRAME + MOTION PLAN');
  parts.push('');
  parts.push(`Output Format: ${step0.platformFormat} (${resolution})`);
  parts.push('NOTE: This prompt generates a video. Frame 1 must be crisp and readable like a premium still.');
  parts.push('');
  
  // Reference block (max 3 refs enforced)
  const limitedRefs = references.slice(0, 3);
  const refBlock = getReferenceBlock(limitedRefs, blueprint.analysisTags);
  if (refBlock.length > 0) {
    parts.push(...refBlock);
    parts.push('VIDEO MODE: Maximum 3 references for reliability');
    parts.push('');
  }
  
  // FRAME 1 section
  parts.push('═══ FRAME 1 COMPOSITION (MUST BE CRISP) ═══');
  parts.push('');
  const location = principle.locations.preferred.find(l => l.id === round1.locationId);
  if (location) {
    parts.push(`Location: ${location.label}`);
    if (location.notes) {
      parts.push(`Context: ${location.notes}`);
    }
  }
  parts.push('');
  
  // Hook for video
  if (subMode && subMode.hookPatternsVideo.length > 0) {
    parts.push(`First Frame Hook: ${subMode.hookPatternsVideo[0]}`);
    parts.push('Frame 1 must look like a premium still image that hooks attention');
  }
  parts.push(`Scene Moment: ${round2.sceneMoment}`);
  parts.push('');
  
  // Props
  if (round2.props && round2.props.length > 0) {
    parts.push(`Props in Frame 1: ${round2.props.join(', ')}`);
    parts.push(`Prop Density: ${intensityMap.propDensity}`);
    parts.push('');
  }
  
  // Camera for Frame 1
  const cameraOption = principle.camera.preferred_angles.find(c => c.id === round1.cameraId);
  if (cameraOption) {
    parts.push('Camera (Frame 1):');
    parts.push(`Starting angle: ${cameraOption.label}`);
    if (cameraOption.notes) {
      parts.push(`Notes: ${cameraOption.notes}`);
    }
    parts.push('Frame 1 must be stable and clear, motion begins after');
    parts.push('');
  }
  
  // Lighting
  const lightingOption = principle.lighting.preferred.find(l => l.id === round1.lightingId);
  if (lightingOption) {
    parts.push('Lighting (consistent throughout):');
    parts.push(`Setup: ${lightingOption.label}`);
    if (lightingOption.notes) {
      parts.push(`Character: ${lightingOption.notes}`);
    }
    parts.push('');
  }
  
  // People block
  const peopleBlock = getPeopleBlock(blueprint);
  if (peopleBlock.length > 0) {
    parts.push('Human Elements:');
    parts.push(...peopleBlock.map(line => `- ${line}`));
    parts.push('');
  }
  
  // Platform composition
  parts.push('Platform Composition (Frame 1):');
  parts.push(`Format: ${step0.platformFormat} at ${resolution}`);
  parts.push(`Safe zones: ${getSafeZoneInstructions(step0.platformFormat)}`);
  parts.push(getSubjectScaleInstructions(step0.platformFormat));
  parts.push('');
  
  // Realness for Frame 1
  parts.push('Tactile Realism (Frame 1 must show):');
  realnessSpecs.slice(0, 5).forEach((spec: string) => parts.push(`- ${spec}`));
  parts.push('');
  
  // MOTION PLAN section (use pillar-specific video rules if available)
  parts.push('═══ MOTION PLAN (AFTER FRAME 1) ═══');
  parts.push('');
  
  if (intensityBehavior) {
    const pillarBehaviorKey = `${step0.pillarId}_behaviour`;
    const behavior = intensityBehavior[pillarBehaviorKey] || intensityBehavior.discover_behaviour || intensityBehavior.levelup_behaviour || intensityBehavior.play_behaviour;
    parts.push(`Motion Intensity: ${intensityBehavior.label} - ${behavior}`);
    if (intensityBehavior.allowed_motion) {
      parts.push(`Allowed motion after frame 1: ${intensityBehavior.allowed_motion.join(', ')}`);
    }
  } else {
    parts.push(`Motion Intensity: ${intensityMap.motionPlanIntensity}`);
    parts.push(`Energy: ${intensityMap.sceneEnergy.join(', ')}`);
  }
  parts.push(`Camera movement style: ${intensityMap.cameraStyle.join(', ')}`);
  parts.push('');
  
  if (videoRules?.motion_after_frame_1_bias) {
    parts.push('Pillar-specific motion suggestions:');
    videoRules.motion_after_frame_1_bias.forEach((suggestion: string) => parts.push(`- ${suggestion}`));
    parts.push('');
  }
  
  if (subMode && subMode.hookPatternsVideo.length > 0) {
    parts.push('Sub-mode specific motion sequence:');
    parts.push(subMode.hookPatternsVideo[0]);
    parts.push('');
  }
  
  parts.push('Motion rules:');
  parts.push('- Frame 1 is crisp and stable');
  parts.push('- Motion begins smoothly after Frame 1');
  parts.push('- Camera moves must feel motivated by scene, never arbitrary');
  parts.push('- If hands present, movement must be natural and purposeful');
  if (step0.intensity > 60) {
    parts.push('- Motion blur allowed after Frame 1 for kinetic energy');
  }
  parts.push('');
  
  // CONTINUITY LOCKS (use pillar-specific if available)
  parts.push('═══ CONTINUITY LOCKS (MUST NOT CHANGE) ═══');
  parts.push('');
  parts.push('These elements must remain consistent across all frames:');
  
  if (videoRules?.continuity_locks) {
    videoRules.continuity_locks.forEach((lock: string) => parts.push(`- ${lock}`));
  } else {
    parts.push('- Card design, borders, and artwork style');
    parts.push('- Playing card size (2.5" x 3.5")');
    parts.push('- Mezcal bottle label (must stay blank throughout)');
    parts.push('- Copita shape and material');
    parts.push('- Lighting direction and quality');
    parts.push('- Location and surface textures');
    parts.push('- Color palette from references');
  }
  
  if (blueprint.analysisTags?.borderRules) {
    parts.push(`- Border rules: ${blueprint.analysisTags.borderRules.join(', ')}`);
  }
  parts.push('');
  
  // Hard constraints (use pillar-specific)
  parts.push('HARD CONSTRAINTS (ALL FRAMES):');
  brandConstraints.forEach((constraint: string) => parts.push(`- ${constraint}`));
  
  const allBrandConstraints = brandConstraints.map((c: string) => c.toLowerCase());
  pillar.hard_constraints_locked?.slice(0, 3).forEach((constraint: string) => {
    if (!allBrandConstraints.some((bc: string) => bc.includes(constraint.toLowerCase().split(' ')[0]))) {
      parts.push(`- ${constraint}`);
    }
  });
  parts.push('');
  
  // Negative constraints (use pillar-specific)
  parts.push('NEGATIVE CONSTRAINTS (AVOID):');
  negativeConstraints.forEach((constraint: string) => parts.push(`- ${constraint}`));
  if (step0.peopleMode === 'hands' || step0.peopleMode !== 'none') {
    parts.push('- CRITICAL: No extra fingers, no warped hands - exactly 5 fingers per hand');
  }
  parts.push('');
  
  // Output spec
  parts.push(`OUTPUT: ${resolution} video, Frame 1 must be social-ready still quality, motion-ready for continuation`);
  
  return parts.join('\n');
}

export async function buildPromptForBlueprint(config: PromptBuildConfig): Promise<string> {
  if (config.blueprint.step0.outputType === 'video') {
    return await buildVideoPrompt(config);
  }
  return await buildStillPrompt(config);
}

// Generate variants (Safe, Risky, Minimal) from a base blueprint
export async function generateVariants(
  baseConfig: PromptBuildConfig
): Promise<PromptVariant[]> {
  const variants: PromptVariant[] = [];
  const pillarId = baseConfig.blueprint.step0.pillarId;
  
  // Load pillar-specific variant configs
  const safeConfig = await getVariantConfig(pillarId, 'safe_commercial');
  const riskyConfig = await getVariantConfig(pillarId, 'risky_chaotic');
  const minimalConfig = await getVariantConfig(pillarId, 'ultra_minimal_hero');
  
  // Primary (unchanged)
  variants.push({
    name: 'Primary',
    type: 'primary',
    prompt: await buildPromptForBlueprint(baseConfig),
    description: 'Your selected configuration as-is',
  });
  
  // Safe variant (use pillar-specific config if available)
  const safeBlueprint = JSON.parse(JSON.stringify(baseConfig.blueprint)) as SceneBlueprint;
  if (safeConfig) {
    safeBlueprint.step0.intensity = Math.max(0, safeBlueprint.step0.intensity + safeConfig.intensity_delta);
    const [minProps, maxProps] = safeConfig.prop_count_range;
    if (safeBlueprint.round2.props.length > maxProps) {
      safeBlueprint.round2.props = safeBlueprint.round2.props.slice(0, maxProps);
    }
  } else {
    safeBlueprint.step0.intensity = getIntensityForVariant(safeBlueprint.step0.intensity, 'safe');
    if (safeBlueprint.round2.props.length > 2) {
      safeBlueprint.round2.props = safeBlueprint.round2.props.slice(0, 2);
    }
  }
  variants.push({
    name: 'Safe',
    type: 'safe',
    prompt: await buildPromptForBlueprint({ ...baseConfig, blueprint: safeBlueprint }),
    description: safeConfig?.notes || 'Lower intensity, fewer props, highest hit-rate',
  });
  
  // Risky variant (use pillar-specific config if available)
  const riskyBlueprint = JSON.parse(JSON.stringify(baseConfig.blueprint)) as SceneBlueprint;
  if (riskyConfig) {
    riskyBlueprint.step0.intensity = Math.min(100, riskyBlueprint.step0.intensity + riskyConfig.intensity_delta);
    const [minProps, maxProps] = riskyConfig.prop_count_range;
    // Ensure props are within range
    while (riskyBlueprint.round2.props.length < minProps) {
      riskyBlueprint.round2.props.push('additional contextual prop');
    }
  } else {
    riskyBlueprint.step0.intensity = getIntensityForVariant(riskyBlueprint.step0.intensity, 'risky');
  }
  if (riskyBlueprint.step0.pillarId === 'play') {
    riskyBlueprint.round2.props.push('controlled chaos element');
  }
  variants.push({
    name: 'Risky',
    type: 'risky',
    prompt: await buildPromptForBlueprint({ ...baseConfig, blueprint: riskyBlueprint }),
    description: riskyConfig?.notes || 'Higher intensity, more dynamic, bold camera moves',
  });
  
  // Minimal variant (use pillar-specific config if available)
  const minimalBlueprint = JSON.parse(JSON.stringify(baseConfig.blueprint)) as SceneBlueprint;
  if (minimalConfig) {
    minimalBlueprint.step0.intensity = minimalConfig.intensity_forced;
    const [minProps, maxProps] = minimalConfig.prop_count_range;
    minimalBlueprint.round2.props = minimalBlueprint.round2.props.slice(0, maxProps);
  } else {
    minimalBlueprint.step0.intensity = getIntensityForVariant(minimalBlueprint.step0.intensity, 'minimal');
    minimalBlueprint.round2.props = minimalBlueprint.round2.props.slice(0, 1);
  }
  variants.push({
    name: 'Minimal',
    type: 'minimal',
    prompt: await buildPromptForBlueprint({ ...baseConfig, blueprint: minimalBlueprint }),
    description: minimalConfig?.notes || 'Museum-grade minimal, extreme restraint, single hero focus',
  });
  
  return variants;
}
