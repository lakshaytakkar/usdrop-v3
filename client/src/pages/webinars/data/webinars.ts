export interface Webinar {
  id: string
  title: string
  description: string
  url: string
  date: Date
  duration: string
  isUpcoming: boolean
}

const mentorAttribution = ": by Mr. Suprans (Dropshipping Expert - 14 years experience as the Mentor in the webinar)"

export const sampleWebinars: Webinar[] = [
  // Foundation & Onboarding (January 2025)
  {
    id: "webinar-001",
    title: `Onboarding Process and Framework Flow Training${mentorAttribution}`,
    description: "Master the complete onboarding process and framework flow for dropshipping success. ✅ Learn the foundational structure and workflow methodology. ✅ Understand essential concepts and best practices. ✅ Discover proven strategies for getting started. ✅ Get expert guidance on implementation and execution.",
    url: "https://drive.google.com/file/d/1W2FCbId6yjCD2y0N2aDn25dasmP8mxJ1/view?usp=drive_link",
    date: new Date(2025, 0, 5, 10, 0), // January 5, 2025, 10:00 AM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-002",
    title: `USA Dropshipping Foundation: Part 02${mentorAttribution}`,
    description: "Deep dive into the fundamentals of USA dropshipping with Part 2 of our comprehensive foundation series. ✅ Master essential concepts and core strategies. ✅ Learn advanced implementation techniques. ✅ Understand market dynamics and opportunities. ✅ Build a solid foundation for your business.",
    url: "https://drive.google.com/file/d/1UIhtfvNebnIolKdHOGlsa56_20oAr2k-/view?usp=drive_link",
    date: new Date(2025, 0, 8, 14, 0), // January 8, 2025, 2:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-003",
    title: `USA Dropshipping Foundation: Part 03${mentorAttribution}`,
    description: "Continue building your USA dropshipping foundation with Part 3 of our comprehensive series. ✅ Explore advanced concepts and methodologies. ✅ Learn practical implementation strategies. ✅ Master critical business operations. ✅ Develop scalable growth frameworks.",
    url: "https://drive.google.com/file/d/1URhfv8Klx95DaLlSuQByvVsTn_vAKJzN/view?usp=drive_link",
    date: new Date(2025, 0, 10, 15, 0), // January 10, 2025, 3:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-004",
    title: `USA Dropshipping Foundation: Part 04${mentorAttribution}`,
    description: "Part 4 of the foundation series covering critical aspects of USA dropshipping business development. ✅ Learn essential setup and configuration strategies. ✅ Master scaling techniques and growth frameworks. ✅ Understand operational best practices. ✅ Discover advanced optimization methods.",
    url: "https://drive.google.com/file/d/1UT1B5-Oi8paBXUvXgKMWiFPIgVCYRMwz/view?usp=drive_link",
    date: new Date(2025, 0, 12, 11, 0), // January 12, 2025, 11:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-005",
    title: `USA Dropshipping Foundation: Part 05${mentorAttribution}`,
    description: "Complete your understanding of USA dropshipping fundamentals with the final part of our foundation series. ✅ Master all core concepts and principles. ✅ Prepare for advanced topics and strategies. ✅ Build a comprehensive knowledge base. ✅ Develop actionable implementation plans.",
    url: "https://drive.google.com/file/d/1UX5nrKDl2sQ48UBIEXUmzk44BTr_YrJ8/view?usp=drive_link",
    date: new Date(2025, 0, 15, 14, 0), // January 15, 2025, 2:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-006",
    title: `USA Dropshipping: Complete Agenda and Startup Approach${mentorAttribution}`,
    description: "Learn the complete agenda and step-by-step approach to launching your USA dropshipping business successfully. ✅ Understand the complete startup roadmap. ✅ Master the step-by-step implementation process. ✅ Learn proven strategies for early success. ✅ Get expert guidance on avoiding common pitfalls.",
    url: "https://drive.google.com/file/d/1kVn5cqjZ4-IOFuVIsYerzcStlt7-vRh5/view?usp=drive_link",
    date: new Date(2025, 0, 18, 10, 0), // January 18, 2025, 10:00 AM
    duration: "60 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-007",
    title: `USA Dropshipping: Market Overview and Motivation${mentorAttribution}`,
    description: "Get motivated and understand the vast opportunities in USA dropshipping with this comprehensive market overview. ✅ Discover what makes the USA market unique. ✅ Learn how to position yourself for success. ✅ Understand market dynamics and trends. ✅ Get inspired by real success stories.",
    url: "https://drive.google.com/file/d/1Qx7YosjxGnJj8AvUHMJiMoWrwu6yJnkt/view?usp=drive_link",
    date: new Date(2025, 0, 20, 16, 0), // January 20, 2025, 4:00 PM
    duration: "60 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-008",
    title: `USA Dropshipping: Investment Requirements and LLC Formation${mentorAttribution}`,
    description: "Essential guide to investment requirements and LLC formation for your USA dropshipping business. ✅ Understand investment requirements and budget planning. ✅ Learn LLC formation processes and legal structures. ✅ Master financial planning and management. ✅ Discover tax optimization strategies.",
    url: "https://drive.google.com/file/d/1aK2uqj64xRPaeN1QymNpP55_QBk86_CV/view?usp=drive_link",
    date: new Date(2025, 0, 22, 13, 0), // January 22, 2025, 1:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-009",
    title: `Dropshipping Mentorship: Strategies of the Top 0.01%${mentorAttribution}`,
    description: "Exclusive mentorship session revealing the strategies that separate the top 0.01% of dropshippers from the rest. ✅ Learn advanced insights and elite tactics. ✅ Discover what top performers do differently. ✅ Master high-level optimization strategies. ✅ Get personalized guidance for exceptional results.",
    url: "https://drive.google.com/file/d/1P-KncuomziF5iKeu-HPXP2OlrQ2NrxQI/view?usp=drive_link",
    date: new Date(2025, 0, 25, 15, 0), // January 25, 2025, 3:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-010",
    title: `Mentorship Framework: Learning from Top 30 Clients${mentorAttribution}`,
    description: "Learn the proven frameworks used by the top 30 clients in our mentorship program. ✅ Discover real-world strategies that drive exceptional results. ✅ Understand frameworks used by successful dropshippers. ✅ Learn from actual case studies and examples. ✅ Apply proven methodologies to your business.",
    url: "https://drive.google.com/file/d/1kVn5cqjZ4-IOFuVIsYerzcStlt7-vRh5/view?usp=sharing",
    date: new Date(2025, 0, 28, 11, 0), // January 28, 2025, 11:00 AM
    duration: "90 minutes",
    isUpcoming: false,
  },

  // Product Research & Selection (February 2025)
  {
    id: "webinar-011",
    title: `Product Research: Trend Analysis and Selling Tools${mentorAttribution}`,
    description: "Master the tools and techniques for identifying trending products that sell in today's market. ✅ Learn how to spot opportunities before they become saturated. ✅ Master trend analysis and market research tools. ✅ Discover proven methods for product validation. ✅ Understand timing and market entry strategies.",
    url: "https://drive.google.com/file/d/1aXGfmbBGpdacOzdbrUinPshUzipUWY-6/view?usp=sharing",
    date: new Date(2025, 1, 2, 14, 0), // February 2, 2025, 2:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-012",
    title: `Research Tools: Minea and Niche Category Selection${mentorAttribution}`,
    description: "Deep dive into Minea and other advanced research tools for profitable niche selection. ✅ Master Minea and other research platforms. ✅ Learn effective niche category selection strategies. ✅ Understand market analysis and validation techniques. ✅ Discover profitable niche identification methods.",
    url: "https://drive.google.com/file/d/1b5Ddw-YAohXLu_Qz6v6nVJ0ZCpK9Hmsb/view?usp=sharing",
    date: new Date(2025, 1, 5, 10, 0), // February 5, 2025, 10:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-013",
    title: `Product Selection Mastery: Part 01${mentorAttribution}`,
    description: "Begin your product selection journey with Part 1 of our comprehensive series. ✅ Learn the fundamentals of choosing winning products. ✅ Understand product validation criteria. ✅ Master basic selection methodologies. ✅ Discover essential tools and resources.",
    url: "https://drive.google.com/file/d/1f3mEWrmFJDba7aCP1u-zOk3f6Smbuq4F/view?usp=drive_link",
    date: new Date(2025, 1, 8, 15, 0), // February 8, 2025, 3:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-014",
    title: `Product Selection Mastery: Part 02${mentorAttribution}`,
    description: "Continue with Part 2 of product selection covering advanced strategies and techniques. ✅ Master advanced product identification methods. ✅ Learn comprehensive validation strategies. ✅ Understand market demand analysis. ✅ Discover competitive positioning techniques.",
    url: "https://drive.google.com/file/d/1f3pRj_tIfiM5t4R_EntjIWmDDMBWl4Px/view?usp=drive_link",
    date: new Date(2025, 1, 10, 11, 0), // February 10, 2025, 11:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-015",
    title: `Product Selection Mastery: Part 03${mentorAttribution}`,
    description: "Part 3 covers advanced product selection techniques and market analysis. ✅ Master market demand analysis methods. ✅ Learn effective competition evaluation. ✅ Understand pricing and profitability analysis. ✅ Discover advanced selection criteria.",
    url: "https://drive.google.com/file/d/1hgk_BvLr6lKWDQNNRU-9H_WOnJ-kXQQY/view?usp=drive_link",
    date: new Date(2025, 1, 12, 14, 0), // February 12, 2025, 2:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-016",
    title: `Product Selection Mastery: Part 04 (Section A)${mentorAttribution}`,
    description: "Part 4A of the product selection series with detailed analysis and case studies. ✅ Learn from real-world successful product selections. ✅ Understand detailed analysis methodologies. ✅ Master case study evaluation techniques. ✅ Discover proven selection frameworks.",
    url: "https://drive.google.com/file/d/1fhEhmQwx4b1Noia6t31M0YoPvYtFqayj/view?usp=drive_link",
    date: new Date(2025, 1, 15, 16, 0), // February 15, 2025, 4:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-017",
    title: `Product Selection Mastery: Part 05 (Section B)${mentorAttribution}`,
    description: "Part 5B continues with advanced product selection strategies and scaling techniques. ✅ Learn to scale your product research process. ✅ Master advanced selection strategies. ✅ Understand portfolio building techniques. ✅ Discover systematic research methodologies.",
    url: "https://drive.google.com/file/d/188YRid9B73Pgr-qFSkGJ10YM2_bkfLY5/view?usp=drive_link",
    date: new Date(2025, 1, 18, 10, 0), // February 18, 2025, 10:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-018",
    title: `Product Selection Mastery: Part 06 - Advanced Tools${mentorAttribution}`,
    description: "Part 6 introduces new tools and updated methodologies for modern product selection. ✅ Master the latest research tools and platforms. ✅ Learn updated selection methodologies. ✅ Stay ahead with cutting-edge techniques. ✅ Discover innovative research approaches.",
    url: "https://drive.google.com/file/d/1NlA1gXmXiTbvhl0rr_-TI52l-OJHBaQG/view?usp=drive_link",
    date: new Date(2025, 1, 20, 13, 0), // February 20, 2025, 1:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-019",
    title: `Product Selection Mastery: Part 07${mentorAttribution}`,
    description: "Part 7 of the product selection series with advanced case studies and real-world applications. ✅ Learn from advanced case studies. ✅ Understand real-world application strategies. ✅ Master complex selection scenarios. ✅ Discover expert-level techniques.",
    url: "https://drive.google.com/file/d/1sfUfzNO8woLOtPS11TOJT5z_D9-6fdJ4/view?usp=drive_link",
    date: new Date(2025, 1, 22, 15, 0), // February 22, 2025, 3:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-020",
    title: `Product Selection Mastery: Part 08${mentorAttribution}`,
    description: "Final part of the product selection series covering portfolio building and optimization. ✅ Master the complete product selection process. ✅ Learn to build a winning product portfolio. ✅ Understand portfolio optimization strategies. ✅ Discover long-term selection frameworks.",
    url: "https://drive.google.com/file/d/199BgSabiqM2FbjmI_CzlZ1y4blNPoXit/view?usp=drive_link",
    date: new Date(2025, 1, 25, 11, 0), // February 25, 2025, 11:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-021",
    title: `Mentorship Session: Advanced Product Research${mentorAttribution}`,
    description: "Exclusive mentorship session focused on advanced product research methodologies. ✅ Get personalized guidance on finding winning products. ✅ Learn advanced validation techniques. ✅ Master expert-level research strategies. ✅ Receive tailored recommendations for your business.",
    url: "https://drive.google.com/file/d/19L5RgrmPY6Nx1bfYsKp9o4CHJk4yZZv9/view?usp=drive_link",
    date: new Date(2025, 1, 28, 14, 0), // February 28, 2025, 2:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-022",
    title: `Product Research Methodology: Part 01${mentorAttribution}`,
    description: "Comprehensive product research methodology Part 1 covering systematic approaches. ✅ Learn systematic approaches to product discovery. ✅ Master research methodology fundamentals. ✅ Understand data analysis techniques. ✅ Discover profitable product identification methods.",
    url: "https://drive.google.com/file/d/12e0g798OyfbY2Iohe7r1Ek0KZTutLytU/view?usp=drive_link",
    date: new Date(2025, 1, 28, 16, 0), // February 28, 2025, 4:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },

  // Sourcing & Suppliers (March 2025)
  {
    id: "webinar-023",
    title: `Product Sourcing for USA Dropshipping: Complete Guide${mentorAttribution}`,
    description: "Complete guide to sourcing products for your USA dropshipping business. ✅ Learn how to find reliable suppliers and partners. ✅ Master negotiation techniques for better terms. ✅ Understand supplier evaluation criteria. ✅ Discover sourcing best practices and strategies.",
    url: "https://drive.google.com/file/d/1Aol_1py7Bk8Cd1iiTq0xVnKH2gjBpBVV/view?usp=drive_link",
    date: new Date(2025, 2, 3, 10, 0), // March 3, 2025, 10:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-024",
    title: `USA Local Suppliers and Marketplace Integration${mentorAttribution}`,
    description: "Discover USA local suppliers and marketplaces for faster shipping and superior quality. ✅ Learn how to leverage domestic suppliers effectively. ✅ Understand marketplace integration strategies. ✅ Master faster shipping and quality advantages. ✅ Discover local supplier networks and platforms.",
    url: "https://drive.google.com/file/d/1zk7yuCHHI0kYlectp4hgNWjvNRiRkUdO/view?usp=sharing",
    date: new Date(2025, 2, 5, 14, 0), // March 5, 2025, 2:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-025",
    title: `AI-Powered Supplier Sourcing and Automation${mentorAttribution}`,
    description: "Learn how to use AI tools for efficient supplier sourcing and evaluation. ✅ Master AI-powered supplier discovery methods. ✅ Learn automated evaluation and assessment techniques. ✅ Discover efficient sourcing workflows. ✅ Understand AI tool integration strategies.",
    url: "https://drive.google.com/file/d/1h2mt7Cat-2QVWw7dvOzFHfD0QZFNBPoG/view?usp=sharing",
    date: new Date(2025, 2, 8, 11, 0), // March 8, 2025, 11:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-026",
    title: `Chinese Supplier Options for Dropshipping${mentorAttribution}`,
    description: "Explore Chinese supplier options and learn when to use them effectively. ✅ Understand when Chinese suppliers are the right choice. ✅ Learn effective integration strategies. ✅ Master cost-benefit analysis. ✅ Discover quality control and communication methods.",
    url: "https://drive.google.com/file/d/13sYa-JQmnyUl9ifweHqZrL75YvB2yVoF/view?usp=drive_link",
    date: new Date(2025, 2, 10, 15, 0), // March 10, 2025, 3:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-027",
    title: `Chinese Dropshipping Sourcing and Private Warehouse Operations${mentorAttribution}`,
    description: "Deep dive into Chinese dropshipping sourcing and private warehouse management. ✅ Master advanced sourcing strategies from China. ✅ Learn private warehouse operations and management. ✅ Understand logistics and fulfillment processes. ✅ Discover cost optimization techniques.",
    url: "https://drive.google.com/file/d/1TzJ8pLx57y3_s7Vns-YF3SWVHnNJiIJv/view?usp=drive_link",
    date: new Date(2025, 2, 12, 13, 0), // March 12, 2025, 1:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-028",
    title: `1688 Platform Sourcing for USA Dropshipping${mentorAttribution}`,
    description: "Master the 1688 platform for sourcing products for your USA dropshipping business. ✅ Learn the right way to source from 1688. ✅ Master platform navigation and search techniques. ✅ Understand pricing and negotiation on 1688. ✅ Discover quality verification methods.",
    url: "https://drive.google.com/file/d/1UEL3yzQa3txz81Uqi4nPlRAUnsJCVKNv/view?usp=drive_link",
    date: new Date(2025, 2, 15, 10, 0), // March 15, 2025, 10:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-029",
    title: `Product Sourcing and Meta Ads Integration${mentorAttribution}`,
    description: "Combine product sourcing strategies with Meta Ads for maximum conversion potential. ✅ Learn to source products that convert well with Facebook ads. ✅ Understand the connection between sourcing and advertising. ✅ Master product-ad alignment strategies. ✅ Discover high-converting product selection methods.",
    url: "https://drive.google.com/file/d/1UdWtytsepQ6s6O1DDhQKphiSEmjjRqEg/view?usp=drive_link",
    date: new Date(2025, 2, 18, 14, 0), // March 18, 2025, 2:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-030",
    title: `UTU Ecosystem: Product Sourcing for USA Dropshipping${mentorAttribution}`,
    description: "Learn about the UTU ecosystem and integrated tools for efficient product sourcing. ✅ Discover the UTU ecosystem and its capabilities. ✅ Learn integrated tools and platform features. ✅ Master efficient sourcing workflows. ✅ Understand ecosystem optimization strategies.",
    url: "https://drive.google.com/file/d/1MKdMxXKhLS6jsKL0-PyK19IffVR5hXUY/view?usp=drive_link",
    date: new Date(2025, 2, 20, 16, 0), // March 20, 2025, 4:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-031",
    title: `CJ Dropshipping, Zen Drop, and Meta Ads Integration${mentorAttribution}`,
    description: "Complete guide to integrating CJ Dropshipping and Zen Drop with Meta Ads for maximum efficiency. ✅ Master CJ Dropshipping and Zen Drop platforms. ✅ Learn seamless Meta Ads integration techniques. ✅ Understand platform synchronization strategies. ✅ Discover workflow optimization methods.",
    url: "https://drive.google.com/file/d/1piKAnO9VzzVqPA-rXS7u-EyXY0SmQqDK/view?usp=drive_link",
    date: new Date(2025, 2, 22, 11, 0), // March 22, 2025, 11:00 AM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-032",
    title: `Top 25 Products for USA Dropshipping: Part 01${mentorAttribution}`,
    description: "Discover the top 25 products currently performing best in USA dropshipping markets. ✅ Learn which products are dominating the market. ✅ Understand product performance metrics. ✅ Discover market trends and opportunities. ✅ Get insights into winning product characteristics.",
    url: "https://drive.google.com/file/d/1jwHOqyvtByJPLZZomHZ_No6a2XwqdUAz/view?usp=drive_link",
    date: new Date(2025, 2, 25, 15, 0), // March 25, 2025, 3:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-033",
    title: `Top 25 Products for USA Dropshipping: Part 02${mentorAttribution}`,
    description: "Continue with Part 2 of the top 25 products series with additional market insights. ✅ Discover more winning products and opportunities. ✅ Learn advanced market analysis techniques. ✅ Understand product lifecycle and trends. ✅ Get comprehensive market intelligence.",
    url: "https://drive.google.com/file/d/19MYc6qcDxH7gQ9I1U-Lw8fD1kfuq4Brj/view?usp=drive_link",
    date: new Date(2025, 2, 27, 13, 0), // March 27, 2025, 1:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-034",
    title: `Top 300 Selling Products: Comprehensive USA Dropshipping List${mentorAttribution}`,
    description: "Comprehensive analysis of the top 300 selling products in USA dropshipping markets. ✅ Access extensive product research and market data. ✅ Learn comprehensive market analysis techniques. ✅ Discover product categorization and trends. ✅ Understand market positioning strategies.",
    url: "https://drive.google.com/file/d/1U-ow3jwSyf6nYBkC-1c5U52j78e4R4-u/view?usp=drive_link",
    date: new Date(2025, 2, 28, 10, 0), // March 28, 2025, 10:00 AM
    duration: "90 minutes",
    isUpcoming: false,
  },

  // Meta Ads Series (April 2025)
  {
    id: "webinar-035",
    title: `Meta Ads Campaign Strategy: C1 & C2 Mastery${mentorAttribution}`,
    description: "Master Meta Ads Campaign 1 and Campaign 2 strategies for optimal performance. ✅ Learn the fundamentals of campaign setup and optimization. ✅ Understand campaign structure and best practices. ✅ Master Facebook ad campaign fundamentals. ✅ Discover advanced optimization techniques.",
    url: "https://drive.google.com/file/d/1ScLTeCcDdXP1PYhAw-gE4fjVJSgENGQD/view?usp=sharing",
    date: new Date(2025, 3, 2, 14, 0), // April 2, 2025, 2:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-036",
    title: `Meta Ads Ad Set Testing: Systematic Approach${mentorAttribution}`,
    description: "Learn systematic approaches to testing Meta Ads ad sets for maximum performance. ✅ Master systematic ad set testing methodologies. ✅ Learn how to identify winning ad sets effectively. ✅ Understand scaling techniques for successful campaigns. ✅ Discover data-driven optimization strategies.",
    url: "https://drive.google.com/file/d/1zab7M3c-5eDtht1_2mKcxn79y4Knmn3i/view?usp=drive_link",
    date: new Date(2025, 3, 5, 11, 0), // April 5, 2025, 11:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-037",
    title: `Meta Ads Research Framework: Mentorship Session${mentorAttribution}`,
    description: "Exclusive mentorship session on Meta Ads research framework and advanced methodologies. ✅ Learn advanced research methods for winning campaigns. ✅ Master comprehensive ad research frameworks. ✅ Understand campaign planning and strategy development. ✅ Get personalized guidance on your campaigns.",
    url: "https://drive.google.com/file/d/1R2_8fppN1-PqI7g9ycfZ_YbNvDB_MwY1/view?usp=drive_link",
    date: new Date(2025, 3, 8, 15, 0), // April 8, 2025, 3:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-038",
    title: `Meta Ads: Control, Matrix Analysis, and Persona Targeting${mentorAttribution}`,
    description: "Master Meta Ads controlling, matrix analysis, and persona targeting for advanced optimization. ✅ Learn advanced control and management techniques. ✅ Master matrix analysis for campaign optimization. ✅ Understand persona targeting and audience segmentation. ✅ Discover performance optimization strategies.",
    url: "https://drive.google.com/file/d/1VhVU05PEa0BCyfY1F8yXXKxXxCvrdqjm/view?usp=sharing",
    date: new Date(2025, 3, 10, 13, 0), // April 10, 2025, 1:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-039",
    title: `Meta Ads ABO: Ad Set Budget Optimization${mentorAttribution}`,
    description: "Complete guide to Meta Ads ABO (Ad Set Budget Optimization) for better campaign performance. ✅ Master ABO setup and configuration. ✅ Learn effective budget allocation strategies. ✅ Understand ABO optimization techniques. ✅ Discover advanced ABO best practices.",
    url: "https://drive.google.com/file/d/1W3HrRQKXexCGx4glSAI5lKa8GSN5zsGC/view?usp=drive_link",
    date: new Date(2025, 3, 12, 10, 0), // April 12, 2025, 10:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-040",
    title: `Meta Ads Automation: Scaling Strategies${mentorAttribution}`,
    description: "Learn how to automate your Meta Ads campaigns for efficient scaling and growth. ✅ Master campaign automation tools and platforms. ✅ Learn scaling strategies with automation. ✅ Understand workflow optimization techniques. ✅ Discover advanced automation frameworks.",
    url: "https://drive.google.com/file/d/1WmtOJ-wjDSPIvWNjuoLZNtnuHjXEf0Ve/view?usp=drive_link",
    date: new Date(2025, 3, 15, 14, 0), // April 15, 2025, 2:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-041",
    title: `Meta Ads Automation: Foundation and Core Concepts${mentorAttribution}`,
    description: "Build your foundation in Meta Ads automation with core concepts and essential tools. ✅ Learn core automation concepts and principles. ✅ Master essential tools for automated management. ✅ Understand automation workflow fundamentals. ✅ Discover foundational automation strategies.",
    url: "https://drive.google.com/file/d/1WyF3KZK4k0StbPKLa7np5DQvtscSY330/view?usp=sharing",
    date: new Date(2025, 3, 18, 11, 0), // April 18, 2025, 11:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-042",
    title: `Meta Ads Mindset: Part 01 - Foundation${mentorAttribution}`,
    description: "Part 1 of the Meta Ads mindset series covering foundational mental frameworks. ✅ Develop the right mental framework for success. ✅ Understand psychological approaches to advertising. ✅ Learn strategic thinking for campaigns. ✅ Master mindset optimization techniques.",
    url: "https://drive.google.com/file/d/1iHfLOcyu3Vw8E-CmLCwbYPbUI8Q9OlXO/view?usp=drive_link",
    date: new Date(2025, 3, 20, 16, 0), // April 20, 2025, 4:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-043",
    title: `Meta Ads Mindset: Part 02 - Advanced Strategies${mentorAttribution}`,
    description: "Continue developing your Meta Ads mindset with Part 2 covering advanced psychological approaches. ✅ Master advanced psychological optimization techniques. ✅ Learn elite-level campaign thinking. ✅ Understand advanced mindset strategies. ✅ Discover expert-level mental frameworks.",
    url: "https://drive.google.com/file/d/1pndz7HT6vILZOwGxRxmPi5Rl4u2TUx-1/view?usp=drive_link",
    date: new Date(2025, 3, 22, 13, 0), // April 22, 2025, 1:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-044",
    title: `Meta Ads Testing: Timelines and Heat Map Introduction${mentorAttribution}`,
    description: "Part 3 covers testing timelines and introduces heat map analysis techniques. ✅ Master testing timelines and schedules. ✅ Learn when and how to test effectively. ✅ Understand heat map fundamentals and applications. ✅ Discover optimal testing strategies.",
    url: "https://drive.google.com/file/d/1FQoCFBmw1L_qH7RpjEN9Zvf5A68T59OR/view?usp=drive_link",
    date: new Date(2025, 3, 25, 10, 0), // April 25, 2025, 10:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-045",
    title: `Meta Ads Budget Planning: Part 01 - Fundamentals${mentorAttribution}`,
    description: "Part 4A of budget planning for Meta Ads covering fundamental allocation strategies. ✅ Learn effective budget allocation methods. ✅ Master budget management techniques. ✅ Understand budget optimization fundamentals. ✅ Discover strategic budget planning approaches.",
    url: "https://drive.google.com/file/d/1jNSTfzr_7d5kC-oJxW2UrtjGKqliMcBd/view?usp=drive_link",
    date: new Date(2025, 3, 27, 15, 0), // April 27, 2025, 3:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-046",
    title: `Meta Ads Budget Planning: Part 02 - Advanced Strategies${mentorAttribution}`,
    description: "Continue budget planning with Part 4B covering advanced strategies and scaling techniques. ✅ Master advanced budgeting strategies. ✅ Learn scaling techniques for campaigns. ✅ Understand budget optimization at scale. ✅ Discover elite-level budget management.",
    url: "https://drive.google.com/file/d/1dIN3mj55TCR72iqxr_2fvw-CkshgTDxZ/view?usp=drive_link",
    date: new Date(2025, 3, 28, 11, 0), // April 28, 2025, 11:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-047",
    title: `Meta Ads Mentorship: Personalized Campaign Guidance${mentorAttribution}`,
    description: "Exclusive mentorship session on Meta Ads with personalized campaign guidance and strategies. ✅ Get personalized guidance on your campaigns. ✅ Receive expert feedback and recommendations. ✅ Learn advanced strategies tailored to your business. ✅ Master campaign optimization with expert support.",
    url: "https://drive.google.com/file/d/1AgHgZEaEyMtuGsU4kPx8Pw8sTGB1P0-i/view?usp=drive_link",
    date: new Date(2025, 3, 30, 14, 0), // April 30, 2025, 2:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-048",
    title: `Meta Ads AI Warehouse: Part 06A - Introduction${mentorAttribution}`,
    description: "Part 6A introduces Meta Ads AI Warehouse and AI-powered optimization tools. ✅ Learn AI tools for warehouse management. ✅ Master AI-powered ad optimization techniques. ✅ Understand AI warehouse integration. ✅ Discover automated optimization workflows.",
    url: "https://drive.google.com/file/d/10rxCb_7z8AsNEVdqQnJBhAOWXccmeC2i/view?usp=drive_link",
    date: new Date(2025, 4, 2, 10, 0), // May 2, 2025, 10:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-049",
    title: `Meta Ads AI Warehouse: Part 06B - Advanced Applications${mentorAttribution}`,
    description: "Continue with Part 6B covering advanced AI applications for campaign management. ✅ Master advanced AI campaign management. ✅ Learn sophisticated optimization techniques. ✅ Understand AI-powered scaling strategies. ✅ Discover cutting-edge automation methods.",
    url: "https://drive.google.com/file/d/1LMFIJpep55E55dx9PZPuFOuk_nw9MwIo/view?usp=drive_link",
    date: new Date(2025, 4, 5, 14, 0), // May 5, 2025, 2:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-050",
    title: `Meta Ads AI Warehouse: Part 06C - Mastery${mentorAttribution}`,
    description: "Final part of Meta Ads AI Warehouse series completing your understanding of AI-powered advertising. ✅ Complete your AI advertising tool mastery. ✅ Understand comprehensive AI strategies. ✅ Master all AI-powered optimization techniques. ✅ Discover expert-level AI applications.",
    url: "https://drive.google.com/file/d/1hY2ynMxpGffbnDRLzQGq7cSISxDOHQoe/view?usp=drive_link",
    date: new Date(2025, 4, 8, 11, 0), // May 8, 2025, 11:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-051",
    title: `Meta Ads Heat Maps: Part 07A - Introduction${mentorAttribution}`,
    description: "Part 7A introduces Meta Ads heat maps for campaign performance visualization and analysis. ✅ Learn heat map fundamentals and applications. ✅ Master campaign performance visualization. ✅ Understand heat map analysis techniques. ✅ Discover performance optimization insights.",
    url: "https://drive.google.com/file/d/1t2NEWra0_ZgsrTW6frvD0XSL6Gb3WQFV/view?usp=drive_link",
    date: new Date(2025, 4, 10, 15, 0), // May 10, 2025, 3:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-052",
    title: `Meta Ads Heat Maps: Part 07B - Advanced Analysis${mentorAttribution}`,
    description: "Continue with Part 7B covering advanced heat map analysis and interpretation techniques. ✅ Master advanced heat map interpretation. ✅ Learn sophisticated analysis methodologies. ✅ Understand complex performance patterns. ✅ Discover expert-level optimization insights.",
    url: "https://drive.google.com/file/d/1IL-hY5QoswFfZupi8AD1OVSdVAHoKwzR/view?usp=drive_link",
    date: new Date(2025, 4, 12, 13, 0), // May 12, 2025, 1:00 PM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-053",
    title: `Meta Ads Heat Maps: Part 07C - Mastery${mentorAttribution}`,
    description: "Final part of Meta Ads heat maps series for comprehensive campaign optimization mastery. ✅ Master comprehensive heat map analysis. ✅ Learn complete optimization methodologies. ✅ Understand advanced performance optimization. ✅ Discover expert-level campaign strategies.",
    url: "https://drive.google.com/file/d/1LSWYplDZNn5vqCMROMRgP_0k77HcE5_G/view?usp=drive_link",
    date: new Date(2025, 4, 15, 10, 0), // May 15, 2025, 10:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },

  // Advanced Topics & Recent (May-June 2025)
  {
    id: "webinar-054",
    title: `Conversion Rate Optimization: Mentorship Session${mentorAttribution}`,
    description: "Exclusive mentorship session on Conversion Rate Optimization (CRO) for maximum performance. ✅ Learn to maximize conversions effectively. ✅ Master store performance improvement techniques. ✅ Understand CRO best practices and strategies. ✅ Discover advanced optimization methodologies.",
    url: "https://drive.google.com/file/d/1uHYd9-AUnbUU1htqh1DxOjAcbTCD5dql/view?usp=drive_link",
    date: new Date(2025, 4, 18, 14, 0), // May 18, 2025, 2:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-055",
    title: `Mentorship Meeting: Path and Milestone Planning${mentorAttribution}`,
    description: "Personalized mentorship meeting to discuss your business path and milestone achievement strategies. ✅ Get guidance on setting realistic goals. ✅ Learn milestone planning and tracking methods. ✅ Understand path optimization strategies. ✅ Receive personalized roadmap recommendations.",
    url: "https://drive.google.com/file/d/1rIf3lWKOO7gOX_x-MjXvRuh5OVMC0QOw/view?usp=sharing",
    date: new Date(2025, 4, 20, 11, 0), // May 20, 2025, 11:00 AM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-056",
    title: `LIVE: USA Dropshipping Webinar with Mr. Suprans${mentorAttribution}`,
    description: "Live interactive webinar session covering comprehensive USA dropshipping strategies and real-time Q&A. ✅ Get real-time expert insights and answers. ✅ Learn comprehensive USA dropshipping strategies. ✅ Participate in live Q&A sessions. ✅ Receive immediate expert guidance.",
    url: "https://drive.google.com/file/d/1KzpwmZKCp-c66WkZUflS0l-s2GzjPYkc/view?usp=drive_link",
    date: new Date(2025, 4, 22, 16, 0), // May 22, 2025, 4:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-057",
    title: `Complete Business Overview: Meta Ads, Sourcing, Frameworks, and Warehousing${mentorAttribution}`,
    description: "Comprehensive session covering all aspects of dropshipping business operations and strategies. ✅ Master Meta Ads integration and optimization. ✅ Learn product sourcing and supplier management. ✅ Understand business frameworks and structures. ✅ Discover warehousing and fulfillment strategies.",
    url: "https://drive.google.com/file/d/1UbLCaGtdSxJBcjv7EYB3JrKlCOdeFOV-/view?usp=drive_link",
    date: new Date(2025, 4, 25, 13, 0), // May 25, 2025, 1:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-058",
    title: `Product Selection and Meta Ads: 2025 Update Part 02${mentorAttribution}`,
    description: "Updated 2025 strategies combining product selection with Meta Ads for current market success. ✅ Learn latest 2025 product selection trends. ✅ Master updated Meta Ads integration techniques. ✅ Understand current market dynamics. ✅ Discover cutting-edge strategies for 2025.",
    url: "https://drive.google.com/file/d/1JRib7I7fNhoHZl77DSfQhKDKGbU0NYJT/view?usp=sharing",
    date: new Date(2025, 4, 28, 15, 0), // May 28, 2025, 3:00 PM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-059",
    title: `USA Dropshipping Products and Meta Ads: Part 03${mentorAttribution}`,
    description: "Part 3 of the comprehensive series on USA dropshipping products and Meta Ads integration. ✅ Master advanced product-ad integration strategies. ✅ Learn from real-world case studies. ✅ Understand advanced optimization techniques. ✅ Discover expert-level strategies and tactics.",
    url: "https://drive.google.com/file/d/1O3bvGcfiKedaP1DyAaH6RhovX3lDjugH/view?usp=drive_link",
    date: new Date(2025, 5, 2, 10, 0), // June 2, 2025, 10:00 AM
    duration: "90 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-060",
    title: `Onboarding Process: Essential Framework${mentorAttribution}`,
    description: "Essential onboarding process for new members covering complete framework and startup guidance. ✅ Learn the complete onboarding framework. ✅ Understand essential startup processes. ✅ Get expert guidance on getting started. ✅ Master foundational concepts and workflows.",
    url: "https://drive.google.com/file/d/1WwMSzzK1dVPwTtuu7DqCQ0rL8AXvRYeq/view?usp=sharing",
    date: new Date(2025, 3, 30, 10, 0), // April 30, 2025, 10:00 AM
    duration: "75 minutes",
    isUpcoming: false,
  },
  {
    id: "webinar-061",
    title: `Onboarding Process: Updated Framework and Strategies${mentorAttribution}`,
    description: "Updated onboarding process session with the latest framework and strategies for 2025. ✅ Learn the latest onboarding framework updates. ✅ Master updated startup strategies. ✅ Understand current best practices. ✅ Get the most recent expert guidance.",
    url: "https://drive.google.com/file/d/1Fp_N1zaxp3yYaPhI3cb0kmkRVjCmdaCv/view?usp=drive_link",
    date: new Date(2025, 5, 5, 14, 0), // June 5, 2025, 2:00 PM
    duration: "75 minutes",
    isUpcoming: true,
  },
]
