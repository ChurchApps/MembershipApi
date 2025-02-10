DROP TABLE IF EXISTS `rolePermissions`;

CREATE TABLE `rolePermissions` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `roleId` char(11) DEFAULT NULL,
  `apiName` varchar(45) DEFAULT NULL,
  `contentType` varchar(45) DEFAULT NULL,
  `contentId` char(11) DEFAULT NULL,
  `action` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `roleId_churchId_INDEX` (`roleId`,`churchId`)
) ENGINE=InnoDB;

