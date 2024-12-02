import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface CompanySetup {
  companyName: string;
  companyWebsite: string;
  annualTurnover: string;
  primaryLocation: string;
  primaryFocus: string;
  hasTenderExperience: boolean;
}

interface EditableFields {
  industrySector: string;
  companyOverview: string;
  coreProducts: string;
  demographic: string;
  uniqueSellingPoint: string;
  geographic: string;
}

interface FinalSteps {
  goal: string;
  feedbackSource: string;
}

interface RequestData {
  companySetup?: CompanySetup;
  editableFields?: EditableFields;
  finalSteps?: FinalSteps;
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = (await req.json()) as RequestData;
    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Validate that at least one of the expected data sections is present
    if (!data.companySetup && !data.editableFields && !data.finalSteps) {
      return NextResponse.json({ 
        error: 'Invalid data format. At least one of companySetup, editableFields, or finalSteps is required' 
      }, { status: 400 });
    }

    // Get or create user with additional setupComplete field in update/create
    const user = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: {
        ...(data.finalSteps?.feedbackSource && data.finalSteps?.goal && { setupComplete: true })
      },
      create: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        setupComplete: false,
      },
    });

    let companyId: number | undefined;

    // Only handle company data if companySetup or editableFields are present
    if (data.companySetup || data.editableFields) {
      // Find existing company or create new one
      let company = await prisma.company.findFirst({
        where: { userId: user.id }
      });

      // Prepare company data for upsert
      const companyData: Partial<{
        name: string;
        website: string;
        annualTurnover: string;
        primaryLocation: string;
        primaryFocus: string;
        experienceWithTenders: boolean;
        industrySector: string;
        companyOverview: string;
        coreProductsServices: string;
        demographic: string;
        uniqueSellingPoint: string;
        geographicFocus: string;
      }> = {};
      
      // Handle company setup data
      if (data.companySetup) {
        Object.assign(companyData, {
          name: data.companySetup.companyName,
          website: data.companySetup.companyWebsite,
          annualTurnover: data.companySetup.annualTurnover,
          primaryLocation: data.companySetup.primaryLocation,
          primaryFocus: data.companySetup.primaryFocus,
          experienceWithTenders: data.companySetup.hasTenderExperience,
        });
      }

      // Handle editable fields
      if (data.editableFields) {
        Object.assign(companyData, {
          industrySector: data.editableFields.industrySector,
          companyOverview: data.editableFields.companyOverview,
          coreProductsServices: data.editableFields.coreProducts,
          demographic: data.editableFields.demographic,
          uniqueSellingPoint: data.editableFields.uniqueSellingPoint,
          geographicFocus: data.editableFields.geographic,
        });
      }

      // Update or create company
      company = await prisma.company.upsert({
        where: { 
          id: company?.id || -1 
        },
        update: companyData,
        create: {
          userId: user.id,
          name: data.companySetup?.companyName || '',
          website: data.companySetup?.companyWebsite || '',
          annualTurnover: data.companySetup?.annualTurnover || '',
          primaryLocation: data.companySetup?.primaryLocation || '',
          primaryFocus: data.companySetup?.primaryFocus || '',
          experienceWithTenders: data.companySetup?.hasTenderExperience || false,
          industrySector: data.editableFields?.industrySector || '',
          companyOverview: data.editableFields?.companyOverview || '',
          coreProductsServices: data.editableFields?.coreProducts || '',
          demographic: data.editableFields?.demographic || '',
          uniqueSellingPoint: data.editableFields?.uniqueSellingPoint || '',
          geographicFocus: data.editableFields?.geographic || '',
        },
      });

      companyId = company.id;
    }

    return NextResponse.json({ 
      success: true,
      companyId,
      message: 'Data saved successfully' 
    });

  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal Server Error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}