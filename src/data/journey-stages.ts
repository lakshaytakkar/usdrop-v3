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
  callout?: string;
}

export const journeyStages: JourneyStage[] = [
  {
    id: "stage-1",
    number: 1,
    title: "Onboarding + Connection",
    phase: "Onboarding",
    tasks: [
      { id: "t-1", taskNo: 1, title: "Onboarding Email Sent & Confirmed" },
      { id: "t-2", taskNo: 2, title: "Contract Sent & Confirmed" },
      { id: "t-3", taskNo: 3, title: "Point of Contact (POC) Assigned & Introduction Done" },
      { id: "t-4", taskNo: 4, title: "Mentee Experience & Knowledge Discussion" },
      { id: "t-5", taskNo: 5, title: "Access to Mentorship Resources" },
      { id: "t-6", taskNo: 6, title: "Mentorship Meaning & Process Brief" },
      { id: "t-7", taskNo: 7, title: "Attendance Process Training" },
      { id: "t-8", taskNo: 8, title: "Framework Assigned & Training" },
      { id: "t-9", taskNo: 9, title: "Tools Login Sent & Confirmed" },
      { id: "t-10", taskNo: 10, title: "Tools Granted" },
    ],
    callout: "CALL WITH YOUR MR.SUPRANS",
  },
  {
    id: "stage-2",
    number: 2,
    title: "Learning & Training Start",
    phase: "Training",
    tasks: [
      { id: "t-11", taskNo: 11, title: "Framework Training Completed", link: "/mentorship" },
      { id: "t-12", taskNo: 12, title: "Shopify Training Videos", link: "/mentorship" },
      { id: "t-13", taskNo: 13, title: "Basic Meta Advertising Training", link: "/mentorship" },
      { id: "t-14", taskNo: 14, title: "Review Facebook Ad Library" },
      { id: "t-15", taskNo: 15, title: "Minea Tools Research Training" },
      { id: "t-16", taskNo: 16, title: "Check Tools Niche Scraper" },
      { id: "t-17", taskNo: 17, title: "Meta Ads - Meeting 1" },
      { id: "t-18", taskNo: 18, title: "Meta Ads - Meeting 2" },
      { id: "t-19", taskNo: 19, title: "Meta Ads - Meeting 3" },
      { id: "t-20", taskNo: 20, title: "Meta Ads - Meeting 4" },
      { id: "t-21", taskNo: 21, title: "Meta Ads - Meeting 5" },
    ],
    callout: "CALL WITH YOUR MR.SUPRANS",
  },
  {
    id: "stage-3",
    number: 3,
    title: "Research",
    phase: "Research",
    tasks: [
      { id: "t-22", taskNo: 22, title: "Conduct research with Niche Scraper Tool" },
      { id: "t-23", taskNo: 23, title: "Conduct research with Minea Tool" },
      { id: "t-24", taskNo: 24, title: "Finalize your brand name" },
      { id: "t-25", taskNo: 25, title: "Finalize your brand logo", link: "/studio/whitelabelling" },
      { id: "t-26", taskNo: 26, title: "Finalize your domain name" },
      { id: "t-27", taskNo: 27, title: "Hunt 100 profitable products by mentee", link: "/winning-products" },
      { id: "t-28", taskNo: 28, title: "Create your store banner" },
      { id: "t-29", taskNo: 29, title: "Create your social media logo" },
      { id: "t-30", taskNo: 30, title: "Create 5 products by yourself", link: "/my-products" },
      { id: "t-31", taskNo: 31, title: "Create 5 collections by yourself", link: "/my-products" },
      { id: "t-32", taskNo: 32, title: "20 profitable products by mentor" },
    ],
  },
  {
    id: "stage-4",
    number: 4,
    title: "Products, Category, Shopify, Legal",
    phase: "Store Setup",
    tasks: [
      { id: "t-33", taskNo: 33, title: "Create Your Shopify Account", link: "/my-store" },
      { id: "t-34", taskNo: 34, title: "Get Ready Your Store Policy Pages" },
      { id: "t-35", taskNo: 35, title: "Upload 100+ Products to your Website", link: "/my-products" },
      { id: "t-36", taskNo: 36, title: "Create Facebook Page" },
      { id: "t-37", taskNo: 37, title: "Create Instagram Page" },
      { id: "t-38", taskNo: 38, title: "Update your USA Address in Shopify" },
    ],
  },
  {
    id: "stage-5",
    number: 5,
    title: "CRO Checkpoint | Budget & Time Buffers",
    phase: "Meta Ads",
    tasks: [
      { id: "t-39", taskNo: 39, title: "First 30 Days Budget Plan for Meta Ads" },
      { id: "t-40", taskNo: 40, title: "First 15 Days Meta Ads Strategy" },
      { id: "t-41", taskNo: 41, title: "Testing Periods: 7 Days, 15 Days, 30 Days" },
      { id: "t-42", taskNo: 42, title: "Plan Age Group" },
      { id: "t-43", taskNo: 43, title: "Plan Gender" },
      { id: "t-44", taskNo: 44, title: "Prepare Your Final Store Landing Page" },
      { id: "t-45", taskNo: 45, title: "Prepare Your Final Store Collection Page" },
      { id: "t-46", taskNo: 46, title: "Prepare Your Final Store Product Page" },
      { id: "t-47", taskNo: 47, title: "Prepare Your Final Store Checkout Page" },
      { id: "t-48", taskNo: 48, title: "Prepare Your Store Policy Pages" },
      { id: "t-49", taskNo: 49, title: "Prepare Your Store Header" },
      { id: "t-50", taskNo: 50, title: "Prepare Your Store Footer" },
    ],
  },
  {
    id: "stage-6",
    number: 6,
    title: "Setup Meta Account",
    phase: "Meta Ads",
    tasks: [
      { id: "t-51", taskNo: 51, title: "Create Meta account" },
      { id: "t-52", taskNo: 52, title: "Connect Google Analytics (by yourself)" },
      { id: "t-53", taskNo: 53, title: "Connect Facebook Pixel (by yourself)" },
      { id: "t-54", taskNo: 54, title: "Set up conversion events - Checkout" },
    ],
  },
  {
    id: "stage-7",
    number: 7,
    title: "Setup Campaign | Audience",
    phase: "Meta Ads",
    tasks: [
      { id: "t-55", taskNo: 55, title: "Start Dummy C1, C2, C3 campaigns" },
      { id: "t-56", taskNo: 56, title: "Learn ABO steps" },
      { id: "t-57", taskNo: 57, title: "Create the first ABO campaign" },
      { id: "t-58", taskNo: 58, title: "Create 4 audiences in Meta Ads", link: "/meta-ads" },
      { id: "t-59", taskNo: 59, title: "Create 1 video creative" },
      { id: "t-60", taskNo: 60, title: "Create 5 image creatives" },
    ],
  },
  {
    id: "stage-8",
    number: 8,
    title: "Start First Meta Ads",
    phase: "Meta Ads",
    tasks: [
      { id: "t-61", taskNo: 61, title: "Start your first Meta Ads campaign", link: "/meta-ads" },
      { id: "t-62", taskNo: 62, title: "Test your Meta Ads metrics (ROAS, CTR)" },
      { id: "t-63", taskNo: 63, title: "SOP for Meta Ads control" },
      { id: "t-64", taskNo: 64, title: "SOP for Meta Ads budget scaling" },
      { id: "t-65", taskNo: 65, title: "SOP for Meta Ads metrics" },
      { id: "t-66", taskNo: 66, title: "SOP for persona of buyer" },
    ],
  },
  {
    id: "stage-9",
    number: 9,
    title: "Meta Ads 24Hrs & 48Hrs Testing",
    phase: "Meta Ads",
    tasks: [
      { id: "t-67", taskNo: 67, title: "Test Your Meta Ads Matrix (ROAS, CTR)" },
      { id: "t-68", taskNo: 68, title: "Working on ABO" },
    ],
  },
  {
    id: "stage-10",
    number: 10,
    title: "Meta Ads 7 Days | 15 Days Custom Audience",
    phase: "Meta Ads",
    tasks: [
      { id: "t-69", taskNo: 69, title: "Working on C1+C2+C3+C4+C5" },
      { id: "t-70", taskNo: 70, title: "Working on Creative Testing" },
    ],
  },
  {
    id: "stage-11",
    number: 11,
    title: "Meta Ads Advanced",
    phase: "Meta Ads",
    tasks: [
      { id: "t-71", taskNo: 71, title: "Heatmaps in Meta Ads" },
      { id: "t-72", taskNo: 72, title: "CBO campaign" },
      { id: "t-73", taskNo: 73, title: "Custom audience" },
      { id: "t-74", taskNo: 74, title: "Lookalike audience" },
    ],
  },
  {
    id: "stage-12",
    number: 12,
    title: "Future Scope & Closing",
    phase: "Future Scope",
    tasks: [
      { id: "t-75", taskNo: 75, title: "Never stop regular testing" },
      { id: "t-76", taskNo: 76, title: "Never stop regular learning" },
      { id: "t-77", taskNo: 77, title: "Never stop regular ads practice" },
      { id: "t-78", taskNo: 78, title: "Next stage: White label" },
      { id: "t-79", taskNo: 79, title: "Next stage: Private label" },
    ],
  },
];
