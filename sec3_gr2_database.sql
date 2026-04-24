CREATE DATABASE IF NOT EXISTS velocita_db;
USE velocita_db;

-- =====================
-- DROP ALL TABLES FIRST
-- (order matters: child tables before parent tables)
-- =====================

DROP TABLE IF EXISTS modify_log;
DROP TABLE IF EXISTS log;
DROP TABLE IF EXISTS image;
DROP TABLE IF EXISTS admin_login;
DROP TABLE IF EXISTS car;
DROP TABLE IF EXISTS admin_info;

-- =====================
-- CREATE ALL TABLES
-- =====================

CREATE TABLE admin_info (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address VARCHAR(50),
    date_of_birth DATE,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE admin_login (
    login_id INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    admin_id INT NOT NULL UNIQUE,
    FOREIGN KEY (admin_id) REFERENCES admin_info(admin_id)
);

CREATE TABLE car (
    vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    daily_price DECIMAL(10,2) NOT NULL,
    year INT NOT NULL,
    doors INT NOT NULL,
    seats INT NOT NULL,
    status ENUM('Available', 'Rented', 'Maintenance') NOT NULL,
    transmission ENUM('Auto', 'Manual') NOT NULL,
    car_model VARCHAR(50) NOT NULL,
    car_brands VARCHAR(50) NOT NULL,
    details VARCHAR(200)
);

CREATE TABLE image (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(255) NOT NULL,
    description VARCHAR(200),
    vehicle_id INT NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES car(vehicle_id)
);

CREATE TABLE log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    login_datetime DATETIME NOT NULL,
    logout_datetime DATETIME,
    login_id INT NOT NULL,
    FOREIGN KEY (login_id) REFERENCES admin_login(login_id)
);

CREATE TABLE modify_log (
    modify_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    operation ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    time_stamp DATETIME NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admin_info(admin_id),
    FOREIGN KEY (vehicle_id) REFERENCES car(vehicle_id)
);

-- =====================
-- INSERT DATA
-- =====================

-- admin_info
INSERT INTO admin_info (first_name, last_name, address, date_of_birth, role) VALUES
('Tinna', 'Mongkolsamoke', 'Bangkok', '2001-01-01', 'Product Manager'),
('Woraneti', 'P.', 'Bangkok', '2001-02-02', 'Admin'),
('Traiwit', 'C.', 'Nakhon Pathom', '2001-03-03', 'Admin'),
('Madhuri', 'S.', 'Bangkok', '2001-04-04', 'Admin'),
('Alice', 'Brown', 'Bangkok', '2000-05-05', 'Staff'),
('Bob', 'Smith', 'Nonthaburi', '1999-06-06', 'Staff'),
('Chris', 'Lee', 'Chiang Mai', '1998-07-07', 'Staff'),
('Daisy', 'Tan', 'Phuket', '1997-08-08', 'Staff'),
('Ethan', 'Miller', 'Khon Kaen', '1996-09-09', 'Staff'),
('Faye', 'Wilson', 'Ayutthaya', '1995-10-10', 'Staff');

UPDATE admin_info SET first_name = 'Woraneti', last_name = 'Phicharanan' WHERE admin_id = 2;
UPDATE admin_info SET first_name = 'Traiwit', last_name = 'Channgam' WHERE admin_id = 3;
UPDATE admin_info SET first_name = 'Madhuri', last_name = 'Singh' WHERE admin_id = 4;

-- admin_login
INSERT INTO admin_login (password, email, username, admin_id) VALUES
('pass123', 'tinna@example.com', 'tinna01', 1),
('pass123', 'woraneti@example.com', 'woraneti02', 2),
('pass123', 'traiwit@example.com', 'traiwit03', 3),
('pass123', 'madhuri@example.com', 'madhuri04', 4),
('pass123', 'alice@example.com', 'alice05', 5),
('pass123', 'bob@example.com', 'bob06', 6),
('pass123', 'chris@example.com', 'chris07', 7),
('pass123', 'daisy@example.com', 'daisy08', 8),
('pass123', 'ethan@example.com', 'ethan09', 9),
('pass123', 'faye@example.com', 'faye10', 10);


INSERT INTO car (vehicle_id, license_plate, daily_price, year, doors, seats, status, transmission, car_model, car_brands, details) VALUES
(1, '9กข-7890', 89000.00, 2026, 2, 2, 'Available', 'Auto', 'DB12', 'Aston Martin', 'Luxury grand tourer'),
(2, '8บค-4567', 65000.00, 2018, 2, 4, 'Rented', 'Auto', 'DB11', 'Aston Martin', 'Premium sports coupe'),
(3, '7งง-3321', 95000.00, 2025, 2, 2, 'Rented', 'Auto', 'V12 Vanquish', 'Aston Martin', 'High performance coupe'),
(4, '5กก-9111', 55000.00, 2025, 2, 4, 'Maintenance', 'Auto', 'M8 Competition', 'BMW', 'Luxury performance car'),
(5, '3บล-8899', 120000.00, 2018, 2, 2, 'Available', 'Auto', 'Huracan EVO-X', 'Lamborghini', 'Supercar'),
(6, '2ฮก-2234', 150000.00, 2025, 2, 2, 'Available', 'Auto', 'Aventador SVJ', 'Lamborghini', 'Flagship supercar'),
(7, '1กอ-0007', 110000.00, 2025, 4, 5, 'Rented', 'Auto', 'Urus Performante', 'Lamborghini', 'Luxury SUV'),
(8, '4กท-4444', 70000.00, 2024, 2, 2, 'Available', 'Auto', '488 GTB', 'Ferrari', 'Italian sports car'),
(9, '6ขย-6666', 130000.00, 2025, 2, 2, 'Available', 'Auto', '911 Turbo S', 'Porsche', 'High-end sports car'),
(10, '1ทม-1111', 60000.00, 2023, 4, 5, 'Available', 'Auto', 'S-Class', 'Mercedes-Benz', 'Executive sedan'),
(11, 'มส-1111', 95000.00, 2024, 2, 4, 'Available', 'Auto', 'MC20', 'Maserati', 'Luxury sports car'),
(12, 'มบ-1212', 60000.00, 2023, 4, 5, 'Available', 'Auto', 'E-Class', 'Mercedes-Benz', 'Executive luxury sedan'),
(13, 'ปช-1313', 88000.00, 2024, 2, 4, 'Available', 'Auto', '911 Carrera', 'Porsche', 'Premium sports coupe'),
(14, 'ปช-1414', 125000.00, 2025, 2, 2, 'Available', 'Auto', 'Taycan Turbo', 'Porsche', 'High-performance electric sports car'),
(15, 'ทซ-1515', 70000.00, 2024, 4, 5, 'Available', 'Auto', 'Model S', 'Tesla', 'Luxury electric sedan'),
(16, 'กข-1616', 90000, 2024, 2, 2, 'Available', 'Auto', 'DBX', 'Aston Martin', 'Luxury SUV'),
(17, 'กข-1717', 120000, 2024, 2, 2, 'Available', 'Auto', 'Victor', 'Aston Martin', 'Ultra luxury sports car'),
(18, 'กข-1818', 85000, 2023, 2, 2, 'Available', 'Auto', 'i8 Roadster', 'BMW', 'Hybrid sports car'),
(19, 'กข-1919', 95000, 2024, 2, 4, 'Available', 'Auto', 'M8 Coupe', 'BMW', 'Luxury sports coupe'),
(20, 'กข-2020', 88000, 2024, 4, 5, 'Available', 'Auto', 'X6 M', 'BMW', 'Performance SUV'),
(21, 'กข-2121', 110000, 2024, 2, 2, 'Available', 'Auto', '812 Superfast', 'Ferrari', 'High-performance sports car'),
(22, 'กข-2222', 115000, 2024, 2, 2, 'Available', 'Auto', 'F8 Tributo', 'Ferrari', 'Luxury sports car'),
(23, 'กข-2323', 130000, 2025, 4, 4, 'Available', 'Auto', 'Purosangue', 'Ferrari', 'Luxury SUV'),
(24, 'กข-2424', 125000, 2025, 2, 2, 'Available', 'Auto', 'Revuelto', 'Lamborghini', 'Hybrid supercar'),
(25, 'กข-2525', 100000, 2024, 2, 2, 'Available', 'Auto', 'Huracan', 'Lamborghini', 'Super sports car'),
(26, 'กข-2626', 105000, 2024, 4, 5, 'Available', 'Auto', 'Urus', 'Lamborghini', 'Luxury SUV'),
(27, 'กข-2727', 95000, 2024, 2, 4, 'Available', 'Auto', 'GranTurismo', 'Maserati', 'Luxury grand tourer'),
(28, 'กข-2828', 85000, 2023, 4, 5, 'Available', 'Auto', 'Levante', 'Maserati', 'Luxury SUV'),
(29, 'กข-2929', 78000, 2023, 4, 5, 'Available', 'Auto', 'Ghibli', 'Maserati', 'Executive sedan'),
(30, 'กข-3030', 92000, 2024, 4, 5, 'Available', 'Auto', 'EQS', 'Mercedes-Benz', 'Luxury electric sedan'),
(31, 'กข-3131', 87000, 2024, 4, 5, 'Available', 'Auto', 'GLE', 'Mercedes-Benz', 'Luxury SUV'),
(32, 'กข-3232', 83000, 2023, 2, 4, 'Available', 'Auto', 'C-Class Coupe', 'Mercedes-Benz', 'Premium coupe'),
(33, 'กข-3333', 88000, 2024, 2, 2, 'Available', 'Auto', '718 Cayman', 'Porsche', 'Sports coupe'),
(34, 'กข-3434', 97000, 2024, 2, 2, 'Available', 'Auto', 'Panamera', 'Porsche', 'Luxury sedan'),
(35, 'กข-3535', 99000, 2025, 4, 5, 'Available', 'Auto', 'Macan', 'Porsche', 'Compact luxury SUV'),
(36, 'กข-3636', 102000, 2025, 4, 5, 'Available', 'Auto', 'Cayenne', 'Porsche', 'Luxury SUV'),
(37, 'กข-3737', 75000, 2023, 4, 5, 'Available', 'Auto', 'Model 3', 'Tesla', 'Electric sedan'),
(38, 'กข-3838', 85000, 2024, 4, 5, 'Available', 'Auto', 'Model X', 'Tesla', 'Electric SUV'),
(39, 'กข-3939', 90000, 2025, 4, 5, 'Available', 'Auto', 'Model Y', 'Tesla', 'Electric SUV');

-- image
INSERT INTO image (url, description, vehicle_id) VALUES
('https://drive.google.com/uc?id=12FQabRLFUNJtERtRLTVJfHxGbd976xvL', 'aston car', 1),
('https://drive.google.com/uc?id=1us3abL-N1tVbDPwQDDufi-CQQ0GjUQ6n', 'bmw car', 2),
('https://drive.google.com/uc?id=1O5MORKgs5D8xQyhEKtMdZZz_q9XWn6tP', 'ferrari car', 3),
('https://drive.google.com/uc?id=1nuV053m7rypkICsplE8UYiTKPIN91NRZ', 'hero_car1', 4),
('https://drive.google.com/uc?id=14uyLMNLvljUiofNC8RDcbjQP3O0l6G2Y', 'hero_car2', 5),
('https://drive.google.com/uc?id=1QoVOL9C9HPwYOByIIactH8ExcPWu5c6_', 'hero_car', 6),
('https://drive.google.com/uc?id=1YYwdGWaS2dSqmwTsIhCQ2MSKadYFPv6L', 'lambo', 7),
('https://drive.google.com/uc?id=1QYwnkCg5AnKWLy49z7fSSiP0GTzo8tc1', 'luxury_interior1', 8),
('https://drive.google.com/uc?id=', 'luxury_interior2', 9),
('https://drive.google.com/uc?id=', 'luxury_interior', 10),
('https://drive.google.com/uc?id=', 'marserati', 11),
('https://drive.google.com/uc?id=', 'mercedes', 12),
('https://drive.google.com/uc?id=', 'porsche1', 13),
('https://drive.google.com/uc?id=', 'porsche', 14),
('https://drive.google.com/uc?id=', 'tesla', 15),
('https://drive.google.com/uc?id=', 'search car 1', 16),
('https://drive.google.com/uc?id=', 'search car 2', 17),
('https://drive.google.com/uc?id=', 'search car 3', 18),
('https://drive.google.com/uc?id=', 'search car 4', 19),
('https://drive.google.com/uc?id=', 'search car 5', 20),
('https://drive.google.com/uc?id=', 'search car 6', 21),
('https://drive.google.com/uc?id=', 'search car 7', 22),
('https://drive.google.com/uc?id=', 'search car 8', 23),
('https://drive.google.com/uc?id=', 'search car 9', 24),
('https://drive.google.com/uc?id=', 'search car 10', 25),
('https://drive.google.com/uc?id=', 'search car 11', 26),
('https://drive.google.com/uc?id=', 'search car 12', 27),
('https://drive.google.com/uc?id=', 'search car 13', 28),
('https://drive.google.com/uc?id=', 'search car 14', 29),
('https://drive.google.com/uc?id=', 'search car 15', 30),
('https://drive.google.com/uc?id=', 'search car 16', 31),
('https://drive.google.com/uc?id=', 'search car 17', 32),
('https://drive.google.com/uc?id=', 'search car 18', 33),
('https://drive.google.com/uc?id=', 'search car 19', 34),
('https://drive.google.com/uc?id=', 'search car 20', 35),
('https://drive.google.com/uc?id=', 'search car 21', 36),
('https://drive.google.com/uc?id=', 'search car 22', 37),
('https://drive.google.com/uc?id=', 'search car 23', 38),
('https://drive.google.com/uc?id=', 'search car 24', 39);

-- log
INSERT INTO log (login_datetime, logout_datetime, login_id) VALUES
('2026-04-01 08:00:00', '2026-04-01 17:00:00', 1),
('2026-04-02 08:15:00', '2026-04-02 17:30:00', 2),
('2026-04-03 07:50:00', '2026-04-03 16:45:00', 3),
('2026-04-04 08:05:00', '2026-04-04 17:10:00', 4),
('2026-04-05 08:20:00', '2026-04-05 17:40:00', 5),
('2026-04-06 08:00:00', '2026-04-06 17:05:00', 1),
('2026-04-07 08:30:00', '2026-04-07 17:50:00', 2),
('2026-04-08 07:45:00', '2026-04-08 16:30:00', 3),
('2026-04-09 08:10:00', '2026-04-09 17:20:00', 4),
('2026-04-10 08:25:00', '2026-04-10 17:55:00', 5);

-- modify_log
INSERT INTO modify_log (admin_id, vehicle_id, operation, time_stamp) VALUES
(1, 1, 'INSERT', '2026-04-01 09:00:00'),
(2, 2, 'INSERT', '2026-04-02 09:30:00'),
(3, 3, 'UPDATE', '2026-04-03 10:15:00'),
(4, 4, 'UPDATE', '2026-04-04 11:00:00'),
(5, 5, 'DELETE', '2026-04-05 14:20:00'),
(1, 6, 'INSERT', '2026-04-06 15:10:00'),
(2, 7, 'UPDATE', '2026-04-07 16:45:00'),
(3, 8, 'INSERT', '2026-04-08 09:50:00'),
(4, 9, 'UPDATE', '2026-04-09 13:30:00'),
(5, 10, 'DELETE', '2026-04-10 16:00:00');

-- =====================
-- SELECT / VERIFY
-- =====================

SHOW TABLES;
SELECT * FROM admin_info;
SELECT * FROM admin_login;
SELECT vehicle_id, car_model, car_brands FROM car ORDER BY vehicle_id;
SELECT * FROM car;
SELECT * FROM image ORDER BY vehicle_id;
SELECT
    c.vehicle_id,
    c.car_model,
    c.car_brands,
    i.url
FROM car c
JOIN image i ON c.vehicle_id = i.vehicle_id
ORDER BY c.vehicle_id;


