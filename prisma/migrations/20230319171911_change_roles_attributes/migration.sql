-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('Admin', 'User') NULL DEFAULT 'User';
