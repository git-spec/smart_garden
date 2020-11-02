-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 02, 2020 at 11:05 AM
-- Server version: 10.3.25-MariaDB-0ubuntu0.20.04.1
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_garden`
--

-- --------------------------------------------------------

--
-- Table structure for table `device_types`
--

CREATE TABLE `device_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `device_types`
--

INSERT INTO `device_types` (`id`, `name`) VALUES
(1, 'soil moisture'),
(2, 'temperature & humidity'),
(3, 'water'),
(4, 'all in one');

-- --------------------------------------------------------

--
-- Table structure for table `iot_data`
--

CREATE TABLE `iot_data` (
  `id` int(11) NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `iot_device`
--

CREATE TABLE `iot_device` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sn_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `hub_id` int(11) DEFAULT NULL,
  `connected` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `iot_device`
--

INSERT INTO `iot_device` (`id`, `name`, `sn_number`, `type_id`, `user_id`, `hub_id`, `connected`) VALUES
(2, 'A', '0x744d52687A', 1, 3, 2, 0),
(3, 'B', '0x744d52687B', 2, 3, 2, 0),
(4, 'C', '0x744d52687C', 3, 3, 2, 1),
(5, 'D', '0x744d52687D', 4, 3, 2, 0),
(6, 'cactus', 'CN86dzJ$aWQ=W$J=', 1, 3, 5, NULL),
(7, 'kitchen', '@JMvTzFG5a4jrPL7', 2, 3, 1, NULL),
(8, 'another cactus', 'tjkH7S%!d8fzZsv6', 3, 3, 5, NULL),
(9, NULL, 'd45f8-bC@bJnR*fv', 4, NULL, NULL, NULL),
(10, 'palm', '-KWKerL#PEq5a3Lm', 1, 3, 7, NULL),
(11, NULL, 'G5$_Gp5VfvKwm6hF', 2, NULL, NULL, NULL),
(12, 'basilikum', '2TAmPW5x$*Fa?CWA', 3, 3, 1, NULL),
(13, NULL, 'gd#kK?c$7N2Gn_uE', 4, NULL, NULL, NULL),
(14, NULL, 'kJEq&Sh4Ev2M^NW2', 1, NULL, NULL, NULL),
(15, NULL, 'bsF_TF6X%9-5pAHa', 2, NULL, NULL, NULL),
(16, NULL, '&27k?pa93*Rs^fb6', 3, NULL, NULL, NULL),
(17, NULL, 'r+nMaQF?57VGeQrk', 4, NULL, NULL, NULL),
(18, NULL, 'Wm+=&6ug#xsT=4@N', 1, NULL, NULL, NULL),
(19, NULL, 'KymH=Cpwy!7+ckE=', 2, NULL, NULL, NULL),
(20, NULL, 'Wwxh?SzMEcck5vqm', 3, NULL, NULL, NULL),
(21, NULL, '*KpTMq2F!X66p7bL', 4, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `iot_hubs`
--

CREATE TABLE `iot_hubs` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sn_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_info` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `connected` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `iot_hubs`
--

INSERT INTO `iot_hubs` (`id`, `name`, `sn_number`, `device_info`, `user_id`, `connected`) VALUES
(1, 'kitchen', 'B*6Vw+&%!*q4XMtt', 'sometext', 3, 0),
(2, 'garden', '0xABCDABCD71', 'sometext', 3, 0),
(3, NULL, 'gLCCs5MP#DD@3Th2', 'sometext', NULL, 0),
(4, NULL, 'v3!Hs6S%7QBVXsBc', 'sometext', NULL, 0),
(5, 'garage', '&hjKww^UYK3%q6vu', 'sometext', 3, 0),
(6, NULL, '4Bb?S-rK2*8t*tEK', 'sometext', NULL, 0),
(7, 'balcony', 'f3?kyury8%s&MHM8', 'sometext', 3, 0),
(8, NULL, 'Dk#$=LWwvvyYc2Dg', 'sometext', NULL, 0),
(9, NULL, 'aFx92My6Sp4N2@-v', 'sometext', NULL, 0),
(10, NULL, 'jK4MPD@qC%MWrWB!', 'sometext', NULL, 0),
(11, NULL, 'GZLEndp!v&h5ZB@4', 'sometext', NULL, 0),
(12, NULL, 'bu8jTg@V43n=VuyB', 'sometext', NULL, 0),
(13, NULL, 'qUeG7Q?V!?aJQs54', 'sometext', NULL, 0),
(14, NULL, '9Y2k%wY?wrudfxZ7', 'sometext', NULL, 0),
(15, NULL, '5-c^22rSTHhFvbMm', 'sometext', NULL, 0),
(16, NULL, '&HGGnkkmk25&H@FC', 'sometext', NULL, 0),
(17, NULL, 'jWzN4v_@cxPg#5ky', 'sometext', NULL, 0),
(18, NULL, '+s**2ZtCB+2Lwa#Q', 'sometext', NULL, 0),
(19, NULL, '4?GDjRhu&^7d9jrw', 'sometext', NULL, 0),
(20, NULL, 'VVmqJ5J3BySPu=$z', 'sometext', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `verified` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `email`, `password`, `verified`) VALUES
(3, 'Felix', 'Wurst', 'felix', 'felix.wurst@gmail.com', 'sha1$8212f6a2$1$0714d58be01c48e54a40320817e6dfbdf53af8da', 1),
(5, 'test', 'test', 'felixwurst', 'felix.wurst@googlemail.com', 'sha1$1650f1df$1$7ccc1a8a1b6e712d13fda29f0a5bbebba1bfd900', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `device_types`
--
ALTER TABLE `device_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `iot_data`
--
ALTER TABLE `iot_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `device_id` (`device_id`);

--
-- Indexes for table `iot_device`
--
ALTER TABLE `iot_device`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sn_number` (`sn_number`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `hub_id` (`hub_id`);

--
-- Indexes for table `iot_hubs`
--
ALTER TABLE `iot_hubs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sn_number` (`sn_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `device_types`
--
ALTER TABLE `device_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `iot_data`
--
ALTER TABLE `iot_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `iot_device`
--
ALTER TABLE `iot_device`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `iot_hubs`
--
ALTER TABLE `iot_hubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `iot_data`
--
ALTER TABLE `iot_data`
  ADD CONSTRAINT `iot_data_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `iot_device`
--
ALTER TABLE `iot_device`
  ADD CONSTRAINT `iot_device_ibfk_1` FOREIGN KEY (`hub_id`) REFERENCES `iot_hubs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `iot_device_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `iot_device_ibfk_3` FOREIGN KEY (`type_id`) REFERENCES `device_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `iot_hubs`
--
ALTER TABLE `iot_hubs`
  ADD CONSTRAINT `iot_hubs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
