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

ALTER TABLE car 
MODIFY details TEXT;

INSERT INTO car (vehicle_id, license_plate, daily_price, year, doors, seats, status, transmission, car_model, car_brands, details) VALUES
(1, '9กข-7890', 89000.00, 2026, 2, 2, 'Available', 'Auto', 'DB12', 'Aston Martin', 'The DB12 is a modern luxury grand tourer that blends high-performance engineering with refined British craftsmanship. It features a powerful V8 engine, advanced suspension systems, and a sleek aerodynamic design. Inside, the cabin is filled with premium materials such as hand-stitched leather, polished metal accents, and cutting-edge infotainment technology, offering both comfort and performance for long-distance driving.'),
(2, '8บค-4567', 65000.00, 2018, 2, 4, 'Rented', 'Auto', 'DB11', 'Aston Martin', 'The DB11 is a premium sports coupe designed to deliver both speed and elegance. It offers a choice of powerful engines, including a V8 or V12, paired with a smooth automatic transmission. The car emphasizes grand touring comfort with a quiet, luxurious interior while maintaining sharp handling and acceleration, making it ideal for both city cruising and highway performance.'),
(3, '7งง-3321', 95000.00, 2025, 2, 2, 'Rented', 'Auto', 'V12 Vanquish', 'Aston Martin', 'The V12 Vanquish is a high-performance coupe known for its naturally aspirated V12 engine and aggressive styling. It delivers thrilling acceleration and a distinctive exhaust note. The interior combines luxury with sportiness, featuring carbon fiber trims and advanced driver-focused controls, making it a flagship performance model of its era.'),
(4, '5กก-9111', 55000.00, 2025, 2, 4, 'Maintenance', 'Auto', 'M8 Competition', 'BMW', 'The M8 Competition is a luxury performance car that combines BMW’s motorsport engineering with executive-level comfort. It features a twin-turbocharged V8 engine, all-wheel drive, and adaptive suspension. The interior is equipped with advanced digital displays, high-end materials, and customizable driving modes, allowing drivers to switch between comfort and track-ready performance.'),
(5, '3บล-8899', 120000.00, 2018, 2, 2, 'Available', 'Auto', 'Huracan EVO-X', 'Lamborghini', 'The Huracan EVO-X is a supercar designed with extreme performance and precision in mind. It features a naturally aspirated V10 engine, rear-wheel steering, and advanced aerodynamics. The design is sharp and aggressive, while the interior focuses on driver engagement with digital controls and racing-inspired seating.'),
(6, '2ฮก-2234', 150000.00, 2025, 2, 2, 'Available', 'Auto', 'Aventador SVJ', 'Lamborghini', 'The Aventador SVJ is Lamborghini’s flagship supercar, built for ultimate performance. It is powered by a naturally aspirated V12 engine and features advanced aerodynamic systems for maximum downforce. The car is lightweight, extremely fast, and designed for track dominance while still being road-legal.'),
(7, '1กอ-0007', 110000.00, 2025, 4, 5, 'Rented', 'Auto', 'Macan', 'Porsche', 'The Macan is a compact luxury SUV that combines everyday practicality with Porsche’s signature driving dynamics. It offers responsive handling, a refined interior, and multiple engine options. The cabin is modern and driver-focused, making it one of the sportiest SUVs in its class.'),
(8, '4กท-4444', 70000.00, 2024, 2, 2, 'Available', 'Auto', '488 GTB', 'Ferrari', 'The 488 GTB is an Italian sports car known for its twin-turbocharged V8 engine and precise handling. It offers rapid acceleration and a refined aerodynamic design. The interior is focused on the driver, with controls integrated into the steering wheel and high-quality materials throughout.'),
(9, '6ขย-6666', 130000.00, 2025, 2, 2, 'Available', 'Auto', '911 Turbo S', 'Porsche', 'The 911 Turbo S is a high-end sports car that delivers exceptional speed and everyday usability. It features all-wheel drive, a twin-turbo engine, and advanced traction systems. The interior balances luxury with functionality, making it suitable for both daily driving and high-performance use.'),
(10, '1ทม-1111', 60000.00, 2023, 4, 5, 'Available', 'Auto', 'S-Class', 'Mercedes-Benz',
'The S-Class is the flagship luxury sedan from Mercedes-Benz, representing the highest level of comfort, innovation, and refinement. It features advanced driver assistance systems, a smooth and quiet ride, and a highly sophisticated interior with ambient lighting, massage seats, and large digital displays, making it ideal for executive travel.'),

(11, 'มส-1111', 95000.00, 2024, 2, 4, 'Available', 'Auto', 'MC20', 'Maserati',
'The MC20 is a modern luxury sports car that marks Maserati’s return to the supercar segment. It features a lightweight carbon fiber chassis and a powerful twin-turbo V6 engine. The design is sleek and aerodynamic, while the interior offers a minimalist yet premium feel focused on driving performance.'),

(12, 'มบ-1212', 60000.00, 2023, 4, 5, 'Available', 'Auto', 'E-Class', 'Mercedes-Benz',
'The E-Class is a refined executive sedan that balances comfort, performance, and advanced technology. It provides a smooth driving experience, modern infotainment systems, and high-quality interior materials, making it suitable for both business and everyday use.'),

(13, 'ปช-1313', 88000.00, 2024, 2, 4, 'Available', 'Auto', '911 Carrera', 'Porsche',
'The 911 Carrera is an iconic sports coupe known for its timeless design and precise performance. It features a rear-engine layout, responsive handling, and a luxurious interior, making it a perfect combination of everyday usability and sports performance.'),

(14, 'ปช-1414', 125000.00, 2025, 2, 2, 'Available', 'Auto', 'Taycan Turbo', 'Porsche',
'The Taycan Turbo is a high-performance electric sports car that delivers instant acceleration and advanced driving dynamics. It features cutting-edge battery technology, a futuristic interior with multiple digital displays, and exceptional handling for an electric vehicle.'),

(15, 'ทซ-1515', 70000.00, 2024, 4, 5, 'Available', 'Auto', 'Model S', 'Tesla',
'The Model S is a luxury electric sedan known for its impressive range, rapid acceleration, and minimalist interior design. It includes a large touchscreen interface, advanced autopilot features, and continuous software updates, making it one of the most innovative EVs available.'),

(16, 'กข-1616', 90000, 2024, 4, 4, 'Available', 'Auto', 'DBX', 'Aston Martin',
'The DBX is Aston Martin’s luxury SUV that combines high performance with everyday practicality. It offers a powerful engine, spacious cabin, and premium materials while maintaining sporty handling and elegant styling.'),

(17, 'กข-1717', 120000, 2024, 2, 2, 'Available', 'Auto', 'Victor', 'Aston Martin',
'The Victor is an ultra-exclusive luxury sports car inspired by classic Aston Martin heritage. It features a powerful V12 engine, bespoke craftsmanship, and a unique design, making it a rare collector’s vehicle with exceptional performance.'),

(18, 'กข-1818', 85000, 2023, 2, 2, 'Available', 'Auto', 'i8 Roadster', 'BMW',
'The i8 Roadster is a futuristic hybrid sports car that combines electric efficiency with turbocharged performance. It features a lightweight design, open-top driving experience, and advanced technology, offering both sustainability and excitement.'),

(19, 'กข-1919', 95000, 2024, 2, 4, 'Available', 'Auto', 'M8 Coupe', 'BMW',
'The M8 Coupe is a high-performance luxury sports coupe with a powerful engine and precise handling. It combines aggressive styling with a refined interior, offering both comfort and track-level performance.'),

(20, 'กข-2020', 88000, 2024, 4, 5, 'Available', 'Auto', 'X6 M', 'BMW',
'The X6 M is a performance SUV that blends coupe-like styling with powerful engine capabilities. It offers all-wheel drive, sporty handling, and a luxurious interior, making it both practical and performance-focused.'),

(21, 'กข-2121', 110000, 2024, 2, 2, 'Available', 'Auto', '812 Superfast', 'Ferrari',
'The 812 Superfast is a front-engine V12 sports car delivering extreme power and precision. It offers exceptional acceleration, advanced aerodynamics, and a luxurious interior, representing Ferrari’s engineering excellence.'),

(22, 'กข-2222', 115000, 2024, 2, 2, 'Available', 'Auto', 'F8 Tributo', 'Ferrari',
'The F8 Tributo is a mid-engine sports car that showcases Ferrari’s V8 performance heritage. It features sharp handling, aerodynamic efficiency, and a driver-focused interior with premium materials.'),

(23, 'กข-2323', 130000, 2025, 4, 4, 'Available', 'Auto', 'Purosangue', 'Ferrari',
'The Purosangue is Ferrari’s first luxury SUV, combining performance with versatility. It features a powerful engine, spacious interior, and advanced technology while maintaining Ferrari’s signature driving dynamics.'),

(24, 'กข-2424', 125000, 2025, 2, 2, 'Available', 'Auto', 'Revuelto', 'Lamborghini',
'The Revuelto is a hybrid supercar that combines a V12 engine with electric motors for extreme performance. It features futuristic styling, advanced aerodynamics, and cutting-edge hybrid technology.'),

(25, 'กข-2525', 100000, 2024, 2, 2, 'Available', 'Auto', 'Huracan', 'Lamborghini',
'The Huracan is a high-performance super sports car equipped with a naturally aspirated V10 engine. It offers precise handling, aggressive styling, and an immersive driving experience.'),

(26, 'กข-2626', 105000, 2024, 4, 5, 'Available', 'Auto', 'Urus', 'Lamborghini',
'The Urus is a luxury SUV that delivers supercar-like performance. It combines a powerful engine, bold design, and advanced technology with everyday usability and comfort.'),

(27, 'กข-2727', 95000, 2024, 2, 4, 'Available', 'Auto', 'GranTurismo', 'Maserati',
'The GranTurismo is a luxury grand tourer designed for long-distance comfort and performance. It features elegant Italian design, a refined interior, and a powerful engine for smooth driving.'),

(28, 'กข-2828', 85000, 2023, 4, 5, 'Available', 'Auto', 'Levante', 'Maserati',
'The Levante is a luxury SUV that blends Italian styling with strong performance. It offers a comfortable interior, advanced features, and a smooth driving experience.'),

(29, 'กข-3030', 92000, 2024, 2, 2, 'Available', 'Auto', 'AMG', 'Mercedes-Benz',
'AMG represents Mercedes-Benz’s high-performance division, delivering enhanced power, sporty design, and advanced engineering. These models feature upgraded engines, aggressive styling, and performance-focused interiors.'),

(30, 'กข-3131', 87000, 2024, 5, 5, 'Available', 'Auto', '918 Spyder', 'Porsche',
'The 918 Spyder is a hybrid hypercar that combines electric motors with a high-performance engine. It delivers extreme acceleration, advanced technology, and exceptional handling, making it one of Porsche’s most advanced models.'),

(31, 'กข-3333', 88000, 2024, 4, 5, 'Available', 'Auto', 'Quattroporte', 'Maserati',
'The Quattroporte is a luxury sports sedan that offers a blend of performance and comfort. It features elegant design, a spacious interior, and strong engine performance for executive driving.'),

(32, 'กข-3434', 97000, 2024, 2, 2, 'Available', 'Auto', 'CLE 63 AMG', 'Mercedes-Benz',
'The CLE 63 AMG is a high-performance luxury sedan with a powerful engine and sporty design. It offers advanced driving dynamics, premium materials, and cutting-edge technology.'),

(33, 'กข-3535', 99000, 2025, 2, 2, 'Available', 'Auto', '911 GT3', 'Porsche',
'The 911 GT3 is a track-focused sports car engineered for precision and speed. It features a naturally aspirated engine, lightweight construction, and advanced aerodynamics for ultimate driving performance.'),

(34, 'กข-3636', 102000, 2025, 4, 5, 'Available', 'Auto', 'Cayenne', 'Porsche',
'The Cayenne is a luxury SUV that combines practicality with sports car performance. It offers powerful engine options, a spacious interior, and advanced technology for everyday use.'),

(35, 'กข-3737', 75000, 2023, 4, 5, 'Available', 'Auto', 'Model 3', 'Tesla',
'The Model 3 is a compact electric sedan designed for efficiency and affordability. It features a minimalist interior, advanced autopilot capabilities, and strong battery range.'),

(36, 'กข-3838', 85000, 2024, 2, 4, 'Available', 'Auto', 'Roadster', 'Tesla',
'The Tesla Roadster is a high-performance electric sports car designed for extreme speed and acceleration. It features cutting-edge battery technology and a sleek aerodynamic design.'),

(37, 'กข-3939', 90000, 2025, 4, 5, 'Available', 'Auto', 'Model Y', 'Tesla',
'The Model Y is a compact electric SUV offering practicality, efficiency, and modern technology. It features a spacious interior, strong range, and advanced safety systems.');

-- image
INSERT INTO image (url, description, vehicle_id) VALUES
('https://drive.google.com/uc?id=12FQabRLFUNJtERtRLTVJfHxGbd976xvL', 'aston car', 1),
('https://drive.google.com/uc?id=1us3abL-N1tVbDPwQDDufi-CQQ0GjUQ6n', 'bmw car', 2),
('https://drive.google.com/uc?id=1O5MORKgs5D8xQyhEKtMdZZz_q9XWn6tP', 'ferrari car', 3),
('https://drive.google.com/uc?id=1nuV053m7rypkICsplE8UYiTKPIN91NRZ', 'hero_car1', 4),
('https://drive.google.com/uc?id=14uyLMNLvljUiofNC8RDcbjQP3O0l6G2Y', 'hero_car2', 5),
('https://drive.google.com/uc?id=1-Gsxi0Tsomk72F2Whulc4radaAMdTWuh', 'hero_car', 6),
('https://drive.google.com/uc?id=1YYwdGWaS2dSqmwTsIhCQ2MSKadYFPv6L', 'lambo', 7),
('https://drive.google.com/uc?id=1QYwnkCg5AnKWLy49z7fSSiP0GTzo8tc1', 'luxury_interior1', 8),
('https://drive.google.com/uc?id=1_-NRmhD_g2Z0fNgMnI92cczZVd8U48Ms', 'luxury_interior2', 9),
('https://drive.google.com/uc?id=1DI-emACj9Ad9JZnX0IQwG5DzfhYcGrH5', 'luxury_interior', 10),
('https://drive.google.com/uc?id=1rsqxWC1PRIsthknJUQZLJg6c7qg2iz_M', 'marserati', 11),
('https://drive.google.com/uc?id=1Wgasy6A9lqwXuKV4D1qoS9sOQWJw5vmT', 'mercedes', 12),
('https://drive.google.com/uc?id=1QHvxRhC1xnevY630XYZtYnRN-3eMLWxM', 'porsche1', 13),
('https://drive.google.com/uc?id=1PjeruwNUJQoeyBApNLhqsXoKnbqkz0dA', 'porsche', 14),
('https://drive.google.com/uc?id=1Yo3_9moR_VPWMBPsLfHEfFjysyQ61KEH', 'tesla', 15),
('https://drive.google.com/uc?id=1WkmXmPZerKWt9Xcdf0es0zfi_GaFFf72', 'search car 1', 16),
('https://drive.google.com/uc?id=10-TohVttk4aTdAxlQQbonrPpxv13zOea', 'search car 2', 17),
('https://drive.google.com/uc?id=1CWniegTeiYVsJX8FbFpq9pCqiNUl5XOJ', 'search car 3', 18),
('https://drive.google.com/uc?id=1n3FiMGQOA64f7m_aQ4ILHS57qRHiO2IZ', 'search car 4', 19),
('https://drive.google.com/uc?id=1cj51d2LyBK366YaA4jJ_yqKeFBnDWi17', 'search car 5', 20),
('https://drive.google.com/uc?id=1VhD84g1kzm1T5W3fI0XMlQ6hVr06PLcL', 'search car 6', 21),
('https://drive.google.com/uc?id=1xc4tiuyIDThTOUvcdVQYetAN1-NYrgzk', 'search car 7', 22),
('https://drive.google.com/uc?id=1VSrZp51yh_k0N3lJfu9XunEevGgPKLLI', 'search car 8', 23),
('https://drive.google.com/uc?id=1MefgwY2fhdYvpAwjQg1HtGqUvOcnmN3E', 'search car 9', 24),
('https://drive.google.com/uc?id=19r7Lynhug2MfLRxLsa3qDPf8HXzTFOon', 'search car 10', 25),
('https://drive.google.com/uc?id=1YYwdGWaS2dSqmwTsIhCQ2MSKadYFPv6L', 'search car 11', 26),
('https://drive.google.com/uc?id=1wf4XN2aWyTNO3wLHI5_AwEicgaYjQqen', 'search car 12', 27),
('https://drive.google.com/uc?id=15bz7yL5m-ilUpQ8a4747c5LPWZ2DXTtL', 'search car 13', 28),
('https://drive.google.com/uc?id=1VcsgCxXH16KfUoSGltm4fhq2H-WrXcZ5', 'search car 15', 29),
('https://drive.google.com/uc?id=14Scd6VVfGTisdlf75c5GXRTx6Sv_1e0K', 'search car 16', 30),
('https://drive.google.com/uc?id=1dbpdFxgkA3oWLtrWgNfUWXR20ab3PBiT', 'search car 18', 31),
('https://drive.google.com/uc?id=1jXqBxpIqZN8biVUKcBNEOhlbE0P-Kaon', 'search car 19', 32),
('https://drive.google.com/uc?id=1xc4tiuyIDThTOUvcdVQYetAN1-NYrgzk', 'search car 20', 33),
('https://drive.google.com/uc?id=1pJi74Y1o-IsxPNOfGZpWU_Yp42tNFTEq', 'search car 21', 34),
('https://drive.google.com/uc?id=11fBdzkbWSVCjhYJN5y4w40QkOXMH7_nu', 'search car 22', 35),
('https://drive.google.com/uc?id=1LNMdR0P-Ebs1YMuumtAd2X5s8OO-VoTo', 'search car 23', 36),
('https://drive.google.com/uc?id=1e7mvi2nN3CwSoCFWTDAmUE3DeXfxdhO1', 'search car 24', 37);

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