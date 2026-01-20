export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateImageFiles(files: File[]): ValidationResult {
  const errors: string[] = [];
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  if (files.length === 0) {
    return { valid: false, errors: ['No files selected'] };
  }

  if (files.length > 2) {
    errors.push('Maximum 2 images allowed');
  }

  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1} (${file.name}): Invalid file type. Allowed types: PNG, JPEG, WEBP`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateUploadType(
  files: File[],
  uploadType: 'single' | 'double'
): ValidationResult {
  const errors: string[] = [];

  if (uploadType === 'double') {
    if (files.length !== 2) {
      errors.push('Double upload requires exactly 2 images (card back + 1 face card)');
    }
  } else if (uploadType === 'single') {
    if (files.length !== 1) {
      errors.push('Single upload requires exactly 1 image (face card OR pack shot OR card back)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}