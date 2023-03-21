-- AlterTable
ALTER TABLE `users` ADD COLUMN `password_token_expiry` VARCHAR(191) NULL,
    ADD COLUMN `password_token_reset` VARCHAR(191) NULL;
