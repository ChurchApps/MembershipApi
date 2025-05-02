DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `formId` char(11) DEFAULT NULL,
  `parentId` char(11) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `fieldType` varchar(50) DEFAULT NULL,
  `placeholder` varchar(50) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  `choices` text,
  `removed` bit(1) DEFAULT NULL,
  `required` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `churchId` (`churchId`),
  KEY `formId` (`formId`)
) ENGINE=InnoDB;