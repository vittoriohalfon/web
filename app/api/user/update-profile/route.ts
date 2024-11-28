import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const updatedCompany = await prisma.company.update({
      where: { userId: user.id },
      data: {
        name: data.companyName,
        annualTurnover: data.turnover,
        primaryLocation: data.location,
        experienceWithTenders: data.experienceWithTenders,
        industrySector: data.industrySector,
        companyOverview: data.companyOverview,
        coreProductsServices: data.coreProducts,
        demographic: data.demographic,
        uniqueSellingPoint: data.uniqueSellingPoint,
        geographicFocus: data.geographic,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Error updating company profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 