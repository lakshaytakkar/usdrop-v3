# Category Thumbnail Generation

This script generates consistent, professional thumbnails for all categories using Google's Gemini 2.5 Flash Image API.

## Features

- **3-Layer Structure**: Each thumbnail follows a consistent design:
  1. **Objects**: Top products from the category (3-4 items)
  2. **Background**: Complimenting gradient/pattern
  3. **Effects & Lighting**: Professional photography feel

- **Automatic Database Updates**: Generated thumbnails are automatically saved and database records are updated

- **Smart Skipping**: Existing thumbnails are skipped to avoid regeneration

## Prerequisites

1. **Gemini API Key**: You need a Google Gemini API key
   - Get one from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Set it as an environment variable: `GEMINI_API_KEY` or `NEXT_PUBLIC_GEMINI_API_KEY`

2. **Supabase Credentials**: Already configured in your project
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Usage

### Option 1: Set environment variable in terminal

```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your-api-key-here"
node scripts/generate-category-thumbnails.mjs

# Windows CMD
set GEMINI_API_KEY=your-api-key-here
node scripts/generate-category-thumbnails.mjs

# macOS/Linux
export GEMINI_API_KEY=your-api-key-here
node scripts/generate-category-thumbnails.mjs
```

### Option 2: Add to .env.local file

Create or update `.env.local` in the project root:

```env
GEMINI_API_KEY=your-api-key-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then run:
```bash
node scripts/generate-category-thumbnails.mjs
```

## Output

- **Images**: Saved to `public/categories/` directory
- **Naming**: `{category-slug}-thumbnail.png`
- **Database**: Automatically updated with thumbnail URLs

## Category-Specific Styling

Each category has custom product examples and color schemes:

- **Electronics**: Tech products on deep blue to purple gradient
- **Fashion & Accessories**: Luxury items on rose gold to champagne
- **Beauty & Personal Care**: Beauty products on pink to lavender
- **Home & Garden**: Home items on sage green to cream
- **Kitchen & Dining**: Kitchenware on warm orange to beige
- **Sports & Fitness**: Fitness gear on energetic blue to green
- **Pet Supplies**: Pet items on warm brown to tan
- **Baby & Kids**: Baby products on soft pastel blue to pink
- And more...

## Rate Limiting

The script includes a 2-second delay between API calls to respect rate limits.

## Troubleshooting

- **"No API key found"**: Make sure `GEMINI_API_KEY` is set in your environment
- **"Supabase credentials not found"**: Check your `.env.local` file
- **Generation fails**: Check your API key is valid and has sufficient quota
- **Images not updating**: Clear browser cache or check file permissions


