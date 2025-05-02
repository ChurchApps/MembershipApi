DROP TABLE IF EXISTS `groups`;

CREATE TABLE `groups` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `categoryName` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `trackAttendance` bit(1) DEFAULT NULL,
  `parentPickup` bit(1) DEFAULT NULL,
  `printNametag` bit(1) DEFAULT NULL,
  `about` text DEFAULT NULL,
  `photoUrl` varchar(255) DEFAULT NULL,
  `removed` bit(1) DEFAULT NULL,
  `tags` varchar(45) DEFAULT NULL,
  `meetingTime` varchar(45) DEFAULT NULL,
  `meetingLocation` varchar(45) DEFAULT NULL,
  `labels` varchar(500) DEFAULT NULL,
  `slug` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `churchId` (`churchId`),
  KEY `churchId_removed_tags` (`churchId`, `removed`, `tags`),
  KEY `churchId_removed_labels` (`churchId`, `removed`, `labels`)
) ENGINE=InnoDB;