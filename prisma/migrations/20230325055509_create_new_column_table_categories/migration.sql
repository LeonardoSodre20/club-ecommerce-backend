/*
  Warnings:

  - Added the required column `pictureCategory` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` ADD COLUMN `pictureCategory` VARCHAR(191) NOT NULL;
