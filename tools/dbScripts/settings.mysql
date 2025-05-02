DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `userId` char(11) DEFAULT NULL,
  `keyName` varchar(255) DEFAULT NULL,
  `value` mediumtext,
  `public` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `churchId` (`churchId`)
) ENGINE=InnoDB;
