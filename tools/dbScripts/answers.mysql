DROP TABLE IF EXISTS `answers`;

CREATE TABLE `answers` (
  `id` char(11) NOT NULL,
  `churchId` char(11) DEFAULT NULL,
  `formSubmissionId` char(11) DEFAULT NULL,
  `questionId` char(11) DEFAULT NULL,
  `value` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `churchId` (`churchId`),
  KEY `formSubmissionId` (`formSubmissionId`),
  KEY `questionId` (`questionId`)
) ENGINE=InnoDB;