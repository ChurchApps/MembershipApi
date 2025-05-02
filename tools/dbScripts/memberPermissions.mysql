DROP TABLE IF EXISTS `memberPermissions`;

CREATE TABLE `memberPermissions` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `memberId` char(11) DEFAULT NULL,
  `contentType` varchar(45) DEFAULT NULL,
  `contentId` char(11) DEFAULT NULL,
  `action` varchar(45) DEFAULT NULL,
  `emailNotification` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `churchId_contentId_memberId` (`churchId`, `contentId`, `memberId`)
) ENGINE=InnoDB;