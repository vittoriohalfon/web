import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Authenticate user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const data = await req.json();
    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Destructure data with default values
    const {
      companySetup: {
        companyName = '',
        companyWebsite = null,
        annualTurnover = null,
        primaryLocation = null,
        hasTenderExperience = false,
      } = {},
      editableFields: {
        industrySector = null,
        companyOverview = null,
        coreProducts = null,
        demographic = null,
        uniqueSellingPoint = null,
        geographic = null,
      } = {},
      finalSteps: { 
        goal = null,
        feedbackSource = null
      } = {},
    } = data;

    // Upsert user
    const user = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: {},
      create: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      },
    });

    // Create company
    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: companyName,
        website: companyWebsite,
        annualTurnover,
        primaryLocation,
        experienceWithTenders: Boolean(hasTenderExperience),
        industrySector,
        companyOverview,
        coreProductsServices: coreProducts,
        demographic,
        uniqueSellingPoint,
        geographicFocus: geographic,
      },
    });

    // Create user preference if goal or feedback source is provided
    if (goal || feedbackSource) {
      await prisma.userPreference.upsert({
        where: { userId: user.id },
        update: { goal, referralSource: feedbackSource },
        create: { userId: user.id, goal, referralSource: feedbackSource },
      });
    }

    // Respond with the created company ID
    return NextResponse.json({ companyId: company.id }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: 'Internal Server Error', message: errorMessage },
      { status: 500 }
    );
  }
}