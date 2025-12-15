# Tradelle Product Scraper

A Playwright-based web scraper for extracting product data from **app.tradelle.io/products** with extensive logging, session persistence, and schema validation.

## Features

- **Observability First**: Extensive console logging at every step
- **Session Persistence**: Login once, scrape repeatedly (saves browser session)
- **Schema Validation**: Validates extracted data against Product schema with completeness scoring
- **Interactive Testing**: Non-headless mode by default for debugging
- **Error Handling**: Never fails silently - actionable error messages
- **Screenshots**: Auto-captures screenshots at key steps and errors

## Quick Start

### 1. Install Dependencies

Dependencies are already installed (`playwright` and `zod`).

### 2. Run the Scraper

```bash
# Interactive mode (visible browser)
npm run scraper:tradelle

# With debug logging
npm run scraper:tradelle:debug

# Or use npx tsx directly
npx tsx scripts/scrapers/test-single-product.ts
```

### 3. First Run - Manual Login

On first run, the scraper will:
1. Open a visible Chrome browser
2. Navigate to Tradelle login page
3. Pause for you to manually log in
4. Automatically detect when logged in
5. Save your session for future runs

After successful login, the session is saved to `.playwright-session/tradelle-io-session.json` and will be reused on subsequent runs.

## Usage Examples

### Basic Usage

```bash
# Scrape first available product
npm run scraper:tradelle
```

### Advanced Options

```bash
# Scrape specific product URL
npx tsx scripts/scrapers/test-single-product.ts --url="https://app.tradelle.io/products/123"

# Force new login (clear saved session)
npx tsx scripts/scrapers/test-single-product.ts --force-login

# Run with debug logging (shows selectors, HTML snippets)
npx tsx scripts/scrapers/test-single-product.ts --debug

# Run in headless mode
npx tsx scripts/scrapers/test-single-product.ts --headless

# Don't use saved session
npx tsx scripts/scrapers/test-single-product.ts --no-session
```

### Command-Line Options

| Option | Description |
|--------|-------------|
| `--url=<url>` | Specific product URL to scrape |
| `--debug` | Enable debug logging (shows selectors, HTML snippets) |
| `--visible` | Run browser in visible mode (default) |
| `--headless` | Run browser in headless mode |
| `--save` | Save extracted data to Supabase (not yet implemented) |
| `--no-session` | Don't use saved session (always login) |
| `--force-login` | Force new login (clear existing session) |
| `--help, -h` | Show help message |

## Output

### Console Output

The scraper provides detailed console output:

```
[2024-01-15T10:30:00.000Z] [INFO] ========================================
[2024-01-15T10:30:00.000Z] [INFO] Tradelle Scraper - Starting
[2024-01-15T10:30:00.000Z] [INFO] ========================================
[2024-01-15T10:30:00.001Z] [INFO] Step 1/6: Checking session...
[2024-01-15T10:30:00.050Z] [SUCCESS] Session valid (5 days remaining)
[2024-01-15T10:30:01.000Z] [INFO] Step 2/6: Launching browser...
[2024-01-15T10:30:03.000Z] [INFO] Step 3/6: Navigating to products...
[2024-01-15T10:30:05.000Z] [INFO] Step 4/6: Extracting data...
[2024-01-15T10:30:05.100Z] [DEBUG] Selector: h1.product-title
[2024-01-15T10:30:05.150Z] [SUCCESS] title: "Wireless Earbuds Pro"
...
[2024-01-15T10:30:08.000Z] [INFO] Step 5/6: Validating...
[2024-01-15T10:30:08.050Z] [SUCCESS] Completeness: 85% (8/10 fields)
[2024-01-15T10:30:08.100Z] [WARN] Missing: description, specifications
```

### Files Generated

1. **Screenshots**: `scripts/scrapers/output/screenshots/`
   - Auto-named with timestamps (e.g., `01-products-page-2024-01-15T10-30-00.png`)
   - Captured at key steps and on errors

2. **Data**: `scripts/scrapers/output/data/`
   - JSON files with extracted product data (e.g., `product-2024-01-15T10-30-00.json`)

3. **Session**: `.playwright-session/`
   - Browser session data (cookies, localStorage)
   - Automatically managed

## Extracted Fields

The scraper extracts the following fields matching `src/types/products.ts`:

### Required Fields (60% weight)
- `title` - Product title/name
- `image` - Primary image URL
- `buy_price` - Supplier price
- `sell_price` - Retail price

### Important Fields (25% weight)
- `description` - Product description
- `profit_per_order` - Calculated from prices
- `category_id` - Product category
- `additional_images` - Gallery images

### Optional Fields (15% weight)
- `specifications` - Product specs as key-value pairs
- `rating` - Product rating (0-5)
- `reviews_count` - Number of reviews
- `trend_data` - Trend metrics

### Metadata Fields
- `is_winning` - Whether product is marked as "winning"
- `profit_margin` - Profit percentage
- `items_sold` - Number sold
- `filters` - Product tags

## Validation & Completeness

After extraction, the scraper validates data and provides a **completeness score** (0-100%):

- **100%**: All fields extracted successfully
- **80-99%**: Core fields present, some optional fields missing
- **60-79%**: Required fields present, missing important fields
- **<60%**: Missing required fields

The validation report shows:
- Missing fields
- Invalid field values
- Warnings for incomplete data
- Suggestions for improving selectors

## Updating Selectors

The scraper uses placeholder selectors that need to be discovered by inspecting Tradelle's actual HTML structure.

### To Update Selectors:

1. Run the scraper in visible mode with debug logging:
   ```bash
   npx tsx scripts/scrapers/test-single-product.ts --debug
   ```

2. Open Chrome DevTools in the browser window (F12)

3. Inspect the product page and identify stable selectors for each field

4. Update the `SELECTORS` object in `tradelle-scraper.ts`:

```typescript
private readonly SELECTORS = {
  detail: {
    title: 'h1.actual-selector-here', // Update this
    primaryImage: 'img.actual-image-selector', // And this
    supplierPrice: '[data-price="supplier"]', // etc...
  }
}
```

### Selector Priority

Use selectors in this order of preference:
1. **data-testid attributes** (most stable)
2. **Specific class names** (e.g., `.product-title`)
3. **DOM structure** (e.g., `h1:first-of-type`)

## Troubleshooting

### "No authentication indicators found"

**Solution**: Update `SELECTORS.auth.dashboardIndicator` with the actual selector for logged-in state.

```typescript
dashboardIndicator: '.your-actual-dashboard-selector'
```

### "No products found on the page"

**Solution**: Update `SELECTORS.listing.productCards` and `productLink` selectors.

### Low Completeness Score

**Solution**: Enable debug mode to see which selectors are failing:

```bash
npx tsx scripts/scrapers/test-single-product.ts --debug
```

Then update the corresponding selectors in `tradelle-scraper.ts`.

### Session Expired

**Solution**: Force a new login:

```bash
npx tsx scripts/scrapers/test-single-product.ts --force-login
```

## Project Structure

```
scripts/scrapers/
├── base-scraper.ts           # Base class with common infrastructure
├── tradelle-scraper.ts       # Tradelle-specific implementation
├── test-single-product.ts    # Entry point for testing
├── utils/
│   ├── logger.ts             # Centralized logging
│   ├── validator.ts          # Schema validation
│   ├── session-manager.ts    # Browser session persistence
│   └── types.ts              # TypeScript definitions
├── output/                   # Generated files (gitignored)
│   ├── screenshots/          # Debug screenshots
│   └── data/                 # Extracted JSON
└── README.md                 # This file
```

## Next Steps

### 1. Discover Selectors

Run the scraper and use Chrome DevTools to identify the actual selectors for Tradelle.io.

### 2. Update tradelle-scraper.ts

Replace placeholder selectors with discovered ones.

### 3. Test Extraction

Verify all fields are extracted correctly:

```bash
npm run scraper:tradelle:debug
```

### 4. Iterate on Selectors

Refine selectors based on completeness score and validation warnings.

### 5. Implement Database Save

Add Supabase integration to save extracted products to the database.

## Development Tips

- **Always run with `--debug` first** to see what selectors are being attempted
- **Take screenshots** at each major step to debug issues
- **Check the console output** for detailed extraction logs
- **Review the generated JSON** in `output/data/` to see raw extracted data
- **Update selectors incrementally** - fix one field at a time

## Architecture

The scraper follows a layered architecture:

1. **Base Layer** (`base-scraper.ts`): Common browser automation
2. **Site Layer** (`tradelle-scraper.ts`): Tradelle-specific extraction
3. **Utilities** (`utils/`): Logging, validation, session management
4. **Entry Point** (`test-single-product.ts`): CLI interface

This design makes it easy to add scrapers for other sites (e.g., `menia-scraper.ts`) by extending `BaseScraper`.

## License

Part of USDrop v3 project.
