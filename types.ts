
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content?: string;
  imageUrl: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price?: string;
  features: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  badge?: string;
  ctaLink: string;
  imageUrl: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Portrait' | 'Corporate' | 'Artistic';
  imageUrl: string;
}

export interface AIRecommendation {
  projeto: string;
  estrategia: string;
  arquetipo: string;
  dicaVisual: string;
}
