-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Jan 13, 2021 at 04:19 PM
-- Server version: 10.5.5-MariaDB-1:10.5.5+maria~focal
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `NazanAdministration`
--
CREATE DATABASE IF NOT EXISTS `NazanAdministration` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `NazanAdministration`;

-- --------------------------------------------------------

--
-- Table structure for table `Audit`
--

DROP TABLE IF EXISTS `Audit`;
CREATE TABLE `Audit` (
  `auditId` varchar(50) NOT NULL,
  `auditChk` varchar(1) DEFAULT '1',
  `auditStatus` varchar(1) DEFAULT 'A',
  `auditCreated` timestamp NULL DEFAULT current_timestamp(),
  `auditModified` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `__CUSTOM__` varchar(1) DEFAULT '1',
  `auditData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `fecha_audit` date DEFAULT NULL,
  `tabla_origen` varchar(30) DEFAULT NULL,
  `tabla_destino` varchar(30) DEFAULT NULL,
  `registros_origen` int(11) DEFAULT NULL,
  `registros_destino` int(11) DEFAULT NULL,
  `auditOrigin` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`auditOrigin`)),
  `auditDestiny` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`auditDestiny`)),
  `resultado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `InventoryAtg`
--

DROP TABLE IF EXISTS `InventoryAtg`;
CREATE TABLE `InventoryAtg` (
  `inventoryAtg_Id` varchar(60) NOT NULL,
  `inventoryAtg_Sts` varchar(1) NOT NULL DEFAULT 'A',
  `inventoryAtg_Chk` varchar(1) NOT NULL DEFAULT '0',
  `inventoryAtg_Created` timestamp NOT NULL DEFAULT current_timestamp(),
  `inventoryAtg_Updated` timestamp NOT NULL DEFAULT current_timestamp(),
  `inventoryAtg_Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `__CUSTOM__` int(1) DEFAULT NULL,
  `inventoryAtg_productId` varchar(60) DEFAULT NULL,
  `inventoryAtg_qty` decimal(18,2) DEFAULT NULL,
  `inventoryAtg_storeId` varchar(10) DEFAULT NULL,
  `inventoryAtg_creationDate` varchar(10) DEFAULT NULL,
  `fecha_status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `InventoryOB`
--

DROP TABLE IF EXISTS `InventoryOB`;
CREATE TABLE `InventoryOB` (
  `inventoryOB_Id` varchar(60) NOT NULL,
  `inventoryOB_Sts` varchar(1) NOT NULL DEFAULT 'A',
  `inventoryOB_Chk` varchar(1) NOT NULL DEFAULT '0',
  `inventoryOB_Created` timestamp NOT NULL DEFAULT current_timestamp(),
  `inventoryOB_Updated` timestamp NOT NULL DEFAULT current_timestamp(),
  `inventoryOB_Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `__CUSTOM__` int(1) DEFAULT NULL,
  `inventoryOB_productId` varchar(60) DEFAULT NULL,
  `inventoryOB_description` varchar(255) DEFAULT NULL,
  `inventoryOB_qty` decimal(18,2) DEFAULT NULL,
  `inventoryOB_storeId` varchar(10) DEFAULT NULL,
  `inventoryOB_updatedDate` varchar(10) DEFAULT NULL,
  `fecha_status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `InventoryXCenter`
--

DROP TABLE IF EXISTS `InventoryXCenter`;
CREATE TABLE `InventoryXCenter` (
  `inventoryXCenter_Id` varchar(60) NOT NULL,
  `inventoryXCenter_Sts` varchar(1) NOT NULL DEFAULT 'A',
  `inventoryXCenter_Chk` varchar(1) NOT NULL DEFAULT '0',
  `inventoryXCenter_Created` timestamp NOT NULL DEFAULT current_timestamp(),
  `inventoryXCenter_Updated` timestamp NOT NULL DEFAULT current_timestamp(),
  `inventoryXCenter_Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `__CUSTOM__` int(1) DEFAULT NULL,
  `inventoryXCenter_productId` varchar(60) DEFAULT NULL,
  `inventoryXCenter_description` varchar(255) DEFAULT NULL,
  `inventoryXCenter_qty` decimal(18,2) DEFAULT NULL,
  `inventoryXCenter_storeId` varchar(10) DEFAULT NULL,
  `inventoryXCenter_bucket` varchar(20) DEFAULT NULL,
  `inventoryXCenter_updateDate` varchar(10) DEFAULT NULL,
  `fecha_status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `InventoryXStore`
--

DROP TABLE IF EXISTS `InventoryXStore`;
CREATE TABLE `InventoryXStore` (
  `inventoryXStore_Id` varchar(60) NOT NULL,
  `inventoryXStore_Sts` varchar(1) NOT NULL DEFAULT 'A',
  `inventoryXStore_Chk` varchar(1) NOT NULL DEFAULT '0',
  `inventoryXStore_Created` timestamp NOT NULL DEFAULT current_timestamp(),
  `inventoryXStore_Updated` timestamp NOT NULL DEFAULT current_timestamp(),
  `inventoryXStore_Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `__CUSTOM__` int(1) DEFAULT NULL,
  `inventoryXStore_productId` varchar(60) DEFAULT NULL,
  `inventoryXStore_description` varchar(255) DEFAULT NULL,
  `inventoryXStore_qty` decimal(18,2) DEFAULT NULL,
  `inventoryXStore_storeId` varchar(10) DEFAULT NULL,
  `inventoryXStore_bucket` varchar(20) DEFAULT NULL,
  `inventoryXStore_updateDate` varchar(10) DEFAULT NULL,
  `fecha_status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Audit`
--
ALTER TABLE `Audit`
  ADD PRIMARY KEY (`auditId`),
  ADD KEY `basicChk-idx` (`auditChk`),
  ADD KEY `basicStatus-idx` (`auditStatus`),
  ADD KEY `basicCreated-idx` (`auditCreated`),
  ADD KEY `basicModified-idx` (`auditModified`),
  ADD KEY `hora_orden` (`tabla_origen`),
  ADD KEY `estado_orden` (`tabla_destino`),
  ADD KEY `via_envio` (`registros_origen`),
  ADD KEY `num_orden` (`fecha_audit`),
  ADD KEY `fecha_audit` (`fecha_audit`),
  ADD KEY `resultado` (`resultado`);

--
-- Indexes for table `InventoryAtg`
--
ALTER TABLE `InventoryAtg`
  ADD PRIMARY KEY (`inventoryAtg_Id`),
  ADD KEY `assistanceEmployeeId` (`inventoryAtg_productId`),
  ADD KEY `assistanceBusinessDate` (`inventoryAtg_qty`),
  ADD KEY `assistanceConcept` (`inventoryAtg_storeId`),
  ADD KEY `assistanceValue` (`inventoryAtg_creationDate`);

--
-- Indexes for table `InventoryOB`
--
ALTER TABLE `InventoryOB`
  ADD PRIMARY KEY (`inventoryOB_Id`),
  ADD KEY `assistanceEmployeeId` (`inventoryOB_productId`),
  ADD KEY `assistancePosition` (`inventoryOB_description`),
  ADD KEY `assistanceBusinessDate` (`inventoryOB_qty`),
  ADD KEY `assistanceConcept` (`inventoryOB_storeId`),
  ADD KEY `assistanceValue` (`inventoryOB_updatedDate`);

--
-- Indexes for table `InventoryXCenter`
--
ALTER TABLE `InventoryXCenter`
  ADD PRIMARY KEY (`inventoryXCenter_Id`),
  ADD KEY `assistanceEmployeeId` (`inventoryXCenter_productId`),
  ADD KEY `assistancePosition` (`inventoryXCenter_description`),
  ADD KEY `assistanceBusinessDate` (`inventoryXCenter_qty`),
  ADD KEY `assistanceConcept` (`inventoryXCenter_storeId`),
  ADD KEY `assistanceValue` (`inventoryXCenter_updateDate`),
  ADD KEY `inventoryXCenter_bucket` (`inventoryXCenter_bucket`);

--
-- Indexes for table `InventoryXStore`
--
ALTER TABLE `InventoryXStore`
  ADD PRIMARY KEY (`inventoryXStore_Id`),
  ADD KEY `assistanceEmployeeId` (`inventoryXStore_productId`),
  ADD KEY `assistancePosition` (`inventoryXStore_description`),
  ADD KEY `assistanceBusinessDate` (`inventoryXStore_qty`),
  ADD KEY `assistanceConcept` (`inventoryXStore_storeId`),
  ADD KEY `assistanceValue` (`inventoryXStore_updateDate`),
  ADD KEY `inventoryXCenter_bucket` (`inventoryXStore_bucket`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
