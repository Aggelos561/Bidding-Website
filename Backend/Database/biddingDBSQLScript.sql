-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema biddingdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema biddingdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `biddingdb` DEFAULT CHARACTER SET utf8 ;
USE `biddingdb` ;

-- -----------------------------------------------------
-- Table `biddingdb`.`auth_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`auth_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`django_content_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`django_content_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `app_label` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label` ASC, `model` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 17
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`auth_permission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`auth_permission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `content_type_id` INT NOT NULL,
  `codename` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id` ASC, `codename` ASC) VISIBLE,
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co`
    FOREIGN KEY (`content_type_id`)
    REFERENCES `biddingdb`.`django_content_type` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 65
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`auth_group_permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`auth_group_permissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `group_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id` ASC, `permission_id` ASC) VISIBLE,
  INDEX `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id` ASC) VISIBLE,
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm`
    FOREIGN KEY (`permission_id`)
    REFERENCES `biddingdb`.`auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id`
    FOREIGN KEY (`group_id`)
    REFERENCES `biddingdb`.`auth_group` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`auth_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`auth_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(128) NOT NULL,
  `last_login` DATETIME(6) NULL DEFAULT NULL,
  `is_superuser` TINYINT(1) NOT NULL,
  `username` VARCHAR(150) NOT NULL,
  `first_name` VARCHAR(150) NOT NULL,
  `last_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `is_staff` TINYINT(1) NOT NULL,
  `is_active` TINYINT(1) NOT NULL,
  `date_joined` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 4219
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`auth_user_groups`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`auth_user_groups` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id` ASC, `group_id` ASC) VISIBLE,
  INDEX `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id` ASC) VISIBLE,
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id`
    FOREIGN KEY (`group_id`)
    REFERENCES `biddingdb`.`auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `biddingdb`.`auth_user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`auth_user_user_permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`auth_user_user_permissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id` ASC, `permission_id` ASC) VISIBLE,
  INDEX `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id` ASC) VISIBLE,
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm`
    FOREIGN KEY (`permission_id`)
    REFERENCES `biddingdb`.`auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `biddingdb`.`auth_user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`userprofile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`userprofile` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `TIN` VARCHAR(20) NOT NULL,
  `phoneNumber` VARCHAR(20) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  `id_user` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `UserProfile_id_user_37141dc4_fk_auth_user_id` (`id_user` ASC) VISIBLE,
  CONSTRAINT `UserProfile_id_user_37141dc4_fk_auth_user_id`
    FOREIGN KEY (`id_user`)
    REFERENCES `biddingdb`.`auth_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4219
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`bidder`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`bidder` (
  `User_ID` INT NOT NULL,
  `rating` INT NOT NULL,
  PRIMARY KEY (`User_ID`),
  CONSTRAINT `bidder_User_ID_36b02cbe_fk_UserProfile_id`
    FOREIGN KEY (`User_ID`)
    REFERENCES `biddingdb`.`userprofile` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`seller`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`seller` (
  `User_ID` INT NOT NULL,
  `rating` INT NOT NULL,
  PRIMARY KEY (`User_ID`),
  CONSTRAINT `seller_User_ID_6b36a383_fk_UserProfile_id`
    FOREIGN KEY (`User_ID`)
    REFERENCES `biddingdb`.`userprofile` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  `latitude` VARCHAR(255) NULL DEFAULT NULL,
  `longitude` VARCHAR(255) NULL DEFAULT NULL,
  `currently` DECIMAL(8,2) NOT NULL,
  `buyPrice` DECIMAL(8,2) NULL DEFAULT NULL,
  `firstBid` DECIMAL(8,2) NOT NULL,
  `numberOfBids` INT NOT NULL,
  `started` DATETIME(6) NOT NULL,
  `ends` DATETIME(6) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `active` TINYINT(1) NOT NULL,
  `Seller_User_ID` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `item_id_Seller_User_ID_51192c5b_uniq` (`id` ASC, `Seller_User_ID` ASC) VISIBLE,
  INDEX `item_Seller_User_ID_6d4abd52_fk_seller_User_ID` (`Seller_User_ID` ASC) VISIBLE,
  CONSTRAINT `item_Seller_User_ID_6d4abd52_fk_seller_User_ID`
    FOREIGN KEY (`Seller_User_ID`)
    REFERENCES `biddingdb`.`seller` (`User_ID`))
ENGINE = InnoDB
AUTO_INCREMENT = 3807
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`bid`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`bid` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `time` DATETIME(6) NOT NULL,
  `amount` DECIMAL(8,2) NOT NULL,
  `Item_id` INT NOT NULL,
  `Bidder_User_ID` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `bid_Item_id_3155badf_fk_item_id` (`Item_id` ASC) VISIBLE,
  INDEX `bid_Bidder_User_ID_1c05a716_fk_bidder_User_ID` (`Bidder_User_ID` ASC) VISIBLE,
  CONSTRAINT `bid_Bidder_User_ID_1c05a716_fk_bidder_User_ID`
    FOREIGN KEY (`Bidder_User_ID`)
    REFERENCES `biddingdb`.`bidder` (`User_ID`),
  CONSTRAINT `bid_Item_id_3155badf_fk_item_id`
    FOREIGN KEY (`Item_id`)
    REFERENCES `biddingdb`.`item` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2143
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`category` (
  `Name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`Name`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`django_admin_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`django_admin_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `action_time` DATETIME(6) NOT NULL,
  `object_id` LONGTEXT NULL DEFAULT NULL,
  `object_repr` VARCHAR(200) NOT NULL,
  `action_flag` SMALLINT UNSIGNED NOT NULL,
  `change_message` LONGTEXT NOT NULL,
  `content_type_id` INT NULL DEFAULT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id` ASC) VISIBLE,
  INDEX `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co`
    FOREIGN KEY (`content_type_id`)
    REFERENCES `biddingdb`.`django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `biddingdb`.`auth_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 884
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`django_migrations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`django_migrations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `app` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `applied` DATETIME(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`django_session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`django_session` (
  `session_key` VARCHAR(40) NOT NULL,
  `session_data` LONGTEXT NOT NULL,
  `expire_date` DATETIME(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  INDEX `django_session_expire_date_a5c62663` (`expire_date` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `message` LONGTEXT NOT NULL,
  `time` DATETIME(6) NOT NULL,
  `subject` LONGTEXT NOT NULL,
  `read` TINYINT(1) NOT NULL,
  `receiver_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `message_receiver_id_763b350f_fk_UserProfile_id` (`receiver_id` ASC) VISIBLE,
  INDEX `message_sender_id_a2a2e825_fk_UserProfile_id` (`sender_id` ASC) VISIBLE,
  CONSTRAINT `message_receiver_id_763b350f_fk_UserProfile_id`
    FOREIGN KEY (`receiver_id`)
    REFERENCES `biddingdb`.`userprofile` (`id`),
  CONSTRAINT `message_sender_id_a2a2e825_fk_UserProfile_id`
    FOREIGN KEY (`sender_id`)
    REFERENCES `biddingdb`.`userprofile` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`hide_message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`hide_message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `message_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `hide_message_message_id_914a9e2e_fk_message_id` (`message_id` ASC) VISIBLE,
  INDEX `hide_message_user_id_ab0a58d9_fk_UserProfile_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `hide_message_message_id_914a9e2e_fk_message_id`
    FOREIGN KEY (`message_id`)
    REFERENCES `biddingdb`.`message` (`id`),
  CONSTRAINT `hide_message_user_id_ab0a58d9_fk_UserProfile_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `biddingdb`.`userprofile` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`item_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`item_category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `item_id` INT NOT NULL,
  `category_id` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `item_category_item_id_category_id_caae8a89_uniq` (`item_id` ASC, `category_id` ASC) VISIBLE,
  INDEX `item_category_category_id_44782045_fk_category_Name` (`category_id` ASC) VISIBLE,
  CONSTRAINT `item_category_category_id_44782045_fk_category_Name`
    FOREIGN KEY (`category_id`)
    REFERENCES `biddingdb`.`category` (`Name`),
  CONSTRAINT `item_category_item_id_49f743b1_fk_item_id`
    FOREIGN KEY (`item_id`)
    REFERENCES `biddingdb`.`item` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 17786
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`pictures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`pictures` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(100) NOT NULL,
  `Item_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `pictures_Item_id_77592d53_fk_item_id` (`Item_id` ASC) VISIBLE,
  CONSTRAINT `pictures_Item_id_77592d53_fk_item_id`
    FOREIGN KEY (`Item_id`)
    REFERENCES `biddingdb`.`item` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3812
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `biddingdb`.`visitation_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `biddingdb`.`visitation_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `count` INT NOT NULL,
  `recommendation` DECIMAL(8,2) NULL DEFAULT NULL,
  `item_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `visitation_log_item_id_8bf0e770_fk_item_id` (`item_id` ASC) VISIBLE,
  INDEX `visitation_log_user_id_0440ed9b_fk_UserProfile_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `visitation_log_item_id_8bf0e770_fk_item_id`
    FOREIGN KEY (`item_id`)
    REFERENCES `biddingdb`.`item` (`id`),
  CONSTRAINT `visitation_log_user_id_0440ed9b_fk_UserProfile_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `biddingdb`.`userprofile` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 702538
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
