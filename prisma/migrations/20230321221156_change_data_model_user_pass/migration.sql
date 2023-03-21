/*
  Warnings:

  - You are about to alter the column `password_token_expiry` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `password_token_expiry` DATETIME(3) NULL;
