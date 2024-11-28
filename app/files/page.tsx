import { FileManagementPage } from '@/components/FileManagement/FileManagementPage';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function FilesPage() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get user's creation date directly from the database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return <FileManagementPage userCreatedAt={user.createdAt} />;
} 