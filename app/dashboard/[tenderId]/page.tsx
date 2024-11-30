import { TenderDetails } from '@/components/TenderDetails/TenderDetails';
import { Metadata } from 'next';

type Props = {
  params: Promise<{
    tenderId: string;
  }>;
  searchParams: Promise<{
    match?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Tender Details',
  description: 'Detailed information about the tender',
};

export default async function TenderDetailsPage({ params, searchParams }: Props) {
  // Await both params and searchParams
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);

  const { tenderId } = resolvedParams;
  
  let match_percentage = 0;
  try {
    match_percentage = resolvedSearchParams?.match 
      ? parseInt(resolvedSearchParams.match) 
      : 0;
  } catch (e) {
    console.error('Error parsing match percentage:', e);
  }
  
  return <TenderDetails 
    tenderId={tenderId} 
    match_percentage={match_percentage} 
  />;
}