DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` char(11) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `authGuid` varchar(255) DEFAULT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `registrationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastLogin` datetime DEFAULT NULL,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `authGuid_INDEX` (`authGuid`)
) ENGINE=InnoDB;
