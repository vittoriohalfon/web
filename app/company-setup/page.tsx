import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import CompanySetupClient from './CompanySetupClient';

export default async function OnboardingPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Check if user has completed setup
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { company: true },
  });

  if (dbUser?.setupComplete) {
    redirect('/home');
  }

  return <CompanySetupClient />;
} 