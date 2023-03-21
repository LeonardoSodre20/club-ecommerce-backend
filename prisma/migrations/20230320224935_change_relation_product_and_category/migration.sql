/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoryName_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `categories_name_key` ON `categories`(`name`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryName_fkey` FOREIGN KEY (`categoryName`) REFERENCES `categories`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
