-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 03, 2025 at 07:42 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_backup`
--

-- --------------------------------------------------------

--
-- Table structure for table `product_detail`
--

CREATE TABLE `product_detail` (
  `id` bigint(20) NOT NULL,
  `color_id` bigint(20) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `quantity` bigint(20) DEFAULT NULL,
  `size_id` bigint(20) DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_detail`
--

INSERT INTO `product_detail` (`id`, `color_id`, `images`, `product_id`, `quantity`, `size_id`, `price`) VALUES
(24, 8, 'images/product-detail/tmgbdi2024-05-01.png', 18, 146, 1, NULL),
(25, 8, 'images/product-detail/RYV36z2024-05-01.png', 18, 65, 2, NULL),
(26, 8, 'images/product-detail/P0e2pO2024-05-01.png', 18, 88, 3, NULL),
(27, 8, 'images/product-detail/KjCddW2024-05-01.png', 18, 33, 4, NULL),
(28, 7, 'images/product-detail/KkxSNv2024-05-01.png', 18, 55, 1, NULL),
(29, 7, 'images/product-detail/AtKMcM2024-05-01.png', 18, 65, 2, NULL),
(30, 7, 'images/product-detail/S8GMyu2024-05-01.png', 18, 91, 3, NULL),
(31, 3, 'images/product-detail/B7ffdr2024-05-01.png', 18, 22, 2, NULL),
(32, 3, 'images/product-detail/EGTWMJ2024-05-01.png', 18, 77, 4, NULL),
(33, 3, 'images/product-detail/OGaqBd2024-05-01.png', 18, 99, 1, NULL),
(34, 3, 'images/product-detail/HjtJgD2024-05-01.png', 21, 78, 1, NULL),
(35, 3, 'images/product-detail/7v9lkH2024-05-01.png', 21, 95, 3, NULL),
(36, 3, 'images/product-detail/F2iqz02024-05-01.png', 21, 10, 2, NULL),
(37, 3, 'images/product-detail/ahZBFX2024-05-01.png', 21, 20, 4, NULL),
(38, 7, 'images/product-detail/mi4VQx2024-05-01.png', 21, 19, 1, NULL),
(39, 7, 'images/product-detail/hPMeUe2024-05-01.png', 21, 10, 3, NULL),
(40, 7, 'images/product-detail/bZXCUe2024-05-01.png', 21, 10, 4, NULL),
(41, 9, 'images/product-detail/hRscuQ2024-05-01.png', 19, 90, 4, NULL),
(42, 9, 'images/product-detail/Ooinxp2024-05-01.png', 19, 90, 5, NULL),
(43, 10, 'images/product-detail/6oheDe2024-05-01.png', 19, 10, 4, NULL),
(44, 10, 'images/product-detail/dVJkXe2024-05-01.png', 19, 10, 5, NULL),
(45, 11, 'images/product-detail/O4HWca2024-05-01.png', 22, 85, 1, NULL),
(46, 11, 'images/product-detail/n60xsz2024-05-01.png', 22, 91, 2, NULL),
(47, 11, 'images/product-detail/Ggn5Vh2024-05-01.png', 22, 10, 3, NULL),
(48, 2, 'images/product-detail/fKzOfs2024-05-01.png', 23, 17, 4, NULL),
(49, 2, 'images/product-detail/Te3MQY2024-05-01.png', 23, 10, 5, NULL),
(50, 1, 'images/product-detail/ZsJUGc2024-05-01.png', 23, 10, 4, NULL),
(51, 1, 'images/product-detail/InHLoz2024-05-01.png', 23, 10, 5, NULL),
(52, 3, 'images/product-detail/yw2UEb2024-05-01.png', 23, 10, 4, NULL),
(53, 3, 'images/product-detail/Z1738Y2024-05-01.png', 23, 9, 5, NULL),
(54, 3, 'images/product-detail/fWlnat2024-05-01.png', 24, 5, 1, NULL),
(55, 3, 'images/product-detail/TQTrq12024-05-01.png', 24, 4, 2, NULL),
(56, 3, 'images/product-detail/mudrlr2024-05-01.png', 24, 5, 3, NULL),
(57, 7, 'images/product-detail/vEpvKU2024-05-01.png', 24, 5, 1, NULL),
(58, 7, 'images/product-detail/kdV3Gk2024-05-01.png', 24, 5, 2, NULL),
(59, 10, 'images/product-detail/isLvdi2024-05-01.png', 24, 5, 2, NULL),
(60, 10, 'images/product-detail/VAtVOh2024-05-01.png', 24, 5, 3, NULL),
(62, 7, 'images/product-detail/hnNaLg2024-05-01.png', 25, 15, 4, NULL),
(63, 7, 'images/product-detail/TBtzQJ2024-05-01.png', 25, 15, 5, NULL),
(64, 7, 'images/product-detail/NeBHh92024-05-01.png', 25, 15, 6, NULL),
(65, 12, 'images/product-detail/xJD29e2024-05-01.png', 25, 15, 4, NULL),
(66, 12, 'images/product-detail/rwW2Qh2024-05-01.png', 25, 15, 5, NULL),
(67, 12, 'images/product-detail/di7cMo2024-05-01.png', 25, 15, 6, NULL),
(68, 1, 'images/product-detail/sBu0Nn2024-05-01.png', 26, 5, 1, NULL),
(69, 1, 'images/product-detail/i7HGlt2024-05-01.png', 26, 10, 2, NULL),
(70, 11, 'images/product-detail/0K4VHo2024-05-01.png', 26, 10, 1, NULL),
(71, 11, 'images/product-detail/d7AO2O2024-05-01.png', 26, 10, 2, NULL),
(72, 4, 'images/product-detail/N7kQXn2024-05-01.png', 26, NULL, 1, NULL),
(73, 4, 'images/product-detail/hnuYZO2024-05-01.png', 26, 10, 2, NULL),
(74, 3, 'images/product-detail/GiVrID2024-05-01.png', 26, 10, 1, NULL),
(75, 3, 'images/product-detail/uGnSb52024-05-01.png', 26, 9, 2, NULL),
(76, 7, 'images/product-detail/dVPw2Y2024-05-02.png', 27, 10, 1, NULL),
(77, 7, 'images/product-detail/SiYxmp2024-05-02.png', 27, 10, 2, NULL),
(78, 7, 'images/product-detail/4gZA0o2025-06-28.png', 28, 50, 1, NULL),
(79, 10, 'images/product-detail/BlyeCi2025-06-28.png', 28, 40, 2, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product_detail`
--
ALTER TABLE `product_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbn675kqqk7eh4bvl7riry1xkl` (`product_id`),
  ADD KEY `FKg99nip4ayeu7v2g5cv94ix74s` (`color_id`),
  ADD KEY `FKha92q2a8nixoxt09hauuemnjm` (`size_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product_detail`
--
ALTER TABLE `product_detail`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product_detail`
--
ALTER TABLE `product_detail`
  ADD CONSTRAINT `FKbn675kqqk7eh4bvl7riry1xkl` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKg99nip4ayeu7v2g5cv94ix74s` FOREIGN KEY (`color_id`) REFERENCES `color` (`id`),
  ADD CONSTRAINT `FKha92q2a8nixoxt09hauuemnjm` FOREIGN KEY (`size_id`) REFERENCES `size` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
