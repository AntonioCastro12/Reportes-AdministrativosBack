-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `stacktrace` LONGTEXT NULL,
    `context` JSON NULL,
    `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Log_level_idx`(`level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryAtg` (
    `inventoryAtg_Id` VARCHAR(60) NOT NULL,
    `inventoryAtg_Sts` VARCHAR(1) NOT NULL DEFAULT 'A',
    `inventoryAtg_Chk` VARCHAR(1) NOT NULL DEFAULT '0',
    `inventoryAtg_Created` TIMESTAMP NULL,
    `inventoryAtg_Updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `inventoryAtg_Data` JSON NULL,
    `inventoryAtg_productId` VARCHAR(60) NULL,
    `inventoryAtg_qty` DECIMAL(65, 30) NULL,
    `inventoryAtg_storeId` VARCHAR(10) NULL,
    `inventoryAtg_creationDate` VARCHAR(10) NULL,
    `fecha_status` VARCHAR(10) NULL,

    PRIMARY KEY (`inventoryAtg_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSearchCriteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `searchCriteria` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserSearchCriteria_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
