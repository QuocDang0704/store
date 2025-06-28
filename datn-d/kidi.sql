-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 05, 2024 lúc 10:35 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `kidi`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `address`
--

CREATE TABLE `address` (
  `id` bigint(20) NOT NULL,
  `district` varchar(255) DEFAULT NULL,
  `exact` varchar(255) DEFAULT NULL,
  `is_default` bit(1) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `address`
--

INSERT INTO `address` (`id`, `district`, `exact`, `is_default`, `province`, `user_id`, `ward`) VALUES
(7, 'Hoàng Mai', '19 Ngõ 192 Đường Lê Trọng Tấn', b'1', 'Hà Nội', 31, 'Định Công'),
(8, 'Tiền Hải', 'Số 26 ngõ 19', b'1', 'Thái Bình', 34, 'Nam Chính'),
(9, 'Hồng Lê', 'Nhà thờ Hữu vi', b'1', 'Nam Định', 35, 'Hồng Thuận'),
(10, 'Vũ Thư', 'Ngõ 193', b'1', 'Thái Bình', 36, 'Nam Phú'),
(11, 'Hoàng Mai', 'Số 26 ngõ 17', b'0', 'Hà Nội', 31, 'Định Công'),
(12, 'Hoàng Mai', 'Số 26 ngõ 17', b'1', 'Thái Bình', 31, 'Định Công');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `description`, `name`) VALUES
(1, 'Sản phẩm dành cho các em bé nữ', 'Em bé nữ'),
(2, 'Sản phẩm dành cho các em bé nam', 'Em bé nam'),
(4, 'Sản phẩm dáng thể thao dành cho nam và nữ', 'Thể thao'),
(5, 'Sản phẩm dành cho cả nam và nữ', 'Bộ siêu tập dành cho nam và nữ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `color`
--

CREATE TABLE `color` (
  `id` bigint(20) NOT NULL,
  `hex` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `color`
--

INSERT INTO `color` (`id`, `hex`, `name`) VALUES
(1, '#FF0000', 'Đỏ'),
(2, '#0c910c', 'Xanh lá'),
(3, '#edc10a', 'Vàng'),
(4, '#895c1d', 'Nâu'),
(5, '#FF00FF', 'Tím'),
(7, '#e77da4', 'Hồng'),
(8, '#afabab', 'Xám'),
(9, '#f6d07d', 'Cam'),
(10, '#62eeda', 'Xanh min'),
(11, '#ffffff', 'Trắng'),
(12, '#0da2fb', 'Xanh nước biển'),
(13, '#0a0a0a', 'Đen'),
(14, '#0a0a0a', 'Đen'),
(15, '#1d0707', 'Đen');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedback`
--

CREATE TABLE `feedback` (
  `id` bigint(20) NOT NULL,
  `feedback_text` varchar(255) DEFAULT NULL,
  `vote` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order`
--

CREATE TABLE `order` (
  `id` bigint(20) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `ship_price` bigint(20) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `total` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `total_init` bigint(20) DEFAULT NULL,
  `is_payment` bit(1) DEFAULT NULL,
  `payment_methods` tinyint(4) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `updated_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order`
--

INSERT INTO `order` (`id`, `code`, `phone`, `ship_price`, `status`, `total`, `user_id`, `description`, `name`, `total_init`, `is_payment`, `payment_methods`, `address`, `created_date`, `updated_date`) VALUES
(26, 'KIDI20240501123843L9JJ5JEK', '0987665755', 0, 3, 364000, 31, 'Đơn hàng được tạo ngày 2024-05-01', 'kiditran', 364000, b'0', 1, '19 Ngõ 192 Đường Lê Trọng Tấn, Định Công, Hoàng Mai, Hà Nội', '2024-05-01 05:38:43.000000', '2024-05-04 10:24:43.000000'),
(28, 'KIDI20240501220905MWZQ9Y99', '0387778322', 0, 0, 299000, 34, 'Đơn hàng được tạo ngày 2024-05-01', 'bernie', 299000, b'0', 1, 'Số 26 ngõ 19, Nam Chính, Tiền Hải, Thái Bình', '2024-05-01 15:09:05.000000', '2024-05-01 15:09:05.000000'),
(29, 'KIDI202405012213341KIPO1O0', '0938372837', 0, 1, 284000, 35, 'Đơn hàng được tạo ngày 2024-05-01', 'cuiz', 289000, b'0', 1, 'Nhà thờ Hữu vi, Hồng Thuận, Hồng Lê, Nam Định', '2024-05-01 15:13:34.000000', '2024-05-04 10:59:06.000000'),
(30, 'KIDI20240501221646B40TODS7', '0937485738', 0, 2, 439000, 36, 'Đơn hàng được tạo ngày 2024-05-01', 'lannguyen', 444000, b'0', 1, 'Ngõ 193, Nam Phú, Vũ Thư, Thái Bình', '2024-05-01 15:16:46.000000', '2024-05-04 10:22:49.000000'),
(32, 'KIDI20240502082306968MJYOJ', '0987665755', 0, 4, 154000, 31, 'Đơn hàng được tạo ngày 2024-05-02', 'kiditran', 159000, b'1', 0, '19 Ngõ 192 Đường Lê Trọng Tấn, Định Công, Hoàng Mai, Hà Nội', '2024-05-02 01:23:06.000000', '2024-05-02 01:29:17.000000'),
(33, 'KIDI2024050211093035FOBG5C', '0987665755', 0, 4, 324000, 31, 'Đơn hàng được tạo ngày 2024-05-02', 'kiditran', 334000, b'1', 0, 'Số 26 ngõ 17, Định Công, Hoàng Mai, Hà Nội', '2024-05-02 04:09:30.000000', '2024-05-02 04:11:22.000000'),
(35, 'KIDI2024050417485970OO0V0R', '0987665755', 0, 3, 124000, 31, 'Đơn hàng được tạo ngày 2024-05-04', 'kiditran', 129000, b'0', 1, 'Số 26 ngõ 17, Định Công, Hoàng Mai, Thái Bình', '2024-05-04 10:48:59.000000', '2024-05-04 10:54:08.000000'),
(36, 'KIDI20240504175443XSEX8RKX', '0987665755', 0, 2, 124000, 31, 'Đơn hàng được tạo ngày 2024-05-04', 'kiditran', 129000, b'1', 0, 'Số 26 ngõ 17, Định Công, Hoàng Mai, Hà Nội', '2024-05-04 10:54:43.000000', '2024-05-04 10:59:14.000000'),
(37, 'KIDI20240504180907MMEV61UZ', '0987665755', 0, 4, 200000, 31, 'Đơn hàng được tạo ngày 2024-05-04', 'kiditran', 205000, b'0', 1, 'Số 26 ngõ 17, Định Công, Hoàng Mai, Hà Nội', '2024-05-04 11:09:07.000000', '2024-05-04 11:09:19.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_detail`
--

CREATE TABLE `order_detail` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL,
  `product_detail_id` bigint(20) DEFAULT NULL,
  `quantity` bigint(20) DEFAULT NULL,
  `total_price` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_detail`
--

INSERT INTO `order_detail` (`id`, `order_id`, `price`, `product_detail_id`, `quantity`, `total_price`) VALUES
(40, 26, 159000, 34, 1, 159000),
(41, 26, 205000, 29, 1, 205000),
(43, 28, 299000, 68, 1, 299000),
(44, 29, 289000, 42, 1, 289000),
(45, 30, 129000, 46, 1, 129000),
(46, 30, 315000, 53, 1, 315000),
(49, 32, 159000, 38, 1, 159000),
(50, 33, 129000, 46, 1, 129000),
(51, 33, 205000, 29, 1, 205000),
(53, 35, 129000, 45, 1, 129000),
(54, 36, 129000, 45, 1, 129000),
(55, 37, 205000, 24, 1, 205000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` bigint(20) NOT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL,
  `supplier_id` bigint(20) DEFAULT NULL,
  `description` varchar(10000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `category_id`, `images`, `material`, `name`, `price`, `supplier_id`, `description`) VALUES
(18, 5, 'images/product/N5SYe92024-05-01.png', 'Modal cao cấp', 'Bộ cộc tay cài vai phối sườn', 205000, 5, 'Bộ cộc tay cài vai phối sườn không chỉ nổi bật với chất vải gỗ sồi cao cấp thoáng mát, kháng khuẩn mà còn bởi thiết kế phối màu xinh yêu, bắt mắt.'),
(19, 1, 'images/product/gMGgRb2024-05-01.png', 'Cotton', 'Váy bé gái cộc tay hở vai', 289000, 2, 'Váy bé gái cộc tay hở vai với kiểu dáng babydoll vô cùng dễ thương, tôn dáng lại che mọi khuyết điểm của bé. '),
(21, 5, 'images/product/Z5gl0C2024-05-01.png', 'Cotton', 'Bộ cộc tay cài vai cho bé vải sồi', 159000, 2, 'Bộ cộc tay cài vai vải gỗ sồi nằm trong bộ sưu tập Hè dành cho các bé từ 4kg đến 15kg . '),
(22, 5, 'images/product/uoM6FW2024-05-01.png', 'Cotton', 'Bodysuit cộc tay vai chồm cho bé', 129000, 2, 'Bodysuit cộc tay vai chồm cho bé từ 3 đến 18 tháng tuổi với thiết kế kiểu vai chồm, khuy bấm ở đũng nhỏ rất tiện lợi cho các mẹ khi thay/cởi đồ cho bé. \r\n'),
(23, 5, 'images/product/XGVBRv2024-05-01.png', 'Bamboo cao cấp', 'Body đùi cộc tay phối màu', 315000, 1, ''),
(24, 2, 'images/product/oZyG3v2024-05-01.png', 'Modal cao cấp', 'Bộ sát nách phối màu xẻ sườn', 215000, 3, 'Bộ sát nách phối màu xẻ sườn may từ sợi sồi (Modal) nên có đặc tính mềm mại, thoáng mát, thấm hút mồ hôi tốt, thoát nhiệt tốt. '),
(25, 1, 'images/product/4XSJ0N2024-05-01.png', '100% Cotton', 'Váy bé gái cộc tay cổ đức', 499000, 5, 'Váy bé gái cộc tay cổ đức với chất liệu Thô 100% Cotton siêu thoáng mát, kiếu dáng cộc tay đơn giản nhưng lại rất tôn dáng của bé, màu sắc trang nhã tạo nên phong cách mới lạ cho bé. '),
(26, 1, 'images/product/a9chhg2024-05-01.png', 'Thô lanh', 'Bộ body tay cánh tiên phối ren', 299000, 3, 'Bộ body tay cánh tiên phối ren với thiết kế khỏe khoắn kết hợp cùng chất vải thô lanh mềm mại, thấm hút mồ hôi. '),
(27, 1, 'images/product/xWTS9r2024-05-01.png', 'Thô lanh', 'Váy liền vai tay quấn bánh bèo', 359000, 1, 'Váy liền vai tay quấn bánh bèo với kiểu dáng babydoll vô cùng dễ thương, tôn dáng lại che mọi khuyết điểm của bé.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_detail`
--

CREATE TABLE `product_detail` (
  `id` bigint(20) NOT NULL,
  `color_id` bigint(20) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `quantity` bigint(20) DEFAULT NULL,
  `size_id` bigint(20) DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_detail`
--

INSERT INTO `product_detail` (`id`, `color_id`, `images`, `product_id`, `quantity`, `size_id`, `price`) VALUES
(24, 8, 'images/product-detail/tmgbdi2024-05-01.png', 18, 20, 1, NULL),
(25, 8, 'images/product-detail/RYV36z2024-05-01.png', 18, 10, 2, NULL),
(26, 8, 'images/product-detail/P0e2pO2024-05-01.png', 18, 10, 3, NULL),
(27, 8, 'images/product-detail/KjCddW2024-05-01.png', 18, 10, 4, NULL),
(28, 7, 'images/product-detail/KkxSNv2024-05-01.png', 18, 10, 1, NULL),
(29, 7, 'images/product-detail/AtKMcM2024-05-01.png', 18, 9, 2, NULL),
(30, 7, 'images/product-detail/S8GMyu2024-05-01.png', 18, 10, 3, NULL),
(31, 3, 'images/product-detail/B7ffdr2024-05-01.png', 18, 10, 2, NULL),
(32, 3, 'images/product-detail/EGTWMJ2024-05-01.png', 18, 10, 4, NULL),
(33, 3, 'images/product-detail/OGaqBd2024-05-01.png', 18, 10, 1, NULL),
(34, 3, 'images/product-detail/HjtJgD2024-05-01.png', 21, 8, 1, NULL),
(35, 3, 'images/product-detail/7v9lkH2024-05-01.png', 21, 9, 3, NULL),
(36, 3, 'images/product-detail/F2iqz02024-05-01.png', 21, 10, 2, NULL),
(37, 3, 'images/product-detail/ahZBFX2024-05-01.png', 21, 20, 4, NULL),
(38, 7, 'images/product-detail/mi4VQx2024-05-01.png', 21, 20, 1, NULL),
(39, 7, 'images/product-detail/hPMeUe2024-05-01.png', 21, 10, 3, NULL),
(40, 7, 'images/product-detail/bZXCUe2024-05-01.png', 21, 10, 4, NULL),
(41, 9, 'images/product-detail/hRscuQ2024-05-01.png', 19, 9, 4, NULL),
(42, 9, 'images/product-detail/Ooinxp2024-05-01.png', 19, 9, 5, NULL),
(43, 10, 'images/product-detail/6oheDe2024-05-01.png', 19, 10, 4, NULL),
(44, 10, 'images/product-detail/dVJkXe2024-05-01.png', 19, 10, 5, NULL),
(45, 11, 'images/product-detail/O4HWca2024-05-01.png', 22, 8, 1, NULL),
(46, 11, 'images/product-detail/n60xsz2024-05-01.png', 22, 9, 2, NULL),
(47, 11, 'images/product-detail/Ggn5Vh2024-05-01.png', 22, 10, 3, NULL),
(48, 2, 'images/product-detail/fKzOfs2024-05-01.png', 23, 10, 4, NULL),
(49, 2, 'images/product-detail/Te3MQY2024-05-01.png', 23, 10, 5, NULL),
(50, 1, 'images/product-detail/ZsJUGc2024-05-01.png', 23, 10, 4, NULL),
(51, 1, 'images/product-detail/InHLoz2024-05-01.png', 23, 10, 5, NULL),
(52, 3, 'images/product-detail/yw2UEb2024-05-01.png', 23, 10, 4, NULL),
(53, 3, 'images/product-detail/Z1738Y2024-05-01.png', 23, 9, 5, NULL),
(54, 3, 'images/product-detail/fWlnat2024-05-01.png', 24, 5, 1, NULL),
(55, 3, 'images/product-detail/TQTrq12024-05-01.png', 24, 5, 2, NULL),
(56, 3, 'images/product-detail/mudrlr2024-05-01.png', 24, 5, 3, NULL),
(57, 7, 'images/product-detail/vEpvKU2024-05-01.png', 24, 5, 1, NULL),
(58, 7, 'images/product-detail/kdV3Gk2024-05-01.png', 24, 5, 2, NULL),
(59, 10, 'images/product-detail/isLvdi2024-05-01.png', 24, 5, 2, NULL),
(60, 10, 'images/product-detail/VAtVOh2024-05-01.png', 24, 5, 3, NULL),
(62, 7, 'images/product-detail/hnNaLg2024-05-01.png', 25, 15, 4, NULL),
(63, 7, 'images/product-detail/TBtzQJ2024-05-01.png', 25, 15, 5, NULL),
(64, 7, 'images/product-detail/NeBHh92024-05-01.png', 25, 15, 6, NULL),
(65, 12, 'images/product-detail/xJD29e2024-05-01.png', 25, 15, 4, NULL),
(66, 12, 'images/product-detail/rwW2Qh2024-05-01.png', 25, 15, 5, NULL),
(67, 12, 'images/product-detail/di7cMo2024-05-01.png', 25, 15, 6, NULL),
(68, 1, 'images/product-detail/sBu0Nn2024-05-01.png', 26, 9, 1, NULL),
(69, 1, 'images/product-detail/i7HGlt2024-05-01.png', 26, 10, 2, NULL),
(70, 11, 'images/product-detail/0K4VHo2024-05-01.png', 26, 10, 1, NULL),
(71, 11, 'images/product-detail/d7AO2O2024-05-01.png', 26, 10, 2, NULL),
(72, 4, 'images/product-detail/N7kQXn2024-05-01.png', 26, NULL, 1, NULL),
(73, 4, 'images/product-detail/hnuYZO2024-05-01.png', 26, 10, 2, NULL),
(74, 3, 'images/product-detail/GiVrID2024-05-01.png', 26, 10, 1, NULL),
(75, 3, 'images/product-detail/uGnSb52024-05-01.png', 26, 9, 2, NULL),
(76, 7, 'images/product-detail/dVPw2Y2024-05-02.png', 27, 10, 1, NULL),
(77, 7, 'images/product-detail/SiYxmp2024-05-02.png', 27, 10, 2, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role`
--

CREATE TABLE `role` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `funtion` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `role`
--

INSERT INTO `role` (`id`, `description`, `funtion`, `name`) VALUES
(1, 'ADMIN', 'admin', 'ADMIN'),
(2, 'MANAGER', 'MANAGER', 'MANAGER'),
(3, 'Customer', 'Customer', 'CUSTOMER'),
(4, 'Quản lý danh mục', '/category', 'category'),
(5, 'Quản lý kích thước', '/category/sizes', 'Kích thước');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `size`
--

CREATE TABLE `size` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `size`
--

INSERT INTO `size` (`id`, `description`, `name`) VALUES
(1, 'Cho bé từ 3 - 4kg', 'Size 2'),
(2, 'Cho bé từ 5 - 7kg', 'Size 3'),
(3, 'Cho bé từ 7 - 8kg', 'Size 4'),
(4, 'Cho bé từ 9 - 10kg', 'Size 5'),
(5, 'Cho bé từ 11 - 13 kg', 'Size 6'),
(6, 'Cho bé từ 14 - 16 kg', 'Size 7');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `supplier`
--

CREATE TABLE `supplier` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `describe` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `supplier`
--

INSERT INTO `supplier` (`id`, `address`, `describe`, `email`, `name`, `description`) VALUES
(1, 'Hoàng Mai, Hà Nội', NULL, 'bubaby@gmail.com', 'Bu Bayby', 'Thương hiệu cung cấp quần áo trẻ em cao cấp'),
(2, 'Quận Bình Thạnh, Thành phố Hồ Chí Minh', NULL, 'ualarogo@gmailcom', 'UalaRogo', 'Thương hiệu quần áo trẻ em cao cấp'),
(3, 'Nam Từ Liêm, Hà Nội', NULL, 'dokma@gmail.com', 'Dokma', 'Thương hiệu quần áo trẻ em cao cấp'),
(5, 'Thanh Xuân, Hà Nội', NULL, 'Haki@gmail.com', 'Haki', 'Thời trang cao cấp dành cho các bé yêu');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `dob`, `email`, `first_name`, `gender`, `last_name`, `password`, `phone`, `user_name`) VALUES
(31, '2001-02-18', 'kiditran123@gmail.com', 'Tran', '1', 'Kidi', '$2a$10$6QYvvTK9T2agIqvDWSj/deOltgF.VQqJdSDUVCJn.Y1J4tiPbjQLi', '0987665755', 'kiditran'),
(32, '2001-02-18', 'kiditranAdmin123@gmail.com', 'Tran', '1', 'KidiAdmin', '$2a$10$6QYvvTK9T2agIqvDWSj/deOltgF.VQqJdSDUVCJn.Y1J4tiPbjQLi', '0987665756', 'kiditranAdmin'),
(33, '2001-02-18', 'kidi123@gmail.com', 'Tran', 'Nữ', 'Kidi', '$2a$10$6QYvvTK9T2agIqvDWSj/deOltgF.VQqJdSDUVCJn.Y1J4tiPbjQLi', '0987665756', 'staff'),
(34, '2001-02-19', 'hanguyen123@gmail.com', 'Nguyen', '1', 'Ha', '$2a$10$kvwc1WptNN3hHRTMzKlcTuckfDKOOZrL.YEOhrDifiIZg1qnAsPf2', '0387778322', 'bernie'),
(35, '2001-02-20', 'Lehien234@gmail.com', 'Le', '0', 'Hiên', '$2a$10$UqfIlSdZIRIZU80haz9H1e8mSBV2T6zKe6pmCxu7eqvm08FuJEXVy', '0938372837', 'cuiz'),
(36, '1998-02-18', 'NguyenLan456@gmail.com', 'Nguyễn', '1', 'Lan', '$2a$10$buOD8q00QqBk9dckQBVL.u38KnxVsbQrAQ72nCnArhLf0hfGnhwDS', '0937485738', 'lannguyen');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_role`
--

CREATE TABLE `user_role` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user_role`
--

INSERT INTO `user_role` (`user_id`, `role_id`) VALUES
(31, 3),
(32, 1),
(34, 3),
(35, 3),
(36, 3),
(33, 5),
(33, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher`
--

CREATE TABLE `voucher` (
  `id` bigint(20) NOT NULL,
  `activated` bit(1) DEFAULT NULL,
  `conditions` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `discount_amount` double DEFAULT NULL,
  `expiration_date` datetime(6) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `voucher`
--

INSERT INTO `voucher` (`id`, `activated`, `conditions`, `created_date`, `discount_amount`, `expiration_date`, `quantity`) VALUES
(1, b'1', '500000', '2024-03-28 02:39:07.000000', 10000, '2024-03-28 02:39:07.000000', 48),
(2, b'1', '700000', '2024-03-28 02:39:07.000000', 20000, '2024-03-28 02:39:07.000000', 19),
(3, b'1', '100000', '2024-03-28 02:39:07.000000', 5000, '2024-03-28 02:39:07.000000', 9),
(4, b'1', '100000', '2024-03-28 02:39:07.000000', 10000, '2024-03-28 02:39:07.000000', 17);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `warehouse_entry`
--

CREATE TABLE `warehouse_entry` (
  `id` bigint(20) NOT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `updated_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `warehouse_entry`
--

INSERT INTO `warehouse_entry` (`id`, `created_date`, `user_id`, `updated_date`) VALUES
(5, '2024-05-01 04:27:23.000000', 32, '2024-05-01 04:27:23.000000'),
(6, '2024-05-02 03:29:51.000000', 32, '2024-05-02 03:29:51.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `warehouse_entry_detail`
--

CREATE TABLE `warehouse_entry_detail` (
  `id` bigint(20) NOT NULL,
  `price` bigint(20) DEFAULT NULL,
  `product_detail_id` bigint(20) DEFAULT NULL,
  `quantity` bigint(20) DEFAULT NULL,
  `total` bigint(20) DEFAULT NULL,
  `warehouse_entry_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `warehouse_entry_detail`
--

INSERT INTO `warehouse_entry_detail` (`id`, `price`, `product_detail_id`, `quantity`, `total`, `warehouse_entry_id`) VALUES
(6, 200000, 24, 10, 2000000, 5),
(7, 100000, 37, 10, 1000000, 6),
(8, 100000, 38, 10, 1000000, 6);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlqh9sj5o1ina3muo082ctm566` (`user_id`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK4wiwu4eheers6ollnya1u71uo` (`product_id`),
  ADD KEY `FKqvhdlc2hns8nk3ueo4ebuh0sq` (`user_id`);

--
-- Chỉ mục cho bảng `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrcaf946w0bh6qj0ljiw3pwpnu` (`user_id`);

--
-- Chỉ mục cho bảng `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlsonu3svt3kmhylu8xt7cymcq` (`order_id`),
  ADD KEY `FKoicpel6ymyiqcfc9t644do19i` (`product_detail_id`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqys3wf25o4da9h0vqcpnnjfmt` (`category_id`),
  ADD KEY `FKder4l07tr0i26mw28rf0gxf78` (`supplier_id`);

--
-- Chỉ mục cho bảng `product_detail`
--
ALTER TABLE `product_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbn675kqqk7eh4bvl7riry1xkl` (`product_id`),
  ADD KEY `FKg99nip4ayeu7v2g5cv94ix74s` (`color_id`),
  ADD KEY `FKha92q2a8nixoxt09hauuemnjm` (`size_id`);

--
-- Chỉ mục cho bảng `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user_role`
--
ALTER TABLE `user_role`
  ADD KEY `FKrhed10qhk4wodaigjva070cnv` (`role_id`),
  ADD KEY `FKfgsgxvihks805qcq8sq26ab7c` (`user_id`);

--
-- Chỉ mục cho bảng `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `warehouse_entry`
--
ALTER TABLE `warehouse_entry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6pr17t2bl16immeuvohst93mg` (`user_id`);

--
-- Chỉ mục cho bảng `warehouse_entry_detail`
--
ALTER TABLE `warehouse_entry_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKsw96eurdw5fees8igtidovu8b` (`product_detail_id`),
  ADD KEY `FKh7bel8ilmpst0arcu2b7u0rku` (`warehouse_entry_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `address`
--
ALTER TABLE `address`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `color`
--
ALTER TABLE `color`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `order`
--
ALTER TABLE `order`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT cho bảng `product_detail`
--
ALTER TABLE `product_detail`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT cho bảng `role`
--
ALTER TABLE `role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `size`
--
ALTER TABLE `size`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `voucher`
--
ALTER TABLE `voucher`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `warehouse_entry`
--
ALTER TABLE `warehouse_entry`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `warehouse_entry_detail`
--
ALTER TABLE `warehouse_entry_detail`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `FKlqh9sj5o1ina3muo082ctm566` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `FK4wiwu4eheers6ollnya1u71uo` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKqvhdlc2hns8nk3ueo4ebuh0sq` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `FKrcaf946w0bh6qj0ljiw3pwpnu` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `FKlsonu3svt3kmhylu8xt7cymcq` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  ADD CONSTRAINT `FKoicpel6ymyiqcfc9t644do19i` FOREIGN KEY (`product_detail_id`) REFERENCES `product_detail` (`id`);

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FKder4l07tr0i26mw28rf0gxf78` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`),
  ADD CONSTRAINT `FKqys3wf25o4da9h0vqcpnnjfmt` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

--
-- Các ràng buộc cho bảng `product_detail`
--
ALTER TABLE `product_detail`
  ADD CONSTRAINT `FKbn675kqqk7eh4bvl7riry1xkl` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKg99nip4ayeu7v2g5cv94ix74s` FOREIGN KEY (`color_id`) REFERENCES `color` (`id`),
  ADD CONSTRAINT `FKha92q2a8nixoxt09hauuemnjm` FOREIGN KEY (`size_id`) REFERENCES `size` (`id`);

--
-- Các ràng buộc cho bảng `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `FKfgsgxvihks805qcq8sq26ab7c` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKrhed10qhk4wodaigjva070cnv` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Các ràng buộc cho bảng `warehouse_entry`
--
ALTER TABLE `warehouse_entry`
  ADD CONSTRAINT `FK6pr17t2bl16immeuvohst93mg` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Các ràng buộc cho bảng `warehouse_entry_detail`
--
ALTER TABLE `warehouse_entry_detail`
  ADD CONSTRAINT `FKh7bel8ilmpst0arcu2b7u0rku` FOREIGN KEY (`warehouse_entry_id`) REFERENCES `warehouse_entry` (`id`),
  ADD CONSTRAINT `FKsw96eurdw5fees8igtidovu8b` FOREIGN KEY (`product_detail_id`) REFERENCES `product_detail` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
