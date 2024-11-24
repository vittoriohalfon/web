interface TimelineItem {
    icon: string;
    title: string;
    date: string;
  }
  
  interface LotItem {
    number: number;
    title: string;
    description: string;
    isExpanded?: boolean;
    status?: string;
    procurementType?: string;
    estimatedValue?: string;
    duration?: string;
  }
  
  interface ContractSummary {
    location: string;
    lots: number;
    value: string;
    status: string;
    submissionUrl: string;
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