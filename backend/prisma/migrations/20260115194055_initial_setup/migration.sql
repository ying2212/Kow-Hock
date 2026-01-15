-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
