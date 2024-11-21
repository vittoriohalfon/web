import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        company: true,
      },
    });

    if (!user || !user.company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const responseData = {
      ...user.company,
      userCreatedAt: user.createdAt
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updatedCompany = await prisma.company.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        name: data.name,
        website: data.website,
        annualTurnover: data.annualTurnover,
        primaryLocation: data.primaryLocation,
        experienceWithTenders: data.experienceWithTenders,
        industrySector: data.industrySector,
        companyOverview: data.companyOverview,
        coreProductsServices: data.coreProductsServices,
        demographic: data.demographic,
        uniqueSellingPoint: data.uniqueSellingPoint,
        geographicFocus: data.geographicFocus,
      },
      update: {
        name: data.name,
        website: data.website,
        annualTurnover: data.annualTurnover,
        primaryLocation: data.primaryLocation,
        experienceWithTenders: data.experienceWithTenders,
        industrySector: data.industrySector,
        companyOverview: data.companyOverview,
        coreProductsServices: data.coreProductsServices,
        demographic: data.demographic,
        uniqueSellingPoint: data.uniqueSellingPoint,
        geographicFocus: data.geographicFocus,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Error updating company profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
