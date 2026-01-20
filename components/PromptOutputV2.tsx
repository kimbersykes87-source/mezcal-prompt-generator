'use client';

import { useState } from 'react';
import type { PromptVariant } from '@/types';

interface PromptOutputV2Props {
  variants: PromptVariant[];
}

export default function PromptOutputV2({ variants }: PromptOutputV2Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const resourceLinks = [
    {
      label: 'Card Artwork',
      href: 'https://drive.google.com/drive/folders/1q2a1s08cmnNVicgk0eQcAMXfjLnKoscI?usp=sharing',
    },
    {
      label: 'Shadows',
      href: 'https://drive.google.com/drive/folders/1FctesmOLENkQcQoTdjpDtEZToqt29D5Q?usp=drive_link',
    },
    {
      label: 'Agave',
      href: 'https://drive.google.com/drive/folders/1HgHvBWj1eFnb_leNDIpClQgTRclzZR1k?usp=drive_link',
    },
    {
      label: 'Pack Shots',
      href: 'https://drive.google.com/drive/folders/1rMihS9Wyc7NgbXFLEim3_Hp_uvLijT4E?usp=drive_link',
    },
  ];

  const handleCopy = async (prompt: string, index: number) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  if (variants.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl text-white">FINAL PROMPT</h2>
        <div className="p-4 border border-muted-olive rounded text-white opacity-70">
          Complete all selections to generate prompts
        </div>
      </div>
    );
  }

  const activeVariant = variants[activeTab];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white">FINAL PROMPT VARIANTS</h2>
      </div>

      {/* Variant Tabs */}
      <div className="flex gap-2 border-b border-muted-olive">
        {variants.map((variant, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === index
                ? 'text-white border-b-2 border-yellow-agave'
                : 'text-white opacity-60 hover:opacity-100'
            }`}
          >
            {variant.name}
          </button>
        ))}
      </div>

      {/* Active Variant Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white opacity-80">
            {activeVariant.description}
          </div>
          <button
            type="button"
            onClick={() => handleCopy(activeVariant.prompt, activeTab)}
            className="px-4 py-2 bg-muted-olive text-white rounded hover:bg-yellow-agave transition-colors"
          >
            {copiedIndex === activeTab ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>

        <div className="relative">
          <textarea
            readOnly
            value={activeVariant.prompt}
            className="w-full h-96 p-4 border border-muted-olive rounded font-mono text-sm resize-none bg-dark-grey text-white"
          />
        </div>

        {copiedIndex === activeTab && (
          <div className="text-sm text-yellow-agave">
            ✓ Copied {activeVariant.name} variant to clipboard!
          </div>
        )}
      </div>

      {/* Hands Warning */}
      {activeVariant.prompt.toLowerCase().includes('hands') && (
        <div className="p-3 bg-terracotta border border-yellow-agave text-white rounded text-sm">
          ⚠️ <strong>Hands detected:</strong> Hands are challenging for AI. Consider using the Safe variant first for highest hit-rate.
        </div>
      )}

      {/* Video Mode Info */}
      {activeVariant.prompt.includes('VIDEO') && (
        <div className="p-3 bg-dark-grey border border-muted-olive text-white rounded text-sm">
          📹 <strong>Video Mode:</strong> Frame 1 will be crisp and social-ready. Motion plan follows after.
        </div>
      )}

      {/* Usage Instructions */}
      <div className="text-sm text-white opacity-80">
        <p>
          <strong>Next steps:</strong> Copy your chosen variant and paste into Gemini to generate your image/video.
          Try the Primary variant first, or use Safe for highest reliability.
        </p>
      </div>

      {/* Reference asset quick-links */}
      <div className="space-y-3">
        <div className="text-sm text-white opacity-80">Open reference folders (new tab):</div>
        <div className="flex flex-wrap gap-3">
          {resourceLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-muted-olive text-white rounded-lg hover:bg-yellow-agave transition-colors text-lg font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
