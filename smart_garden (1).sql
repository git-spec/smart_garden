-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 05. Okt 2020 um 10:19
-- Server-Version: 8.0.17
-- PHP-Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `smart_garden`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `device_types`
--

CREATE TABLE `device_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `iot_data`
--

CREATE TABLE `iot_data` (
  `id` int(11) NOT NULL,
  `data` text NOT NULL,
  `device_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `iot_device`
--

CREATE TABLE `iot_device` (
  `id` int(11) NOT NULL,
  `sn_number` varchar(50) NOT NULL,
  `type_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `hub_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `iot_hubs`
--

CREATE TABLE `iot_hubs` (
  `id` int(11) NOT NULL,
  `sn_number` varchar(50) NOT NULL,
  `device_info` text NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `verified` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `email`, `password`, `verified`) VALUES
(1, '', '', 'Mostafa', 'smogeq7@yahoo.com', '1234', 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `device_types`
--
ALTER TABLE `device_types`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `iot_data`
--
ALTER TABLE `iot_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `device_id` (`device_id`);

--
-- Indizes für die Tabelle `iot_device`
--
ALTER TABLE `iot_device`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sn_number` (`sn_number`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `hub_id` (`hub_id`);

--
-- Indizes für die Tabelle `iot_hubs`
--
ALTER TABLE `iot_hubs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sn_number` (`sn_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `device_types`
--
ALTER TABLE `device_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `iot_data`
--
ALTER TABLE `iot_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `iot_device`
--
ALTER TABLE `iot_device`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `iot_hubs`
--
ALTER TABLE `iot_hubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `iot_data`
--
ALTER TABLE `iot_data`
  ADD CONSTRAINT `iot_data_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `iot_device` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `iot_device`
--
ALTER TABLE `iot_device`
  ADD CONSTRAINT `iot_device_ibfk_1` FOREIGN KEY (`hub_id`) REFERENCES `iot_hubs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `iot_device_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `iot_device_ibfk_3` FOREIGN KEY (`type_id`) REFERENCES `device_types` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `iot_hubs`
--
ALTER TABLE `iot_hubs`
  ADD CONSTRAINT `iot_hubs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
