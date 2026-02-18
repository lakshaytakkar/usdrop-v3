export interface NavItem {
  label: string;
  href: string;
}

export interface Product {
  id: string;
  name: string;
  margin: string;
  revenue: string;
  growth: string;
  itemsSold: string;
  prompt?: string;
  image?: string;
}

export interface Feature {
  title: string;
  description: string;
  prompt?: string;
  cta: string;
  image?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface StudioFeature {
  title: string;
  description: string;
  icon: any;
}

