import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        },
      });
    }

    // Create company and user preferences
    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: data.companySetup.companyName,
        website: data.companySetup.companyWebsite,
        annualTurnover: data.companySetup.annualTurnover,
        primaryLocation: data.companySetup.primaryLocation,
        experienceWithTenders: data.companySetup.hasTenderExperience,
        industrySector: data.finalSteps.industry,
        companyOverview: data.editableFields?.companyOverview,
        coreProductsServices: data.editableFields?.coreProducts,
        demographic: data.editableFields?.demographic,
        uniqueSellingPoint: data.editableFields?.uniqueSellingPoint,
        geographicFocus: data.editableFields?.geographic,
      },
    });

    // Create user preferences
    await prisma.userPreference.create({
      data: {
        userId: user.id,
        goal: data.finalSteps.goal,
      },
    });

    // If there are past performances, create them
    if (data.pastPerformance?.files?.length > 0) {
      await prisma.pastPerformance.createMany({
        data: data.pastPerformance.files.map((file: string) => ({
          companyId: company.id,
          fileUrl: file,
        })),
      });
    }

    return new Response(JSON.stringify({ companyId: company.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in company setup:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 