# Brand Style Guide Implementation

This document outlines the brand style system implemented for the Mezcal Prompt Generator site, based on the provided brand guidelines.

## Color Palette

### Primary Colors

- **Dark Grey** (`#272926`)
  - Usage: Background colour in all instances
  - RGB: R: 39, G: 41, B: 38
  - CMYK: C: 5, M: 0, Y: 7, K: 84
  - Pantone: 447 C

- **Muted Olive Green** (`#7B815C`)
  - Usage: Logo word colour
  - RGB: R: 123, G: 129, B: 92
  - CMYK: C: 5, M: 0, Y: 29, K: 49
  - Pantone: 5777C

- **White** (`#FFFFFF`)
  - Usage: Primary text colour
  - RGB: R: 255, G: 255, B: 255
  - CMYK: C: 0, M: 0, Y: 0, K: 0

### Secondary Colors (Use Sparingly)

- **Yellow Agave Leaf** (`#A29037`)
  - Usage: Logo mark colour and used sparingly on digital and physical assets
  - RGB: R: 162, G: 144, B: 55
  - CMYK: C: 0, M: 11, Y: 66, K: 36
  - Pantone: 7755C

- **Terracotta** (`#B86744`)
  - Usage: Used sparingly on digital and physical assets
  - RGB: R: 184, G: 103, B: 68
  - CMYK: C: 0, M: 44, Y: 63, K: 28
  - Pantone: 447C

## Typography

### Fonts

- **Logo**: Gotham Condensed (Medium weight)
- **All other text**: Open Sans (Regular weight)

### Typography Hierarchy

#### 1. Logo
- **Font**: Gotham Condensed
- **Weight**: Medium (500)
- **Letter Spacing**: 0.077em
- **Case**: Always UPPERCASE
- **Usage**: Logo display only. When typed or written, use Open Sans in title case.

#### 2. Capital Headings, Names, and CTAs
- **Font**: Open Sans
- **Weight**: Regular (400)
- **Letter Spacing**: 0.06em
- **Case**: ALL UPPERCASE
- **Usage**: Section headings, CTAs, and product names

#### 3. Headlines
- **Font**: Open Sans
- **Weight**: Regular (400)
- **Letter Spacing**: 0.015em (narrower)
- **Case**: Title Case
- **Usage**: All headlines

#### 4. Body Text
- **Font**: Open Sans
- **Weight**: Regular (400)
- **Letter Spacing**: 0.03em (narrower)
- **Case**: lowercase
- **Usage**: All body text

## Implementation

### CSS Variables

All brand colors and typography settings are available as CSS variables:

```css
--background: #272926
--foreground: #FFFFFF
--brand-primary: #7B815C
--brand-accent-1: #A29037
--brand-accent-2: #B86744
```

### Tailwind Classes

#### Colors
- `bg-dark-grey` - Dark grey background
- `bg-muted-olive` - Muted olive green
- `bg-yellow-agave` - Yellow agave leaf (use sparingly)
- `bg-terracotta` - Terracotta (use sparingly)
- `text-brand-primary` - Muted olive green text
- `text-brand-accent-1` - Yellow agave text
- `text-brand-accent-2` - Terracotta text

#### Typography Classes
- `.logo` - Logo styling (Gotham Condensed, uppercase)
- `h1, h2, h3, h4, h5, h6` - Capital headings (Open Sans, uppercase)
- `.headline` - Headline styling (Open Sans, title case)
- `p, .body-text` - Body text (Open Sans, lowercase)

### Usage Examples

```tsx
// Logo
<h1 className="logo text-brand-primary">MEZCAL PROMPT GENERATOR</h1>

// Heading
<h2 className="text-white">SECTION HEADING</h2>

// Headline
<h3 className="headline text-white">This Is A Headline</h3>

// Body text
<p className="text-white">this is body text in lowercase</p>

// CTA Button
<button className="cta bg-brand-primary text-white px-6 py-3">
  CLICK HERE
</button>
```

## Design Principles

1. **Dark Background**: Always use Dark Grey (`#272926`) as the background
2. **White Text**: Primary text should be white (`#FFFFFF`)
3. **Sparse Accents**: Use Yellow Agave Leaf and Terracotta sparingly for emphasis
4. **Consistent Typography**: Follow the typography hierarchy strictly
5. **Lowercase Body**: All body text should be lowercase per brand guidelines
