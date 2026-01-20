# Mezcal Prompt Generator

A web application for generating Gemini-ready image prompts for mezcal photography. This tool guides you through a 2-round selection process to create detailed, creative prompts that combine Photography Principles (Agaveculture, Atmosphere, Action) with Content Pillars (Discover, Level Up, Play).

## Features

- **2-Round Prompt Generation**: 
  - Round 1: Select Photography Principle, Content Pillar, Location, People, Camera, Lighting, and Product
  - Round 2: Auto-generate and customize Scene Moments and Props (3 options each)
  
- **Image Upload Validation**: 
  - Upload 1 image (face card, pack shot, or card back)
  - Upload 2 images (card back + 1 face card)
  - Validates file types (PNG, JPEG, WEBP) and enforces upload rules

- **Surprise Me Mode**: 
  - Randomly selects Principle, Pillar, and all Round 1 options using weighted probabilities
  - Respects principle/pillar compatibility rules

- **Copy-to-Clipboard Output**: 
  - Generates clean, Gemini-ready prompt text
  - One-click copy functionality
  - No image generation - copy and paste prompts directly into Gemini

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

The static export will be generated in the `out/` directory.

## Deployment to Cloudflare Pages

### Via Git Integration (Recommended)

1. **Connect Repository**:
   - Go to Cloudflare Pages dashboard
   - Click "Create a project"
   - Connect your GitHub/GitLab repository

2. **Build Configuration**:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/` (project root)

3. **Deploy**:
   - Cloudflare Pages will automatically deploy on every push to the main branch
   - Preview deploys are created for pull requests

4. **Custom Domain**:
   - The site will be available at `prompt-mezcalomano.pages.dev` (auto-created)
   - You can add a custom domain in the Pages dashboard

### Manual Deployment

```bash
npm run build
# Upload the contents of the 'out' directory to Cloudflare Pages
```

## Configuration Files

The app uses JSON configuration files for Photography Principles and Content Pillars:

- **Photography Principles**: `/config/principles/`
  - `Agaveculture.json` - Earthy, intimate agave-first photography
  - `Atmosphere.json` - Warm, intimate, lived-in documentary scenes
  - `Action.json` - Fast, kinetic, documentary-style scenes

- **Content Pillars**: `/config/pillars/`
  - `Discover.json` - Spark curiosity and teach mezcal diversity
  - `LevelUp.json` - Turn curiosity into confidence
  - `Play.json` - Make mezcal learning feel like a game

These JSON files are copied to `/public/config/` during build for runtime access.

## Architecture

- **Static Export**: Next.js configured for static export (`output: 'export'`)
- **Client-Side Only**: All logic runs in the browser, no server/API required
- **Config Loading**: Principles and Pillars loaded from `/public/config/` at runtime
- **State Management**: React hooks (useState, useEffect) for component state
- **Styling**: Tailwind CSS for responsive, clean UI

## Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main generator page
│   └── globals.css         # Global styles
├── components/
│   ├── ImageUpload.tsx     # Image upload with validation
│   ├── Round1Selector.tsx  # Round 1 option selectors
│   ├── Round2Generator.tsx # Round 2 scene/props generator
│   ├── PromptOutput.tsx    # Final prompt display
│   └── SurpriseMeButton.tsx # Random selection button
├── config/
│   ├── principles/         # Principle JSON files (source)
│   └── pillars/            # Pillar JSON files (source)
├── lib/
│   ├── configLoader.ts     # Load principles/pillars from JSON
│   ├── promptBuilder.ts    # Assemble final prompt
│   ├── round2Generator.ts  # Generate scene/props options
│   ├── validation.ts       # Image upload validation
│   └── logicRules.ts       # Weighted random selection logic
├── public/
│   └── config/             # Runtime config files (copied during build)
├── types/
│   └── index.ts            # TypeScript type definitions
└── package.json
```

## How It Works

1. **Image Upload** (Optional): Upload reference images (1 or 2) with validation
2. **Round 1 Selection**: Choose Photography Principle, Content Pillar, and all associated options (Location, People, Camera, Lighting, Product)
3. **Round 2 Generation**: 
   - System auto-generates 3 Scene Moment options and 3 Props sets
   - Options are selected from combined principle + pillar templates
   - You can edit any option and select your preferred choice
4. **Prompt Assembly**: 
   - Combines principle prompt fragments, pillar hooks, and all selections
   - Includes hard constraints from both principle and pillar
   - Formats as clean, Gemini-ready text
5. **Copy to Clipboard**: One-click copy to paste into Gemini

## Customization

To update Principles or Pillars:

1. Edit the JSON files in `/config/principles/` or `/config/pillars/`
2. Copy updated files to `/public/config/` (same structure)
3. Rebuild: `npm run build`

The app will automatically load the updated configurations at runtime.

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.