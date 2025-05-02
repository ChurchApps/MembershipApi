DROP TABLE IF EXISTS `roleMembers`;

CREATE TABLE `roleMembers` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `roleId` char(11) DEFAULT NULL,
  `userId` char(11) DEFAULT NULL,
  `dateAdded` datetime DEFAULT NULL,
  `addedBy` char(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId_INDEX` (`userId`),
  KEY `userId_churchId` (`userId`, `churchId`),
  KEY `roleId_churchId` (`roleId`, `churchId`)
) ENGINE=InnoDB;
