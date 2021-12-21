/*
  Warnings:

  - You are about to drop the column `ImageId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_ImageId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `ImageId`,
    ADD COLUMN `imageId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
