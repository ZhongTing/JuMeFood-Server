-- phpMyAdmin SQL Dump
-- version 2.10.3
-- http://www.phpmyadmin.net
-- 
-- 主機: localhost:2819
-- 建立日期: Jun 23, 2014, 01:24 PM
-- 伺服器版本: 6.0.4
-- PHP 版本: 6.0.0-dev

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- 資料庫: `jumefood`
-- 

-- --------------------------------------------------------

-- 
-- 資料表格式： `room`
-- 

CREATE TABLE `room` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `masterUid` int(11) NOT NULL,
  `goalUid` int(11) DEFAULT NULL,
  `time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`rid`),
  KEY `goal` (`goalUid`),
  KEY `masterUid` (`masterUid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

-- 
-- 列出以下資料庫的數據： `room`
-- 

INSERT INTO `room` VALUES (1, '吃飯囉', 11, 10, '2014-06-15 00:00:00');
INSERT INTO `room` VALUES (2, '午餐要吃沙米呢？', 10, NULL, '2014-06-15 19:30:00');

-- --------------------------------------------------------

-- 
-- 資料表格式： `roomadvice`
-- 

CREATE TABLE `roomadvice` (
  `rid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `sid` int(11) DEFAULT NULL,
  `customName` text,
  PRIMARY KEY (`rid`,`uid`),
  KEY `sid` (`sid`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- 列出以下資料庫的數據： `roomadvice`
-- 

INSERT INTO `roomadvice` VALUES (1, 10, 3, NULL);
INSERT INTO `roomadvice` VALUES (1, 11, 6, NULL);
INSERT INTO `roomadvice` VALUES (2, 10, NULL, '老張牛肉麵');
INSERT INTO `roomadvice` VALUES (2, 14, 3, NULL);

-- --------------------------------------------------------

-- 
-- 資料表格式： `roommember`
-- 

CREATE TABLE `roommember` (
  `rid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `status` enum('accept','refuse','quit','wait_decision') NOT NULL DEFAULT 'wait_decision',
  PRIMARY KEY (`rid`,`uid`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
-- 列出以下資料庫的數據： `roommember`
-- 

INSERT INTO `roommember` VALUES (1, 10, 'quit');
INSERT INTO `roommember` VALUES (1, 11, 'accept');
INSERT INTO `roommember` VALUES (1, 13, 'accept');
INSERT INTO `roommember` VALUES (2, 10, 'accept');
INSERT INTO `roommember` VALUES (2, 11, 'accept');
INSERT INTO `roommember` VALUES (2, 13, 'accept');
INSERT INTO `roommember` VALUES (2, 14, 'accept');

-- --------------------------------------------------------

-- 
-- 資料表格式： `roommsg`
-- 

CREATE TABLE `roommsg` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message` text NOT NULL,
  PRIMARY KEY (`mid`),
  KEY `rid` (`rid`),
  KEY `uid` (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=137 ;

-- 
-- 列出以下資料庫的數據： `roommsg`
-- 

INSERT INTO `roommsg` VALUES (126, 1, 11, '2014-06-15 18:48:29', 'ㄎㄎ');
INSERT INTO `roommsg` VALUES (127, 1, 10, '2014-06-15 18:48:39', '吃啥 ？？');
INSERT INTO `roommsg` VALUES (128, 1, 11, '2014-06-15 18:49:13', '謝宗廷推薦了麥當勞');
INSERT INTO `roommsg` VALUES (129, 1, 10, '2014-06-15 18:49:31', 'Keming Chen推薦了肯德基');
INSERT INTO `roommsg` VALUES (130, 1, 11, '2014-06-15 18:49:46', '室長轉出了---肯德基');
INSERT INTO `roommsg` VALUES (131, 1, 10, '2014-06-15 19:01:41', 'Keming Chen推薦了垃圾麵');
INSERT INTO `roommsg` VALUES (132, 1, 10, '2014-06-15 19:01:50', 'Keming Chen推薦了麥當勞');
INSERT INTO `roommsg` VALUES (133, 1, 10, '2014-06-15 19:04:39', 'Keming Chen推薦了漢堡王');
INSERT INTO `roommsg` VALUES (134, 2, 10, '2014-06-15 19:10:13', 'Keming Chen推薦了老張牛肉麵');
INSERT INTO `roommsg` VALUES (135, 2, 14, '2014-06-15 19:17:11', '嗨');
INSERT INTO `roommsg` VALUES (136, 2, 10, '2014-06-15 19:34:13', '嗨 你想吃漢堡王唷 ㄎㄎ');

-- --------------------------------------------------------

-- 
-- 資料表格式： `store`
-- 

CREATE TABLE `store` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  PRIMARY KEY (`sid`),
  KEY `tid` (`tid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- 
-- 列出以下資料庫的數據： `store`
-- 

INSERT INTO `store` VALUES (1, 1, '高家涼麵', 40, 25.042524, 121.539728);
INSERT INTO `store` VALUES (2, 1, '垃圾麵', 40, 25.043507, 121.53176);
INSERT INTO `store` VALUES (3, 1, '漢堡王', 100, 25.044112, 121.53144);
INSERT INTO `store` VALUES (5, 1, '嵐迪義大利麵', 100, 25.0428984, 121.5314894);
INSERT INTO `store` VALUES (6, 1, '麥當勞', 80, 25.0406519, 121.5322265);

-- --------------------------------------------------------

-- 
-- 資料表格式： `tag`
-- 

CREATE TABLE `tag` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

-- 
-- 列出以下資料庫的數據： `tag`
-- 

INSERT INTO `tag` VALUES (1, '北科');

-- --------------------------------------------------------

-- 
-- 資料表格式： `user`
-- 

CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `photo` text,
  `FBID` bigint(20) NOT NULL,
  `token` varchar(50) NOT NULL,
  `gcmId` text NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `FBID` (`FBID`),
  UNIQUE KEY `token` (`token`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

-- 
-- 列出以下資料庫的數據： `user`
-- 

INSERT INTO `user` VALUES (2, 'test', NULL, 123, '123', '123');
INSERT INTO `user` VALUES (3, 'test2', NULL, 456, '456', '456');
INSERT INTO `user` VALUES (7, '謝宗廷', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/t1.0-1/c37.55.466.466/s100x100/547766_578607275491125_1443285479_n.jpg', 100000255741179, '8e78e650-ef10-11e3-b2dd-0b0144f9b7e1', 'APA91bFaORY1G7FCx6sO-n92t8172KXaKo3Ul8DH9LgwdScZRDvRMQDkC5GS_78MznYPk1nOS5LOfbgwWRDV4CrgRwWMYB56OtVn1P5PE9GAli37953YMOmVm4nP7vWTy3XfqG-BVDZ80PRT7Ur8wXRIonpve0yH3A');
INSERT INTO `user` VALUES (8, 'Keming Chen', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/t1.0-1/c21.76.462.462/s100x100/546081_4583705557198_1334797284_n.jpg', 10202168645364130, '9ce0ff50-f147-11e3-886e-8d73978141a4', 'APA91bHBpzfXOltq0EG35FzMrP_ixj6X3cT3OWmzcQqT1kLGD02Kn4D5bpQloq8011UTivVt1aECNF66qvrUpBO3moEVsS8LC2vyRct6JumTrcUQO04sFwzhvuLqobhxsJhEnSNyvfEBB5toSKGUaaREjIJgrTfv2w');
INSERT INTO `user` VALUES (9, '謝宗廷', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/t1.0-1/c37.55.466.466/s100x100/547766_578607275491125_1443285479_n.jpg', 783620638323120, '7d56d5e0-f199-11e3-853f-5780f053ad9f', 'NoGCMId');
INSERT INTO `user` VALUES (10, 'Keming Chen', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/t1.0-1/c21.76.462.462/s100x100/546081_4583705557198_1334797284_n.jpg', 10202340378177343, '9928bcc0-f20c-11e3-be8d-41939060d5ea', 'APA91bH7NdxPylwSlfFkS7wlY7JraTHz6_0GNqqXFIEApRZ6Xmq3lsVQ5EJr5F0rnRoNtFBqYfWOsdfpqg_6x5RfU05HVySmHZgDhgWw_YPdUPKDs1elCp6evXJcbvl3FlQCmghRsuhU4xF_qCHIE1wMCNRuTRX0Ag');
INSERT INTO `user` VALUES (11, '謝宗廷', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/t1.0-1/c37.55.466.466/s100x100/547766_578607275491125_1443285479_n.jpg', 794044337280750, '860ff1f0-f20f-11e3-9b6d-437679be408c', 'APA91bFSkJJbm25xHobJaiz_QFPqD5eDarhhthBi6VY-KH4NtbdOzorDgYisOToEGjSMZaracBn4HPiXp0gMIMIjJf1nDDU5xf09jWpwYN2LxiuODYSo_CMe8ThI_lTkcfJxMy3ZCOFK');
INSERT INTO `user` VALUES (12, '彭湘媛', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/t1.0-1/c37.55.466.466/s100x100/481427_596732713678520_81081687_n.jpg', 801829129835543, 'bddbf550-f23e-11e3-b6bc-c1bb213bca72', 'APA91bH7NdxPylwSlfFkS7wlY7JraTHz6_0GNqqXFIEApRZ6Xmq3lsVQ5EJr5F0rnRoNtFBqYfWOsdfpqg_6x5RfU05HVySmHZgDhgWw_YPdUPKDs1elCp6evXJcbvl3FlQCmghRsuhU4xF_qCHIE1wMCNRuTRX0Ag');
INSERT INTO `user` VALUES (13, '林育德', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/t1.0-1/p100x100/547392_526262834059292_1555841980_n.jpg', 793432994008940, '6dc96cc0-f241-11e3-9ffd-39f9c7dd11c1', 'APA91bEhe7qMH2R7J9VVdVsMjXLoZ0c6eAba-dcdKZ_g8HdkR8v_6Je3XrLnQyMm15GLI7GmEB9Gcxzeh37Yo-fB-FFQ4_m3Ie5QoeEXzaN-8_wy_tqGaJf_A7XTnQut6Sr4AFSYZW2aP9UY4AoYtOtThcS9ws7Gag');
INSERT INTO `user` VALUES (14, '唐軒尉', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/t1.0-1/c0.43.100.100/p100x100/1795637_803354386346142_1137856438_n.jpg', 871474622867451, 'b0382640-f242-11e3-9ffd-39f9c7dd11c1', 'APA91bHscgZuE1O522fXxt5Ph5K1Y4OmjGLLSngLHuTPkGGW2662AbEPL0VtBncJzHXlZwzyoBTLYVxqGfHUgWfnbrRHIVJU93N5sfd5pv9Ryq2vQZuY5vy6ceFxsm01GfPLQEu-IO6d');
INSERT INTO `user` VALUES (15, '黃翊庭', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/t1.0-1/c71.7.706.706/s100x100/10402077_808825512463476_2935907798617944939_n.jpg', 820388961307131, '5c7f7b40-f254-11e3-8068-6d17600c553e', 'APA91bEJXxGGjZ3mVX1f8ByJQr3k_pPLMAQVsrDD-aGRIPRR_5ptmLhvWb3N6oHP_Cs2tA-ReFAVMn8BjtFIn_NDYUyUba7wPDK4INNBPKPMKZCE-4t_DD2UOdN7ozkzapljUKKCJQrv2QiqJrf_ZnCo3Qhx5YOYpw');
INSERT INTO `user` VALUES (16, 'Wen-pin  Hsu', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfp1/t1.0-1/c247.37.466.466/s100x100/407727_177163135724013_191664638_n.jpg', 604670942973228, '5f653610-f254-11e3-8068-6d17600c553e', 'APA91bFI8uE4hMGBAZ1joUH0t8fr3D5TOi6xViXOFXm9eamis1l_RnR16n_ezLlMwI1xwtjeKTGGLj6quvFRYhqtjJL4_EwHCm5Ohkp2oiGZFfW7xdg3qNkzIrVudPMjxA7eSiInyhqf');
INSERT INTO `user` VALUES (17, 'Chen YiHao', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfp1/t1.0-1/c0.36.179.179/s100x100/10336754_746440008712605_5901327298015726031_a.jpg', 753865884636684, 'afea7640-f254-11e3-8068-6d17600c553e', 'APA91bEumy6Zqmv3yGmZpT0cC2YjoZ_p7UdoP-guO6F6Ce3MX98rBbGdf6yxsyxcyGe0Mt2anyd_VkuQNu9wuqxz267oNhp8lqwgdWGp4QXtX1ws7hAfgp5Q-0xrbFTxC2C6I2yiJGWB78l9etr545tDGUZX_HkNxg');
INSERT INTO `user` VALUES (18, '李偉宇', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/t1.0-1/c122.2.716.716/s100x100/1911975_727713507261150_645307622_n.jpg', 791574767541690, 'ce999670-f259-11e3-8068-6d17600c553e', 'APA91bEZVd78EgtG6TEWM8k-z9tvuqBzI8TI2Pt5qJWjC2gKQs34tNzTpXisCxf50d1U0dKMr3rMnDBupcDkeK1S66QGfd9CRqF645LdPYjuCIsaTwub2u6dy3pAb9d0ARwbzc4xEMEgM0hYbi7HfmdgcejKDiuu7Q');
INSERT INTO `user` VALUES (19, '郭芳瑜', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/p100x100/1972328_10201663112413794_559572313_a.jpg?oh=b75a5bbc3a3b0ee86033658f4fedcc1d&oe=542CC347&__gda__=1412432138_afe99552ac15e021033e02d192ef50e3', 10202078912048525, 'c79a6650-f25a-11e3-8068-6d17600c553e', 'APA91bEnnw8rkMCmvQfO-uF3mV0MUVFxL7rZBH29nbAvxbgGjCgnc9OLSjqGDWmGTCqRJnOugAzGNJeIrEJWaWsJzGKgnqgztJcQYx5PfqbHJHh4OAOl9YKbfOu5_dGuSDFk2H-7mgaLqBOJlEtnAmy-e7QHlsV_Fw');
INSERT INTO `user` VALUES (20, '周泰禎', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/t1.0-1/c29.0.100.100/p100x100/252231_1002029915278_1941483569_n.jpg', 613113415462773, '2fb58640-f25e-11e3-8068-6d17600c553e', 'APA91bFRlfbnxo828-jzv3bgW4FcmuvdudtgNsMtRcnSsqSGsaFLNLBcxgd79i1aW0o96lvQGNvp4zLmqLT1R7z22_Ktp_hey-Uc6CqAPajy3ZiHLmE6NN_1utZ_ZOK1JC9qTukyE6pLEG5OocwZ-zhCpL7aE8wetA');
INSERT INTO `user` VALUES (21, 'Ting-Han Su', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/t1.0-1/c13.0.100.100/p100x100/10440933_10203339593443680_1819971710635510880_n.jpg', 10203346013844186, '04f3f450-f27c-11e3-8068-6d17600c553e', 'APA91bFc95ucQhfv9Jx7lntzzFcbPE7EreD3mLUl23v68foLUVTezYhYvJuB5xMBEP995qa0SKRsULoGJ6W0z0acaAshNtBZwfDbm64G7jXX3tjDNWGfkGRlhemdyfc-c8H3Mf1OhE2yb2I6yGbTmTq9e1gZ3AeGZw');
INSERT INTO `user` VALUES (22, '李劭騏', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/t1.0-1/c106.31.388.388/s100x100/970817_395565970555456_1061407931_n.jpg', 528923453886373, '323465f0-f27f-11e3-8068-6d17600c553e', 'APA91bEQHYOtvXSe9Xrr-x8lT0EqAFgL7jsOOjPcB2CU_pcKLYUgoQOiTRO2BDxqT0Ojzuo9B6BiproqV7Rax3lqj_DSEMDyyGsxEvNXOjCudbxzG24L_OYDwo9hh-Lniw9-h5TniZrXLhYROj6ARPGhv__ek3RMDA');
INSERT INTO `user` VALUES (23, 'Liang Shih E Liang', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/t1.0-1/c29.0.100.100/p100x100/252231_1002029915278_1941483569_n.jpg', 890077354343127, '951775a0-f28d-11e3-8068-6d17600c553e', 'APA91bHArhx285c0MT41N67XOQOudJhjCJJIsn_v1dUDDcZBjWkebIr_it3gkuZQ2_g_0WVG8X014E67DZDYcw7v05asK63bU2VCdCyqujG4XFKF6ESSqL5sDd3n2dGIZX-WU8W30JGf2vUIjVsMlajLygjX1iMuig');
INSERT INTO `user` VALUES (24, '林怡靜', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/t1.0-1/p100x100/1962668_738883576144309_2023495333_a.jpg', 782333738465959, '22f4b600-f2d7-11e3-aa89-3de98ee291ea', 'APA91bFvJtJGvBxyxSTNY_c6vP-pcIjPOXq57Nddig3-Mr0kSmk5ZPNii9O1YVoITuh5zObCAWn5RE7R7VNfKDht-ig2EnjE76owU-4aEVT6XHKquRMVwUJ3dY5OsI828cRPWNZQAGxY5dEWKJg2sNr8En1KAit0tg');
INSERT INTO `user` VALUES (25, 'TaipeiTech Apps', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/t1.0-1/c10.0.100.100/p100x100/1456136_1389508451293244_1218599401_n.jpg', 1459693077608114, '4b12c550-f471-11e3-bc8c-d9049fd925ac', 'APA91bHoTYxxDgI_gnz1ozCb6rssYRs1-CqQ90qNd4ynsGk4hoPcWW-tAimTBsi7Mxyi4_rIkAAwXhtBpJHJTqZePFXrVnJdSmVW-_mdUNmQ-13aWpwsfs_3IRMl8iE0h57W-U3FTVZd9qF4nWAHEsUtKUww5_phAg');

-- 
-- 備份資料表限制
-- 

-- 
-- 資料表限制 `room`
-- 
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_3` FOREIGN KEY (`masterUid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `room_ibfk_2` FOREIGN KEY (`goalUid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- 資料表限制 `roomadvice`
-- 
ALTER TABLE `roomadvice`
  ADD CONSTRAINT `roomadvice_ibfk_4` FOREIGN KEY (`uid`) REFERENCES `roommember` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `roomadvice_ibfk_1` FOREIGN KEY (`rid`) REFERENCES `room` (`rid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `roomadvice_ibfk_3` FOREIGN KEY (`sid`) REFERENCES `store` (`sid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- 資料表限制 `roommember`
-- 
ALTER TABLE `roommember`
  ADD CONSTRAINT `roommember_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `roommember_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `room` (`rid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- 資料表限制 `roommsg`
-- 
ALTER TABLE `roommsg`
  ADD CONSTRAINT `roommsg_ibfk_1` FOREIGN KEY (`rid`) REFERENCES `room` (`rid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `roommsg_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- 資料表限制 `store`
-- 
ALTER TABLE `store`
  ADD CONSTRAINT `store_ibfk_1` FOREIGN KEY (`tid`) REFERENCES `tag` (`tid`) ON DELETE CASCADE ON UPDATE CASCADE;
