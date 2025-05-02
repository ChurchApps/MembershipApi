DROP TABLE IF EXISTS `forms`;

CREATE TABLE `forms` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `contentType` varchar(50) DEFAULT NULL,
  `createdTime` datetime DEFAULT NULL,
  `modifiedTime` datetime DEFAULT NULL,
  `accessStartTime` datetime DEFAULT NULL,
  `accessEndTime` datetime DEFAULT NULL,
  `restricted` bit(1) DEFAULT NULL,
  `archived` bit(1) DEFAULT NULL,
  `removed` bit(1) DEFAULT NULL,
  `thankYouMessage` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `churchId` (`churchId`),
  KEY `churchId_removed_archived` (`churchId`, `removed`, `archived`),
  KEY `churchId_id` (`churchId`, `id`)
) ENGINE=InnoDB;