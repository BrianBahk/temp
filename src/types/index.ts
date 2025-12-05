export type PublicationType = 'magazine' | 'newspaper';
export type UserRole = 'user' | 'admin';

export interface CreditCard {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

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
  paymentMethod?: 'card' | 'points' | 'mixed';
  pointsUsed?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  address: string;
  creditCard: CreditCard;
  points: number;
  subscriptions: Subscription[];
  reviews: Review[];
  role: UserRole;
}

export interface Subscription {
  id: string;
  subscriptionNumber: string;
  publicationId: string;
  publicationTitle: string;
  type: PublicationType;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  orderNumber: string;
  price: number;
  issuesPerYear: number;
  pointsAwarded: number;
  paidWithPoints: boolean;
  refundAmount?: number;
}

export interface ReviewInput {
  subscriptionId: string;
  issueNumber: number;
  publicationDate: string;
  articleName: string;
  authorLastName: string;
  content: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  subscriptionId: string;
  publicationId: string;
  issueNumber: number;
  publicationDate: string;
  articleName: string;
  authorLastName: string;
  content: string;
  wordCount: number;
  sentenceCount: number;
  date: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  rejectionReason?: string;
}
