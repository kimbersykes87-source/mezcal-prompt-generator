import type { Principle, Pillar } from '@/types';

export function generateSceneMoments(
  principle: Principle,
  pillar: Pillar
): string[] {
  const principleTemplates = principle.round2_generators.scene_moment_templates || [];
  const pillarTemplates = pillar.random_generators.scene_moment_templates || [];
  
  // Combine templates from both principle and pillar
  const allTemplates = [...principleTemplates, ...pillarTemplates];
  
  // If we have compatibility hints, prefer templates that align with the nudge
  const compatibilityHint = principle.pillar_compatibility_hints[pillar.id];
  const hookDetails = pillar.random_generators.hook_details || [];
  
  // Weight templates: those matching hook details or mentioned in hints get higher weight
  const weightedTemplates = allTemplates.map(template => ({
    template,
    weight: 1 + 
      (hookDetails.some(hook => template.toLowerCase().includes(hook.toLowerCase())) ? 2 : 0) +
      (compatibilityHint?.nudge && template.toLowerCase().includes(compatibilityHint.nudge.toLowerCase().split(' ')[0]) ? 2 : 0)
  }));

  // Select 3 unique templates using weighted random
  const selected: string[] = [];
  const available = [...weightedTemplates];
  
  while (selected.length < 3 && available.length > 0) {
    const totalWeight = available.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    let chosenIndex = -1;
    for (let i = 0; i < available.length; i++) {
      if (random < available[i].weight) {
        chosenIndex = i;
        break;
      }
      random -= available[i].weight;
    }
    
    if (chosenIndex === -1) {
      chosenIndex = available.length - 1;
    }
    
    const chosen = available.splice(chosenIndex, 1)[0];
    selected.push(chosen.template);
  }
  
  // If we don't have 3, fill with any remaining
  while (selected.length < 3 && allTemplates.length > selected.length) {
    const remaining = allTemplates.filter(t => !selected.includes(t));
    if (remaining.length > 0) {
      selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
    } else {
      break;
    }
  }
  
  return selected.slice(0, 3);
}

export function generateProps(
  principle: Principle,
  pillar: Pillar
): string[][] {
  const principleProps = principle.round2_generators.props_sets || [];
  const pillarProps = pillar.random_generators.props_sets || [];
  
  // Combine props from both principle and pillar
  const allProps = [...principleProps, ...pillarProps];
  
  // Get compatibility hint for safe props additions
  const compatibilityHint = principle.pillar_compatibility_hints[pillar.id];
  
  // Select 3 unique prop sets
  const selected: string[][] = [];
  const available = [...allProps];
  
  while (selected.length < 3 && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const chosen = available.splice(randomIndex, 1)[0];
    
    // Merge safe props additions if available
    let finalProps = [...chosen];
    if (compatibilityHint?.safe_props_additions) {
      finalProps = [...finalProps, ...compatibilityHint.safe_props_additions];
    }
    
    // Add hook details if relevant
    const hookDetails = pillar.random_generators.hook_details || [];
    if (hookDetails.length > 0 && Math.random() > 0.5) {
      finalProps.push(hookDetails[Math.floor(Math.random() * hookDetails.length)]);
    }
    
    selected.push(finalProps);
  }
  
  // If we don't have 3, fill with any remaining
  while (selected.length < 3 && allProps.length > selected.length) {
    const remaining = allProps.filter((props, index) => {
      const propsStr = JSON.stringify(props);
      return !selected.some(s => JSON.stringify(s) === propsStr);
    });
    
    if (remaining.length > 0) {
      const chosen = remaining[Math.floor(Math.random() * remaining.length)];
      let finalProps = [...chosen];
      if (compatibilityHint?.safe_props_additions) {
        finalProps = [...finalProps, ...compatibilityHint.safe_props_additions];
      }
      selected.push(finalProps);
    } else {
      break;
    }
  }
  
  return selected.slice(0, 3);
}