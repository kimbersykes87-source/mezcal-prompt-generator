import type { Principle, Pillar, Round1Selection, Round2Selection } from '@/types';

export interface PromptConfig {
  principle: Principle;
  pillar: Pillar;
  round1: Round1Selection;
  round2: Round2Selection;
  referenceImages?: File[];
}

export function buildPrompt(config: PromptConfig): string {
  const { principle, pillar, round1, round2, referenceImages } = config;
  
  const parts: string[] = [];

  // 1. Reference Images
  if (referenceImages && referenceImages.length > 0) {
    const imageTypes = referenceImages.length === 2 
      ? 'card back + 1 face card' 
      : 'face card, pack shot, or card back';
    parts.push(`Reference Images: Use the uploaded ${imageTypes} as the primary visual reference for the playing card artwork and design elements.`);
    parts.push('');
  }

  // 2. Scene Section
  const location = principle.locations.preferred.find(l => l.id === round1.locationId);
  if (location) {
    let sceneDesc = `Scene: ${location.label}. `;
    
    // Add pillar visual story rules
    if (pillar.visual_story_rules?.composition_bias) {
      sceneDesc += `${pillar.visual_story_rules.composition_bias.join(', ')}. `;
    }
    
    // Add principle prompt fragments
    const principleLine = principle.prompt_fragments[`${principle.id}_line`] || 
                         principle.prompt_fragments.atmosphere_line || 
                         principle.prompt_fragments.action_line || 
                         principle.prompt_fragments.agave_line || '';
    if (principleLine) {
      sceneDesc += principleLine;
    }
    
    // Add product positioning
    if (principle.product_handling.positioning.length > 0) {
      sceneDesc += ` ${principle.product_handling.positioning[0]}.`;
    }
    
    parts.push(sceneDesc);
    parts.push('');
  }

  // 3. Camera Section
  const cameraOption = principle.camera.preferred_angles.find(c => c.id === round1.cameraId) ||
                       pillar.camera_and_lighting_preferences?.camera_angles_ranked.find(c => c.id === round1.cameraId);
  if (cameraOption) {
    let cameraDesc = `Camera: ${cameraOption.label}`;
    if (cameraOption.notes) {
      cameraDesc += `, ${cameraOption.notes}`;
    }
    
    // Add lens language
    if (principle.camera.lens_language.length > 0) {
      cameraDesc += `. ${principle.camera.lens_language.join(', ')}.`;
    }
    
    // Add focus targets
    if (principle.camera.focus_targets_ranked.length > 0) {
      const topTargets = principle.camera.focus_targets_ranked.slice(0, 3);
      cameraDesc += ` Focus on ${topTargets.join(', ')}.`;
    }
    
    // Add pillar clarity/depth rules
    if (pillar.camera_and_lighting_preferences?.clarity_rule) {
      cameraDesc += ` ${pillar.camera_and_lighting_preferences.clarity_rule}.`;
    }
    if (pillar.camera_and_lighting_preferences?.depth_of_field_rule) {
      cameraDesc += ` ${pillar.camera_and_lighting_preferences.depth_of_field_rule}.`;
    }
    
    parts.push(cameraDesc);
    parts.push('');
  }

  // 4. Lighting Section
  const lightingOption = principle.lighting.preferred.find(l => l.id === round1.lightingId) ||
                         pillar.camera_and_lighting_preferences?.lighting_ranked.find(l => l.id === round1.lightingId);
  if (lightingOption) {
    let lightingDesc = `Lighting: ${lightingOption.label}`;
    if (lightingOption.notes) {
      lightingDesc += `, ${lightingOption.notes}`;
    }
    
    // Add shadow notes
    if (principle.lighting.shadow_notes && principle.lighting.shadow_notes.length > 0) {
      lightingDesc += `. ${principle.lighting.shadow_notes.join(', ')}.`;
    }
    
    // Add palette notes
    if (principle.lighting.palette_notes && principle.lighting.palette_notes.length > 0) {
      lightingDesc += `. ${principle.lighting.palette_notes.join(', ')}.`;
    }
    
    parts.push(lightingDesc);
    parts.push('');
  }

  // 5. Scene Moment
  if (round2.sceneMoment) {
    parts.push(`Scene Moment: ${round2.sceneMoment}`);
    parts.push('');
  }

  // 6. Props
  if (round2.props && round2.props.length > 0) {
    let propsDesc = `Props: ${round2.props.join(', ')}`;
    
    // Add pillar hook details if relevant
    if (pillar.random_generators.hook_details.length > 0) {
      const relevantHook = pillar.random_generators.hook_details[0];
      if (relevantHook) {
        propsDesc += `, ${relevantHook}`;
      }
    }
    
    // Add compatibility hint props
    const compatibilityHint = principle.pillar_compatibility_hints[pillar.id];
    if (compatibilityHint?.safe_props_additions.length > 0) {
      propsDesc += `, ${compatibilityHint.safe_props_additions.join(', ')}`;
    }
    
    parts.push(propsDesc);
    parts.push('');
  }

  // 7. Style Line
  let styleLine = principle.prompt_fragments.style_line || '';
  
  // Add principle-specific fragments
  const principleSpecific = principle.prompt_fragments[`${principle.id}_line`] || 
                           principle.prompt_fragments.atmosphere_line || 
                           principle.prompt_fragments.action_line || 
                           principle.prompt_fragments.agave_line || '';
  if (principleSpecific) {
    styleLine += `. ${principleSpecific}`;
  }
  
  // Add pillar vibe
  if (pillar.visual_story_rules?.hook_types_ranked && pillar.visual_story_rules.hook_types_ranked.length > 0) {
    styleLine += `. ${pillar.primary_emotion} mood with ${pillar.visual_story_rules.hook_types_ranked[0]}.`;
  }
  
  if (styleLine) {
    parts.push(styleLine);
    parts.push('');
  }

  // 8. Story Intent
  if (pillar.story_intent_rules?.allowed) {
    let storyIntent = '';
    
    const compatibilityHint = principle.pillar_compatibility_hints[pillar.id];
    if (compatibilityHint?.nudge) {
      storyIntent = compatibilityHint.nudge;
    } else {
      storyIntent = pillar.purpose;
    }
    
    // Limit to max sentences if specified
    if (pillar.story_intent_rules.max_sentences) {
      const sentences = storyIntent.split(/[.!?]+/).filter(s => s.trim());
      storyIntent = sentences.slice(0, pillar.story_intent_rules.max_sentences).join('. ').trim();
      if (!storyIntent.endsWith('.')) storyIntent += '.';
    }
    
    parts.push(`Story Intent: ${storyIntent}`);
    parts.push('');
  }

  // 9. Hard Constraints
  parts.push('Hard Constraints:');
  
  // Add all principle constraints
  principle.hard_constraints_locked.forEach(constraint => {
    parts.push(`- ${constraint}`);
  });
  
  // Add all pillar constraints
  pillar.hard_constraints_locked.forEach(constraint => {
    if (!principle.hard_constraints_locked.includes(constraint)) {
      parts.push(`- ${constraint}`);
    }
  });
  
  // Add global mezcal constraints (if not already present)
  const globalConstraints = [
    'mezcal bottles must have blank or unbranded labels only',
    'poured mezcal must be still liquid, never bubbly or fizzy',
    'playing cards must be true-to-size 2.5 inches by 3.5 inches',
    'no readable text anywhere in the scene except on the reference card itself; all other writing must be blurred or illegible',
    'no UI icons, no corner marks, no sparkles, no watermarks, no logos',
    'no warped hands, no extra fingers',
    'mezcal glass must be a small clay copita or small tulip copita, not a tumbler or rocks glass',
  ];
  
  const allConstraints = [...principle.hard_constraints_locked, ...pillar.hard_constraints_locked];
  globalConstraints.forEach(constraint => {
    if (!allConstraints.some(c => c.toLowerCase().includes(constraint.toLowerCase().split(' ')[0]))) {
      parts.push(`- ${constraint}`);
    }
  });
  
  parts.push('');

  // 10. Output Size
  parts.push('Output Size: 1024x1024');

  return parts.join('\n');
}