export interface JourneyTask {
  id: string;
  taskNo: number;
  title: string;
  link?: string;
}

export interface JourneyStage {
  id: string;
  number: number;
  title: string;
  phase: string;
  tasks: JourneyTask[];
}

export const journeyStages: JourneyStage[] = [
  {
    id: "stage-1",
    number: 1,
    title: "Onboarding & Setup",
    phase: "Getting Started",
    tasks: [
      { id: "t-1", taskNo: 1, title: "Onboarding Email Sent & Confirmed" },
      { id: "t-2", taskNo: 2, title: "Contract Signed & Confirmed" },
      { id: "t-3", taskNo: 3, title: "Point of Contact (POC) Assigned & Introduction Done" },
      { id: "t-4", taskNo: 4, title: "Access to Mentorship Resources & Tools Granted" },
      { id: "t-5", taskNo: 5, title: "Framework Assigned & Training Completed", link: "/mentorship" },
      { id: "t-6", taskNo: 6, title: "Mentorship Process & Attendance Brief Done" },
    ],
  },
  {
    id: "stage-2",
    number: 2,
    title: "Learning & Training",
    phase: "Training",
    tasks: [
      { id: "t-7", taskNo: 7, title: "Shopify Store Setup Training", link: "/mentorship" },
      { id: "t-8", taskNo: 8, title: "Meta Advertising Fundamentals Training", link: "/mentorship" },
      { id: "t-9", taskNo: 9, title: "Facebook Ad Library Review & Analysis" },
      { id: "t-10", taskNo: 10, title: "Product Research Tools Training (Minea & Niche Scraper)" },
      { id: "t-11", taskNo: 11, title: "Winning Product Selection Methods", link: "/products/winning-products" },
      { id: "t-12", taskNo: 12, title: "Competitor Store Analysis Practice", link: "/products/competitor-stores" },
    ],
  },
  {
    id: "stage-3",
    number: 3,
    title: "Research & Branding",
    phase: "Research",
    tasks: [
      { id: "t-13", taskNo: 13, title: "Finalize Brand Name & Domain" },
      { id: "t-14", taskNo: 14, title: "Create Brand Logo & Social Media Assets", link: "/ai-studio/whitelabelling" },
      { id: "t-15", taskNo: 15, title: "Hunt 100 Profitable Products", link: "/products/winning-products" },
      { id: "t-16", taskNo: 16, title: "Create 5 Product Listings & 5 Collections", link: "/framework/my-products" },
      { id: "t-17", taskNo: 17, title: "Design Store Banner & Homepage Layout" },
      { id: "t-18", taskNo: 18, title: "Receive 20 Curated Products from Mentor" },
    ],
  },
  {
    id: "stage-4",
    number: 4,
    title: "Store Build & Launch",
    phase: "Store Setup",
    tasks: [
      { id: "t-19", taskNo: 19, title: "Create Shopify Account & Configure Settings", link: "/framework/my-store" },
      { id: "t-20", taskNo: 20, title: "Set Up Store Policies (Privacy, Refund, Terms)" },
      { id: "t-21", taskNo: 21, title: "Upload 100+ Products to Your Store", link: "/framework/my-products" },
      { id: "t-22", taskNo: 22, title: "Create Facebook & Instagram Business Pages" },
      { id: "t-23", taskNo: 23, title: "Update USA Address & Shipping Settings" },
      { id: "t-24", taskNo: 24, title: "Final Store Review (Header, Footer, Checkout)" },
    ],
  },
  {
    id: "stage-5",
    number: 5,
    title: "Ads Foundation & Setup",
    phase: "Meta Ads",
    tasks: [
      { id: "t-25", taskNo: 25, title: "Plan First 30-Day Ad Budget & Strategy" },
      { id: "t-26", taskNo: 26, title: "Define Target Audience (Age, Gender, Interests)" },
      { id: "t-27", taskNo: 27, title: "Create Meta Business Account & Ad Manager" },
      { id: "t-28", taskNo: 28, title: "Connect Facebook Pixel & Google Analytics" },
      { id: "t-29", taskNo: 29, title: "Set Up Conversion Events (Add to Cart, Checkout)" },
      { id: "t-30", taskNo: 30, title: "Create First Ad Creatives (1 Video + 5 Images)" },
    ],
  },
  {
    id: "stage-6",
    number: 6,
    title: "Campaign Launch",
    phase: "Meta Ads",
    tasks: [
      { id: "t-31", taskNo: 31, title: "Run Practice Campaigns (C1, C2, C3)" },
      { id: "t-32", taskNo: 32, title: "Learn & Create First ABO Campaign" },
      { id: "t-33", taskNo: 33, title: "Build 4 Ad Audiences in Meta Ads", link: "/ads/meta-ads" },
      { id: "t-34", taskNo: 34, title: "Launch First Live Meta Ads Campaign", link: "/ads/meta-ads" },
      { id: "t-35", taskNo: 35, title: "Track Key Metrics (ROAS, CTR, CPC)" },
      { id: "t-36", taskNo: 36, title: "Document SOPs for Ads Control & Budget" },
    ],
  },
  {
    id: "stage-7",
    number: 7,
    title: "Ads Testing & Optimization",
    phase: "Optimization",
    tasks: [
      { id: "t-37", taskNo: 37, title: "24hr & 48hr Ads Performance Review" },
      { id: "t-38", taskNo: 38, title: "7-Day & 15-Day Testing Cycles" },
      { id: "t-39", taskNo: 39, title: "Creative A/B Testing & Iteration" },
      { id: "t-40", taskNo: 40, title: "Launch CBO Campaigns" },
      { id: "t-41", taskNo: 41, title: "Build Custom & Lookalike Audiences" },
      { id: "t-42", taskNo: 42, title: "Implement Budget Scaling Strategy" },
    ],
  },
  {
    id: "stage-8",
    number: 8,
    title: "Growth & Scaling",
    phase: "Scaling",
    tasks: [
      { id: "t-43", taskNo: 43, title: "Heatmaps Analysis & Store CRO", link: "/tools/cro-checklist" },
      { id: "t-44", taskNo: 44, title: "Advanced Retargeting Campaigns" },
      { id: "t-45", taskNo: 45, title: "Explore White Label Opportunities" },
      { id: "t-46", taskNo: 46, title: "Explore Private Label Opportunities" },
      { id: "t-47", taskNo: 47, title: "Set Up Continuous Testing & Learning Plan" },
      { id: "t-48", taskNo: 48, title: "Graduation & Next Steps Review" },
    ],
  },
];
