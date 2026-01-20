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
    [key: string]: string;
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