CREATE DATABASE  IF NOT EXISTS `mollev545` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mollev545`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 10.3.1.65    Database: mollev545
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
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Programs`
--

LOCK TABLES `Programs` WRITE;
/*!40000 ALTER TABLE `Programs` DISABLE KEYS */;
INSERT INTO `Programs` VALUES (1,'Duna hajókirándulás','Városnéző hajóút Budapest látványosságai mentén.',0.00,1,1,'2025-03-17 09:32:10','Vigadó téri hajóállomás','duna-hajokirandulas.jpg','https://www.cruise-holidays.hu/hu/tipusok/dunai-hajoutak',1),(2,'Hop-On Hop-Off buszos városnézés','Fedezd fel Budapest nevezetességeit kényelmes busszal.',0.00,1,2,'2025-03-17 09:32:10','Clark Ádám tér','hop-on-hop-off-buszos-varosnezes.jpg','https://www.bigbustours.com/hu/budapest/budapesti-buszos-varosnezesek',1),(3,'Szent István Bazilika látogatás','Fedezd fel Budapest legnagyobb templomát és a kupolát.',0.00,0,1,'2025-03-17 09:32:10','Szent István Bazilika','szent-istvan-bazilika.jpg','https://bazilikabudapest.hu/',1),(4,'Romkocsmatúra','Ismerd meg Budapest híres romkocsmáit egy vezetett túrán.',0.00,1,1,'2025-03-17 09:32:10','Szimpla Kert','romkocsmatura-szimplakert.jpg','https://szimpla.hu/',1),(5,'Termálfürdő élmény','Pihenj Budapest híres termálfürdőiben, például a Széchenyiben.',0.00,1,2,'2025-03-17 09:32:10','Széchenyi Fürdő','termalfurdo-elmeny-szechenyi.jpg','https://www.szechenyifurdo.hu/',1),(6,'Parlament látogatás','Fedezd fel a magyar Parlament csodás épületét.',0.00,1,1,'2025-03-17 09:32:10','Országház','parlament-latogatas.jpg','https://www.parlament.hu/web/orszaghaz/latogatas',1),(7,'Gellért-hegyi kilátótúra','Túrázz fel a Gellért-hegyre és élvezd a panorámát.',0.00,0,1,'2025-03-17 09:32:10','Gellért-hegy','gellert-hegyi-kilato-tura.jpg','https://www.mozgasvilag.hu/turazas/turautak/gellert-hegy--szechenyi-hegy-tura',1),(8,'Margitszigeti piknik','Piknikezz és sétálj a Margitszigeten.',0.00,0,2,'2025-03-17 09:32:10','Margitsziget','margitszigeti-piknik-szokokut.jpg','https://g.co/kgs/mZbuieF',1),(9,'Sörkóstoló','Kóstold meg a Rízmájer Sörház különleges kézműves söreit.',0.00,1,1,'2025-03-17 09:32:10','Rizmájer Sörház','rizmajer-sorkostolas.jpg','https://rizmajersor.hu/',1),(10,'Múzeumlátogatás','Fedezd fel Budapest történelmét és művészetét egy múzeumban.',0.00,1,1,'2025-03-17 09:32:10','Magyar Nemzeti Múzeum','muzeumlatogatas-nemzeti-muzeum.jpg','https://mnm.hu/hu',1),(11,'Éjszakai városnéző séta','Fedezd fel Budapest fényeit egy esti sétán.',0.00,0,1,'2025-03-17 09:32:10','Váci utca','vaci-utca-esti-seta.jpg','https://hoponhopoff-budapest.com/hu/blog/ejszakai-varosnezes-top/',1),(12,'Gasztrotúra','Ismerd meg a magyar konyha különlegességeit.',0.00,1,1,'2025-03-17 09:32:10','Nagy Vásárcsarnok','gasztrotura-nagyvasarcsarnok.jpg','https://funzine.hu/2024/04/19/gasztro/kulvarosi-gasztrotura-6-hely-budapesten-ahol-isteni-falatok-es-festoi-tajak-varnak/',1),(13,'Escape Room élmény','Próbáld ki Budapest legizgalmasabb szabadulószobáit.',0.00,1,1,'2025-03-17 09:32:10','Mystique Room','escape-room-elmeny.jpg','https://paniqszoba.hu/',1),(14,'Jazz koncert','Élvezd a budapesti jazz klubok élőzenés előadásait.',0.00,1,1,'2025-03-17 09:32:10','Opus Jazz Club','jazz-koncert-opus-jazz-club.jpg','https://www.bjc.hu/',1),(15,'Folyami vacsorás hajózás','Élvezd a dunai hajózást egy elegáns vacsorával.',0.00,1,1,'2025-03-17 09:32:10','Duna Corso hajóállomás','duna-corso-hajovacsora.jpg','https://budapestrivercruise.eu/hu/',1),(16,'Kalandpark és kötélpálya','Próbáld ki Budapest egyik kalandparkját.',0.00,1,1,'2025-03-17 09:32:10','Challengeland Kalandpálya','challengeland-kalandpalya.jpg','https://orczykalandpark.eu/',1),(17,'Street Art túra','Ismerd meg Budapest utcai művészetét egy vezetett túrán.',0.00,0,1,'2025-03-17 09:32:10','VIII. kerület - Corvin negyed','corvin-streetart-tour.jpg','https://budapestflow.com/budapest-street-art-guide/',1),(18,'Bringatúra Budapesten','Fedezd fel a várost biciklivel egy csoportos túrán.',0.00,1,2,'2025-03-17 09:32:10','Margitsziget - bringakölcsönző','margit-sziget-bickli.jpg','https://www.bajabikes.eu/en/budapest-highlights-bike-tour/?gad_source=1&gclid=CjwKCAiAqrG9BhAVEiwAaPu5zmSKvrd9iGgfmEoivNI4viP3zWBEJLpkEESZBVknksDGXJ7YD2SFDhoCsysQAvD_BwE',1),(19,'Óriáskerék élmény','Csodáld meg Budapest látképét az óriáskerékről.',0.00,1,1,'2025-03-17 09:32:10','Budapest Eye - Erzsébet tér','budapest-eye.jpg','https://oriaskerek.com/',1),(20,'Hajnali fotótúra','Fényképezd le Budapest legszebb helyeit a napfelkeltében.',0.00,0,1,'2025-03-17 09:32:10','Halászbástya','halaszbastya-fotozasok.jpg','https://www.getyourguide.com/hu-hu/budapest-l29/fotos-turak-tc19/',1),(21,'Futóverseny a Városligetben','Vegyél részt egy budapesti amatőr futóversenyen.',0.00,0,1,'2025-03-17 09:32:10','Városliget','varosliget-futas.jpg','https://www.ligetelmenyfutas.hu/',1),(22,'Sétahajózás pezsgővel','Lélegzetelállító kilátás pezsgővel egybekötve a Dunán.',0.00,1,1,'2025-03-17 09:32:10','Vigadó tér','setahajozas-pezsgovel-vigadoter.jpg','https://silver-line.hu/hu/termek/korlatlan-pezsgo-es-bor-hajout/',1),(23,'Kirándulás a Normafára','Túrázz fel a Normafára és élvezd a természetet.',0.00,0,2,'2025-03-17 09:32:10','Normafa','normafa.jpg','https://normafapark.hu/turautvonalak',1),(24,'Opera előadás','Élvezd a budapesti operaház egyik klasszikus előadását.',0.00,1,1,'2025-03-17 09:32:10','Magyar Állami Operaház','operahaz.jpg','https://www.opera.hu/hu/',1),(25,'Sörkóstoló','Kóstold meg a magyar kézműves söröket egy vezetett sörkóstolón.',0.00,1,1,'2025-03-17 09:32:10','First Craft Beer Bár','first-craft-beer-bar.jpg','https://shop.firstcraftbeer.com/',1),(26,'Vízi biciklizés a Városligeti tónál','Kölcsönözz egy vízibiciklit és fedezd fel a Városligeti tavat.',0.00,1,1,'2025-03-17 09:32:10','Városligeti Tó','vizibicikli-varosligeti.jpg','https://csonakazoto.hu/',1),(27,'Karaoke est','Énekelj barátaiddal egy budapesti karaoke bárban.',0.00,1,1,'2025-03-17 09:32:10','Blue Bird Karaoke','karaoke-bluebird.jpg','https://bbrooms.hu/',1),(28,'Extrém kalandpark','Próbáld ki az extrém kötélpályát és mászófalakat.',0.00,1,1,'2025-03-17 09:32:10','Római Kalandpark','extrem-kalandpark.jpg','https://budakeszivadaspark.hu/kalandpark/',1),(29,'Táncóra egy profi oktatóval','Tanulj meg latin vagy társastáncot egy professzionális tanártól.',0.00,1,1,'2025-03-17 09:32:10','Salsa Diabolica Tánciskola','tancora.jpg','https://goldance.hu/',1),(30,'Szabadulószoba horror tematikával','Tedd próbára a bátorságodat egy horror szabadulószobában.',0.00,1,1,'2025-03-17 09:32:10','Neverland Szabadulószoba','horror-szabaduloszoba.jpg','https://questhunter.hu/category/quest_themes/horror/',1),(31,'Kézműves workshop','Készítsd el saját ékszeredet vagy dísztárgyadat egy workshopon.',0.00,1,1,'2025-03-17 09:32:10','Paloma Budapest','kezmuves-workshop.jpg','https://viragbuborekmuhely.hu/',1),(32,'Szabadtéri jóga a Városligetben','Lazíts és töltekezz fel szabadtéri jógaórán.',0.00,0,3,'2025-03-17 09:32:10','Városliget','szabadteri-joga-varosliget.jpg','https://downdogjoga.hu/szabadteri-jogaora',1),(33,'Duna-parti sétatúra','Fedezd fel a budapesti rakpart történelmét egy vezetett sétán.',0.00,0,3,'2025-03-17 09:32:10','Duna-part','dunaparti-seta.jpg','https://budapestcity.org/egyeb/kirandulas/seta/seta-a-pesti-duna-parton.html',1),(34,'Dunaparti futóverseny','Csatlakozz egy ingyenes közösségi futáshoz a Dunaparton.',0.00,0,3,'2025-03-17 09:32:10','Duna-part','dunaparti-futoverseny.jpg','https://futonaptar.hu/',1),(35,'Szabadtéri filmvetítés','Élvezd az esti filmvetítéseket Budapest különböző pontjain.',0.00,0,3,'2025-03-17 09:32:10','Városligeti Mozi','szabadteri-filmvetites.jpg','https://budapestgarden.com/kertmozi',1),(36,'Gellért-hegyi napfelkelte túra','Csodáld meg a napfelkeltét a város felett.',0.00,0,3,'2025-03-17 09:32:10','Gellért-hegy','gellert-hegyi-napfelkelte.jpg','https://www.dunaipoly.hu/hu/program/napfelkelte-a-sas-hegyen',1),(37,'Ingyenes múzeumi nap','Fedezd fel Budapest múzeumait a havonta egyszer ingyenes napokon.',0.00,0,3,'2025-03-17 09:32:10','Ludwig Múzeum','ingyenes-muzeum.jpg','https://minimatine.hu/mikor-ingyenesek-a-muzeumok/',1),(38,'Szabadtéri koncertek','Élvezd a város különböző pontjain megrendezett ingyenes koncerteket.',0.00,0,3,'2025-03-17 09:32:10','Kobuci Kert','szabadteri-koncert.jpg','https://www.budapestpark.hu/',1),(39,'Bringás túra a Budai-hegységben','Ingyenes szervezett kerékpártúra a Budai-hegységben.',0.00,0,3,'2025-03-17 09:32:10','Normafa','bringastura-normafa.jpg','https://www.welovecycling.com/hu/biciklivel-tesztelve/budai-hegyek-tura-normafa-harshegy-huvosvolgy/',1),(40,'Utcazenei fesztivál','Hallgasd Budapest legjobb utcazenészeit ingyenes fesztiválokon.',0.00,0,3,'2025-03-17 09:32:10','Gozsdu Udvar','utcazene-fesztival.jpg','https://facebook.com',1),(41,'Természetjárás a Róka-hegyen','Kirándulj a Róka-hegyre és fedezd fel Budapest rejtett természeti szépségeit.',0.00,0,3,'2025-03-17 09:32:10','Róka-hegy','termeszetjaras-rokahegy.jpg','https://www.termeszetjaro.hu/hu/tour/gyalogtura/ko-koevoen-foeldtoerteneti-seta-a-roka-hegy-sziklaudvaraiban/29624082/',1),(42,'Ingyenes városnéző séta','Csatlakozz egy ingyenes idegenvezetéses városnézéshez.',0.00,0,3,'2025-03-17 09:32:10','Váci utca','ingyenes-varosnezes.jpg','http://www.budapestvarosnezes.hu/varosnezesek.php',1),(43,'Kulturális fesztivál a Várkert Bazárban','Élvezd a színes kulturális eseményeket Budapest egyik legszebb helyszínén.',0.00,0,3,'2025-03-17 09:32:10','Várkert Bazár','kulturalis-fesztival.jpg','https://varkertbazar.hu/',1),(44,'Ingyenes sportnap a Városligetben','Vegyél részt ingyenes edzéseken és sportprogramokon.',0.00,0,3,'2025-03-17 09:32:10','Városliget','ingyenes-sportnap.jpg','https://facebook.com',1),(45,'Gourmet Street Food Nap','Próbáld ki a legjobb street food ételeket ingyenes kóstolókkal.',0.00,0,3,'2025-03-17 09:32:10','Bálna Budapest','gourmet-street-food.jpg','https:// ourmetfesztival.hu/hu/',1),(46,'Kézműves vásár','Fedezd fel Budapest helyi kézműveseinek termékeit.',0.00,0,3,'2025-03-17 09:32:10','Fény Utcai Piac','kezmuves-vasar.jpg','https://hellopiac.hu/',1),(47,'Nyílt nap az Operában','Tekints be a Magyar Állami Operaház kulisszatitkaiba ingyenesen.',0.00,0,3,'2025-03-17 09:32:10','Magyar Állami Operaház','nyilt-nap-opera.jpg','https://www.opera.hu/hu/musor/2024-2025/a-magyar-nemzeti-balett-nyilt-napjai-20242025-2024/77665-eloadas-202504261100/',1),(48,'Történelmi séta Budapesten','Vezetett túra Budapest történelmi emlékhelyein.',0.00,0,3,'2025-03-17 09:32:10','Budai Vár','tortenelmi-seta.jpg','https://facebook.com',1),(49,'Ingyenes kiállítás a Millenárison','Fedezd fel az aktuális művészeti kiállításokat.',0.00,0,3,'2025-03-17 09:32:10','Millenáris Park','ingyenes-kiallitas.jpg','https://millenaris.hu/programok/',1),(50,'Dunakorzó esti séta','Csodáld meg a Duna-part fényeit egy kellemes esti sétán.',0.00,0,3,'2025-03-17 09:32:10','Dunakorzó','dunakorz-est.jpg','https://maps.app.goo.gl/ZF9JAjT6CRgMRqLr9',1),(51,'Paintball','Vegyétek fel a harcot, küzdjetek meg egymással, ne hagyjátok hogy egy cseppnyi festék is érjen titeket!',0.00,1,3,'2025-03-17 09:32:10','Budapest','paintball.jpg','https://patriotspaintball.hu/',1),(52,'Lézerharc','Vegyétek fel a harcot, küzdjetek meg egymással, ne hagyjátok hogy a lézer eltaláljon!',0.00,1,3,'2025-03-17 09:32:10','Budapest','lezerharc.jpg','https://laserforcebudapest.hu/',1),(53,'Társasjátékozás','Mérjétek össze tudásotokat vagy szerencséteket egy jó társasjátékban, esetleg egy jó hideg sör társaságában!',0.00,1,3,'2025-03-17 09:32:10','Budapest','tarsasjatek_sorozgetes.jpg','https://boardgamecafe.hu/en/a-tarsasjatekos-kavezo',1),(54,'Plázázás','Fedezzétek fel Budapest plázáit, vesszetek el a kirakatokban.',0.00,0,1,'2025-03-17 09:32:10','Budapest','plazazas-shoppingolas.jpg','https://westend.hu/',1),(55,'Kolodko szobor keresés','Fedezd fel Budapest rejtett kis mini szobrait, találd meg mindet!',0.00,0,1,'2025-03-17 09:32:10','Budapest','kolodko-szobor.jpg','https://www.kozterkep.hu/alkotok/megtekintes/6186/kolodko-mihaly',1),(59,'Szegedi Élményfürdő','Kikapcsolódás a szegedi Anna élményfürdőben',0.00,1,2,'2025-03-19 08:37:21','Szeged','1742373436220-184446495.jpg','https://www.termalfurdo.hu/furdo/anna-gyogy-termal-es-elmenyfurdo-94',3),(60,'Horgászás Abonyban','Horgászás az abonyi horgásztónál ',0.00,1,2,'2025-03-21 09:10:17','Abonyi Horgásztó','1742548195535-48516884.jpg','http://www.abonyhorgasz.hu/ujoldal/',50),(61,'Tűzmadár látogatás ','Nézzétek meg a híres Tűzmadarat abonyban',0.00,0,1,'2025-03-21 09:16:41','Abony, Táborhegy dűlő 12, 2740','1742548591566-987702506.jpg','https://bit.ly/4hAgxWg',50),(62,'Kristályfürdő Ajkán','Szórakozzatok az ajkai kristályfürdőben',0.00,1,2,'2025-03-21 09:22:54','Ajka, Városliget 1320/1, 8400','1742548968528-692334086.jpg','http://www.kristalyfurdo.hu/site/?f=1&p=581',44),(63,'Csónakázás Ajkán','Csónakázzatok barátaiddal és kis kedvenceiddel az ajaki csónakázó tavon',0.00,0,1,'2025-03-21 09:27:33','Ajka, 8400','1742549246678-992174588.jpg','https://bit.ly/4bUAwOf',44),(64,'Türr István kilátó','Nézzétek meg a naplementét a csodás Türr István kilátóban',0.00,0,1,'2025-03-21 13:00:23','Türr István kilátó','1742562014962-897018763.jpg','https://bit.ly/4iUqBuh',21),(65,'Duna Wellness Hotel','Élvezzétek a wellnessi vendéglátását a bajai wellness hotelnek',0.00,1,3,'2025-03-21 13:11:25','Duna Wellness Hotel','1742562680862-774118178.jpg','http://hotelduna.hu/',21),(66,'Békési Gyógyfürdő','Üdüljetek Békés leghíresebb gyógyfürdőjébe és relaxáljatok egy jót.',0.00,1,2,'2025-03-24 10:03:53','Kőrösi Csoma Sándor utca','1742810524087-801917109.jpg','http://bekesifurdo.hu/',27),(68,'Bagoly Vendéglő','Ebédeljetek vagy vacsorázzatok a békésen található Bagoly vendéglőbe.',0.00,1,1,'2025-03-24 10:27:54','Dózsa-liget','1742812036692-62084817.jpg','https://bagolyvendeglo.hu/',27),(69,'Kerékpározás Békéscsabán','Kerékpározzatok végig Békéscsaba híres kerékpár útján és nézzetek meg látványosságokat az út közben.',0.00,0,2,'2025-03-24 10:56:00','Unnamed Road ','1742813755847-718041846.jpg','https://www.wenckheimkerekparut.hu/hu/',15),(70,'Munkácsy Mihály Múzeum','Látogassátok meg békéscsabán a híres Munkácsy Mihály Múzeumot egy kultúrális délután keretén belűl.',0.00,1,1,'2025-03-24 11:02:57','Széchenyi utca','1742814173392-906376161.jpg','https://munkacsy.hu/',15),(71,'Randevú Cukrászda','Randevúzzatok a Randevú Cukrászdába és garantált hogy az édes szájuak egymásra találnak',0.00,1,1,'2025-03-25 11:17:03','Kossuth utca','1742901423031-138723576.jpg','https://randevu-cukraszda.uzleti.hu/',51),(72,'AquaCity Vízicsúszda és Élménypark','Garantált szórakozás zalaegerszegen az aquacityben',0.00,1,2,'2025-04-03 10:00:00','Fürdő Sétány utca','1743674399553-776881072.jpg','http://www.aquacity.hu/',16),(73,'Göcseji Falumúzeum','Látogatassatok el a göcseji falumúzeum ami a tökéletes útvonal egy kis kulturális élmény kutatáshoz',0.00,0,1,'2025-04-03 10:05:59','Faulmúzeum utca','1743674758961-348723443.jpg','https://zegimuzeumok.hu/gocseji-skanzen/',16),(74,'RQ Vízi Élménypark','Csobbanjatok egy jót a győri Rabaquelle viziparkban',0.00,1,2,'2025-04-07 08:29:31','Palotai Károly tér','1744014569981-735636182.jpg','https://rabaquelle.hu/',6),(75,'Debreceni Állatkert','Látogassátok meg a debreceni állatkert élőlényeit',0.00,1,1,'2025-04-07 09:11:56','Ady Endre Út','1744017114968-238518874.jpg','http://www.zoodebrecen.hu/',2),(76,'Egri Vár','Látogassátok meg az Egri várat egy történelmi utazás keretein belűl',0.00,1,1,'2025-04-07 09:52:13','Eger Vár','1744019531867-857208771.jpg','https://www.egrivar.hu/',12),(77,'Cifrapalota','Látogassátok meg a cifrapalotát és a benne található csodákat ',0.00,1,1,'2025-04-07 10:00:57','Rákoczi út','1744020055589-998074186.jpg','https://kkjm.hu/cifrapalota',8),(78,'Pécsi bazilika ','Kalandozás a múlt századokba, nézzétek meg a gyönyörű pécsi bazilikát',0.00,0,1,'2025-04-07 10:09:42','Dóm tér','1744020581255-561981639.jpg','https://pecsiegyhazmegye.hu/',5);
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
) ENGINE=InnoDB AUTO_INCREMENT=262 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RoomParticipants`
--

LOCK TABLES `RoomParticipants` WRITE;
/*!40000 ALTER TABLE `RoomParticipants` DISABLE KEYS */;
INSERT INTO `RoomParticipants` VALUES (75,49,6,0),(78,51,6,1),(79,52,6,0),(87,55,6,1),(92,59,6,1),(94,64,6,0),(98,68,6,1),(102,69,6,1),(106,71,4,1),(109,73,4,0),(111,75,4,1),(112,75,6,1),(136,99,9,1),(169,131,4,1),(178,138,4,0),(181,140,4,1),(182,140,6,1),(189,146,4,1),(190,146,6,1),(193,162,6,0),(199,169,6,0),(201,178,4,0),(202,181,4,0),(204,185,6,0),(205,188,4,0),(208,190,6,0),(209,191,4,0),(210,192,6,0),(214,196,4,0),(215,197,6,0),(217,199,6,0),(218,200,4,0),(219,201,6,0),(220,49,4,0),(222,203,6,0),(223,204,6,0),(224,205,6,0),(227,208,6,0),(230,210,6,0),(231,211,6,0),(232,212,6,0),(233,213,6,0),(234,214,6,0),(235,215,6,0),(236,216,6,0),(237,217,6,0),(238,218,6,0),(240,220,6,0),(241,221,6,0),(242,222,6,0),(243,223,6,0),(244,224,6,0),(245,225,6,0),(246,226,6,0),(247,227,6,0),(248,228,6,0),(249,229,6,0),(251,231,6,0),(252,232,6,0),(254,234,4,0),(255,235,4,0),(256,236,4,0),(257,237,4,0),(258,238,4,0),(259,239,4,0),(260,240,4,0),(261,241,4,0);
/*!40000 ALTER TABLE `RoomParticipants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RoomSwipeLikes`
--

DROP TABLE IF EXISTS `RoomSwipeLikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RoomSwipeLikes` (
  `RoomSwipeLikeID` int NOT NULL AUTO_INCREMENT,
  `RoomID` int NOT NULL,
  `UserID` int NOT NULL,
  `ProgramID` int NOT NULL,
  `LikedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RoomSwipeLikeID`),
  UNIQUE KEY `unique_like` (`RoomID`,`UserID`,`ProgramID`)
) ENGINE=InnoDB AUTO_INCREMENT=538 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RoomSwipeLikes`
--

LOCK TABLES `RoomSwipeLikes` WRITE;
/*!40000 ALTER TABLE `RoomSwipeLikes` DISABLE KEYS */;
INSERT INTO `RoomSwipeLikes` VALUES (1,225,6,1,'2025-04-07 09:53:50'),(2,225,6,2,'2025-04-07 09:53:52'),(3,226,6,1,'2025-04-07 09:56:05'),(4,226,6,2,'2025-04-07 09:56:06'),(5,228,6,1,'2025-04-07 10:00:14'),(6,228,6,2,'2025-04-07 10:00:17'),(7,228,6,3,'2025-04-07 10:00:17'),(8,228,6,4,'2025-04-07 10:00:18'),(9,228,6,5,'2025-04-07 10:00:18'),(10,228,6,6,'2025-04-07 10:00:19'),(11,228,6,7,'2025-04-07 10:00:20'),(12,228,6,8,'2025-04-07 10:00:23'),(13,228,6,9,'2025-04-07 10:00:23'),(14,228,6,10,'2025-04-07 10:00:23'),(15,228,6,11,'2025-04-07 10:00:23'),(16,228,6,12,'2025-04-07 10:00:23'),(17,228,6,13,'2025-04-07 10:00:24'),(18,228,6,14,'2025-04-07 10:00:24'),(19,228,6,15,'2025-04-07 10:00:24'),(20,228,6,16,'2025-04-07 10:00:24'),(21,228,6,17,'2025-04-07 10:00:24'),(22,228,6,18,'2025-04-07 10:00:24'),(23,228,6,19,'2025-04-07 10:00:25'),(24,228,6,20,'2025-04-07 10:00:25'),(25,228,6,21,'2025-04-07 10:00:25'),(26,228,6,22,'2025-04-07 10:00:25'),(27,228,6,23,'2025-04-07 10:00:25'),(28,228,6,24,'2025-04-07 10:00:25'),(29,228,6,25,'2025-04-07 10:00:26'),(30,228,6,26,'2025-04-07 10:00:26'),(31,228,6,27,'2025-04-07 10:00:26'),(32,228,6,28,'2025-04-07 10:00:26'),(33,228,6,29,'2025-04-07 10:00:26'),(34,228,6,30,'2025-04-07 10:00:27'),(35,228,6,31,'2025-04-07 10:00:27'),(36,228,6,32,'2025-04-07 10:00:27'),(37,228,6,33,'2025-04-07 10:00:27'),(38,228,6,34,'2025-04-07 10:00:27'),(39,228,6,35,'2025-04-07 10:00:28'),(40,228,6,36,'2025-04-07 10:00:28'),(41,228,6,37,'2025-04-07 10:00:28'),(42,228,6,38,'2025-04-07 10:00:28'),(43,228,6,39,'2025-04-07 10:00:28'),(44,228,6,40,'2025-04-07 10:00:28'),(45,228,6,41,'2025-04-07 10:00:29'),(46,228,6,42,'2025-04-07 10:00:29'),(47,228,6,43,'2025-04-07 10:00:29'),(48,228,6,44,'2025-04-07 10:00:29'),(49,228,6,45,'2025-04-07 10:00:29'),(50,228,6,46,'2025-04-07 10:00:29'),(51,228,6,47,'2025-04-07 10:00:30'),(52,228,6,48,'2025-04-07 10:00:30'),(53,228,6,49,'2025-04-07 10:00:30'),(54,228,6,50,'2025-04-07 10:00:30'),(55,228,6,51,'2025-04-07 10:00:30'),(56,228,6,52,'2025-04-07 10:00:30'),(57,228,6,53,'2025-04-07 10:00:31'),(58,228,6,54,'2025-04-07 10:00:31'),(59,228,6,55,'2025-04-07 10:00:31'),(60,228,6,59,'2025-04-07 10:00:31'),(61,228,6,60,'2025-04-07 10:00:31'),(62,228,6,61,'2025-04-07 10:00:31'),(63,228,6,62,'2025-04-07 10:00:32'),(64,228,6,63,'2025-04-07 10:00:32'),(65,228,6,64,'2025-04-07 10:00:32'),(66,228,6,65,'2025-04-07 10:00:32'),(67,228,6,66,'2025-04-07 10:00:32'),(68,228,6,68,'2025-04-07 10:00:33'),(69,228,6,69,'2025-04-07 10:00:33'),(70,228,6,70,'2025-04-07 10:00:33'),(71,228,6,71,'2025-04-07 10:00:33'),(72,228,6,72,'2025-04-07 10:00:33'),(73,228,6,73,'2025-04-07 10:00:34'),(74,228,6,74,'2025-04-07 10:00:34'),(75,228,6,75,'2025-04-07 10:00:34'),(76,228,6,76,'2025-04-07 10:00:36'),(77,229,6,1,'2025-04-07 10:09:22'),(78,229,6,2,'2025-04-07 10:09:22'),(79,229,6,3,'2025-04-07 10:09:22'),(80,229,6,4,'2025-04-07 10:09:23'),(81,229,6,5,'2025-04-07 10:09:23'),(82,229,6,6,'2025-04-07 10:09:23'),(83,229,6,7,'2025-04-07 10:09:23'),(84,229,6,8,'2025-04-07 10:09:23'),(85,229,6,9,'2025-04-07 10:09:24'),(86,229,6,10,'2025-04-07 10:09:24'),(87,229,6,11,'2025-04-07 10:09:24'),(88,229,6,12,'2025-04-07 10:09:24'),(89,229,6,13,'2025-04-07 10:09:24'),(90,229,6,14,'2025-04-07 10:09:24'),(91,229,6,15,'2025-04-07 10:09:25'),(92,229,6,16,'2025-04-07 10:09:25'),(93,229,6,17,'2025-04-07 10:09:25'),(94,229,6,18,'2025-04-07 10:09:25'),(95,229,6,19,'2025-04-07 10:09:25'),(96,229,6,20,'2025-04-07 10:09:25'),(97,229,6,21,'2025-04-07 10:09:26'),(98,229,6,22,'2025-04-07 10:09:26'),(99,229,6,23,'2025-04-07 10:09:26'),(100,229,6,24,'2025-04-07 10:09:26'),(101,229,6,25,'2025-04-07 10:09:26'),(102,229,6,26,'2025-04-07 10:09:26'),(103,229,6,27,'2025-04-07 10:09:27'),(104,229,6,28,'2025-04-07 10:09:27'),(105,229,6,29,'2025-04-07 10:09:27'),(106,229,6,30,'2025-04-07 10:09:27'),(107,229,6,31,'2025-04-07 10:09:27'),(108,229,6,32,'2025-04-07 10:09:28'),(109,229,6,33,'2025-04-07 10:09:28'),(110,229,6,34,'2025-04-07 10:09:28'),(111,229,6,35,'2025-04-07 10:09:28'),(112,229,6,36,'2025-04-07 10:09:28'),(113,229,6,37,'2025-04-07 10:09:28'),(114,229,6,38,'2025-04-07 10:09:29'),(115,229,6,39,'2025-04-07 10:09:29'),(116,229,6,40,'2025-04-07 10:09:29'),(117,229,6,41,'2025-04-07 10:09:29'),(118,229,6,42,'2025-04-07 10:09:29'),(119,229,6,43,'2025-04-07 10:09:30'),(120,229,6,44,'2025-04-07 10:09:30'),(121,229,6,45,'2025-04-07 10:09:30'),(122,229,6,46,'2025-04-07 10:09:30'),(123,229,6,47,'2025-04-07 10:09:30'),(124,229,6,48,'2025-04-07 10:09:31'),(125,229,6,49,'2025-04-07 10:09:31'),(126,229,6,50,'2025-04-07 10:09:31'),(127,229,6,51,'2025-04-07 10:09:31'),(128,229,6,52,'2025-04-07 10:09:31'),(129,229,6,53,'2025-04-07 10:09:32'),(130,229,6,54,'2025-04-07 10:09:32'),(131,229,6,55,'2025-04-07 10:09:32'),(132,229,6,59,'2025-04-07 10:09:32'),(133,229,6,60,'2025-04-07 10:09:32'),(134,229,6,61,'2025-04-07 10:09:33'),(135,229,6,62,'2025-04-07 10:09:33'),(136,229,6,63,'2025-04-07 10:09:33'),(137,229,6,64,'2025-04-07 10:09:33'),(138,229,6,65,'2025-04-07 10:09:33'),(139,229,6,66,'2025-04-07 10:09:34'),(140,229,6,68,'2025-04-07 10:09:34'),(141,229,6,69,'2025-04-07 10:09:34'),(142,229,6,70,'2025-04-07 10:09:34'),(143,229,6,71,'2025-04-07 10:09:34'),(144,229,6,72,'2025-04-07 10:09:34'),(145,229,6,73,'2025-04-07 10:09:35'),(146,229,6,74,'2025-04-07 10:09:35'),(147,229,6,75,'2025-04-07 10:09:35'),(148,229,6,76,'2025-04-07 10:09:35'),(149,229,6,77,'2025-04-07 10:09:35'),(223,230,6,1,'2025-04-07 10:10:32'),(224,230,6,2,'2025-04-07 10:10:32'),(225,230,6,3,'2025-04-07 10:10:32'),(226,230,6,4,'2025-04-07 10:10:32'),(227,230,6,5,'2025-04-07 10:10:32'),(228,230,6,6,'2025-04-07 10:10:33'),(229,230,6,7,'2025-04-07 10:10:33'),(230,230,6,8,'2025-04-07 10:10:33'),(231,230,6,9,'2025-04-07 10:10:33'),(232,230,6,10,'2025-04-07 10:10:33'),(233,230,6,11,'2025-04-07 10:10:34'),(234,230,6,12,'2025-04-07 10:10:34'),(235,230,6,13,'2025-04-07 10:10:34'),(236,230,6,14,'2025-04-07 10:10:34'),(237,230,6,15,'2025-04-07 10:10:35'),(238,230,6,16,'2025-04-07 10:10:35'),(239,230,6,17,'2025-04-07 10:10:35'),(240,230,6,18,'2025-04-07 10:10:35'),(241,230,6,19,'2025-04-07 10:10:35'),(242,230,6,20,'2025-04-07 10:10:36'),(243,230,6,21,'2025-04-07 10:10:36'),(244,230,6,22,'2025-04-07 10:10:36'),(245,230,6,23,'2025-04-07 10:10:36'),(246,230,6,24,'2025-04-07 10:10:36'),(247,230,6,25,'2025-04-07 10:10:36'),(248,230,6,26,'2025-04-07 10:10:36'),(249,230,6,27,'2025-04-07 10:10:37'),(250,230,6,28,'2025-04-07 10:10:39'),(251,230,6,29,'2025-04-07 10:10:39'),(252,230,6,30,'2025-04-07 10:10:39'),(253,230,6,31,'2025-04-07 10:10:39'),(254,230,6,32,'2025-04-07 10:10:39'),(255,230,6,33,'2025-04-07 10:10:39'),(256,230,6,34,'2025-04-07 10:10:40'),(257,230,6,35,'2025-04-07 10:10:40'),(258,230,6,36,'2025-04-07 10:10:40'),(259,230,6,37,'2025-04-07 10:10:40'),(260,230,6,38,'2025-04-07 10:10:40'),(261,230,6,39,'2025-04-07 10:10:41'),(262,230,6,40,'2025-04-07 10:10:41'),(263,230,6,41,'2025-04-07 10:10:41'),(264,230,6,42,'2025-04-07 10:10:41'),(265,230,6,43,'2025-04-07 10:10:41'),(266,230,6,44,'2025-04-07 10:10:41'),(267,230,6,45,'2025-04-07 10:10:42'),(268,230,6,46,'2025-04-07 10:10:42'),(269,230,6,47,'2025-04-07 10:10:42'),(270,230,6,48,'2025-04-07 10:10:42'),(271,230,6,49,'2025-04-07 10:10:42'),(272,230,6,50,'2025-04-07 10:10:24'),(273,230,6,51,'2025-04-07 10:10:24'),(274,230,6,52,'2025-04-07 10:10:24'),(275,230,6,53,'2025-04-07 10:10:24'),(276,230,6,54,'2025-04-07 10:10:25'),(277,230,6,55,'2025-04-07 10:10:25'),(278,230,6,59,'2025-04-07 10:10:25'),(279,230,6,60,'2025-04-07 10:10:25'),(280,230,6,61,'2025-04-07 10:10:25'),(281,230,6,62,'2025-04-07 10:10:26'),(282,230,6,63,'2025-04-07 10:10:26'),(283,230,6,64,'2025-04-07 10:10:26'),(284,230,6,65,'2025-04-07 10:10:26'),(285,230,6,66,'2025-04-07 10:10:26'),(286,230,6,68,'2025-04-07 10:10:27'),(287,230,6,69,'2025-04-07 10:10:27'),(288,230,6,70,'2025-04-07 10:10:27'),(289,230,6,71,'2025-04-07 10:10:27'),(290,230,6,72,'2025-04-07 10:10:27'),(291,230,6,73,'2025-04-07 10:10:28'),(292,230,6,74,'2025-04-07 10:10:28'),(293,230,6,75,'2025-04-07 10:10:28'),(294,230,6,76,'2025-04-07 10:10:28'),(295,230,6,77,'2025-04-07 10:10:29'),(296,230,6,78,'2025-04-07 10:10:29'),(346,231,6,1,'2025-04-07 10:10:49'),(347,231,6,2,'2025-04-07 10:10:49'),(348,231,6,3,'2025-04-07 10:10:49'),(349,231,6,4,'2025-04-07 10:10:50'),(350,231,6,5,'2025-04-07 10:10:50'),(351,231,6,6,'2025-04-07 10:10:50'),(352,231,6,7,'2025-04-07 10:10:50'),(353,231,6,8,'2025-04-07 10:10:50'),(354,231,6,9,'2025-04-07 10:10:50'),(355,231,6,10,'2025-04-07 10:10:51'),(356,231,6,11,'2025-04-07 10:10:51'),(357,231,6,12,'2025-04-07 10:10:51'),(358,231,6,13,'2025-04-07 10:10:51'),(359,231,6,14,'2025-04-07 10:10:51'),(360,231,6,15,'2025-04-07 10:10:51'),(361,231,6,16,'2025-04-07 10:10:52'),(362,231,6,17,'2025-04-07 10:10:52'),(363,231,6,18,'2025-04-07 10:10:52'),(364,231,6,19,'2025-04-07 10:10:52'),(365,231,6,20,'2025-04-07 10:10:52'),(366,231,6,21,'2025-04-07 10:10:52'),(367,231,6,22,'2025-04-07 10:10:53'),(368,231,6,23,'2025-04-07 10:10:53'),(369,231,6,24,'2025-04-07 10:10:53'),(370,231,6,25,'2025-04-07 10:10:53'),(371,231,6,26,'2025-04-07 10:10:53'),(372,231,6,27,'2025-04-07 10:10:54'),(373,231,6,28,'2025-04-07 10:10:54'),(374,231,6,29,'2025-04-07 10:10:54'),(375,231,6,30,'2025-04-07 10:10:54'),(376,231,6,31,'2025-04-07 10:10:54'),(377,231,6,32,'2025-04-07 10:10:55'),(378,231,6,33,'2025-04-07 10:10:55'),(379,231,6,34,'2025-04-07 10:10:55'),(380,231,6,35,'2025-04-07 10:10:56'),(381,231,6,36,'2025-04-07 10:10:56'),(382,231,6,37,'2025-04-07 10:10:57'),(383,231,6,38,'2025-04-07 10:10:57'),(384,231,6,39,'2025-04-07 10:10:58'),(385,231,6,40,'2025-04-07 10:10:58'),(386,231,6,41,'2025-04-07 10:10:58'),(387,231,6,42,'2025-04-07 10:10:59'),(388,231,6,43,'2025-04-07 10:10:59'),(389,231,6,44,'2025-04-07 10:11:00'),(390,231,6,45,'2025-04-07 10:11:00'),(391,231,6,46,'2025-04-07 10:11:00'),(392,231,6,47,'2025-04-07 10:11:01'),(393,231,6,48,'2025-04-07 10:11:01'),(394,231,6,49,'2025-04-07 10:11:02'),(395,231,6,50,'2025-04-07 10:11:02'),(396,231,6,51,'2025-04-07 10:11:03'),(397,231,6,52,'2025-04-07 10:11:03'),(398,231,6,53,'2025-04-07 10:11:03'),(399,231,6,54,'2025-04-07 10:11:04'),(400,231,6,55,'2025-04-07 10:11:04'),(401,231,6,59,'2025-04-07 10:11:05'),(402,231,6,60,'2025-04-07 10:11:05'),(403,231,6,61,'2025-04-07 10:11:06'),(404,231,6,62,'2025-04-07 10:11:06'),(405,231,6,63,'2025-04-07 10:11:07'),(406,231,6,64,'2025-04-07 10:11:07'),(407,231,6,65,'2025-04-07 10:11:08'),(408,231,6,66,'2025-04-07 10:11:08'),(409,231,6,68,'2025-04-07 10:11:09'),(410,231,6,69,'2025-04-07 10:11:09'),(411,231,6,70,'2025-04-07 10:11:10'),(412,231,6,71,'2025-04-07 10:11:10'),(413,231,6,72,'2025-04-07 10:11:11'),(414,231,6,73,'2025-04-07 10:11:11'),(415,231,6,74,'2025-04-07 10:11:12'),(416,231,6,75,'2025-04-07 10:11:13'),(417,231,6,76,'2025-04-07 10:11:13'),(418,231,6,77,'2025-04-07 10:11:14'),(419,231,6,78,'2025-04-07 10:11:14'),(420,232,6,1,'2025-04-07 10:14:51'),(421,232,6,2,'2025-04-07 10:14:51'),(422,232,6,3,'2025-04-07 10:14:52'),(423,232,6,4,'2025-04-07 10:14:52'),(424,232,6,5,'2025-04-07 10:14:52'),(425,232,6,6,'2025-04-07 10:14:52'),(426,232,6,7,'2025-04-07 10:14:52'),(427,232,6,8,'2025-04-07 10:14:52'),(428,232,6,9,'2025-04-07 10:14:53'),(429,232,6,10,'2025-04-07 10:14:53'),(430,232,6,11,'2025-04-07 10:14:53'),(431,232,6,12,'2025-04-07 10:14:53'),(432,232,6,13,'2025-04-07 10:14:53'),(433,232,6,14,'2025-04-07 10:14:53'),(434,232,6,15,'2025-04-07 10:14:54'),(435,232,6,16,'2025-04-07 10:14:54'),(436,232,6,17,'2025-04-07 10:14:54'),(437,232,6,18,'2025-04-07 10:14:54'),(438,232,6,19,'2025-04-07 10:14:54'),(439,232,6,20,'2025-04-07 10:14:54'),(440,232,6,21,'2025-04-07 10:14:55'),(441,232,6,22,'2025-04-07 10:14:55'),(442,232,6,23,'2025-04-07 10:14:55'),(443,232,6,24,'2025-04-07 10:14:55'),(444,232,6,25,'2025-04-07 10:14:55'),(445,232,6,26,'2025-04-07 10:14:55'),(446,232,6,27,'2025-04-07 10:14:56'),(447,232,6,28,'2025-04-07 10:14:56'),(448,232,6,29,'2025-04-07 10:14:56'),(449,232,6,30,'2025-04-07 10:14:56'),(450,232,6,31,'2025-04-07 10:14:56'),(451,232,6,32,'2025-04-07 10:14:56'),(452,232,6,33,'2025-04-07 10:14:57'),(453,232,6,34,'2025-04-07 10:14:57'),(454,232,6,35,'2025-04-07 10:14:57'),(455,232,6,36,'2025-04-07 10:14:57'),(456,232,6,37,'2025-04-07 10:14:57'),(457,232,6,38,'2025-04-07 10:14:57'),(458,232,6,39,'2025-04-07 10:14:58'),(459,232,6,40,'2025-04-07 10:14:58'),(460,232,6,41,'2025-04-07 10:14:58'),(461,232,6,42,'2025-04-07 10:14:58'),(462,232,6,43,'2025-04-07 10:14:58'),(463,232,6,44,'2025-04-07 10:14:58'),(464,232,6,45,'2025-04-07 10:14:59'),(465,232,6,46,'2025-04-07 10:14:59'),(466,232,6,47,'2025-04-07 10:14:59'),(467,232,6,48,'2025-04-07 10:14:59'),(468,232,6,49,'2025-04-07 10:14:59'),(469,232,6,50,'2025-04-07 10:15:00'),(470,232,6,51,'2025-04-07 10:15:00'),(471,232,6,52,'2025-04-07 10:15:00'),(472,232,6,53,'2025-04-07 10:15:00'),(473,232,6,54,'2025-04-07 10:15:00'),(474,232,6,55,'2025-04-07 10:15:00'),(475,232,6,59,'2025-04-07 10:15:00'),(476,232,6,60,'2025-04-07 10:15:01'),(477,232,6,61,'2025-04-07 10:15:01'),(478,232,6,62,'2025-04-07 10:15:01'),(479,232,6,63,'2025-04-07 10:15:01'),(480,232,6,64,'2025-04-07 10:15:01'),(481,232,6,65,'2025-04-07 10:15:02'),(482,232,6,66,'2025-04-07 10:15:02'),(483,232,6,68,'2025-04-07 10:15:02'),(484,232,6,69,'2025-04-07 10:15:02'),(485,232,6,70,'2025-04-07 10:15:02'),(486,232,6,71,'2025-04-07 10:15:02'),(487,232,6,72,'2025-04-07 10:15:03'),(488,232,6,73,'2025-04-07 10:15:03'),(489,232,6,74,'2025-04-07 10:15:03'),(490,232,6,75,'2025-04-07 10:15:03'),(491,232,6,76,'2025-04-07 10:15:03'),(492,232,6,77,'2025-04-07 10:15:04'),(493,232,6,78,'2025-04-07 10:15:04'),(494,233,4,1,'2025-04-09 05:59:29'),(495,233,4,2,'2025-04-09 05:59:29'),(496,233,4,3,'2025-04-09 05:59:29'),(497,233,4,4,'2025-04-09 05:59:29'),(498,233,4,5,'2025-04-09 05:59:29'),(499,233,4,6,'2025-04-09 05:59:30'),(500,233,4,7,'2025-04-09 05:59:30'),(501,233,4,8,'2025-04-09 05:59:30'),(502,233,4,9,'2025-04-09 05:59:30'),(503,233,4,10,'2025-04-09 05:59:31'),(504,233,4,11,'2025-04-09 05:59:31'),(505,233,4,12,'2025-04-09 05:59:31'),(506,233,4,13,'2025-04-09 05:59:31'),(507,233,4,14,'2025-04-09 05:59:31'),(508,233,4,15,'2025-04-09 05:59:32'),(509,233,4,16,'2025-04-09 05:59:32'),(510,233,4,17,'2025-04-09 05:59:32'),(511,233,4,18,'2025-04-09 05:59:32'),(512,233,4,19,'2025-04-09 05:59:32'),(513,234,4,1,'2025-04-09 05:59:46'),(514,234,4,2,'2025-04-09 05:59:47'),(515,234,4,3,'2025-04-09 05:59:47'),(516,234,4,4,'2025-04-09 05:59:47'),(517,234,4,5,'2025-04-09 05:59:47'),(518,234,4,6,'2025-04-09 05:59:47'),(519,235,4,1,'2025-04-09 06:00:06'),(520,235,4,2,'2025-04-09 06:00:06'),(521,235,4,3,'2025-04-09 06:00:06'),(522,235,4,4,'2025-04-09 06:00:06'),(523,235,4,5,'2025-04-09 06:00:06'),(524,235,4,6,'2025-04-09 06:00:07'),(525,235,4,7,'2025-04-09 06:00:07'),(526,235,4,8,'2025-04-09 06:00:07'),(527,235,4,9,'2025-04-09 06:00:07'),(528,235,4,10,'2025-04-09 06:00:07'),(529,235,4,11,'2025-04-09 06:00:07'),(530,235,4,12,'2025-04-09 06:00:08'),(531,235,4,13,'2025-04-09 06:00:08'),(532,235,4,14,'2025-04-09 06:00:08'),(533,235,4,15,'2025-04-09 06:00:09'),(534,235,4,16,'2025-04-09 06:00:09'),(535,235,4,17,'2025-04-09 06:00:09'),(536,235,4,18,'2025-04-09 06:00:09'),(537,235,4,19,'2025-04-09 06:00:09');
/*!40000 ALTER TABLE `RoomSwipeLikes` ENABLE KEYS */;
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
  `Filters` json DEFAULT NULL,
  `IsStarted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`RoomID`),
  UNIQUE KEY `RoomCode` (`RoomCode`),
  KEY `CreatedByUserID` (`CreatedByUserID`),
  CONSTRAINT `Rooms_ibfk_1` FOREIGN KEY (`CreatedByUserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rooms`
--

LOCK TABLES `Rooms` WRITE;
/*!40000 ALTER TABLE `Rooms` DISABLE KEYS */;
INSERT INTO `Rooms` VALUES (49,'80C1E4A5',2,'2025-03-18 08:49:38',NULL,0),(51,'F4A7B135',2,'2025-03-18 09:01:33',NULL,0),(52,'19A181D3',2,'2025-03-18 09:05:22',NULL,0),(55,'D4A80D97',2,'2025-03-18 09:30:37',NULL,0),(59,'1E691E66',2,'2025-03-18 10:14:35',NULL,0),(64,'35EEEB90',2,'2025-03-18 10:47:48',NULL,0),(68,'68C3AE39',2,'2025-03-18 11:06:05',NULL,0),(69,'8654E9A0',2,'2025-03-18 11:13:03',NULL,0),(71,'E91C2D4F',4,'2025-03-18 11:22:52',NULL,0),(73,'B685D006',4,'2025-03-19 06:58:13',NULL,0),(75,'8E318427',4,'2025-03-19 07:37:48',NULL,0),(99,'DCE83EDE',9,'2025-03-21 09:16:07',NULL,0),(131,'C405FA20',4,'2025-03-25 10:19:24',NULL,0),(138,'001C7BD8',4,'2025-03-27 08:54:45',NULL,0),(140,'84A20F12',4,'2025-03-27 09:20:07',NULL,0),(146,'94BF5D01',4,'2025-03-27 10:57:02',NULL,0),(162,'D35E4002',4,'2025-03-27 12:04:02',NULL,0),(169,'73BE37E5',4,'2025-04-01 07:21:45',NULL,0),(178,'2BE025DD',6,'2025-04-02 07:17:57',NULL,0),(181,'0FE0808F',4,'2025-04-02 07:49:19',NULL,0),(185,'A405253B',6,'2025-04-02 08:05:09',NULL,0),(188,'F21FF8D6',4,'2025-04-02 08:09:18',NULL,0),(190,'1B0B3937',6,'2025-04-02 08:18:40',NULL,0),(191,'A71CED21',4,'2025-04-02 08:20:49',NULL,0),(192,'3519D5F2',6,'2025-04-02 08:21:15',NULL,0),(196,'0D42931D',4,'2025-04-02 08:31:24',NULL,0),(197,'9E3E9BB9',6,'2025-04-02 08:32:03',NULL,0),(199,'476F327F',6,'2025-04-03 09:09:53',NULL,0),(200,'91DDDE57',4,'2025-04-03 09:10:08',NULL,0),(201,'E4ABF26C',6,'2025-04-03 09:20:57',NULL,0),(202,'DDCF320B',6,'2025-04-03 09:22:34',NULL,0),(203,'44906218',6,'2025-04-03 09:24:17',NULL,0),(204,'719A9758',6,'2025-04-03 09:24:49',NULL,0),(205,'A924E27A',6,'2025-04-03 09:31:45',NULL,0),(206,'71F9C139',6,'2025-04-03 09:33:54',NULL,0),(207,'B8AD9A2A',6,'2025-04-03 09:35:52',NULL,0),(208,'E7B95132',6,'2025-04-03 09:37:47',NULL,0),(209,'FAC76BAA',6,'2025-04-03 09:40:54',NULL,0),(210,'4F5953D0',6,'2025-04-03 09:41:30',NULL,0),(211,'E5E1804D',6,'2025-04-03 09:55:32',NULL,0),(212,'D1483AE4',6,'2025-04-03 10:05:10',NULL,0),(213,'01779A0B',6,'2025-04-03 10:08:29',NULL,0),(214,'5EA51402',6,'2025-04-03 10:48:27',NULL,0),(215,'CE031641',6,'2025-04-03 11:07:35',NULL,0),(216,'FCE13921',6,'2025-04-03 11:17:20',NULL,0),(217,'44C368AC',6,'2025-04-03 11:17:37',NULL,0),(218,'ADDA2B9E',6,'2025-04-03 11:18:04',NULL,0),(219,'0D1BC8AA',6,'2025-04-07 08:20:23',NULL,0),(220,'8611C981',6,'2025-04-07 08:26:00',NULL,0),(221,'3525800A',6,'2025-04-07 08:50:06',NULL,0),(222,'DAFA6187',6,'2025-04-07 08:50:58',NULL,0),(223,'46352E2B',6,'2025-04-07 08:58:09',NULL,0),(224,'28B5512C',6,'2025-04-07 09:30:07',NULL,0),(225,'9DFBBF11',6,'2025-04-07 09:53:42',NULL,0),(226,'29D82D60',6,'2025-04-07 09:55:48',NULL,0),(227,'CAA891DA',6,'2025-04-07 09:58:23',NULL,0),(228,'4F0C2D4A',6,'2025-04-07 09:59:06',NULL,0),(229,'B5E859F5',6,'2025-04-07 10:07:37',NULL,0),(230,'5F3901B7',6,'2025-04-07 10:10:13',NULL,0),(231,'39744071',6,'2025-04-07 10:10:47',NULL,0),(232,'FDB30F14',6,'2025-04-07 10:14:49',NULL,0),(233,'E51C7C44',4,'2025-04-09 05:59:25',NULL,0),(234,'9EF91911',4,'2025-04-09 05:59:42',NULL,0),(235,'5A15DECB',4,'2025-04-09 05:59:50',NULL,0),(236,'CD76B968',4,'2025-04-09 06:06:23',NULL,0),(237,'9831180B',4,'2025-04-09 06:06:27',NULL,0),(238,'DA29A0F0',4,'2025-04-09 06:10:07',NULL,0),(239,'04639D57',4,'2025-04-09 06:14:38',NULL,0),(240,'90630657',4,'2025-04-09 06:14:43',NULL,0),(241,'823BAA81',4,'2025-04-09 06:19:13','{\"city\": \"50\", \"cost\": \"\", \"duration\": \"\"}',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=1488 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SwipeActions`
--

LOCK TABLES `SwipeActions` WRITE;
/*!40000 ALTER TABLE `SwipeActions` DISABLE KEYS */;
INSERT INTO `SwipeActions` VALUES (65,8,54,'dislike','2025-03-21 08:59:22'),(67,8,19,'dislike','2025-03-21 08:59:36'),(68,8,34,'dislike','2025-03-21 08:59:40'),(69,8,39,'dislike','2025-03-21 08:59:46'),(839,10,60,'like','2025-03-28 10:29:25'),(840,10,54,'dislike','2025-03-28 10:29:28'),(841,10,34,'dislike','2025-03-28 10:29:29'),(1032,3,13,'like','2025-03-31 09:10:07'),(1033,3,20,'like','2025-03-31 09:10:07'),(1034,3,40,'like','2025-03-31 09:10:07'),(1035,3,53,'like','2025-03-31 09:10:07'),(1036,3,7,'like','2025-03-31 09:10:08'),(1037,3,26,'like','2025-03-31 09:10:08'),(1038,3,71,'like','2025-03-31 09:10:08'),(1039,3,50,'like','2025-03-31 09:10:08'),(1040,3,60,'like','2025-03-31 09:10:08'),(1041,3,4,'like','2025-03-31 09:10:08'),(1042,3,38,'like','2025-03-31 09:10:08'),(1043,3,62,'like','2025-03-31 09:10:08'),(1044,3,6,'like','2025-03-31 09:10:08'),(1045,3,24,'like','2025-03-31 09:10:09'),(1046,3,29,'like','2025-03-31 09:10:09'),(1047,3,36,'like','2025-03-31 09:10:09'),(1048,3,21,'like','2025-03-31 09:10:09'),(1049,3,8,'like','2025-03-31 09:10:09'),(1050,3,47,'like','2025-03-31 09:10:09'),(1051,3,5,'like','2025-03-31 09:10:09'),(1052,3,32,'like','2025-03-31 09:10:09'),(1053,3,11,'like','2025-03-31 09:10:09'),(1054,3,1,'like','2025-03-31 09:10:10'),(1055,3,46,'like','2025-03-31 09:10:10'),(1056,3,54,'like','2025-03-31 09:10:10'),(1057,3,30,'like','2025-03-31 09:10:10'),(1058,3,25,'like','2025-03-31 09:10:10'),(1059,3,3,'like','2025-03-31 09:10:10'),(1060,3,23,'like','2025-03-31 09:10:10'),(1061,3,9,'like','2025-03-31 09:10:11'),(1062,3,12,'like','2025-03-31 09:10:11'),(1063,3,19,'like','2025-03-31 09:10:11'),(1064,3,37,'like','2025-03-31 09:10:11'),(1065,3,44,'like','2025-03-31 09:10:11'),(1066,3,10,'like','2025-03-31 09:10:12'),(1067,3,61,'like','2025-03-31 09:10:12'),(1068,3,14,'like','2025-03-31 09:10:12'),(1069,3,18,'like','2025-03-31 09:10:12'),(1070,3,42,'like','2025-03-31 09:10:12'),(1071,3,17,'like','2025-03-31 09:10:12'),(1072,3,43,'like','2025-03-31 09:10:13'),(1073,3,49,'like','2025-03-31 09:10:13'),(1074,3,65,'like','2025-03-31 09:10:13'),(1075,3,28,'like','2025-03-31 09:10:13'),(1076,3,52,'like','2025-03-31 09:10:13'),(1077,3,2,'like','2025-03-31 09:10:13'),(1078,3,55,'like','2025-03-31 09:10:13'),(1079,3,41,'like','2025-03-31 09:10:13'),(1080,3,51,'like','2025-03-31 09:10:14'),(1081,3,35,'like','2025-03-31 09:10:14'),(1082,3,33,'like','2025-03-31 09:10:14'),(1083,3,45,'like','2025-03-31 09:10:14'),(1084,3,48,'like','2025-03-31 09:10:14'),(1085,3,34,'like','2025-03-31 09:10:14'),(1086,3,63,'like','2025-03-31 09:10:15'),(1087,3,16,'like','2025-03-31 09:10:15');
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
) ENGINE=InnoDB AUTO_INCREMENT=3021 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserLikes`
--

LOCK TABLES `UserLikes` WRITE;
/*!40000 ALTER TABLE `UserLikes` DISABLE KEYS */;
INSERT INTO `UserLikes` VALUES (619,8,38,'2025-03-21 08:59:19',NULL),(620,8,9,'2025-03-21 08:59:29',NULL),(621,8,45,'2025-03-21 08:59:31',NULL),(622,8,12,'2025-03-21 08:59:32',NULL),(623,8,16,'2025-03-21 08:59:38',NULL),(624,8,29,'2025-03-21 08:59:42',NULL),(625,8,52,'2025-03-21 08:59:44',NULL),(626,8,27,'2025-03-21 08:59:49',NULL),(627,9,18,'2025-03-21 09:15:19',NULL),(628,9,2,'2025-03-21 09:15:19',NULL),(629,9,21,'2025-03-21 09:15:20',NULL),(630,9,22,'2025-03-21 09:15:20',NULL),(631,9,15,'2025-03-21 09:15:21',NULL),(632,9,27,'2025-03-21 09:15:21',NULL),(633,9,52,'2025-03-21 09:15:21',NULL),(634,9,5,'2025-03-21 09:15:21',NULL),(635,9,19,'2025-03-21 09:15:22',NULL),(636,9,4,'2025-03-21 09:15:22',NULL),(637,9,30,'2025-03-21 09:15:22',NULL),(638,9,36,'2025-03-21 09:15:22',NULL),(639,9,9,'2025-03-21 09:15:22',NULL),(640,9,51,'2025-03-21 09:15:27',NULL),(641,9,29,'2025-03-21 09:15:28',NULL),(642,9,16,'2025-03-21 09:15:28',NULL),(1619,3,66,'2025-03-24 10:28:01',NULL),(1620,3,68,'2025-03-24 10:28:01',NULL),(1801,3,69,'2025-03-24 11:03:04',NULL),(1802,3,70,'2025-03-24 11:03:05',NULL),(2382,10,60,'2025-03-28 10:29:25',NULL),(2571,3,13,'2025-03-31 09:10:07',NULL),(2572,3,20,'2025-03-31 09:10:07',NULL),(2573,3,40,'2025-03-31 09:10:07',NULL),(2574,3,53,'2025-03-31 09:10:07',NULL),(2575,3,7,'2025-03-31 09:10:08',NULL),(2576,3,26,'2025-03-31 09:10:08',NULL),(2577,3,71,'2025-03-31 09:10:08',NULL),(2578,3,50,'2025-03-31 09:10:08',NULL),(2579,3,60,'2025-03-31 09:10:08',NULL),(2580,3,4,'2025-03-31 09:10:08',NULL),(2581,3,38,'2025-03-31 09:10:08',NULL),(2582,3,62,'2025-03-31 09:10:08',NULL),(2583,3,6,'2025-03-31 09:10:08',NULL),(2584,3,24,'2025-03-31 09:10:09',NULL),(2585,3,29,'2025-03-31 09:10:09',NULL),(2586,3,36,'2025-03-31 09:10:09',NULL),(2587,3,21,'2025-03-31 09:10:09',NULL),(2588,3,8,'2025-03-31 09:10:09',NULL),(2589,3,47,'2025-03-31 09:10:09',NULL),(2590,3,5,'2025-03-31 09:10:09',NULL),(2591,3,32,'2025-03-31 09:10:09',NULL),(2592,3,11,'2025-03-31 09:10:09',NULL),(2593,3,1,'2025-03-31 09:10:10',NULL),(2594,3,46,'2025-03-31 09:10:10',NULL),(2595,3,54,'2025-03-31 09:10:10',NULL),(2596,3,30,'2025-03-31 09:10:10',NULL),(2597,3,25,'2025-03-31 09:10:10',NULL),(2598,3,3,'2025-03-31 09:10:10',NULL),(2599,3,23,'2025-03-31 09:10:10',NULL),(2600,3,9,'2025-03-31 09:10:11',NULL),(2601,3,12,'2025-03-31 09:10:11',NULL),(2602,3,19,'2025-03-31 09:10:11',NULL),(2603,3,37,'2025-03-31 09:10:11',NULL),(2604,3,44,'2025-03-31 09:10:11',NULL),(2605,3,10,'2025-03-31 09:10:12',NULL),(2606,3,61,'2025-03-31 09:10:12',NULL),(2607,3,14,'2025-03-31 09:10:12',NULL),(2608,3,18,'2025-03-31 09:10:12',NULL),(2609,3,42,'2025-03-31 09:10:12',NULL),(2610,3,17,'2025-03-31 09:10:12',NULL),(2611,3,43,'2025-03-31 09:10:13',NULL),(2612,3,49,'2025-03-31 09:10:13',NULL),(2613,3,65,'2025-03-31 09:10:13',NULL),(2614,3,28,'2025-03-31 09:10:13',NULL),(2615,3,52,'2025-03-31 09:10:13',NULL),(2616,3,2,'2025-03-31 09:10:13',NULL),(2617,3,55,'2025-03-31 09:10:13',NULL),(2618,3,41,'2025-03-31 09:10:13',NULL),(2619,3,51,'2025-03-31 09:10:14',NULL),(2620,3,35,'2025-03-31 09:10:14',NULL),(2621,3,33,'2025-03-31 09:10:14',NULL),(2622,3,45,'2025-03-31 09:10:14',NULL),(2623,3,48,'2025-03-31 09:10:14',NULL),(2624,3,34,'2025-03-31 09:10:14',NULL),(2625,3,63,'2025-03-31 09:10:15',NULL),(2626,3,16,'2025-03-31 09:10:15',NULL);
/*!40000 ALTER TABLE `UserLikes` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'testuser','hashedpassword','test@example.com','2025-03-14 09:06:13',0),(2,'Dr. Cigány','$2b$10$Vf2gEiixhaoh1/6IbUQa3OqT8F3b.jWpBD2AoaTvEUSX0cgClGARy','doktorcigany@gmail.com','2025-03-14 09:10:21',0),(3,'marszi','$2b$10$2SuGHw1by2fQe.lagdUNgOKcnIx27CaNlRIQLHZVeHNK1qrnLWlGq','kovmar138@hengersor.hu','2025-03-14 10:06:10',1),(4,'Levi','$2b$10$G4O9tO9J61PEEtGF8SMqU.KhZlZ3Kk1iYauYAacuBbOFZBhGe6UnK','mollev545@hengersor.hu','2025-03-14 10:27:56',1),(5,'Levi','$2b$10$.g.VAlceHtlWdqqOCKFkDecJwpxzeczSY6O.Rd/VOs2KTXqiOhHCO','test@test.com','2025-03-17 08:55:08',0),(6,'Nagy Martin','$2b$10$yUUvO1OHj.Di7CikjgIIrOh7fvK5vpYX7Ers/1hLswQrx6imsB0ae','nagmar206@hengersor.hu','2025-03-17 08:59:24',1),(7,'John EldenRing','$2b$10$kuXYfFqQ5U6yNrS8NvymAeXL/t7WFBY9anXOjfox2HhZO6K8YHSbS','johneldenring@gmail.com','2025-03-20 11:16:43',0),(8,'Majzi','$2b$10$aUzcV3sMgkT1jfDoTVLfw.rBQOCcMBBXC1HPno0xVg6AM.F7kHxYG','majzi0421@gmail.com','2025-03-21 08:58:43',0),(9,'Tomika','$2b$10$MrAQ/ijdSa.LkX5UJ8fmWeQ3dw8kd65XnWGiAP6W7ropc9O0k.vZC','gellertfy@gmail.com','2025-03-21 09:14:26',0),(10,'Tundi','$2b$10$c7hcR0ECeE5oOiZ/wGB8PuyYBORxq1maHz9dHoH7JPxU.jO2Aj1ui','tundi@gmail.com','2025-03-28 10:28:50',0);
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

-- Dump completed on 2025-04-09  8:20:46
