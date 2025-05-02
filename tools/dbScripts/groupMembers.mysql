DROP TABLE IF EXISTS `groupMembers`;

CREATE TABLE `groupMembers` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `groupId` char(11) DEFAULT NULL,
  `personId` char(11) DEFAULT NULL,
  `joinDate` datetime DEFAULT NULL,
  `leader` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `churchId` (`churchId`),
  KEY `groupId` (`groupId`),
  KEY `personId` (`personId`),
  KEY `churchId_groupId_personId` (`churchId`, `groupId`, `personId`),
  KEY `personId_churchId` (`personId`, `churchId`)
) ENGINE=InnoDB;
