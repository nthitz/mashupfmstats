



-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'song'
-- 
-- ---

DROP TABLE IF EXISTS `song`;
    
CREATE TABLE `song` (
  `songId` VARCHAR(24) NOT NULL,
  `title` MEDIUMTEXT NULL DEFAULT NULL,
  `artist` MEDIUMTEXT NULL DEFAULT NULL,
  `album` MEDIUMTEXT NULL DEFAULT NULL,
  `genre` MEDIUMTEXT NULL DEFAULT NULL,
  `length` INT(5) NULL DEFAULT NULL,
  PRIMARY KEY (`songId`)
);

-- ---
-- Table 'play'
-- 
-- ---

DROP TABLE IF EXISTS `play`;
    
CREATE TABLE `play` (
  `playId` INT(10) NOT NULL AUTO_INCREMENT,
  `startTime` INT(11) NULL DEFAULT NULL,
  `songId` VARCHAR(24) NULL DEFAULT NULL,
  `djid` VARCHAR(24) NULL DEFAULT NULL,
  `djname` VARCHAR(40) NULL DEFAULT NULL,
  `up` INTEGER(6) NULL DEFAULT NULL,
  `down` INT(6) NULL DEFAULT NULL,
  `spread` INT(6) NULL DEFAULT NULL,
  `snagged` INT(6) NULL DEFAULT NULL,
  PRIMARY KEY (`playId`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `play` ADD FOREIGN KEY (songId) REFERENCES `song` (`songId`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `song` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `play` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `song` (`songId`,`title`,`artist`,`album`,`genre`,`length`) VALUES
-- ('','','','','','');
-- INSERT INTO `play` (`playId`,`startTime`,`songId`,`djid`,`djname`,`up`,`down`,`spread`,`snagged`) VALUES
-- ('','','','','','','','','');

