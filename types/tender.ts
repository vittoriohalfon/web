export interface ApiContract {
  title: string;
  description: string;
  amount: number | null;
  currency: string | null;
  status: string;
  match_percentage: number;
  published: string;
  lot_count: number;
  deadline?: string;
  country: string | null;
  id: string;
  notice_id: string;
  is_liked: boolean;
}

export interface Tender {
  title: string;
  description: string;
  amount: number | null;
  currency: string | null;
  status: string;
  match_percentage: number;
  published: string;
  lot_count: number;
  deadline?: string;
  country: string | null;
  id: string;
  notice_id: string;
  isLiked: boolean;
} 