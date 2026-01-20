'use client';

import { useState, useRef } from 'react';
import { validateImageFiles, validateUploadType } from '@/lib/validation';

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  onError: (errors: string[]) => void;
}

export default function ImageUpload({ onImagesChange, onError }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadType, setUploadType] = useState<'single' | 'double'>('single');
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file types and count
    const typeValidation = validateImageFiles(selectedFiles);
    if (!typeValidation.valid) {
      onError(typeValidation.errors);
      return;
    }

    // Limit to 2 files
    const limitedFiles = selectedFiles.slice(0, 2);
    
    // Validate upload type
    const uploadValidation = validateUploadType(limitedFiles, uploadType);
    if (!uploadValidation.valid) {
      onError(uploadValidation.errors);
      return;
    }

    setFiles(limitedFiles);
    onImagesChange(limitedFiles);
    onError([]);

    // Create previews
    const newPreviews: string[] = [];
    limitedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === limitedFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onImagesChange(newFiles);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-2 text-white">upload type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="uploadType"
              value="single"
              checked={uploadType === 'single'}
              onChange={(e) => {
                const newType = e.target.value as 'single' | 'double';
                setUploadType(newType);
                // Clear files if switching type
                if ((newType === 'single' && files.length > 1) || 
                    (newType === 'double' && files.length === 1)) {
                  setFiles([]);
                  setPreviews([]);
                  onImagesChange([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }
              }}
              className="accent-muted-olive"
            />
            <span>1 image (face card or pack shot or card back)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="radio"
              name="uploadType"
              value="double"
              checked={uploadType === 'double'}
              onChange={(e) => {
                const newType = e.target.value as 'single' | 'double';
                setUploadType(newType);
                // Clear files if switching type
                if ((newType === 'single' && files.length > 1) || 
                    (newType === 'double' && files.length === 1)) {
                  setFiles([]);
                  setPreviews([]);
                  onImagesChange([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }
              }}
              className="accent-muted-olive"
            />
            <span>2 images (card back + 1 face card)</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2 text-white">
          upload images ({uploadType === 'single' ? '1' : '2'} max)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple={uploadType === 'double'}
          onChange={handleFileChange}
          className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-muted-olive file:text-white hover:file:bg-yellow-agave file:cursor-pointer"
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded border border-muted-olive"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-yellow-agave transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}