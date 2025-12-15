/**
 * Tradelle.io specific scraper implementation
 * Extracts product data from app.tradelle.io/products
 */

import { BaseScraper } from './base-scraper'
import { createTradelleSessionManager } from './utils/session-manager'
import type { RawProductData, ScrapeResult, ScraperConfig } from './utils/types'
import { validateProduct, reportValidation, parsePrice, parseInteger, parseRating } from './utils/validator'
import * as path from 'path'
import { promises as fs } from 'fs'

export class TradelleScraper extends BaseScraper {
  private readonly BASE_URL = 'https://app.tradelle.io'
  private readonly PRODUCTS_URL = 'https://app.tradelle.io' // Will navigate via sidebar
  private readonly LOGIN_URL = 'https://app.tradelle.io/login'

  /**
   * Selectors for Tradelle.io
   * NOTE: These are placeholder selectors that need to be discovered during testing
   * We'll update these after inspecting the actual site structure
   */
  // Loading indicator to wait for SPA to finish loading
  private readonly LOADING_SELECTOR = 'text=Loading'

  private readonly SELECTORS = {
    // Authentication selectors
    auth: {
      emailInput: 'input[type="email"], input[name="email"], #email',
      passwordInput: 'input[type="password"], input[name="password"], #password',
      loginButton: 'button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")',
      // Updated to detect common dashboard/authenticated UI elements
      dashboardIndicator: 'nav, aside, [class*="sidebar"], [class*="nav"], [class*="menu"], header a[href*="product"], button[class*="avatar"], img[class*="avatar"], [class*="user"], [class*="profile"]',
      userEmail: '.user-email, .user-info',
    },

    // Product listing selectors
    listing: {
      productCards: '.product-card, [data-testid="product-card"], article',
      productLink: 'a[href*="/products/"], a[href*="/product/"]',
      productTitle: 'h2, h3, .product-title, .title',
      productImage: 'img',
      productPrice: '.price, [data-testid="price"]',
    },

    // Product detail selectors - Updated based on actual Tradelle page structure
    detail: {
      // Core fields - The main product title is a large heading after the "Back" button
      title: 'main h1, [class*="product"] h1, h1:not(:has-text("Hand-Picked")):not(:has-text("Product"))',
      primaryImage: 'main img[src*="cdn"], main img[src*="alicdn"], main img[src*="http"]:not([src*="avatar"])',
      description: 'p:has-text("Revolutionize"), p:has-text("This"), [class*="description"] p, main p',

      // Pricing - Based on the card layout with "Product Cost", "Selling Price", "Profit per Sale"
      supplierPrice: ':has-text("Product Cost") + *, :has-text("Product Cost") ~ *:has-text("$")',
      retailPrice: ':has-text("Selling Price") + *, :has-text("Selling Price") ~ *:has-text("$")',
      profitMargin: ':has-text("Profit per Sale") + *, :has-text("Profit per Sale") ~ *:has-text("$")',

      // Media - Main gallery and thumbnails
      imageGallery: 'main img[src*="cdn"], main img[src*="alicdn"], main img[src*="http"]:not([src*="avatar"]):not([width="20"])',
      additionalImages: 'main img[src*="cdn"], main img[src*="alicdn"]',

      // Product details
      rating: '.rating, [data-testid="rating"], .stars, [class*="rating"]',
      reviewsCount: '.reviews-count, [data-testid="reviews-count"], [class*="review"]',
      specifications: '.specifications, .specs, [data-testid="specifications"], table',
      category: '.category, .breadcrumb, [data-testid="category"]',

      // Tradelle-specific metadata
      winningBadge: ':has-text("Winning"), [class*="winning"], .badge',
      itemsSold: ':has-text("sold"), [class*="sold"], .sales-count',
      trendChart: 'canvas, [class*="chart"], svg[class*="chart"]',
      foundDate: ':has-text("Added to Tradelle"), [class*="date"]',

      // Tags/Filters
      tags: '.tag, .badge, [data-testid="tag"], [class*="chip"]',
    },
  }

  constructor(config: Partial<ScraperConfig> = {}) {
    const sessionManager = createTradelleSessionManager()
    super(config, sessionManager)
  }

  /**
   * Main scraping entry point
   */
  async scrape(): Promise<ScrapeResult> {
    const startTime = new Date().toISOString()
    const screenshots: string[] = []
    const errors: ScrapeResult['errors'] = []
    let rawData: RawProductData = {}

    try {
      this.logger.divider('TRADELLE SCRAPER')

      // Step 1: Check/restore session
      this.logger.step(1, 6, 'Checking for existing session')
      const hasSession = await this.sessionManager.hasValidSession()

      if (hasSession && this.context) {
        this.logger.info('Loading saved session into browser...')
        await this.sessionManager.loadSession(this.context)
      } else if (!hasSession) {
        this.logger.warn('No valid session found - manual login required')
      }

      // Step 2: Navigate to products page via sidebar
      this.logger.step(2, 6, 'Navigating to products page')
      await this.navigateTo(this.PRODUCTS_URL, 'networkidle')
      await this.waitForPageLoad()

      // Click on Product Research in sidebar to expand menu
      await this.navigateToProductsViaSidebar()
      screenshots.push(await this.screenshot('products-page'))

      // Step 3: Check authentication
      this.logger.step(3, 6, 'Verifying authentication')
      const isAuth = await this.isAuthenticated()

      if (!isAuth) {
        this.logger.warn('Not authenticated - need to login')
        await this.handleLogin()
        screenshots.push(await this.screenshot('after-login'))
      }

      // Step 4: Navigate to first product (or use provided URL)
      this.logger.step(4, 6, 'Selecting product to scrape')
      const productUrl = await this.selectFirstProduct()
      if (!productUrl) {
        throw new Error('No products found on the page')
      }

      this.logger.info(`Scraping product: ${productUrl}`)
      await this.navigateTo(productUrl)
      await this.waitForPageLoad()

      // Check for error page and retry if needed
      const pageText = await this.page?.evaluate(() => document.body?.textContent || '') || ''
      if (pageText.includes('Something went wrong') || pageText.includes("couldn't load the page")) {
        this.logger.warn('Page showed error, retrying in 3 seconds...')
        await this.page?.waitForTimeout(3000)
        await this.page?.reload({ waitUntil: 'networkidle' })
        await this.waitForPageLoad()
      }

      screenshots.push(await this.screenshot('product-detail'))

      // Step 5: Extract product data
      this.logger.step(5, 6, 'Extracting product data')
      this.logger.divider('DATA EXTRACTION')

      rawData = await this.extractProductData()

      // Step 6: Validate extracted data
      this.logger.step(6, 6, 'Validating extracted data')
      const validationResult = validateProduct(rawData)
      reportValidation(validationResult)

      // Take final screenshot if successful
      if (this.config.screenshotOnSuccess) {
        screenshots.push(await this.screenshot('extraction-complete'))
      }

      const endTime = new Date().toISOString()
      const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime()

      this.logger.divider('SCRAPE COMPLETE')
      this.logger.success(`Duration: ${(durationMs / 1000).toFixed(2)}s`)
      this.logger.success(`Completeness: ${validationResult.completenessScore}%`)

      return {
        success: validationResult.requiredFieldsComplete,
        product: validationResult.transformedProduct as any,
        metadata: validationResult.transformedMetadata as any,
        source: {
          source_type: 'scraped',
          source_id: productUrl,
        },
        validationResult,
        rawData,
        screenshots,
        timing: {
          startTime,
          endTime,
          durationMs,
        },
        errors,
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.logger.error('Scraping failed', err)

      if (this.config.screenshotOnError) {
        screenshots.push(await this.screenshot('error'))
      }

      errors.push({
        message: err.message,
        context: 'scrape',
        recoverable: false,
      })

      const endTime = new Date().toISOString()
      const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime()

      return {
        success: false,
        validationResult: validateProduct(rawData),
        rawData,
        screenshots,
        timing: {
          startTime,
          endTime,
          durationMs,
        },
        errors,
      }
    }
  }

  /**
   * Navigate to products page via sidebar menu
   */
  protected async navigateToProductsViaSidebar(): Promise<void> {
    if (!this.page) return

    this.logger.info('Navigating via sidebar menu...')

    try {
      // Click on "Product Research" to expand the menu
      const productResearchMenu = await this.page.$('text=Product Research')
      if (productResearchMenu) {
        this.logger.debug('Found Product Research menu, clicking...')
        await productResearchMenu.click()
        await this.page.waitForTimeout(1000)
      }

      // Look for submenu items and click the first product-related link
      const submenuSelectors = [
        'text=Product Picks',
        'text=Hand-Picked',
        'text=Winning Products',
        'text=All Products',
        'a[href*="product"]',
        'a[href*="picks"]',
      ]

      for (const selector of submenuSelectors) {
        const menuItem = await this.page.$(selector)
        if (menuItem) {
          this.logger.debug(`Found submenu item: ${selector}, clicking...`)
          await menuItem.click()
          await this.waitForPageLoad()
          return
        }
      }

      this.logger.warn('Could not find product submenu, taking screenshot for inspection')
      await this.screenshot('sidebar-expanded')
    } catch (error) {
      this.logger.error('Error navigating via sidebar', error)
    }
  }

  /**
   * Wait for SPA to finish loading (loading spinner to disappear)
   */
  protected async waitForPageLoad(): Promise<void> {
    if (!this.page) return

    this.logger.debug('Waiting for page to fully load...')

    try {
      // List of loading indicators to check for
      const loadingSelectors = [
        'text=Loading user data',
        'text=Loading...',
        'text=Loading',
        '[class*="loading"]',
        '[class*="spinner"]',
        '.skeleton',
        '[data-loading="true"]',
      ]

      // Check each loading indicator and wait for it to disappear
      for (const selector of loadingSelectors) {
        try {
          const loadingElement = await this.page.$(selector)
          if (loadingElement) {
            this.logger.debug(`Loading indicator found: ${selector}, waiting for it to disappear...`)
            await this.page.waitForSelector(selector, { state: 'hidden', timeout: 30000 })
            this.logger.debug(`Loading indicator disappeared: ${selector}`)
          }
        } catch (e) {
          // Ignore timeout for individual selectors
        }
      }

      // Additional wait for React/Vue to fully hydrate
      await this.page.waitForTimeout(2000)

      // Wait for any images to load
      await this.page.waitForLoadState('networkidle')

      this.logger.success('Page fully loaded')
    } catch (error) {
      this.logger.warn('Timeout waiting for page load, continuing anyway...', error)
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    if (!this.page) return false

    try {
      // Try multiple authentication indicators
      const selectors = this.SELECTORS.auth.dashboardIndicator.split(', ')

      for (const selector of selectors) {
        const element = await this.page.$(selector)
        if (element) {
          this.logger.success(`Authenticated (found: ${selector})`)
          return true
        }
      }

      this.logger.debug('No authentication indicators found')
      return false
    } catch (error) {
      this.logger.debug('Error checking authentication', error)
      return false
    }
  }

  /**
   * Handle login flow
   */
  private async handleLogin(): Promise<void> {
    this.logger.info('Starting login flow...')

    // Navigate to login page if not already there
    const currentUrl = this.getCurrentUrl()
    if (!currentUrl.includes('/login')) {
      await this.navigateTo(this.LOGIN_URL, 'networkidle')
      await this.waitForPageLoad()
      await this.screenshot('login-page')
    }

    // Pause for manual login
    this.logger.divider('MANUAL LOGIN')
    this.logger.info('Please complete the login process in the browser window.')
    this.logger.info('The scraper will automatically continue once you are logged in.')
    this.logger.divider()

    if (this.page) {
      await this.sessionManager.pauseForManualLogin(
        this.page,
        this.SELECTORS.auth.dashboardIndicator
      )

      // Save session for future use
      if (this.context) {
        await this.sessionManager.saveSession(this.context)
        this.logger.success('Session saved for future runs')
      }
    }
  }

  /**
   * Select the first product from the listing
   */
  private async selectFirstProduct(): Promise<string | null> {
    if (!this.page) return null

    try {
      // Wait for products to load
      await this.page.waitForTimeout(2000)

      // Try to find product links
      const productLinks = await this.page.$$eval(
        'a[href*="/product"]',
        (elements) => elements.map(el => (el as HTMLAnchorElement).href)
      )

      if (productLinks.length > 0) {
        this.logger.success(`Found ${productLinks.length} products`)
        return productLinks[0]
      }

      // Fallback: try to click first product card
      const firstCard = await this.page.$(this.SELECTORS.listing.productCards)
      if (firstCard) {
        const href = await firstCard.evaluate(el => {
          const link = el.querySelector('a')
          return link?.href
        })
        if (href) return href
      }

      return null
    } catch (error) {
      this.logger.error('Error selecting product', error)
      return null
    }
  }

  /**
   * Extract all product data from the detail page using smart DOM inspection
   */
  protected async extractProductData(): Promise<RawProductData> {
    const raw: RawProductData = {}

    if (!this.page) return raw

    // Use page.evaluate to extract data directly from the DOM
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractedData: any = await this.page.evaluate(`
      (function() {
        var data = {};

        // Extract title - look for the main product heading (not sidebar items)
        var mainContent = document.querySelector('main') || document.body;
        var allH1s = mainContent.querySelectorAll('h1, h2');
        for (var i = 0; i < allH1s.length; i++) {
          var h = allH1s[i];
          var text = h.textContent ? h.textContent.trim() : '';
          // Skip common page headers
          if (text && text.indexOf('Hand-Picked') === -1 && text.indexOf('Product Research') === -1 &&
              text.indexOf('Product Picks') === -1 && text.length > 10) {
            data.title = text;
            break;
          }
        }

        // If no title found, try looking for large text elements
        if (!data.title) {
          var largeTexts = mainContent.querySelectorAll('[class*="title"], [class*="heading"], [class*="name"]');
          for (var j = 0; j < largeTexts.length; j++) {
            var el = largeTexts[j];
            var elText = el.textContent ? el.textContent.trim() : '';
            if (elText && elText.length > 10 && elText.length < 200) {
              data.title = elText;
              break;
            }
          }
        }

        // Extract description - look for paragraph with product description
        // Skip generic site taglines like "Explore winning products..."
        var paragraphs = mainContent.querySelectorAll('p');
        for (var k = 0; k < paragraphs.length; k++) {
          var p = paragraphs[k];
          var pText = p.textContent ? p.textContent.trim() : '';
          if (pText && pText.length > 50 && pText.length < 2000) {
            // Check if it looks like a product description (not site tagline)
            if (pText.indexOf('Go to') !== 0 &&
                pText.indexOf('Added to Tradelle') === -1 &&
                pText.indexOf('Explore winning products') === -1 &&
                pText.indexOf('Only pay once') === -1 &&
                pText.indexOf('verified by real-time') === -1) {
              data.description = pText;
              break;
            }
          }
        }

        // If no description found in paragraphs, look for text near "Show more" button
        if (!data.description) {
          // Search for Show more text
          var allElements = document.querySelectorAll('button, span, a');
          for (var sm = 0; sm < allElements.length; sm++) {
            var smEl = allElements[sm];
            if (smEl.textContent && smEl.textContent.trim() === 'Show more') {
              var smParent = smEl.parentElement;
              if (smParent) {
                var smParentText = smParent.textContent || '';
                var smDescText = smParentText.replace('Show more', '').replace('Show less', '').trim();
                if (smDescText.length > 50) {
                  data.description = smDescText;
                  break;
                }
              }
            }
          }
        }

        // Extract prices using the label-based approach
        // Find all elements that might contain prices
        var priceContainers = mainContent.querySelectorAll('div, span, p');
        for (var m = 0; m < priceContainers.length; m++) {
          var container = priceContainers[m];
          var containerText = container.textContent || '';

          // Product Cost (buy price)
          if (containerText.indexOf('Product Cost') !== -1 && !data.supplierPrice) {
            var costMatch = containerText.match(/Product Cost[^$]*(\\$[\\d,]+\\.?\\d*)/i);
            if (costMatch) data.supplierPrice = costMatch[1];
          }

          // Selling Price
          if (containerText.indexOf('Selling Price') !== -1 && !data.retailPrice) {
            var sellMatch = containerText.match(/Selling Price[^$]*(\\$[\\d,]+\\.?\\d*)/i);
            if (sellMatch) data.retailPrice = sellMatch[1];
          }

          // Profit per Sale
          if (containerText.indexOf('Profit per Sale') !== -1 && !data.profitMargin) {
            var profitMatch = containerText.match(/Profit per Sale[^$]*(\\$[\\d,]+\\.?\\d*)/i);
            if (profitMatch) data.profitMargin = profitMatch[1];
          }
        }

        // Fallback: if prices not found, try finding them individually
        if (!data.supplierPrice || !data.retailPrice) {
          var allPrices = [];
          var priceRegex = /\\$\\d+\\.?\\d*/g;
          var bodyText = mainContent.textContent || '';
          var priceMatch;
          while ((priceMatch = priceRegex.exec(bodyText)) !== null) {
            if (allPrices.indexOf(priceMatch[0]) === -1) {
              allPrices.push(priceMatch[0]);
            }
          }
          // Typically: first price is cost, second is selling, third is profit
          if (allPrices.length >= 2) {
            if (!data.supplierPrice) data.supplierPrice = allPrices[0];
            if (!data.retailPrice) data.retailPrice = allPrices[1];
            if (!data.profitMargin && allPrices.length >= 3) data.profitMargin = allPrices[2];
          }
        }

        // Extract main image - find the product detail area first
        var productImages = [];
        var mainImage = null;

        // Get product ID from URL
        var currentProductId = window.location.pathname.match(/products\\/([\\d]+)/);
        var productId = currentProductId ? currentProductId[1] : null;

        // Find all images in the main content area
        var images = mainContent.querySelectorAll('img');

        for (var n = 0; n < images.length; n++) {
          var img = images[n];
          var src = img.src || img.getAttribute('data-src') || '';

          // Skip non-http, avatars, icons, logos
          if (!src || src.indexOf('http') !== 0) continue;
          if (src.indexOf('avatar') !== -1 || src.indexOf('logo') !== -1 || src.indexOf('icon') !== -1) continue;

          // Priority 1: Images with current product ID in URL
          if (productId && src.indexOf('/products/' + productId) !== -1) {
            if (!mainImage) mainImage = src;
            if (productImages.indexOf(src) === -1) productImages.push(src);
            continue;
          }

          // Priority 2: CloudFront images (Tradelle's CDN)
          if (src.indexOf('cloudfront.net') !== -1) {
            if (!mainImage) mainImage = src;
            if (productImages.indexOf(src) === -1) productImages.push(src);
            continue;
          }

          // Priority 3: Alicdn images (supplier images)
          if (src.indexOf('alicdn.com') !== -1 || src.indexOf('aliexpress') !== -1) {
            if (productImages.indexOf(src) === -1) productImages.push(src);
            continue;
          }

          // Priority 4: Large images (likely product gallery)
          if (img.naturalWidth > 150 || img.width > 150) {
            if (productImages.indexOf(src) === -1) productImages.push(src);
          }
        }

        // Assign main image
        if (mainImage) {
          data.imageUrl = mainImage;
        } else if (productImages.length > 0) {
          data.imageUrl = productImages[0];
        }

        // Filter additional images to exclude images from other products (different product IDs)
        var filteredImages = [];
        for (var fi = 0; fi < productImages.length; fi++) {
          var imgUrl = productImages[fi];
          // Check if this image belongs to a different product
          var otherProductMatch = imgUrl.match(/\\/products\\/(\\d+)/);
          if (otherProductMatch && productId && otherProductMatch[1] !== productId) {
            continue; // Skip images from other products
          }
          filteredImages.push(imgUrl);
        }
        data.additionalImages = filteredImages;

        // Extract "Added to Tradelle" date
        var bodyContent = mainContent.textContent || '';
        var dateMatch = bodyContent.match(/Added to Tradelle:\\s*(\\d{1,2}\\/\\d{1,2}\\/\\d{4})/);
        if (dateMatch) {
          data.foundDate = dateMatch[1];
        }

        return data;
      })()
    `)

    // Log extracted data
    this.logger.field('title', extractedData.title, !!extractedData.title)
    this.logger.field('image', extractedData.imageUrl ? 'Found' : null, !!extractedData.imageUrl)
    this.logger.field('description', extractedData.description ? `${extractedData.description.substring(0, 50)}...` : null, !!extractedData.description)
    this.logger.field('supplier price', extractedData.supplierPrice, !!extractedData.supplierPrice)
    this.logger.field('retail price', extractedData.retailPrice, !!extractedData.retailPrice)
    this.logger.field('profit margin', extractedData.profitMargin, !!extractedData.profitMargin)
    this.logger.field('additional_images', `${extractedData.additionalImages?.length || 0} images`, (extractedData.additionalImages?.length || 0) > 0)
    this.logger.field('found_date', extractedData.foundDate, !!extractedData.foundDate)

    // Map to raw data structure
    raw.title = extractedData.title || null
    raw.imageUrl = extractedData.imageUrl || null
    raw.description = extractedData.description || null
    raw.supplierPrice = extractedData.supplierPrice || undefined
    raw.retailPrice = extractedData.retailPrice || undefined
    raw.profitMargin = extractedData.profitMargin || undefined
    raw.additionalImages = extractedData.additionalImages || []
    raw.foundDate = extractedData.foundDate || undefined

    // Extract remaining fields with fallback selectors
    raw.rating = (await this.extractField('rating', this.SELECTORS.detail.rating)) ?? undefined
    raw.reviewsCount = (await this.extractField('reviews count', this.SELECTORS.detail.reviewsCount)) ?? undefined
    raw.specifications = (await this.extractSpecifications()) ?? undefined
    raw.isWinning = await this.checkWinningProduct()
    raw.category = (await this.extractField('category', this.SELECTORS.detail.category)) ?? undefined
    raw.filters = await this.extractTags()

    return raw
  }

  /**
   * Generic field extraction helper
   */
  private async extractField(fieldName: string, selector: string, attribute?: string): Promise<string | null> {
    this.logger.debug(`Extracting: ${fieldName}`)
    this.logger.debug(`Selector: ${selector}`)

    const value = attribute
      ? await this.extractAttribute(selector, attribute)
      : await this.extractText(selector)

    if (value) {
      this.logger.field(fieldName, value, true)
    } else {
      this.logger.field(fieldName, null, false)
    }

    return value
  }

  /**
   * Extract additional images
   */
  private async extractImages(): Promise<string[]> {
    if (!this.page) return []

    try {
      const images = await this.page.$$eval(
        this.SELECTORS.detail.imageGallery,
        (elements) => elements
          .map(el => (el as HTMLImageElement).src)
          .filter(src => src && src.length > 0)
      )

      this.logger.field('additional_images', `${images.length} images`, images.length > 0)
      return images
    } catch (error) {
      this.logger.field('additional_images', null, false)
      return []
    }
  }

  /**
   * Extract product specifications
   */
  private async extractSpecifications(): Promise<Record<string, string> | null> {
    if (!this.page) return null

    try {
      const specs = await this.page.evaluate(() => {
        const specsTable = document.querySelector('.specifications, .specs, table')
        if (!specsTable) return null

        const result: Record<string, string> = {}
        const rows = specsTable.querySelectorAll('tr, .spec-row')

        rows.forEach(row => {
          const cells = row.querySelectorAll('td, th, .label, .value')
          if (cells.length >= 2) {
            const key = cells[0]?.textContent?.trim()
            const value = cells[1]?.textContent?.trim()
            if (key && value) {
              result[key] = value
            }
          }
        })

        return Object.keys(result).length > 0 ? result : null
      })

      this.logger.field('specifications', specs ? `${Object.keys(specs).length} items` : null, specs !== null)
      return specs
    } catch (error) {
      this.logger.field('specifications', null, false)
      return null
    }
  }

  /**
   * Check if product is marked as "winning"
   */
  private async checkWinningProduct(): Promise<boolean> {
    if (!this.page) return false

    try {
      const badge = await this.page.$(this.SELECTORS.detail.winningBadge)
      const isWinning = badge !== null

      this.logger.field('is_winning', isWinning, true)
      return isWinning
    } catch (error) {
      this.logger.field('is_winning', false, false)
      return false
    }
  }

  /**
   * Extract tags/filters
   */
  private async extractTags(): Promise<string[]> {
    if (!this.page) return []

    try {
      const tags = await this.page.$$eval(
        this.SELECTORS.detail.tags,
        (elements) => elements
          .map(el => el.textContent?.trim())
          .filter((tag): tag is string => !!tag)
      )

      this.logger.field('filters', `${tags.length} tags`, tags.length > 0)
      return tags
    } catch (error) {
      this.logger.field('filters', null, false)
      return []
    }
  }

  /**
   * Scrape a specific product URL
   */
  async scrapeProduct(productUrl: string): Promise<ScrapeResult> {
    // Initialize if not already done
    if (!this.page) {
      await this.initialize()
    }

    const startTime = new Date().toISOString()
    const screenshots: string[] = []

    try {
      // Navigate directly to product
      await this.navigateTo(productUrl)
      await this.waitForPageLoad()
      screenshots.push(await this.screenshot('product-page'))

      // Extract data
      const rawData = await this.extractProductData()

      // Validate
      const validationResult = validateProduct(rawData)
      reportValidation(validationResult)

      const endTime = new Date().toISOString()
      const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime()

      return {
        success: validationResult.requiredFieldsComplete,
        product: validationResult.transformedProduct as any,
        metadata: validationResult.transformedMetadata as any,
        source: {
          source_type: 'scraped',
          source_id: productUrl,
        },
        validationResult,
        rawData,
        screenshots,
        timing: {
          startTime,
          endTime,
          durationMs,
        },
        errors: [],
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.logger.error('Failed to scrape product', err)

      if (this.config.screenshotOnError) {
        screenshots.push(await this.screenshot('scrape-error'))
      }

      const endTime = new Date().toISOString()
      const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime()

      return {
        success: false,
        validationResult: validateProduct({}),
        rawData: {},
        screenshots,
        timing: {
          startTime,
          endTime,
          durationMs,
        },
        errors: [{
          message: err.message,
          context: 'scrapeProduct',
          recoverable: false,
        }],
      }
    }
  }
}
