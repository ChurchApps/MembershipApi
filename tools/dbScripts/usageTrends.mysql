DROP TABLE IF EXISTS `usageTrends`;

CREATE TABLE `usageTrends` (
  `id` char(11) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `week` int(11) DEFAULT NULL,
  `b1Users` int(11) DEFAULT NULL,
  `b1Churches` int(11) DEFAULT NULL,
  `b1Devices` int(11) DEFAULT NULL,
  `chumsUsers` int(11) DEFAULT NULL,
  `chumsChurches` int(11) DEFAULT NULL,
  `lessonsUsers` int(11) DEFAULT NULL,
  `lessonsChurches` int(11) DEFAULT NULL,
  `lessonsDevices` int(11) DEFAULT NULL,
  `freeShowDevices` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `year_week` (`year`,`week`)
) ENGINE=InnoDB; 