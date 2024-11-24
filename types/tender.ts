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
  record_id: string;
} 