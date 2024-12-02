interface TimelineItem {
    icon: string;
    title: string;
    date: string;
  }
  
  interface LotItem {
    lotId: string;
    number?: number;
    title: string;
    description: string;
    procurementType: string;
    estimatedValue: number | null;
    isExpanded?: boolean;
  }
  
  interface ContractSummary {
    location: string;
    lots: number;
    value: string;
    status: string;
    submissionUrl: string | null;
  }
  
  interface BuyerInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  }
  
  interface StatusItemProps {
    icon: string;
    label: string;
    isFirst?: boolean;
    isLast?: boolean;
  }
  
  interface BidStatusListProps {
    className?: string;
    onStatusChange: (status: string) => void;
    currentStatus: string;
    items: Array<{ icon: string; label: string; }>;
  }
  
  export type { TimelineItem, LotItem, ContractSummary, BuyerInfo, StatusItemProps, BidStatusListProps };