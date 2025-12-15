// Feature list that will be compared
export const FEATURES = [
  'Store Creation',
  'Product Research',
  'AI Tools',
  'Automation',
  'Data Intelligence',
  'Fulfillment',
  'Profit Tracking',
  'Video Ad Generator',
];

// Competitor information with features
export const COMPETITORS = [
  {
    id: 'usdrop-ai',
    name: 'USDrop AI',
    role: 'All-in-One Platform',
    color: 'hsl(var(--primary))',
    gradientFrom: '#8b5cf6',
    gradientTo: '#7c3aed',
    pricing: 'FREE',
    keyFeatures: ['AI Product Finder', 'Auto-Fulfillment', 'Custom Branding', 'Global Suppliers'],
    features: {
      'Store Creation': true,
      'Product Research': true,
      'AI Tools': true,
      'Automation': true,
      'Data Intelligence': true,
      'Fulfillment': true,
      'Profit Tracking': true,
      'Video Ad Generator': true,
    },
    totalScore: 469,
  },
  {
    id: 'zendrop',
    name: 'Zendrop',
    role: 'Fulfillment Service',
    color: 'hsl(var(--chart-2))',
    gradientFrom: '#f97316',
    gradientTo: '#ea580c',
    pricing: '$79/M',
    keyFeatures: ['US/EU Suppliers', 'Private Label', 'POD Options'],
    features: {
      'Store Creation': false,
      'Product Research': false,
      'AI Tools': false,
      'Automation': true,
      'Data Intelligence': false,
      'Fulfillment': true,
      'Profit Tracking': false,
      'Video Ad Generator': false,
    },
    totalScore: 280,
  },
  {
    id: 'cj-dropshipping',
    name: 'CJ Dropshipping',
    role: 'Fulfillment Service',
    color: 'hsl(var(--chart-3))',
    gradientFrom: '#06b6d4',
    gradientTo: '#0891b2',
    pricing: '$29/M',
    keyFeatures: ['Warehousing', 'Photo/Video', 'COD Payments'],
    features: {
      'Store Creation': false,
      'Product Research': false,
      'AI Tools': false,
      'Automation': true,
      'Data Intelligence': false,
      'Fulfillment': true,
      'Profit Tracking': false,
      'Video Ad Generator': false,
    },
    totalScore: 265,
  },
  {
    id: 'tradelle',
    name: 'Tradelle',
    role: 'Fulfillment Service',
    color: 'hsl(var(--chart-4))',
    gradientFrom: '#10b981',
    gradientTo: '#059669',
    pricing: '$49/M',
    keyFeatures: ['Trending Products', 'Photo/Video', 'Supplier Chat'],
    features: {
      'Store Creation': false,
      'Product Research': false,
      'AI Tools': false,
      'Automation': true,
      'Data Intelligence': false,
      'Fulfillment': true,
      'Profit Tracking': false,
      'Video Ad Generator': false,
    },
    totalScore: 250,
  },
  {
    id: 'spocket',
    name: 'Spocket',
    role: 'Product Sourcing',
    color: 'hsl(var(--chart-5))',
    gradientFrom: '#3b82f6',
    gradientTo: '#2563eb',
    pricing: '$39/M',
    keyFeatures: ['Local Suppliers', 'Dropship Academy'],
    features: {
      'Store Creation': false,
      'Product Research': true,
      'AI Tools': false,
      'Automation': false,
      'Data Intelligence': false,
      'Fulfillment': true,
      'Profit Tracking': false,
      'Video Ad Generator': false,
    },
    totalScore: 240,
  },
];

// Colors for each competitor (single color per bar)
export const COMPETITOR_COLORS: Record<string, string> = {
  'usdrop-ai': 'hsl(var(--primary))',
  'zendrop': 'hsl(var(--chart-2))',
  'cj-dropshipping': 'hsl(var(--chart-3))',
  'tradelle': 'hsl(var(--chart-4))',
  'spocket': 'hsl(var(--chart-5))',
};

// Total ecosystem efficiency scores
export const TOTAL_ECOSYSTEM_SCORE = [
  {
    name: 'USDrop AI',
    value: 94,
  },
  {
    name: 'Zendrop',
    value: 56,
  },
  {
    name: 'CJ Dropshipping',
    value: 53,
  },
  {
    name: 'Tradelle',
    value: 50,
  },
  {
    name: 'Spocket',
    value: 48,
  },
];
