-- AlterTable
ALTER TABLE "Project" ADD COLUMN "webScreens" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "mobileScreens" TEXT[] DEFAULT ARRAY[]::TEXT[];
