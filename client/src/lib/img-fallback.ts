/* The placeholder shown when a product has no usable image.
   ────────────────────────────────────────────────────────────────────────────
   Four separate surfaces used to fall back to
   `/demo-products/Screenshot 2024-07-24 185228.png` — a real photograph of a
   demo product. Every product whose image failed to import rendered THAT
   picture, so unrelated products looked identical and, worse, looked like they
   had loaded correctly. Reported 13 Aug 2026: four imported products all
   showing the same red ghost.

   A wrong picture is worse than no picture: it hides the failure instead of
   showing it, and a dropshipper pushing that product to Shopify would be
   pushing somebody else's photo.

   It is an inline SVG rather than a file so it cannot itself 404, and so it
   reads unmistakably as "no image" rather than as a product. One constant,
   because the same mistake in four places is how only one of them gets fixed. */
export const IMG_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">' +
      '<rect width="400" height="400" fill="#f1f2f4"/>' +
      '<g fill="none" stroke="#c3c7cd" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="128" y="140" width="144" height="120" rx="10"/>' +
      '<path d="M128 224l38-34 30 26 34-40 42 48"/></g>' +
      '<circle cx="172" cy="176" r="11" fill="#c3c7cd"/>' +
      '<text x="200" y="300" text-anchor="middle" font-family="system-ui,sans-serif" ' +
      'font-size="20" fill="#8b9099">No image</text></svg>',
  );
