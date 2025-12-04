export type PublicationType = 'magazine' | 'newspaper';

export interface Publication {
  id: string;
  title: string;
  type: PublicationType;
  description: string;
  price: number;
  image: string;
  issuesPerYear?: number;
  city?: string;
  category: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export interface CartItem {
  publication: Publication;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  role?: string;
  subscriptions: Subscription[];
}

export interface Subscription {
  id: string;
  publicationId: string;
  publicationTitle: string;
  type: PublicationType;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  orderNumber: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  publicationId: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}
