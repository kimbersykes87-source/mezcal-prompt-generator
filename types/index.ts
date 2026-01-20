export interface PillarCameraLightingPref {
  id: string;
  label: string;
  weight: number;
  notes: string;
}

export interface PillarRandomGenerators {
  scene_moment_templates: string[];
  location_vibes: string[];
  props_sets: string[][];
  hook_details: string[];
}

export interface Pillar {
  id: string;
  name: string;
  version: string;
  purpose: string;
  primary_emotion: string;
  secondary_emotions: string[];
  what_this_pillar_is: string[];
  what_this_pillar_is_not: string[];
  content_goals: Record<string, string>;
  visual_story_rules: {
    core_rule?: string;
    hook_types_ranked?: string[];
    composition_bias?: string[];
    tempo?: {
      pace?: string;
      energy?: string;
      motion_allowed?: string[];
      motion_required?: boolean;
      motion_types?: string[];
    };
  };
  // New fields from updated JSON
  step0_required?: {
    requires_principle: boolean;
    requires_pillar: boolean;
    requires_sub_mode: boolean;
    allowed_platform_formats: string[];
    allowed_output_types: string[];
  };
  intensity_bands?: Array<{
    range: number[];
    label: string;
    discover_behaviour?: string;
    levelup_behaviour?: string;
    play_behaviour?: string;
    allowed_motion?: string[];
    prop_density?: string;
  }>;
  sub_modes?: Array<{
    id: string;
    name: string;
    intent?: string;
    best_for_formats?: string[];
    hook_patterns_still?: string[];
    hook_patterns_video?: string[];
    moment_templates_still?: string[];
    moment_templates_video?: string[];
    moment_templates?: string[];
    prop_logic?: string[];
  }>;
  video_first_frame_rules?: {
    first_frame_must_read_like_still: boolean;
    no_motion_blur_in_frame_1: boolean;
    motion_after_frame_1_bias?: string[];
    continuity_locks?: string[];
  };
  prompt_fragments?: {
    realness_micro_specs?: string[];
    brand_hard_constraints?: string[];
    negatives?: string[];
  };
  variants?: {
    safe_commercial?: {
      intensity_delta: number;
      prop_count_range: number[];
      camera_bias?: string[];
      motion_bias_video?: string;
      notes?: string;
    };
    risky_chaotic?: {
      intensity_delta: number;
      prop_count_range: number[];
      camera_bias?: string[];
      motion_bias_video?: string;
      notes?: string;
    };
    ultra_minimal_hero?: {
      intensity_forced: number;
      prop_count_range: number[];
      camera_bias?: string[];
      motion_bias_video?: string;
      notes?: string;
    };
  };
  reference_rules?: {
    reference_source: string;
    still_max_refs: number;
    video_first_frame_max_refs: number;
    preferred_ref_sets?: Array<{label: string; face_cards: number; back_cards: number}>;
    do_not_allow?: string[];
  };
  product_focus_rules: {
    allowed_primary_subjects: string[];
    best_fit_for_discover?: string[];
    best_fit_for_level_up?: string[];
    best_fit_for_play?: string[];
    avoid_in_discover?: string[];
    avoid_in_level_up?: string[];
    avoid_in_play?: string[];
    scale_locks: string[];
  };
  people_and_framing?: {
    primary_rule?: string;
    allowed_people_modes?: string[];
    allowed_people_modes_ranked?: Array<{id: string; label: string; weight: number; notes: string;}>;
    face_rule?: { strict: boolean; rule: string };
    face_policy?: { strict: boolean; rule: string };
    wardrobe_textures_if_hands_present?: string[];
    wardrobe_texture_keywords?: string[];
    casting_notes?: string[];
    hand_requirements_if_present?: string[];
  };
  locations?: {
    preferred?: Array<{id: string; label: string; notes: string;}>;
    avoid?: string[];
    surface_textures?: string[];
    materials?: string[];
    colour_bias?: string[];
    avoid_colours?: string[];
  };
  props?: {
    allowed: string[];
    rules: string[];
    mezcal_specific_constraints?: string[];
  };
  camera_and_lighting_preferences?: {
    camera_angles_ranked: PillarCameraLightingPref[];
    lighting_ranked: PillarCameraLightingPref[];
    clarity_rule?: string;
    depth_of_field_rule?: string;
  };
  random_generators: PillarRandomGenerators;
  story_intent_rules?: {
    allowed: boolean;
    max_sentences?: number;
    guidance?: string[];
  };
  caption_support_notes?: { caption_does_the_teaching?: boolean; caption_guidance?: string[] };
  hard_constraints_locked: string[];
  anti_patterns: { avoid_phrases: string[]; avoid_visuals: string[]; };
  scoring_heuristics: { good_output_signals: string[]; bad_output_signals: string[]; };
}

export interface LocationOption {
  id: string;
  label: string;
  notes: string;
}

export interface CameraOption {
  id: string;
  label: string;
  weight: number;
  notes: string;
}

export interface LightingOption {
  id: string;
  label: string;
  weight: number;
  notes: string;
}

export interface Principle {
  id: string;
  name: string;
  version: string;
  purpose: string;
  priority: number;
  mood_keywords: string[];
  // New fields from updated JSONs
  step0_required?: {
    requires_principle: boolean;
    allowed_platform_formats: string[];
    allowed_output_types: string[];
  };
  platform_behavior?: {
    '9x16'?: {
      framing_bias: string;
      safe_zone_notes: string;
      subject_scale: string;
    };
    '4x5'?: {
      framing_bias: string;
      safe_zone_notes: string;
      subject_scale: string;
    };
  };
  intensity_bands?: Array<{
    range: number[];
    label: string;
    action_behaviour?: string;
    agaveculture_behaviour?: string;
    atmosphere_behaviour?: string;
    allowed_motion?: string[];
    motion_blur_amount?: string;
    prop_density?: string;
  }>;
  video_first_frame_rules?: {
    first_frame_must_read_like_still: boolean;
    no_motion_blur_in_frame_1: boolean;
    first_frame_clarity_rules?: string[];
    motion_after_frame_1_plan?: {
      allowed_motion: string[];
      avoid_motion: string[];
    };
    continuity_locks?: string[];
  };
  reference_rules?: {
    reference_source: string;
    still_max_refs: number;
    video_first_frame_max_refs: number;
    preferred_ref_sets?: Array<{label: string; face_cards: number; back_cards: number}>;
    do_not_allow?: string[];
  };
  variants?: {
    safe_commercial?: {
      intensity_delta: number;
      motion_blur_bias?: string;
      motion_bias_video?: string;
      prop_count_range: number[];
      camera_bias?: string[];
      notes?: string;
    };
    risky_chaotic?: {
      intensity_delta: number;
      motion_blur_bias?: string;
      motion_bias_video?: string;
      prop_count_range: number[];
      camera_bias?: string[];
      notes?: string;
    };
    ultra_minimal_hero?: {
      intensity_forced: number;
      motion_blur_bias?: string;
      motion_bias_video?: string;
      prop_count_range: number[];
      camera_bias?: string[];
      notes?: string;
    };
  };
  core_rules: {
    hero_focus: string[];
    composition: {
      framing_style: string[];
      center_of_gravity: string[];
      background_behavior: string[];
      plant_ratio_rule?: {
        plant_only_target_percent: number;
        context_percent: number;
        rule: string;
      };
    };
    texture_language?: {
      must_show: string[];
      avoid: string[];
    };
    social_language?: {
      allowed_moments: string[];
      avoid_moments: string[];
    };
    motion_language?: {
      allowed_motion: string[];
      motion_camera_effects?: string[];
      avoid_motion: string[];
    };
  };
  locations: {
    preferred: LocationOption[];
    avoid: string[];
    ground_textures?: string[];
    surfaces?: string[];
  };
  camera: {
    preferred_angles: CameraOption[];
    lens_language: string[];
    focus_targets_ranked: string[];
    framing_rules: string[];
  };
  lighting: {
    preferred: LightingOption[];
    avoid: string[];
    shadow_notes?: string[];
    palette_notes?: string[];
  };
  casting: {
    human_elements_ratio?: {
      strict: boolean;
      rule: string;
    };
    age_range?: string;
    vibe?: string[];
    diversity?: string[];
    allowed_humans?: Array<{id: string; label: string; notes: string}>;
    framing_preferences?: string[];
    wardrobe_textures?: string[];
    face_visibility_rule?: {
      strict: boolean;
      rule: string;
      allowed_face_treatments?: string[];
    };
    avoid?: string[];
    skin_texture_notes?: string[];
  };
  product_handling: {
    integration_rule?: {
      strict: boolean;
      rule: string;
    };
    scale_locks: string[];
    positioning: string[];
    avoid: string[];
  };
  prompt_fragments: {
    style_line: string;
    action_line?: string;
    agave_line?: string;
    atmosphere_line?: string;
    ratio_line?: string;
    environment_line?: string;
    wardrobe_line?: string;
    face_rule_line?: string;
    realness_micro_specs?: string[];
    negatives?: string[];
    [key: string]: string | string[] | undefined;
  };
  round2_generators: {
    scene_moment_templates: string[];
    props_sets: string[][];
    props_notes: string[];
  };
  pillar_compatibility_hints: {
    [pillarId: string]: {
      nudge: string;
      safe_props_additions: string[];
    };
  };
  hard_constraints_locked: string[];
  anti_patterns: {
    avoid_phrases: string[];
    avoid_visuals: string[];
  };
  scoring_heuristics: {
    good_output_signals: string[];
    bad_output_signals: string[];
  };
}

export interface Round1Selection {
  principleId: string;
  pillarId: string;
  locationId: string;
  peopleId: string;
  cameraId: string;
  lightingId: string;
  productId: string;
}

export interface Round2Selection {
  sceneMoment: string;
  props: string[];
}

// ===== NEW TYPES FOR UPGRADE =====

export type OutputType = 'still' | 'video';
export type PlatformFormat = '9x16' | '4x5';
export type PeopleMode = 'none' | 'hands' | 'partialNoFace' | 'fullBody';
export type PillarId = 'discover' | 'levelup' | 'play';
export type PillarSubModeId = string;

export interface Step0Selection {
  outputType: OutputType;
  platformFormat: PlatformFormat;
  intensity: number; // 0-100
  peopleMode: PeopleMode;
  facesAllowed: boolean;
  principleId: string;
  pillarId: PillarId;
  subModeId: PillarSubModeId;
}

export interface SelectedReferences {
  faceCardIds: string[]; // max 3
  backCardId?: string;
}

export interface AnalysisTags {
  refSetId: string; // hash of selected reference IDs
  dominantPalette: string[];
  lightingSummary: string;
  borderRules: string[];
  textureCues: string[];
}

export interface SceneBlueprint {
  step0: Step0Selection;
  round1: {
    locationId: string;
    cameraId: string;
    lightingId: string;
    productFocus: string;
  };
  round2: Round2Selection;
  selectedReferences: SelectedReferences;
  analysisTags?: AnalysisTags;
}

export interface CardReference {
  id: string;
  originalFilename: string;
  newFilename: string;
  type: string;
  suit?: string;
  rank?: string;
  text: {
    speciesName?: string;
    tagline?: string;
    tastingNotes?: string[];
    latinName?: string;
    habitat?: string;
    size?: string;
    jobTitle?: string;
    actionLine?: string;
  };
  artworkPath: string;
  fullCardPath: string;
  jsonPath: string;
  // Optional alt paths used by the reference library helper (public assets)
  artworkPng?: string;
  fullCardJpg?: string;
}

export interface PillarSubMode {
  id: string;
  name: string;
  momentTemplates: string[];
  propLogic: string[];
  hookPatternsStill: string[];
  hookPatternsVideo: string[];
}

export interface PlatformCompositionPack {
  format: PlatformFormat;
  resolution: { width: number; height: number };
  safeZones: {
    top: number; // percentage
    bottom: number;
    left?: number;
    right?: number;
  };
  subjectScale: {
    min: number; // percentage
    max: number;
  };
  croppingRules: string[];
}

export interface PromptVariant {
  name: string;
  type: 'primary' | 'safe' | 'risky' | 'minimal';
  prompt: string;
  description: string;
}