'use client';

import { useState } from 'react';

interface PromptOutputProps {
  prompt: string;
}

export default function PromptOutput({ prompt }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white">FINAL PROMPT</h2>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!prompt}
          className="cta px-4 py-2 bg-muted-olive text-white rounded hover:bg-yellow-agave disabled:bg-dark-grey disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {copied ? 'copied!' : 'copy to clipboard'}
        </button>
      </div>
      
      <div className="relative">
        <textarea
          readOnly
          value={prompt}
          className="w-full h-96 p-4 border border-muted-olive rounded font-mono text-sm resize-none bg-dark-grey text-white placeholder:text-white placeholder:opacity-50"
          placeholder="select options in round 1 and round 2 to generate your prompt..."
        />
      </div>
      
      {prompt && (
        <div className="text-sm text-white">
          <p>prompt ready! copy and paste this into gemini to generate your image.</p>
          {copied && (
            <p className="text-yellow-agave mt-2">✓ copied to clipboard!</p>
          )}
        </div>
      )}
    </div>
  );
}