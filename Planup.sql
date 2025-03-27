CREATE DATABASE  IF NOT EXISTS `mollev545` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mollev545`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: mysql    Database: mollev545
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
INSERT INTO `Admins` VALUES (1,'admin','$2b$10$dVlAwL7ELq/Wf5TzIb840OzUj7xG0MvUtqZdd.cf8irXyss/20gT.');
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `City`
--

DROP TABLE IF EXISTS `City`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `City` (
  `CityID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`CityID`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `City`
--

LOCK TABLES `City` WRITE;
/*!40000 ALTER TABLE `City` DISABLE KEYS */;
INSERT INTO `City` VALUES (1,'Budapest'),(2,'Debrecen'),(3,'Szeged'),(4,'Miskolc'),(5,'Pécs'),(6,'Győr'),(7,'Nyíregyháza'),(8,'Kecskemét'),(9,'Székesfehérvár'),(10,'Szombathely'),(11,'Sopron'),(12,'Eger'),(13,'Veszprém'),(14,'Kaposvár'),(15,'Békéscsaba'),(16,'Zalaegerszeg'),(17,'Szolnok'),(18,'Tatabánya'),(19,'Keszthely'),(20,'Salgótarján'),(21,'Baja'),(22,'Vác'),(23,'Szekszárd'),(24,'Dunakeszi'),(25,'Hódmezővásárhely'),(26,'Cegléd'),(27,'Békés'),(28,'Dunaújváros'),(29,'Szigetszentmiklós'),(30,'Érd'),(31,'Kiskunfélegyháza'),(32,'Orosháza'),(33,'Mosonmagyaróvár'),(34,'Gyula'),(35,'Nagykanizsa'),(36,'Hajdúböszörmény'),(37,'Szentendre'),(38,'Jászberény'),(39,'Komló'),(40,'Siófok'),(41,'Tata'),(42,'Kazincbarcika'),(43,'Pápa'),(44,'Ajka'),(45,'Gyöngyös'),(46,'Kiskunhalas'),(47,'Mezőtúr'),(48,'Kalocsa'),(49,'Tiszavasvári'),(50,'Abony'),(51,'Bicske'),(52,'Dunaharaszti'),(53,'Fót'),(54,'Gödöllő'),(55,'Gönc'),(56,'Hatvan'),(57,'Jászárokszállás'),(58,'Karcag'),(60,'Kisvárda'),(61,'Makó'),(62,'Mezőkövesd'),(63,'Monor'),(64,'Nagykáta'),(65,'Nagykőrös'),(66,'Ózd'),(67,'Paks'),(68,'Pilisvörösvár'),(69,'Ráckeve'),(70,'Sárospatak'),(71,'Sátoraljaújhely'),(72,'Szigethalom'),(73,'Tiszafüred'),(74,'Törökszentmiklós'),(75,'Újfehértó'),(76,'Vásárosnamény'),(77,'Vecsés');
/*!40000 ALTER TABLE `City` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Programs`
--

DROP TABLE IF EXISTS `Programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Programs` (
  `ProgramID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Description` text COLLATE utf8mb4_general_ci,
  `Price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `Cost` tinyint(1) NOT NULL DEFAULT '0',
  `Duration` tinyint NOT NULL DEFAULT '1',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Location` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `Image` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `MoreInfoLink` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CityID` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`ProgramID`),
  KEY `CityID` (`CityID`),
  CONSTRAINT `Programs_ibfk_1` FOREIGN KEY (`CityID`) REFERENCES `City` (`CityID`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Programs`
--

LOCK TABLES `Programs` WRITE;
/*!40000 ALTER TABLE `Programs` DISABLE KEYS */;
INSERT INTO `Programs` VALUES (1,'Duna hajókirándulás','Városnéző hajóút Budapest látványosságai mentén.',0.00,1,1,'2025-03-17 09:32:10','Vigadó téri hajóállomás','duna-hajokirandulas.jpg','https://www.cruise-holidays.hu/hu/tipusok/dunai-hajoutak',1),(2,'Hop-On Hop-Off buszos városnézés','Fedezd fel Budapest nevezetességeit kényelmes busszal.',0.00,1,2,'2025-03-17 09:32:10','Clark Ádám tér','hop-on-hop-off-buszos-varosnezes.jpg','https://www.bigbustours.com/hu/budapest/budapesti-buszos-varosnezesek',1),(3,'Szent István Bazilika látogatás','Fedezd fel Budapest legnagyobb templomát és a kupolát.',0.00,0,1,'2025-03-17 09:32:10','Szent István Bazilika','szent-istvan-bazilika.jpg','https://bazilikabudapest.hu/',1),(4,'Romkocsmatúra','Ismerd meg Budapest híres romkocsmáit egy vezetett túrán.',0.00,1,1,'2025-03-17 09:32:10','Szimpla Kert','romkocsmatura-szimplakert.jpg','https://szimpla.hu/',1),(5,'Termálfürdő élmény','Pihenj Budapest híres termálfürdőiben, például a Széchenyiben.',0.00,1,2,'2025-03-17 09:32:10','Széchenyi Fürdő','termalfurdo-elmeny-szechenyi.jpg','https://www.szechenyifurdo.hu/',1),(6,'Parlament látogatás','Fedezd fel a magyar Parlament csodás épületét.',0.00,1,1,'2025-03-17 09:32:10','Országház','parlament-latogatas.jpg','https://www.parlament.hu/web/orszaghaz/latogatas',1),(7,'Gellért-hegyi kilátótúra','Túrázz fel a Gellért-hegyre és élvezd a panorámát.',0.00,0,1,'2025-03-17 09:32:10','Gellért-hegy','gellert-hegyi-kilato-tura.jpg','https://www.mozgasvilag.hu/turazas/turautak/gellert-hegy--szechenyi-hegy-tura',1),(8,'Margitszigeti piknik','Piknikezz és sétálj a Margitszigeten.',0.00,0,2,'2025-03-17 09:32:10','Margitsziget','margitszigeti-piknik-szokokut.jpg','https://g.co/kgs/mZbuieF',1),(9,'Sörkóstoló','Kóstold meg a Rízmájer Sörház különleges kézműves söreit.',0.00,1,1,'2025-03-17 09:32:10','Rizmájer Sörház','rizmajer-sorkostolas.jpg','https://rizmajersor.hu/',1),(10,'Múzeumlátogatás','Fedezd fel Budapest történelmét és művészetét egy múzeumban.',0.00,1,1,'2025-03-17 09:32:10','Magyar Nemzeti Múzeum','muzeumlatogatas-nemzeti-muzeum.jpg','https://mnm.hu/hu',1),(11,'Éjszakai városnéző séta','Fedezd fel Budapest fényeit egy esti sétán.',0.00,0,1,'2025-03-17 09:32:10','Váci utca','vaci-utca-esti-seta.jpg','https://hoponhopoff-budapest.com/hu/blog/ejszakai-varosnezes-top/',1),(12,'Gasztrotúra','Ismerd meg a magyar konyha különlegességeit.',0.00,1,1,'2025-03-17 09:32:10','Nagy Vásárcsarnok','gasztrotura-nagyvasarcsarnok.jpg','https://funzine.hu/2024/04/19/gasztro/kulvarosi-gasztrotura-6-hely-budapesten-ahol-isteni-falatok-es-festoi-tajak-varnak/',1),(13,'Escape Room élmény','Próbáld ki Budapest legizgalmasabb szabadulószobáit.',0.00,1,1,'2025-03-17 09:32:10','Mystique Room','escape-room-elmeny.jpg','https://paniqszoba.hu/',1),(14,'Jazz koncert','Élvezd a budapesti jazz klubok élőzenés előadásait.',0.00,1,1,'2025-03-17 09:32:10','Opus Jazz Club','jazz-koncert-opus-jazz-club.jpg','https://www.bjc.hu/',1),(15,'Folyami vacsorás hajózás','Élvezd a dunai hajózást egy elegáns vacsorával.',0.00,1,1,'2025-03-17 09:32:10','Duna Corso hajóállomás','duna-corso-hajovacsora.jpg','https://budapestrivercruise.eu/hu/',1),(16,'Kalandpark és kötélpálya','Próbáld ki Budapest egyik kalandparkját.',0.00,1,1,'2025-03-17 09:32:10','Challengeland Kalandpálya','challengeland-kalandpalya.jpg','https://orczykalandpark.eu/',1),(17,'Street Art túra','Ismerd meg Budapest utcai művészetét egy vezetett túrán.',0.00,0,1,'2025-03-17 09:32:10','VIII. kerület - Corvin negyed','corvin-streetart-tour.jpg','https://budapestflow.com/budapest-street-art-guide/',1),(18,'Bringatúra Budapesten','Fedezd fel a várost biciklivel egy csoportos túrán.',0.00,1,2,'2025-03-17 09:32:10','Margitsziget - bringakölcsönző','margit-sziget-bickli.jpg','https://www.bajabikes.eu/en/budapest-highlights-bike-tour/?gad_source=1&gclid=CjwKCAiAqrG9BhAVEiwAaPu5zmSKvrd9iGgfmEoivNI4viP3zWBEJLpkEESZBVknksDGXJ7YD2SFDhoCsysQAvD_BwE',1),(19,'Óriáskerék élmény','Csodáld meg Budapest látképét az óriáskerékről.',0.00,1,1,'2025-03-17 09:32:10','Budapest Eye - Erzsébet tér','budapest-eye.jpg','https://oriaskerek.com/',1),(20,'Hajnali fotótúra','Fényképezd le Budapest legszebb helyeit a napfelkeltében.',0.00,0,1,'2025-03-17 09:32:10','Halászbástya','halaszbastya-fotozasok.jpg','https://www.getyourguide.com/hu-hu/budapest-l29/fotos-turak-tc19/',1),(21,'Futóverseny a Városligetben','Vegyél részt egy budapesti amatőr futóversenyen.',0.00,0,1,'2025-03-17 09:32:10','Városliget','varosliget-futas.jpg','https://www.ligetelmenyfutas.hu/',1),(22,'Sétahajózás pezsgővel','Lélegzetelállító kilátás pezsgővel egybekötve a Dunán.',0.00,1,1,'2025-03-17 09:32:10','Vigadó tér','setahajozas-pezsgovel-vigadoter.jpg','https://silver-line.hu/hu/termek/korlatlan-pezsgo-es-bor-hajout/',1),(23,'Kirándulás a Normafára','Túrázz fel a Normafára és élvezd a természetet.',0.00,0,2,'2025-03-17 09:32:10','Normafa','normafa.jpg','https://normafapark.hu/turautvonalak',1),(24,'Opera előadás','Élvezd a budapesti operaház egyik klasszikus előadását.',0.00,1,1,'2025-03-17 09:32:10','Magyar Állami Operaház','operahaz.jpg','https://www.opera.hu/hu/',1),(25,'Sörkóstoló','Kóstold meg a magyar kézműves söröket egy vezetett sörkóstolón.',0.00,1,1,'2025-03-17 09:32:10','First Craft Beer Bár','first-craft-beer-bar.jpg','https://shop.firstcraftbeer.com/',1),(26,'Vízi biciklizés a Városligeti tónál','Kölcsönözz egy vízibiciklit és fedezd fel a Városligeti tavat.',0.00,1,1,'2025-03-17 09:32:10','Városligeti Tó','vizibicikli-varosligeti.jpg','https://csonakazoto.hu/',1),(27,'Karaoke est','Énekelj barátaiddal egy budapesti karaoke bárban.',0.00,1,1,'2025-03-17 09:32:10','Blue Bird Karaoke','karaoke-bluebird.jpg','https://bbrooms.hu/',1),(28,'Extrém kalandpark','Próbáld ki az extrém kötélpályát és mászófalakat.',0.00,1,1,'2025-03-17 09:32:10','Római Kalandpark','extrem-kalandpark.jpg','https://budakeszivadaspark.hu/kalandpark/',1),(29,'Táncóra egy profi oktatóval','Tanulj meg latin vagy társastáncot egy professzionális tanártól.',0.00,1,1,'2025-03-17 09:32:10','Salsa Diabolica Tánciskola','tancora.jpg','https://goldance.hu/',1),(30,'Szabadulószoba horror tematikával','Tedd próbára a bátorságodat egy horror szabadulószobában.',0.00,1,1,'2025-03-17 09:32:10','Neverland Szabadulószoba','horror-szabaduloszoba.jpg','https://questhunter.hu/category/quest_themes/horror/',1),(31,'Kézműves workshop','Készítsd el saját ékszeredet vagy dísztárgyadat egy workshopon.',0.00,1,1,'2025-03-17 09:32:10','Paloma Budapest','kezmuves-workshop.jpg','https://viragbuborekmuhely.hu/',1),(32,'Szabadtéri jóga a Városligetben','Lazíts és töltekezz fel szabadtéri jógaórán.',0.00,0,3,'2025-03-17 09:32:10','Városliget','szabadteri-joga-varosliget.jpg','https://downdogjoga.hu/szabadteri-jogaora',1),(33,'Duna-parti sétatúra','Fedezd fel a budapesti rakpart történelmét egy vezetett sétán.',0.00,0,3,'2025-03-17 09:32:10','Duna-part','dunaparti-seta.jpg','https://budapestcity.org/egyeb/kirandulas/seta/seta-a-pesti-duna-parton.html',1),(34,'Dunaparti futóverseny','Csatlakozz egy ingyenes közösségi futáshoz a Dunaparton.',0.00,0,3,'2025-03-17 09:32:10','Duna-part','dunaparti-futoverseny.jpg','https://futonaptar.hu/',1),(35,'Szabadtéri filmvetítés','Élvezd az esti filmvetítéseket Budapest különböző pontjain.',0.00,0,3,'2025-03-17 09:32:10','Városligeti Mozi','szabadteri-filmvetites.jpg','https://budapestgarden.com/kertmozi',1),(36,'Gellért-hegyi napfelkelte túra','Csodáld meg a napfelkeltét a város felett.',0.00,0,3,'2025-03-17 09:32:10','Gellért-hegy','gellert-hegyi-napfelkelte.jpg','https://www.dunaipoly.hu/hu/program/napfelkelte-a-sas-hegyen',1),(37,'Ingyenes múzeumi nap','Fedezd fel Budapest múzeumait a havonta egyszer ingyenes napokon.',0.00,0,3,'2025-03-17 09:32:10','Ludwig Múzeum','ingyenes-muzeum.jpg','https://minimatine.hu/mikor-ingyenesek-a-muzeumok/',1),(38,'Szabadtéri koncertek','Élvezd a város különböző pontjain megrendezett ingyenes koncerteket.',0.00,0,3,'2025-03-17 09:32:10','Kobuci Kert','szabadteri-koncert.jpg','https://www.budapestpark.hu/',1),(39,'Bringás túra a Budai-hegységben','Ingyenes szervezett kerékpártúra a Budai-hegységben.',0.00,0,3,'2025-03-17 09:32:10','Normafa','bringastura-normafa.jpg','https://www.welovecycling.com/hu/biciklivel-tesztelve/budai-hegyek-tura-normafa-harshegy-huvosvolgy/',1),(40,'Utcazenei fesztivál','Hallgasd Budapest legjobb utcazenészeit ingyenes fesztiválokon.',0.00,0,3,'2025-03-17 09:32:10','Gozsdu Udvar','utcazene-fesztival.jpg','https://facebook.com',1),(41,'Természetjárás a Róka-hegyen','Kirándulj a Róka-hegyre és fedezd fel Budapest rejtett természeti szépségeit.',0.00,0,3,'2025-03-17 09:32:10','Róka-hegy','termeszetjaras-rokahegy.jpg','https://www.termeszetjaro.hu/hu/tour/gyalogtura/ko-koevoen-foeldtoerteneti-seta-a-roka-hegy-sziklaudvaraiban/29624082/',1),(42,'Ingyenes városnéző séta','Csatlakozz egy ingyenes idegenvezetéses városnézéshez.',0.00,0,3,'2025-03-17 09:32:10','Váci utca','ingyenes-varosnezes.jpg','http://www.budapestvarosnezes.hu/varosnezesek.php',1),(43,'Kulturális fesztivál a Várkert Bazárban','Élvezd a színes kulturális eseményeket Budapest egyik legszebb helyszínén.',0.00,0,3,'2025-03-17 09:32:10','Várkert Bazár','kulturalis-fesztival.jpg','https://varkertbazar.hu/',1),(44,'Ingyenes sportnap a Városligetben','Vegyél részt ingyenes edzéseken és sportprogramokon.',0.00,0,3,'2025-03-17 09:32:10','Városliget','ingyenes-sportnap.jpg','https://facebook.com',1),(45,'Gourmet Street Food Nap','Próbáld ki a legjobb street food ételeket ingyenes kóstolókkal.',0.00,0,3,'2025-03-17 09:32:10','Bálna Budapest','gourmet-street-food.jpg','https:// ourmetfesztival.hu/hu/',1),(46,'Kézműves vásár','Fedezd fel Budapest helyi kézműveseinek termékeit.',0.00,0,3,'2025-03-17 09:32:10','Fény Utcai Piac','kezmuves-vasar.jpg','https://hellopiac.hu/',1),(47,'Nyílt nap az Operában','Tekints be a Magyar Állami Operaház kulisszatitkaiba ingyenesen.',0.00,0,3,'2025-03-17 09:32:10','Magyar Állami Operaház','nyilt-nap-opera.jpg','https://www.opera.hu/hu/musor/2024-2025/a-magyar-nemzeti-balett-nyilt-napjai-20242025-2024/77665-eloadas-202504261100/',1),(48,'Történelmi séta Budapesten','Vezetett túra Budapest történelmi emlékhelyein.',0.00,0,3,'2025-03-17 09:32:10','Budai Vár','tortenelmi-seta.jpg','https://facebook.com',1),(49,'Ingyenes kiállítás a Millenárison','Fedezd fel az aktuális művészeti kiállításokat.',0.00,0,3,'2025-03-17 09:32:10','Millenáris Park','ingyenes-kiallitas.jpg','https://millenaris.hu/programok/',1),(50,'Dunakorzó esti séta','Csodáld meg a Duna-part fényeit egy kellemes esti sétán.',0.00,0,3,'2025-03-17 09:32:10','Dunakorzó','dunakorz-est.jpg','https://maps.app.goo.gl/ZF9JAjT6CRgMRqLr9',1),(51,'Paintball','Vegyétek fel a harcot, küzdjetek meg egymással, ne hagyjátok hogy egy cseppnyi festék is érjen titeket!',0.00,1,3,'2025-03-17 09:32:10','Budapest','paintball.jpg','https://patriotspaintball.hu/',1),(52,'Lézerharc','Vegyétek fel a harcot, küzdjetek meg egymással, ne hagyjátok hogy a lézer eltaláljon!',0.00,1,3,'2025-03-17 09:32:10','Budapest','lezerharc.jpg','https://laserforcebudapest.hu/',1),(53,'Társasjátékozás','Mérjétek össze tudásotokat vagy szerencséteket egy jó társasjátékban, esetleg egy jó hideg sör társaságában!',0.00,1,3,'2025-03-17 09:32:10','Budapest','tarsasjatek_sorozgetes.jpg','https://boardgamecafe.hu/en/a-tarsasjatekos-kavezo',1),(54,'Plázázás','Fedezzétek fel Budapest plázáit, vesszetek el a kirakatokban.',0.00,0,1,'2025-03-17 09:32:10','Budapest','plazazas-shoppingolas.jpg','https://westend.hu/',1),(55,'Kolodko szobor keresés','Fedezd fel Budapest rejtett kis mini szobrait, találd meg mindet!',0.00,0,1,'2025-03-17 09:32:10','Budapest','kolodko-szobor.jpg','https://www.kozterkep.hu/alkotok/megtekintes/6186/kolodko-mihaly',1),(59,'Szegedi Élményfürdő','Kikapcsolódás a szegedi Anna élményfürdőben',0.00,1,2,'2025-03-19 08:37:21','Szeged','1742373436220-184446495.jpg','https://www.termalfurdo.hu/furdo/anna-gyogy-termal-es-elmenyfurdo-94',3),(60,'Horgászás Abonyban','Horgászás az abonyi horgásztónál ',0.00,1,2,'2025-03-21 09:10:17','Abonyi Horgásztó','1742548195535-48516884.jpg','http://www.abonyhorgasz.hu/ujoldal/',50),(61,'Tűzmadár látogatás ','Nézzétek meg a híres Tűzmadarat abonyban',0.00,0,1,'2025-03-21 09:16:41','Abony, Táborhegy dűlő 12, 2740','1742548591566-987702506.jpg','https://bit.ly/4hAgxWg',50),(62,'Kristályfürdő Ajkán','Szórakozzatok az ajkai kristályfürdőben',0.00,1,2,'2025-03-21 09:22:54','Ajka, Városliget 1320/1, 8400','1742548968528-692334086.jpg','http://www.kristalyfurdo.hu/site/?f=1&p=581',44),(63,'Csónakázás Ajkán','Csónakázzatok barátaiddal és kis kedvenceiddel az ajaki csónakázó tavon',0.00,0,1,'2025-03-21 09:27:33','Ajka, 8400','1742549246678-992174588.jpg','https://bit.ly/4bUAwOf',44),(64,'Türr István kilátó','Nézzétek meg a naplementét a csodás Türr István kilátóban',0.00,0,1,'2025-03-21 13:00:23','Türr István kilátó','1742562014962-897018763.jpg','https://bit.ly/4iUqBuh',21),(65,'Duna Wellness Hotel','Élvezzétek a wellnessi vendéglátását a bajai wellness hotelnek',0.00,1,3,'2025-03-21 13:11:25','Duna Wellness Hotel','1742562680862-774118178.jpg','http://hotelduna.hu/',21),(66,'Békési Gyógyfürdő','Üdüljetek Békés leghíresebb gyógyfürdőjébe és relaxáljatok egy jót.',0.00,1,2,'2025-03-24 10:03:53','Kőrösi Csoma Sándor utca','1742810524087-801917109.jpg','http://bekesifurdo.hu/',27),(68,'Bagoly Vendéglő','Ebédeljetek vagy vacsorázzatok a békésen található Bagoly vendéglőbe.',0.00,1,1,'2025-03-24 10:27:54','Dózsa-liget','1742812036692-62084817.jpg','https://bagolyvendeglo.hu/',27),(69,'Kerékpározás Békéscsabán','Kerékpározzatok végig Békéscsaba híres kerékpár útján és nézzetek meg látványosságokat az út közben.',0.00,0,2,'2025-03-24 10:56:00','Unnamed Road ','1742813755847-718041846.jpg','https://www.wenckheimkerekparut.hu/hu/',15),(70,'Munkácsy Mihály Múzeum','Látogassátok meg békéscsabán a híres Munkácsy Mihály Múzeumot egy kultúrális délután keretén belűl.',0.00,1,1,'2025-03-24 11:02:57','Széchenyi utca','1742814173392-906376161.jpg','https://munkacsy.hu/',15),(71,'Randevú Cukrászda','Randevúzzatok a Randevú Cukrászdába és garantált hogy az édes szájuak egymásra találnak',0.00,1,1,'2025-03-25 11:17:03','Kossuth utca','1742901423031-138723576.jpg','https://randevu-cukraszda.uzleti.hu/',51);
/*!40000 ALTER TABLE `Programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RoomParticipants`
--

DROP TABLE IF EXISTS `RoomParticipants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RoomParticipants` (
  `ParticipantID` int NOT NULL AUTO_INCREMENT,
  `RoomID` int NOT NULL,
  `UserID` int NOT NULL,
  `isReady` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`ParticipantID`),
  KEY `RoomID` (`RoomID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `RoomParticipants_ibfk_1` FOREIGN KEY (`RoomID`) REFERENCES `Rooms` (`RoomID`) ON DELETE CASCADE,
  CONSTRAINT `RoomParticipants_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RoomParticipants`
--

LOCK TABLES `RoomParticipants` WRITE;
/*!40000 ALTER TABLE `RoomParticipants` DISABLE KEYS */;
INSERT INTO `RoomParticipants` VALUES (7,4,6,0),(8,4,6,0),(10,4,3,0),(11,4,4,0),(13,4,3,0),(35,12,3,0),(36,26,3,0),(37,27,3,0),(38,27,3,0),(39,27,3,0),(40,27,6,0),(41,27,3,0),(42,28,3,0),(43,28,3,0),(44,28,6,0),(45,28,3,0),(46,30,3,0),(48,33,3,0),(50,33,6,0),(62,1,6,0),(67,43,3,0),(75,49,6,0),(78,51,6,1),(79,52,6,0),(87,55,6,1),(92,59,6,1),(94,64,6,0),(98,68,6,1),(102,69,6,1),(103,70,6,1),(106,71,4,1),(109,73,4,0),(111,75,4,1),(112,75,6,1),(114,77,6,1),(116,79,6,0),(117,80,6,0),(119,82,6,1),(121,84,6,1),(122,85,6,1),(124,87,6,1),(125,88,6,1),(135,98,6,1),(136,99,9,1),(140,102,6,1),(141,103,6,1),(142,104,6,1),(143,105,6,1),(144,106,6,1),(145,107,6,1),(146,108,6,1),(147,109,6,1),(148,110,6,1),(149,111,6,1),(151,113,6,1),(152,114,6,1),(154,116,6,0),(158,120,6,1),(159,121,6,1),(160,122,6,1),(161,123,6,1),(162,124,6,1),(163,125,6,1),(164,126,6,1),(165,127,6,1),(167,129,6,1),(169,131,4,1),(172,134,6,0),(174,136,6,1),(175,136,4,1),(176,137,6,1),(177,137,4,1),(178,138,4,0),(181,140,4,1),(182,140,6,1),(184,141,4,1),(185,142,6,0),(189,146,4,1),(190,146,6,1),(191,147,6,0),(192,148,6,0);
/*!40000 ALTER TABLE `RoomParticipants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rooms`
--

DROP TABLE IF EXISTS `Rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rooms` (
  `RoomID` int NOT NULL AUTO_INCREMENT,
  `RoomCode` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `CreatedByUserID` int NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RoomID`),
  UNIQUE KEY `RoomCode` (`RoomCode`),
  KEY `CreatedByUserID` (`CreatedByUserID`),
  CONSTRAINT `Rooms_ibfk_1` FOREIGN KEY (`CreatedByUserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rooms`
--

LOCK TABLES `Rooms` WRITE;
/*!40000 ALTER TABLE `Rooms` DISABLE KEYS */;
INSERT INTO `Rooms` VALUES (1,'55AC55A1',2,'2025-03-14 12:57:02'),(2,'3FAFBD79',2,'2025-03-14 13:01:07'),(3,'88463365',2,'2025-03-14 13:04:54'),(4,'164F76D4',6,'2025-03-17 09:01:46'),(5,'31557D1B',2,'2025-03-17 09:17:59'),(6,'ABF05983',2,'2025-03-17 09:18:22'),(7,'6C55F122',2,'2025-03-17 09:21:18'),(8,'667ECC01',2,'2025-03-17 09:23:06'),(9,'10A088AC',2,'2025-03-17 09:23:29'),(10,'32F24421',2,'2025-03-17 09:23:36'),(11,'07D65FCD',2,'2025-03-17 09:23:48'),(12,'F9E78692',2,'2025-03-17 09:26:08'),(13,'23BD8BC6',2,'2025-03-17 09:29:55'),(14,'2DF5F8F4',2,'2025-03-17 09:30:04'),(15,'B8F1533C',2,'2025-03-17 09:30:58'),(16,'1A0B9FD2',2,'2025-03-17 09:31:02'),(17,'13C1FEDC',2,'2025-03-17 09:51:10'),(18,'B302231E',6,'2025-03-17 09:55:47'),(19,'824D2C32',6,'2025-03-17 09:55:53'),(20,'112D6B20',6,'2025-03-17 09:55:55'),(21,'2B5FD9E3',6,'2025-03-17 09:58:53'),(22,'BDE778E0',6,'2025-03-17 09:59:09'),(23,'2A498493',6,'2025-03-17 10:01:25'),(24,'10BBECEB',6,'2025-03-17 10:03:13'),(25,'AD39821B',6,'2025-03-17 10:04:47'),(26,'653F0883',6,'2025-03-17 10:06:22'),(27,'8300B2EE',6,'2025-03-17 10:08:28'),(28,'53C36099',6,'2025-03-17 10:19:28'),(29,'E39458F1',6,'2025-03-17 10:22:03'),(30,'F5D1B369',6,'2025-03-17 10:25:25'),(31,'33A9D58E',6,'2025-03-17 10:27:22'),(32,'EC61145C',6,'2025-03-17 10:28:28'),(33,'5F2A1402',6,'2025-03-17 10:29:03'),(34,'B6C9FEA6',6,'2025-03-17 10:47:37'),(35,'3C6D959F',6,'2025-03-17 10:56:17'),(36,'A4A338A5',6,'2025-03-17 11:21:49'),(37,'6E6EFB1E',6,'2025-03-18 07:05:07'),(38,'5CBA84C6',6,'2025-03-18 07:08:26'),(39,'C4BB157C',6,'2025-03-18 07:10:41'),(40,'379089E1',6,'2025-03-18 07:13:11'),(41,'6B6D97ED',6,'2025-03-18 07:30:12'),(42,'165C70C7',6,'2025-03-18 07:50:46'),(43,'A26860D7',6,'2025-03-18 07:57:14'),(44,'3575F6CD',2,'2025-03-18 08:20:24'),(45,'1E43F8B6',6,'2025-03-18 08:24:22'),(46,'9CD3F7D0',6,'2025-03-18 08:33:06'),(47,'B88C0F45',6,'2025-03-18 08:40:20'),(48,'2C9E9492',2,'2025-03-18 08:44:48'),(49,'80C1E4A5',2,'2025-03-18 08:49:38'),(50,'D58CB37F',6,'2025-03-18 08:53:46'),(51,'F4A7B135',2,'2025-03-18 09:01:33'),(52,'19A181D3',2,'2025-03-18 09:05:22'),(53,'E8946433',2,'2025-03-18 09:15:12'),(54,'0E8781DF',6,'2025-03-18 09:19:55'),(55,'D4A80D97',2,'2025-03-18 09:30:37'),(56,'50290819',6,'2025-03-18 09:31:37'),(57,'649A91E9',6,'2025-03-18 09:52:00'),(58,'EB3540CB',6,'2025-03-18 10:12:09'),(59,'1E691E66',2,'2025-03-18 10:14:35'),(60,'27CAC0FC',6,'2025-03-18 10:19:59'),(61,'1239061F',6,'2025-03-18 10:22:46'),(62,'71DFC638',6,'2025-03-18 10:22:58'),(63,'4BC460DA',6,'2025-03-18 10:28:12'),(64,'35EEEB90',2,'2025-03-18 10:47:48'),(65,'D1DBB559',6,'2025-03-18 10:59:50'),(66,'FFE5A524',2,'2025-03-18 11:01:48'),(67,'7A1B9E01',2,'2025-03-18 11:03:50'),(68,'68C3AE39',2,'2025-03-18 11:06:05'),(69,'8654E9A0',2,'2025-03-18 11:13:03'),(70,'2600B93D',6,'2025-03-18 11:20:18'),(71,'E91C2D4F',4,'2025-03-18 11:22:52'),(72,'7B8ADB5E',4,'2025-03-19 06:50:44'),(73,'B685D006',4,'2025-03-19 06:58:13'),(74,'CC98A38B',6,'2025-03-19 07:13:42'),(75,'8E318427',4,'2025-03-19 07:37:48'),(76,'60B42428',6,'2025-03-19 08:05:16'),(77,'99302AF3',6,'2025-03-19 08:09:58'),(78,'BA8971A7',6,'2025-03-19 08:13:33'),(79,'73EB20CA',6,'2025-03-19 08:43:56'),(80,'12D6C95B',6,'2025-03-19 08:56:53'),(81,'5AB7A390',6,'2025-03-19 09:24:17'),(82,'E8579594',6,'2025-03-19 09:26:48'),(83,'A64BD1F6',6,'2025-03-20 09:49:43'),(84,'30A004F2',6,'2025-03-20 10:06:21'),(85,'4A33DBAC',6,'2025-03-20 10:23:09'),(86,'D8333AD8',4,'2025-03-20 10:52:10'),(87,'A90F842C',6,'2025-03-20 10:52:42'),(88,'89A4C3CF',6,'2025-03-20 10:58:21'),(89,'15D63DB8',6,'2025-03-20 11:07:07'),(90,'0707E68E',6,'2025-03-20 11:19:38'),(91,'1C3B902B',6,'2025-03-20 11:20:00'),(92,'168BAC50',6,'2025-03-20 11:22:51'),(93,'EED61947',6,'2025-03-20 11:23:30'),(94,'713EF754',6,'2025-03-20 11:23:51'),(95,'FEDC1F73',6,'2025-03-20 11:52:21'),(96,'3B67B5B5',6,'2025-03-20 11:53:27'),(97,'60779112',6,'2025-03-20 12:14:25'),(98,'7E306DFE',6,'2025-03-20 12:17:27'),(99,'DCE83EDE',9,'2025-03-21 09:16:07'),(100,'8718601A',6,'2025-03-21 09:25:17'),(101,'F9A37A1A',6,'2025-03-21 09:25:33'),(102,'F25BC673',6,'2025-03-21 09:32:37'),(103,'0832AA35',6,'2025-03-21 09:49:00'),(104,'10CF0878',6,'2025-03-21 10:01:57'),(105,'7D73E5F4',6,'2025-03-21 10:07:48'),(106,'480D6647',6,'2025-03-21 10:11:17'),(107,'EFA75AB2',6,'2025-03-21 10:18:09'),(108,'8B087487',6,'2025-03-21 10:18:51'),(109,'7E8227B2',6,'2025-03-21 10:21:34'),(110,'47CEBCFD',6,'2025-03-21 10:22:24'),(111,'5FD92AD5',6,'2025-03-21 10:24:51'),(112,'069CD2C0',6,'2025-03-21 11:51:04'),(113,'B06D0992',6,'2025-03-21 11:54:30'),(114,'B6C03531',6,'2025-03-21 12:04:24'),(115,'618FE8B5',6,'2025-03-21 12:20:16'),(116,'54D67B17',6,'2025-03-21 12:20:28'),(117,'DFFDA41C',6,'2025-03-21 12:54:47'),(118,'0C5B05F1',6,'2025-03-21 12:54:57'),(119,'C589F358',6,'2025-03-21 13:06:07'),(120,'BF0A881E',6,'2025-03-24 08:54:48'),(121,'D53B30E0',6,'2025-03-24 09:01:58'),(122,'C5F1396B',6,'2025-03-24 09:08:57'),(123,'9A2AB5EF',6,'2025-03-24 09:20:29'),(124,'2E97AD83',6,'2025-03-24 10:03:24'),(125,'F4210317',6,'2025-03-24 10:07:29'),(126,'8469C6E0',6,'2025-03-24 10:11:12'),(127,'A1748E58',6,'2025-03-24 10:23:10'),(128,'DFDE2817',6,'2025-03-24 10:45:47'),(129,'EFDA54EB',6,'2025-03-24 10:58:41'),(130,'3431C2C5',4,'2025-03-25 10:18:19'),(131,'C405FA20',4,'2025-03-25 10:19:24'),(132,'9CD26E84',6,'2025-03-26 07:27:45'),(133,'51D40393',6,'2025-03-26 07:28:35'),(134,'9CBF7737',6,'2025-03-26 07:29:34'),(135,'E6AD63CC',6,'2025-03-26 09:11:05'),(136,'E2B89671',6,'2025-03-26 09:14:57'),(137,'2D1820CB',6,'2025-03-26 11:59:28'),(138,'001C7BD8',4,'2025-03-27 08:54:45'),(139,'154B075A',4,'2025-03-27 09:12:21'),(140,'84A20F12',4,'2025-03-27 09:20:07'),(141,'1CEDBCC8',6,'2025-03-27 10:40:02'),(142,'40ADBA00',6,'2025-03-27 10:46:20'),(143,'0433972D',6,'2025-03-27 10:53:22'),(144,'AF8C228A',6,'2025-03-27 10:53:52'),(145,'15B7698A',6,'2025-03-27 10:54:48'),(146,'94BF5D01',4,'2025-03-27 10:57:02'),(147,'D69AE63B',6,'2025-03-27 11:05:25'),(148,'6FB81039',6,'2025-03-27 11:05:46'),(149,'49BEA3D8',6,'2025-03-27 11:07:48'),(150,'5C353329',6,'2025-03-27 11:08:27'),(151,'F2493BD8',4,'2025-03-27 11:45:22'),(152,'E634BBF5',6,'2025-03-27 11:45:48'),(153,'C3593CC2',6,'2025-03-27 11:46:24'),(154,'7C938337',4,'2025-03-27 11:49:09'),(155,'3675D5F4',6,'2025-03-27 11:49:18'),(156,'5CEADA6D',6,'2025-03-27 11:49:58'),(157,'17326828',6,'2025-03-27 11:50:33'),(158,'3CF7DD7F',6,'2025-03-27 11:54:34'),(159,'5F60787A',6,'2025-03-27 11:57:33'),(160,'1AADF1B5',6,'2025-03-27 12:01:06');
/*!40000 ALTER TABLE `Rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SwipeActions`
--

DROP TABLE IF EXISTS `SwipeActions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SwipeActions` (
  `SwipeID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `ProgramID` int NOT NULL,
  `Action` enum('like','dislike') COLLATE utf8mb4_general_ci NOT NULL,
  `Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SwipeID`),
  KEY `UserID` (`UserID`),
  KEY `ProgramID` (`ProgramID`),
  CONSTRAINT `SwipeActions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `SwipeActions_ibfk_2` FOREIGN KEY (`ProgramID`) REFERENCES `Programs` (`ProgramID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=695 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SwipeActions`
--

LOCK TABLES `SwipeActions` WRITE;
/*!40000 ALTER TABLE `SwipeActions` DISABLE KEYS */;
INSERT INTO `SwipeActions` VALUES (65,8,54,'dislike','2025-03-21 08:59:22'),(67,8,19,'dislike','2025-03-21 08:59:36'),(68,8,34,'dislike','2025-03-21 08:59:40'),(69,8,39,'dislike','2025-03-21 08:59:46'),(330,4,61,'dislike','2025-03-26 09:16:50'),(331,4,61,'dislike','2025-03-26 09:16:51'),(332,4,60,'dislike','2025-03-26 09:16:51'),(333,4,60,'dislike','2025-03-26 09:16:51'),(503,4,68,'like','2025-03-27 09:16:17'),(504,4,66,'like','2025-03-27 09:16:17'),(510,4,6,'dislike','2025-03-27 09:19:54'),(513,4,63,'like','2025-03-27 09:20:47'),(514,4,62,'like','2025-03-27 09:20:50'),(515,4,60,'like','2025-03-27 09:21:05'),(516,4,61,'like','2025-03-27 09:21:06'),(519,4,38,'like','2025-03-27 09:21:48'),(520,4,36,'like','2025-03-27 09:21:49'),(522,4,3,'like','2025-03-27 09:21:49'),(523,4,17,'like','2025-03-27 09:21:50'),(525,4,24,'like','2025-03-27 09:21:50'),(526,4,10,'like','2025-03-27 09:21:50'),(528,4,55,'like','2025-03-27 09:21:51'),(529,4,7,'like','2025-03-27 09:21:52'),(530,4,22,'like','2025-03-27 09:21:52'),(532,4,2,'like','2025-03-27 09:21:53'),(534,4,28,'like','2025-03-27 09:21:54'),(536,4,6,'like','2025-03-27 09:21:54'),(538,4,48,'like','2025-03-27 09:21:55'),(540,4,21,'like','2025-03-27 09:21:56'),(542,4,52,'like','2025-03-27 09:21:57'),(544,4,12,'like','2025-03-27 09:21:58'),(545,4,43,'like','2025-03-27 09:21:58'),(547,4,23,'like','2025-03-27 09:21:59'),(549,4,54,'like','2025-03-27 09:22:01'),(550,4,42,'like','2025-03-27 09:22:01'),(551,4,50,'like','2025-03-27 09:22:01'),(555,4,30,'like','2025-03-27 09:22:06'),(556,4,13,'like','2025-03-27 09:22:07'),(557,4,26,'like','2025-03-27 09:22:07'),(558,4,16,'like','2025-03-27 09:22:07'),(559,4,9,'like','2025-03-27 09:22:07'),(560,4,14,'like','2025-03-27 09:22:07'),(561,4,1,'like','2025-03-27 09:22:07'),(562,4,27,'like','2025-03-27 09:22:08'),(563,4,19,'like','2025-03-27 09:22:08'),(565,4,25,'like','2025-03-27 09:22:08'),(566,4,4,'like','2025-03-27 09:22:08'),(567,4,31,'like','2025-03-27 09:22:08'),(568,4,15,'like','2025-03-27 09:22:08'),(570,4,29,'like','2025-03-27 09:22:09'),(620,4,64,'like','2025-03-27 10:57:43'),(621,4,65,'like','2025-03-27 10:57:43'),(631,4,64,'like','2025-03-27 11:01:19'),(632,4,65,'like','2025-03-27 11:01:19'),(633,4,21,'dislike','2025-03-27 11:27:17'),(634,4,30,'dislike','2025-03-27 11:27:18'),(635,4,61,'dislike','2025-03-27 11:27:19'),(636,4,37,'dislike','2025-03-27 11:27:19'),(637,4,70,'dislike','2025-03-27 11:27:19'),(638,4,71,'dislike','2025-03-27 11:27:19'),(639,4,31,'dislike','2025-03-27 11:27:19'),(640,4,27,'dislike','2025-03-27 11:27:19'),(641,4,41,'dislike','2025-03-27 11:27:19'),(642,4,68,'dislike','2025-03-27 11:27:20'),(643,4,14,'dislike','2025-03-27 11:27:20'),(644,4,28,'dislike','2025-03-27 11:27:20'),(645,4,20,'dislike','2025-03-27 11:27:20'),(646,4,29,'dislike','2025-03-27 11:27:20'),(647,4,38,'dislike','2025-03-27 11:27:21'),(648,4,53,'dislike','2025-03-27 11:27:21'),(649,4,34,'dislike','2025-03-27 11:27:21'),(650,4,59,'dislike','2025-03-27 11:27:21'),(651,4,13,'dislike','2025-03-27 11:27:21'),(652,4,8,'dislike','2025-03-27 11:27:22'),(653,4,33,'dislike','2025-03-27 11:27:22'),(654,4,10,'dislike','2025-03-27 11:27:22'),(655,4,63,'dislike','2025-03-27 11:27:22'),(656,4,7,'dislike','2025-03-27 11:27:22'),(657,4,42,'dislike','2025-03-27 11:27:23'),(658,4,42,'dislike','2025-03-27 11:27:23'),(659,4,50,'dislike','2025-03-27 11:27:23'),(660,4,54,'dislike','2025-03-27 11:27:23'),(661,4,17,'dislike','2025-03-27 11:27:23'),(662,4,36,'dislike','2025-03-27 11:27:24'),(663,4,24,'dislike','2025-03-27 11:27:24'),(664,4,3,'dislike','2025-03-27 11:27:24'),(665,4,35,'dislike','2025-03-27 11:27:24'),(666,4,60,'dislike','2025-03-27 11:27:24'),(667,4,16,'dislike','2025-03-27 11:27:24'),(668,4,51,'dislike','2025-03-27 11:27:25'),(669,4,47,'dislike','2025-03-27 11:27:25'),(670,4,4,'dislike','2025-03-27 11:27:25'),(671,4,19,'dislike','2025-03-27 11:27:25'),(672,4,5,'dislike','2025-03-27 11:27:25'),(673,4,18,'dislike','2025-03-27 11:27:25'),(674,4,9,'dislike','2025-03-27 11:27:25'),(675,4,62,'dislike','2025-03-27 11:27:26'),(676,4,64,'dislike','2025-03-27 11:27:26'),(677,4,11,'dislike','2025-03-27 11:27:26'),(678,4,11,'dislike','2025-03-27 11:27:26'),(679,4,43,'dislike','2025-03-27 11:27:26'),(680,4,55,'dislike','2025-03-27 11:27:26'),(681,4,22,'dislike','2025-03-27 11:27:27'),(682,4,48,'dislike','2025-03-27 11:27:27');
/*!40000 ALTER TABLE `SwipeActions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserLikes`
--

DROP TABLE IF EXISTS `UserLikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserLikes` (
  `LikeID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `ProgramID` int NOT NULL,
  `LikedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `RoomID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`LikeID`),
  KEY `UserID` (`UserID`),
  KEY `ProgramID` (`ProgramID`),
  CONSTRAINT `UserLikes_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`),
  CONSTRAINT `UserLikes_ibfk_2` FOREIGN KEY (`ProgramID`) REFERENCES `Programs` (`ProgramID`)
) ENGINE=InnoDB AUTO_INCREMENT=2238 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserLikes`
--

LOCK TABLES `UserLikes` WRITE;
/*!40000 ALTER TABLE `UserLikes` DISABLE KEYS */;
INSERT INTO `UserLikes` VALUES (619,8,38,'2025-03-21 08:59:19',NULL),(620,8,9,'2025-03-21 08:59:29',NULL),(621,8,45,'2025-03-21 08:59:31',NULL),(622,8,12,'2025-03-21 08:59:32',NULL),(623,8,16,'2025-03-21 08:59:38',NULL),(624,8,29,'2025-03-21 08:59:42',NULL),(625,8,52,'2025-03-21 08:59:44',NULL),(626,8,27,'2025-03-21 08:59:49',NULL),(627,9,18,'2025-03-21 09:15:19',NULL),(628,9,2,'2025-03-21 09:15:19',NULL),(629,9,21,'2025-03-21 09:15:20',NULL),(630,9,22,'2025-03-21 09:15:20',NULL),(631,9,15,'2025-03-21 09:15:21',NULL),(632,9,27,'2025-03-21 09:15:21',NULL),(633,9,52,'2025-03-21 09:15:21',NULL),(634,9,5,'2025-03-21 09:15:21',NULL),(635,9,19,'2025-03-21 09:15:22',NULL),(636,9,4,'2025-03-21 09:15:22',NULL),(637,9,30,'2025-03-21 09:15:22',NULL),(638,9,36,'2025-03-21 09:15:22',NULL),(639,9,9,'2025-03-21 09:15:22',NULL),(640,9,51,'2025-03-21 09:15:27',NULL),(641,9,29,'2025-03-21 09:15:28',NULL),(642,9,16,'2025-03-21 09:15:28',NULL),(1619,3,66,'2025-03-24 10:28:01',NULL),(1620,3,68,'2025-03-24 10:28:01',NULL),(1801,3,69,'2025-03-24 11:03:04',NULL),(1802,3,70,'2025-03-24 11:03:05',NULL),(2224,4,64,'2025-03-27 11:01:19','146'),(2225,4,65,'2025-03-27 11:01:19','146');
/*!40000 ALTER TABLE `UserLikes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserPreferences`
--

DROP TABLE IF EXISTS `UserPreferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserPreferences` (
  `PreferenceID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `DurationFilter` tinyint DEFAULT NULL,
  `CostFilter` tinyint(1) DEFAULT NULL,
  `LocationFilter` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`PreferenceID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `UserPreferences_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserPreferences`
--

LOCK TABLES `UserPreferences` WRITE;
/*!40000 ALTER TABLE `UserPreferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserPreferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `PasswordHash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `IsAdmin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'testuser','hashedpassword','test@example.com','2025-03-14 09:06:13',0),(2,'Dr. Cigány','$2b$10$Vf2gEiixhaoh1/6IbUQa3OqT8F3b.jWpBD2AoaTvEUSX0cgClGARy','doktorcigany@gmail.com','2025-03-14 09:10:21',0),(3,'marszi','$2b$10$2SuGHw1by2fQe.lagdUNgOKcnIx27CaNlRIQLHZVeHNK1qrnLWlGq','kovmar138@hengersor.hu','2025-03-14 10:06:10',1),(4,'Levi','$2b$10$G4O9tO9J61PEEtGF8SMqU.KhZlZ3Kk1iYauYAacuBbOFZBhGe6UnK','mollev545@hengersor.hu','2025-03-14 10:27:56',1),(5,'Levi','$2b$10$.g.VAlceHtlWdqqOCKFkDecJwpxzeczSY6O.Rd/VOs2KTXqiOhHCO','test@test.com','2025-03-17 08:55:08',0),(6,'Nagy Martin','$2b$10$yUUvO1OHj.Di7CikjgIIrOh7fvK5vpYX7Ers/1hLswQrx6imsB0ae','nagmar206@hengersor.hu','2025-03-17 08:59:24',1),(7,'John EldenRing','$2b$10$kuXYfFqQ5U6yNrS8NvymAeXL/t7WFBY9anXOjfox2HhZO6K8YHSbS','johneldenring@gmail.com','2025-03-20 11:16:43',0),(8,'Majzi','$2b$10$aUzcV3sMgkT1jfDoTVLfw.rBQOCcMBBXC1HPno0xVg6AM.F7kHxYG','majzi0421@gmail.com','2025-03-21 08:58:43',0),(9,'Tomika','$2b$10$MrAQ/ijdSa.LkX5UJ8fmWeQ3dw8kd65XnWGiAP6W7ropc9O0k.vZC','gellertfy@gmail.com','2025-03-21 09:14:26',0);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 13:01:41
