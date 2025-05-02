DROP TABLE IF EXISTS `notes`;

CREATE TABLE `notes` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `contentType` varchar(50) DEFAULT NULL,
  `contentId` char(11) DEFAULT NULL,
  `noteType` varchar(50) DEFAULT NULL,
  `addedBy` char(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `contents` text,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `churchId` (`churchId`)
) ENGINE=InnoDB; 