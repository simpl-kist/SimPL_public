
DROP TABLE IF EXISTS `policies`;
CREATE TABLE `policies` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255)   NOT NULL,
  `job_submit` tinyint(4) NOT NULL DEFAULT '0',
  `own_data_create` tinyint(4) NOT NULL DEFAULT '0',
  `own_data_read` tinyint(4) NOT NULL DEFAULT '0',
  `own_data_update` tinyint(4) NOT NULL DEFAULT '0',
  `own_data_delete` tinyint(4) NOT NULL DEFAULT '0',
  `oth_data_read` tinyint(4) NOT NULL DEFAULT '0',
  `oth_data_update` tinyint(4) NOT NULL DEFAULT '0',
  `oth_data_delete` tinyint(4) NOT NULL DEFAULT '0',
  `oth_user_read` tinyint(4) NOT NULL DEFAULT '0',
  `oth_user_update` tinyint(4) NOT NULL DEFAULT '0',
  `oth_user_delete` tinyint(4) NOT NULL DEFAULT '0',
  `policy_admin` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `policies_type_unique` (`type`)
);


DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `email` varchar(255)  NOT NULL,
  `token` varchar(255)  NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
);

DROP TABLE IF EXISTS `repositories`;
CREATE TABLE `repositories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `owner` int(11) NOT NULL,
  `alias` varchar(255)  NOT NULL,
  `filename` varchar(255)  NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `path` varchar(255)  DEFAULT NULL,
  `author` int(11) NOT NULL,
  `ispublic` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255)  NOT NULL,
  `email` varchar(255)   NOT NULL,
  `affiliation` varchar(255)   DEFAULT NULL,
  `tel` varchar(255)   DEFAULT NULL,
  `phone` varchar(255)   DEFAULT NULL,
  `verification_code` varchar(255)   DEFAULT NULL,
  `verified` tinyint(4) NOT NULL DEFAULT '0',
  `password` varchar(255)   NOT NULL,
  `remember_token` varchar(100)   DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `policy` varchar(255)   NOT NULL DEFAULT 'user',
  `mypic` varchar(255)   DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
);

DROP TABLE IF EXISTS `vcms_env`;
CREATE TABLE `vcms_env` (
  `var_key` varchar(255)   NOT NULL,
  `var_value` longtext   NOT NULL
);

DROP TABLE IF EXISTS `vcms_job`;
CREATE TABLE `vcms_job` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent` int(11) DEFAULT NULL,
  `project` int(11) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  `type` varchar(255)   DEFAULT NULL,
  `qinfo` json DEFAULT NULL,
  `status` varchar(32)   DEFAULT NULL,
  `pluginId` int(11) DEFAULT NULL,
  `jobBefore` json DEFAULT NULL,
  `jobNext` json DEFAULT NULL,
  `input` json DEFAULT NULL,
  `output` json DEFAULT NULL,
  `name` text  ,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `vcms_pages`;
CREATE TABLE `vcms_pages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` text   NOT NULL,
  `alias` text   NOT NULL,
  `contents` longtext   NOT NULL,
  `created` datetime NOT NULL,
  `isfront` tinyint(1) DEFAULT '0',
  `ispublic` tinyint(1) DEFAULT '0',
  `author` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `vcms_plugin`;
CREATE TABLE `vcms_plugin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text   NOT NULL,
  `role` varchar(255)   NOT NULL,
  `type` varchar(255)   NOT NULL,
  `script` longtext   NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `alias` varchar(255)   DEFAULT NULL,
  `author` int(11) NOT NULL,
  `ispublic` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `vcms_solvers`;
CREATE TABLE `vcms_solvers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `owner` int(11) NOT NULL,
  `author` varchar(255)   NOT NULL,
  `execcmd` text   NOT NULL,
  `version` varchar(255)   NOT NULL,
  `name` varchar(255)   NOT NULL,
  `path` varchar(255)   NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);


INSERT INTO `policies` VALUES (1,'admin',1,1,1,1,1,1,1,1,1,1,1,1,'2017-12-04 03:08:37','2017-12-04 23:58:59'),(2,'editor',1,1,1,1,1,1,0,0,0,0,0,0,'2017-12-04 03:45:29','2017-12-06 01:03:50'),(3,'user',1,1,1,1,1,1,0,0,0,0,0,0,'2017-12-04 03:49:03','2017-12-06 21:17:42'),(4,'anonymous',0,0,0,0,0,0,0,0,0,0,0,0,'2017-12-04 03:49:36','2017-12-04 03:49:36');
