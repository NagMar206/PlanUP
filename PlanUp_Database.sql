-- Database: PlanUp

-- Drop database if it exists and create a new one
DROP DATABASE IF EXISTS PlanUp;
CREATE DATABASE PlanUp;
USE PlanUp;

-- Users table: stores user information
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Programs table: stores program details
CREATE TABLE Programs (
    ProgramID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Cost BOOLEAN NOT NULL DEFAULT FALSE, -- Fizetős szűrő (TRUE/FALSE)
    Duration TINYINT NOT NULL DEFAULT 1, -- Időtartam (1 = Fél nap, 2 = Egész nap, 3 = Hétvége)
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Location VARCHAR(50) NOT NULL,
    Image VARCHAR(50) NOT NULL
);

-- UserPreferences table: stores user preferences for filtering programs
CREATE TABLE UserPreferences (
    PreferenceID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    DurationFilter TINYINT DEFAULT NULL,
    CostFilter BOOLEAN DEFAULT NULL,
    LocationFilter VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- SwipeActions table: records swipe actions of users on programs
CREATE TABLE SwipeActions (
    SwipeID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ProgramID INT NOT NULL,
    Action ENUM('like', 'dislike') NOT NULL,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProgramID) REFERENCES Programs(ProgramID) ON DELETE CASCADE
);

-- Rooms table: stores room codes for shared program selection
CREATE TABLE Rooms (
    RoomID INT AUTO_INCREMENT PRIMARY KEY,
    RoomCode VARCHAR(10) UNIQUE NOT NULL,
    CreatedByUserID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CreatedByUserID) REFERENCES Users(UserID)
);

-- RoomParticipants table: links users to rooms
CREATE TABLE RoomParticipants (
    ParticipantID INT AUTO_INCREMENT PRIMARY KEY,
    RoomID INT NOT NULL,
    UserID INT NOT NULL,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- UserLikes table: records likes by users on programs
CREATE TABLE UserLikes (
    LikeID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ProgramID INT NOT NULL,
    LikedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProgramID) REFERENCES Programs(ProgramID)
);


INSERT INTO Users (Username, PasswordHash, Email)
VALUES ('testuser', 'hashedpassword', 'test@example.com');
 

 
-- Insert sample data into Programs table
INSERT INTO Programs (Name, Description, Duration, Cost, Location, Image) VALUES
('Duna hajókirándulás', 'Városnéző hajóút Budapest látványosságai mentén.', 1, TRUE, 'Vigadó téri hajóállomás', 'duna-hajokirandulas.jpg'),
('Hop-On Hop-Off buszos városnézés', 'Fedezd fel Budapest nevezetességeit kényelmes busszal.', 2, TRUE, 'Clark Ádám tér', 'hop-on-hop-off-buszos-varosnezes.jpg'),
('Szent István Bazilika látogatás', 'Fedezd fel Budapest legnagyobb templomát és a kupolát.', 1, FALSE, 'Szent István Bazilika', 'szent-istvan-bazilika.jpg'),
('Romkocsmatúra', 'Ismerd meg Budapest híres romkocsmáit egy vezetett túrán.', 1, TRUE, 'Szimpla Kert', 'romkocsmatura-szimplakert.jpg'),
('Termálfürdő élmény', 'Pihenj Budapest híres termálfürdőiben, például a Széchenyiben.', 2, TRUE, 'Széchenyi Fürdő', 'termalfurdo-elmeny-szechenyi.jpg'),
('Parlament látogatás', 'Fedezd fel a magyar Parlament csodás épületét.', 1, TRUE, 'Országház', 'parlament-latogatas.jpg'),
('Gellért-hegyi kilátótúra', 'Túrázz fel a Gellért-hegyre és élvezd a panorámát.', 1, FALSE, 'Gellért-hegy', 'gellert-hegyi-kilato-tura.jpg'),
('Margitszigeti piknik', 'Piknikezz és sétálj a Margitszigeten.', 2, FALSE, 'Margitsziget', 'margitszigeti-piknik-szokokut.jpg'),
('Sörkóstoló', 'Kóstold meg a Rízmájer Sörház különleges kézműves söreit.', 1, TRUE, 'Rizmájer Sörház', 'rizmajer-sorkostolas.jpg'),
('Múzeumlátogatás', 'Fedezd fel Budapest történelmét és művészetét egy múzeumban.', 1, TRUE, 'Magyar Nemzeti Múzeum', 'muzeumlatogatas-nemzeti-muzeum.jpg'),
('Éjszakai városnéző séta', 'Fedezd fel Budapest fényeit egy esti sétán.', 1, FALSE, 'Váci utca', 'vaci-utca-esti-seta.jpg'),
('Gasztrotúra', 'Ismerd meg a magyar konyha különlegességeit.', 1, TRUE, 'Nagy Vásárcsarnok', 'gasztrotura-nagyvasarcsarnok.jpg'),
('Escape Room élmény', 'Próbáld ki Budapest legizgalmasabb szabadulószobáit.', 1, TRUE, 'Mystique Room', 'escape-room-elmeny.jpg'),
('Jazz koncert', 'Élvezd a budapesti jazz klubok élőzenés előadásait.', 1, TRUE, 'Opus Jazz Club', 'jazz-koncert-opus-jazz-club.jpg'),
('Folyami vacsorás hajózás', 'Élvezd a dunai hajózást egy elegáns vacsorával.', 1, TRUE, 'Duna Corso hajóállomás', 'duna-corso-hajovacsora.jpg'),
('Kalandpark és kötélpálya', 'Próbáld ki Budapest egyik kalandparkját.', 1, TRUE, 'Challengeland Kalandpálya', 'challengeland-kalandpalya.jpg'),
('Street Art túra', 'Ismerd meg Budapest utcai művészetét egy vezetett túrán.', 1, FALSE, 'VIII. kerület - Corvin negyed', 'corvin-streetart-tour.jpg'),
('Bringatúra Budapesten', 'Fedezd fel a várost biciklivel egy csoportos túrán.', 2, TRUE, 'Margitsziget - bringakölcsönző', 'margit-sziget-bickli.jpg'),
('Óriáskerék élmény', 'Csodáld meg Budapest látképét az óriáskerékről.', 1, TRUE, 'Budapest Eye - Erzsébet tér', 'budapest-eye.jpg'),
('Hajnali fotótúra', 'Fényképezd le Budapest legszebb helyeit a napfelkeltében.', 1, FALSE, 'Halászbástya', 'halaszbastya-fotozasok.jpg'),
('Futóverseny a Városligetben', 'Vegyél részt egy budapesti amatőr futóversenyen.', 1, FALSE, 'Városliget', 'varosliget-futas.jpg'),
('Sétahajózás pezsgővel', 'Lélegzetelállító kilátás pezsgővel egybekötve a Dunán.', 1, TRUE, 'Vigadó tér', 'setahajozas-pezsgovel-vigadoter.jpg'),
('Kirándulás a Normafára', 'Túrázz fel a Normafára és élvezd a természetet.', 2, FALSE, 'Normafa', 'normafa.jpg'),
('Opera előadás', 'Élvezd a budapesti operaház egyik klasszikus előadását.', 1, TRUE, 'Magyar Állami Operaház', 'operahaz.jpg'),
('Sörkóstoló', 'Kóstold meg a magyar kézműves söröket egy vezetett sörkóstolón.', 1, TRUE, 'First Craft Beer Bár', 'first-craft-beer-bar.jpg'),
('Vízi biciklizés a Városligeti tónál', 'Kölcsönözz egy vízibiciklit és fedezd fel a Városligeti tavat.', 1, TRUE, 'Városligeti Tó', 'vizibicikli-varosligeti.jpg'),
('Karaoke est', 'Énekelj barátaiddal egy budapesti karaoke bárban.', 1, TRUE, 'Blue Bird Karaoke', 'karaoke-bluebird.jpg'),
('Extrém kalandpark', 'Próbáld ki az extrém kötélpályát és mászófalakat.', 1, TRUE, 'Római Kalandpark', 'extrem-kalandpark.jpg'),
('Táncóra egy profi oktatóval', 'Tanulj meg latin vagy társastáncot egy professzionális tanártól.', 1, TRUE, 'Salsa Diabolica Tánciskola', 'tancora.jpg'),
('Szabadulószoba horror tematikával', 'Tedd próbára a bátorságodat egy horror szabadulószobában.', 1, TRUE, 'Neverland Szabadulószoba', 'horror-szabaduloszoba.jpg'),
('Kézműves workshop', 'Készítsd el saját ékszeredet vagy dísztárgyadat egy workshopon.', 1, TRUE, 'Paloma Budapest', 'kezmuves-workshop.jpg'),
('Szabadtéri jóga a Városligetben', 'Lazíts és töltekezz fel szabadtéri jógaórán.', 3, FALSE, 'Városliget', 'szabadteri-joga-varosliget.jpg'),
('Duna-parti sétatúra', 'Fedezd fel a budapesti rakpart történelmét egy vezetett sétán.', 3, FALSE, 'Duna-part', 'dunaparti-seta.jpg'),
('Dunaparti futóverseny', 'Csatlakozz egy ingyenes közösségi futáshoz a Dunaparton.', 3, FALSE, 'Duna-part', 'dunaparti-futoverseny.jpg'),
('Szabadtéri filmvetítés', 'Élvezd az esti filmvetítéseket Budapest különböző pontjain.', 3, FALSE, 'Városligeti Mozi', 'szabadteri-filmvetites.jpg'),
('Gellért-hegyi napfelkelte túra', 'Csodáld meg a napfelkeltét a város felett.', 3, FALSE, 'Gellért-hegy', 'gellert-hegyi-napfelkelte.jpg'),
('Ingyenes múzeumi nap', 'Fedezd fel Budapest múzeumait a havonta egyszer ingyenes napokon.', 3, FALSE, 'Ludwig Múzeum', 'ingyenes-muzeum.jpg'),
('Szabadtéri koncertek', 'Élvezd a város különböző pontjain megrendezett ingyenes koncerteket.', 3, FALSE, 'Kobuci Kert', 'szabadteri-koncert.jpg'),
('Bringás túra a Budai-hegységben', 'Ingyenes szervezett kerékpártúra a Budai-hegységben.', 3, FALSE, 'Normafa', 'bringastura-normafa.jpg'),
('Utcazenei fesztivál', 'Hallgasd Budapest legjobb utcazenészeit ingyenes fesztiválokon.', 3, FALSE, 'Gozsdu Udvar', 'utcazene-fesztival.jpg'),
('Természetjárás a Róka-hegyen', 'Kirándulj a Róka-hegyre és fedezd fel Budapest rejtett természeti szépségeit.', 3, FALSE, 'Róka-hegy', 'termeszetjaras-rokahegy.jpg'),
('Ingyenes városnéző séta', 'Csatlakozz egy ingyenes idegenvezetéses városnézéshez.', 3, FALSE, 'Váci utca', 'ingyenes-varosnezes.jpg'),
('Kulturális fesztivál a Várkert Bazárban', 'Élvezd a színes kulturális eseményeket Budapest egyik legszebb helyszínén.', 3, FALSE, 'Várkert Bazár', 'kulturalis-fesztival.jpg'),
('Ingyenes sportnap a Városligetben', 'Vegyél részt ingyenes edzéseken és sportprogramokon.', 3, FALSE, 'Városliget', 'ingyenes-sportnap.jpg'),
('Gourmet Street Food Nap', 'Próbáld ki a legjobb street food ételeket ingyenes kóstolókkal.', 3, FALSE, 'Bálna Budapest', 'gourmet-street-food.jpg'),
('Kézműves vásár', 'Fedezd fel Budapest helyi kézműveseinek termékeit.', 3, FALSE, 'Fény Utcai Piac', 'kezmuves-vasar.jpg'),
('Nyílt nap az Operában', 'Tekints be a Magyar Állami Operaház kulisszatitkaiba ingyenesen.', 3, FALSE, 'Magyar Állami Operaház', 'nyilt-nap-opera.jpg'),
('Történelmi séta Budapesten', 'Vezetett túra Budapest történelmi emlékhelyein.', 3, FALSE, 'Budai Vár', 'tortenelmi-seta.jpg'),
('Ingyenes kiállítás a Millenárison', 'Fedezd fel az aktuális művészeti kiállításokat.', 3, FALSE, 'Millenáris Park', 'ingyenes-kiallitas.jpg'),
('Dunakorzó esti séta', 'Csodáld meg a Duna-part fényeit egy kellemes esti sétán.', 3, FALSE, 'Dunakorzó', 'dunakorz-est.jpg'),
('Paintball', 'Vegyétek fel a harcot, küzdjetek meg egymással, ne hagyjátok hogy egy cseppnyi festék is érjen titeket!', 3, TRUE, 'Budapest', 'paintball.jpg'),
('Lézerharc', 'Vegyétek fel a harcot, küzdjetek meg egymással, ne hagyjátok hogy a lézer eltaláljon!', 3, TRUE, 'Budapest', 'lezerharc.jpg'),
('Társasjátékozás', 'Mérjétek össze tudásotokat vagy szerencséteket egy jó társasjátékban, esetleg egy jó hideg sör társaságában!', 3, TRUE, 'Budapest', 'tarsasjatek_sorozgetes.jpg'),
('Plázázás', 'Fedezzétek fel Budapest plázáit, vesszetek el a kirakatokban.', 1, FALSE, 'Budapest', 'plazazas-shoppingolas.jpg'),
('Kolodko szobor keresés', 'Fedezd fel Budapest rejtett kis mini szobrait, találd meg mindet!', 1, FALSE, 'Budapest', 'kolodko-szobor.jpg');

