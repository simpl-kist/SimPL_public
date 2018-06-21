-- MySQL dump 10.16  Distrib 10.2.13-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: simpl
-- ------------------------------------------------------
-- Server version	10.2.12-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `affiliation` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `verification_code` varchar(255) DEFAULT NULL,
  `verified` tinyint(4) NOT NULL DEFAULT 0,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `policy` varchar(255) NOT NULL DEFAULT 'user',
  `mypic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'jhlee','jhlee@virtuallab.co.kr','','','','amhsZWVAdmlydHVhbGxhYi5jby5rcg==',1,'$2y$10$mQrnOlrhDeaU55YiIdiLVeJdLZPO9U2FvXPNc17E80fwLblnZtfCO','CZfH7hKLcK1IwW3Wmg2ZXImpw63KAUBGqTpse9Eu0cSrpLeWuQqg8Aic36iX','2018-03-28 05:58:37','2018-03-28 08:02:52','admin','userpic/t0tXHTE8sdPlGPGqKXlK8OpmJYLRjh7dRiZXomqZ.gif'),(2,'tester','2lihf4bm@gmail.com','','','','MmxpaGY0Ym1AZ21haWwuY29t',1,'$2y$10$pUSm7UHMMoJPNAJOYSik3unaMAcPkl3Sdlge7eQwSbYXDj6wu9by6','IuB5STiw6ctlrUV0Loj4GsAc8X0JdOKdBGMYyAA4q8fjgqipeMfOD0uUHGaj','2018-03-28 07:22:38','2018-03-28 09:31:39','editor','YFPQW0jMWfGKLKNjYbuaV051lkMN374Q7uLFcOko.jpeg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vcms_plugin`
--

DROP TABLE IF EXISTS `vcms_plugin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vcms_plugin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `role` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `script` longtext NOT NULL,
  `includes` longtext NOT NULL DEFAULT '',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `author` int(11) NOT NULL,
  `ispublic` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vcms_plugin`
--

LOCK TABLES `vcms_plugin` WRITE;
/*!40000 ALTER TABLE `vcms_plugin` DISABLE KEYS */;
INSERT INTO `vcms_plugin` VALUES (1,'Hello SimPL','calculator','python','print json.dumps(\"Hello \"+kCms[\'input\'][\'name\'])','','2017-12-11 16:13:25','2017-12-11 16:20:01','hellosimpl',1,0),(2,'[SimPL Example] VASP Job Submit Example','calculator','python','fp=open(\"INCAR\",\"w\");\r\nfp.write(kCms[\'input\'][\'incar\'])\r\nfp.close()\r\nfp=open(\"POSCAR\",\"w\");\r\nfp.write(kCms[\'input\'][\'poscar\'])\r\nfp.close()\r\nfp=open(\"KPOINTS\",\"w\");\r\nfp.write(kCms[\'input\'][\'kpoints\'])\r\nfp.close()\r\nfp=open(\"POTCAR\",\"w\");\r\nfp.write(kCms[\'input\'][\'potcar\'])\r\nfp.close()\r\n\r\n\r\nvasp = getSolver(1)\r\nsolverExec = vasp[\'path\']\r\nqueueParams = {\'mpi\':True,\'solverExec\':solverExec,\'nnodes\':2,\'ppn\':4}\r\nqid = qsub(queueParams)\r\nprint qid','','2017-12-14 10:31:17','2017-12-14 12:13:51','simpl_ex_jobsubmit',1,0),(3,'[SimPL Example] Save Job Example','calculator','python','\"\"\"\r\nsaveJob : Save Data to database\r\n  args : object {\r\n    qinfo : , # json parsed queue Information\r\n    input : json, # json parsed Job Input\r\n    output : json, # json parsed Job output\r\n    name : string, # Job Name\r\n  }\r\n  qinfo should have (integer) id field\r\n  i.e,\r\n  qinfo : json.dumps({\"id\" : 12345})\r\n\"\"\"    \r\ndbid = saveJob({\r\n	\"qinfo\" : json.dumps({\"id\":12345}),\r\n    \"input\" : json.dumps({\"inputargs\":\"Hello World\"}),\r\n    \"output\" : json.dumps({})\r\n});\r\nprint json.dumps(dbid)','','2017-12-14 11:13:16','2017-12-14 12:12:48','simpl_ex_savejob',1,0),(4,'[SimPL default] Update Job Status','calculator','python','import xmltodict\r\n\r\njoblist = json.loads(getJobs({}))\r\nfor job in joblist:\r\n    jobid = job[\'id\']\r\n    qinfo = job[\'qinfo\']\r\n    try:\r\n        if qinfo == \"\":\r\n            \"\"\r\n        else :\r\n            qinfo = json.loads(job[\'qinfo\'])\r\n            qstat_ret = qstat(qinfo[\'id\'])\r\n            if qstat_ret == \"\":\r\n                if (os.path.isfile(job[\'jobdir\']+\"/finished\")) :\r\n                    qinfo[\'status\'] = \"F\"\r\n                else :\r\n                    qinfo[\'status\'] = \"D\"\r\n            else :\r\n                qjob = xmltodict.parse(qstat_ret)[\'Data\'][\'Job\']\r\n                qinfo[\'status\']=qjob[\'job_state\']\r\n                if qinfo[\'status\'] == \"C\":\r\n                    if (os.path.isfile(job[\'jobdir\']+\"/finished\")) :\r\n                        qinfo[\'status\'] = \"F\"\r\n                    else :\r\n                        qinfo[\'status\'] = \"D\"\r\n                  \r\n            saveJob({\"id\":jobid,\"qinfo\":json.dumps(qinfo),\"jobdir\":job[\'jobdir\']})\r\n\r\n    except Exception as e:\r\n        print e.message\r\n    ','','2017-12-14 12:07:14','2017-12-14 12:15:01','updateJobStat',1,0);
/*!40000 ALTER TABLE `vcms_plugin` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-03-29  7:29:41
