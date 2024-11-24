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
  
  export type { TimelineItem, LotItem, ContractSummary, BuyerInfo };