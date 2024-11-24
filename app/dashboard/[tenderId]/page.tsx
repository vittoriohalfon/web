import { TenderDetails } from '@/components/TenderDetails/TenderDetails';
import { Metadata } from 'next';

interface Props {
  params: {
    noticeId: string;
  };
}

export const metadata: Metadata = {
  title: 'Tender Details',
  description: 'Detailed information about the tender',
};

export default async function TenderDetailsPage({ params }: Props) {
  return <TenderDetails tenderId={params.noticeId} />;
} 