-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 08 mei 2023 om 13:12
-- Serverversie: 10.4.21-MariaDB
-- PHP-versie: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `walkingbranch`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `acties`
--

CREATE TABLE `acties` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `dates0datum` varchar(10) NOT NULL,
  `dates0times0time` varchar(100) NOT NULL,
  `dates0times1time` varchar(100) NOT NULL,
  `dates1datum` varchar(10) NOT NULL,
  `dates1times0time` varchar(100) NOT NULL,
  `dates1times1time` varchar(100) NOT NULL,
  `dates1times2time` varchar(100) NOT NULL,
  `dates2datum` varchar(10) DEFAULT NULL,
  `dates2times0time` varchar(100) DEFAULT NULL,
  `dates2times1time` varchar(100) DEFAULT NULL,
  `dates3datum` varchar(10) DEFAULT NULL,
  `dates3times0time` varchar(100) DEFAULT NULL,
  `loon` varchar(6) NOT NULL,
  `disabled` tinyint(1) NOT NULL,
  `dates0times2time` varchar(25) DEFAULT NULL,
  `dates0times3time` varchar(25) DEFAULT NULL,
  `dates1times3time` varchar(25) DEFAULT NULL,
  `dates1times4time` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Gegevens worden geëxporteerd voor tabel `acties`
--

INSERT INTO `acties` (`id`, `name`, `dates0datum`, `dates0times0time`, `dates0times1time`, `dates1datum`, `dates1times0time`, `dates1times1time`, `dates1times2time`, `dates2datum`, `dates2times0time`, `dates2times1time`, `dates3datum`, `dates3times0time`, `loon`, `disabled`, `dates0times2time`, `dates0times3time`, `dates1times3time`, `dates1times4time`) VALUES
(1, 'Ribs & Blues', '0000-00-00', '13:00 - 20:00', '19:00 - 2:00', '0000-00-00', '11:00 - 18:00', '12:00 - 19:00', '18:00 - 2:00', '0000-00-00', '11:00 - 21:00', '12:00 - 19:00', '0000-00-00', '18:00 - 20:00', '€4,50', 0, NULL, NULL, NULL, NULL),
(2, 'Douwpop', '0000-00-00', '14:15 - 21:30  (Entree)', '16:30 - 22:30  (Entree)', '0000-00-00', '9:45 - 17:00    (Entree)', '15:00 - 22:00  (Entree)', '9:00 - 15:00    (Parkeren)', NULL, NULL, NULL, NULL, NULL, '€8,00', 0, '14:00 - 19:00  (Parkeren)', '15:30 - 22:00  (Parkeren)', '10:00 - 16:00  (Parkeren)', '15:00 - 21:00  (Parkeren)');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `data`
--

CREATE TABLE `data` (
  `id` int(255) NOT NULL,
  `date` varchar(10) NOT NULL,
  `organisatie` varchar(50) NOT NULL,
  `activity` mediumtext NOT NULL,
  `cost` int(11) NOT NULL,
  `notes` mediumtext NOT NULL,
  `disabled` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Gegevens worden geëxporteerd voor tabel `data`
--

INSERT INTO `data` (`id`, `date`, `organisatie`, `activity`, `cost`, `notes`, `disabled`) VALUES
(1, '14-4-2023', 'Myron   Jorian', 'Tusselspel opkomst (trefbal slagbal enz)', 0, '', 1),
(2, '21-4-2023', 'Liese   Stan', 'Knutselen', 0, '', 1),
(3, '28-4-2023', 'Joost   Damian', 'Kampvuur', 5, 'Mes meenemen en evt Opkomst met andere groep?', 1),
(4, '5-5-2023', 'Stan   Daan', 'Pubquiz', 0, '', 1),
(5, '12-5-2023', 'Tom   Stan', 'Dorppuzzel', 0, '', 1),
(6, '20-5-2023', 'Jorian', 'Vrij invullen', 0, '', 1),
(7, '25-5-2023', 'Lynn   Liese', 'Tijenraan', 0, '', 1),
(8, '3-6-2023', 'Myron   Tom', 'Stad bezoeken zaterdag', 0, '', 1),
(9, '9-6-2023', 'Joost   Damian', 'Bowlen', 0, '', 1),
(10, '16-6-2023', 'Nienke   Jorian', 'Cluedo', 0, '', 1),
(11, '23-6-2023', 'Liese', 'Koken', 0, '', 1),
(12, '30-6-2023', 'Daan   Lynn', 'Portret schilderen', 0, '', 1),
(13, '7-7-2023', 'Atisha', 'Karaoke', 0, '', 1),
(14, '14-7-2023', 'Daan   Stan', 'Chocolade Fondue', 0, '', 1),
(15, '21-7-2023', 'Iedereen', 'Zomerkamp voorbereiden', 0, '', 1);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `username` text NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Gegevens worden geëxporteerd voor tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'Damian', 'DmH#232004!', 'admin'),
(2, 'Joost', 'blobbr', 'peasant');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `acties`
--
ALTER TABLE `acties`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `data`
--
ALTER TABLE `data`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT voor een tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
