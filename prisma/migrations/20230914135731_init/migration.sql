/*
  Warnings:

  - You are about to alter the column `inventoryAtg_Created` on the `InventoryAtg` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `inventoryAtg_Updated` on the `InventoryAtg` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `Log` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `InventoryAtg` MODIFY `inventoryAtg_Created` TIMESTAMP NULL,
    MODIFY `inventoryAtg_Updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Log` MODIFY `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(3);
