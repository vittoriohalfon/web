import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user and their company's past performance files
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        company: {
          include: {
            pastPerformances: {
              orderBy: {
                uploadedAt: 'desc'
              }
            }
          }
        }
      }
    });

    if (!user?.company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      files: user.company.pastPerformances
    });

  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
