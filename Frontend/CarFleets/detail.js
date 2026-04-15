// ===================================================
//  Velocità — Car Detail Page
// ===================================================

// ---- CONFIG: set your API base URL here ----
const API_BASE = 'http://localhost:5000';   // change to your backend URL

const params    = new URLSearchParams(window.location.search);
const vehicleId = params.get('id') || '';

// ===================================================
//  MOCK DATA (same as brand.js — remove once backend ready)
// ===================================================
const ALL_MOCK_CARS = [
    { vehicle_id: 'VEL-AM-001', brand: 'Aston Martin', model: 'Vintage DB12',   year: 2026, transmission: 'Auto', seats: 2, doors: 2, daily_price: 89000,  status: 'Available', image: '../Searchpage/All_brands/Aston-Martin-DB11_Auto_2_Seats_2_Doors.jpg',        description: 'The ultimate in refined performance and British luxury — 690 hp unleashed through a handcrafted twin-turbo V8, breathtaking acceleration, and bespoke interior comfort. Whether cruising city boulevards or commanding open highways, the DB12 S delivers an unforgettable drive.' },
    { vehicle_id: 'VEL-AM-002', brand: 'Aston Martin', model: 'DB11 Navy',      year: 2018, transmission: 'Auto', seats: 4, doors: 2, daily_price: 75000,  status: 'Available', image: '../Searchpage/All_brands/Aston-Martin-DBX_Auto_5_Seats_5_Doors.jpg',          description: 'The DB11 Navy combines striking British elegance with a 503 hp twin-turbo V8. Its navy exterior finish is rare and breathtaking, perfect for those who demand style and power in every journey.' },
    { vehicle_id: 'VEL-AM-003', brand: 'Aston Martin', model: 'V12 Vanquish',   year: 2025, transmission: 'Auto', seats: 2, doors: 2, daily_price: 95000,  status: 'Available', image: '../Searchpage/All_brands/Aston-Martin-Victor_Manual_2_Seats_2_Doors.jpg',       description: 'The V12 Vanquish is Aston Martin at its most dramatic — a naturally aspirated 5.9L V12 producing 568 hp with a spine-tingling exhaust note that defines the grand tourer experience.' },
    { vehicle_id: 'VEL-BM-001', brand: 'BMW', model: 'M8 Competition',          year: 2025, transmission: 'Auto', seats: 4, doors: 2, daily_price: 98000,  status: 'Available', image: '../Searchpage/All_brands/BMW-M8-Coupe_Auto_4_Seats_2_Doors.jpg',               description: 'The BMW M8 Competition is the pinnacle of M performance — a 617 hp V8 biturbo beast wrapped in grand touring luxury. Blazingly fast and surprisingly comfortable.' },
    { vehicle_id: 'VEL-BM-002', brand: 'BMW', model: 'X6 M',                   year: 2024, transmission: 'Auto', seats: 5, doors: 5, daily_price: 85000,  status: 'Available', image: '../Searchpage/All_brands/BMW-X6-M_Auto_5_Seats_5_Doors.jpg',                   description: 'The X6 M combines the practicality of an SUV with the athleticism of an M car. 600 hp, all-wheel drive, and a coupe-like roofline make this an icon of modern performance.' },
    { vehicle_id: 'VEL-BM-003', brand: 'BMW', model: 'i8 Roadster',             year: 2023, transmission: 'Auto', seats: 2, doors: 2, daily_price: 72000,  status: 'Available', image: '../Searchpage/All_brands/BMW-i8-Roadster_Auto_2_Seats_2_Doors.jpg',             description: 'The BMW i8 Roadster is a plug-in hybrid sports car that turns heads everywhere. Scissor doors, carbon fiber construction, and a futuristic design make it unlike anything else on the road.' },
    { vehicle_id: 'VEL-FR-001', brand: 'Ferrari', model: '812 Superfast',       year: 2024, transmission: 'Auto', seats: 2, doors: 2, daily_price: 150000, status: 'Available', image: '../Searchpage/All_brands/Ferrari-812-Superfast_Auto_2_Seats_2_Doors.jpg',       description: 'The 812 Superfast is the most powerful naturally aspirated road car Ferrari has ever built — 789 hp from a front-mounted V12 that screams to 8,900 rpm. An automotive masterpiece.' },
    { vehicle_id: 'VEL-FR-002', brand: 'Ferrari', model: 'F8 Tributo',          year: 2023, transmission: 'Auto', seats: 2, doors: 2, daily_price: 130000, status: 'Available', image: '../Searchpage/All_brands/Ferrari-F8-Tributo_Auto_2_Seats_2_Doors.jpg',          description: 'The F8 Tributo pays homage to the most powerful V8 in Ferrari history. 710 hp, 0-100 km/h in 2.9 seconds, and an exhaust sound that defines Italian engineering.' },
    { vehicle_id: 'VEL-FR-003', brand: 'Ferrari', model: 'Purosangue',          year: 2025, transmission: 'Auto', seats: 4, doors: 5, daily_price: 180000, status: 'Available', image: '../Searchpage/All_brands/Ferrari-Purosangue_Auto_4_Seats_5_Doors.jpg',          description: 'The Purosangue is Ferrari\'s first four-door, four-seat car — and it is unmistakably a Ferrari. A 715 hp naturally aspirated V12 delivers pure prancing horse thrills for four passengers.' },
    { vehicle_id: 'VEL-LB-001', brand: 'Lamborghini', model: 'Huracan EVO-X',  year: 2025, transmission: 'Auto', seats: 2, doors: 2, daily_price: 120000, status: 'Available', image: '../Searchpage/All_brands/Lamborghini-Huracan_Auto_2_Seats_2_Doors.jpg',          description: 'Pure V10 emotion. Precision In Every Detail. The Huracan EVO-X represents the ultimate expression of Lamborghini performance and design. Powered by a naturally aspirated V10 and enhanced with next-generation dynamics control, it delivers breathtaking acceleration, razor-sharp handling, and an unmistakable presence.' },
    { vehicle_id: 'VEL-LB-002', brand: 'Lamborghini', model: 'Aventador SVJ',  year: 2025, transmission: 'Auto', seats: 2, doors: 2, daily_price: 160000, status: 'Available', image: '../Searchpage/All_brands/Lamborghini-Revuelto_Auto_2_Seats_2_Doors.jpg',        description: 'The Aventador SVJ holds the Nürburgring production car lap record. 770 hp from a naturally aspirated V12, active aerodynamics, and a visceral driving experience that cannot be replicated.' },
    { vehicle_id: 'VEL-LB-003', brand: 'Lamborghini', model: 'Urus Performante',year: 2025, transmission: 'Auto', seats: 5, doors: 5, daily_price: 100000, status: 'Available', image: '../Searchpage/All_brands/Lamborghini-Urus_Auto_5_Seats_5_Doors.jpg',            description: 'The Urus Performante is the world\'s fastest SUV. A 666 hp twin-turbo V8 and race-derived chassis deliver supercar performance in a family-practical package.' },
    { vehicle_id: 'VEL-MS-001', brand: 'Maserati', model: 'GranTurismo',        year: 2024, transmission: 'Auto', seats: 4, doors: 2, daily_price: 95000,  status: 'Available', image: '../Searchpage/All_brands/Maserati-GranTurismo_Auto_4_Seats_2_Doors.jpg',        description: 'The GranTurismo is Maserati\'s most iconic model — a long-bonnet grand tourer with a handcrafted V6 Nettuno engine and a cabin that blends Italian artistry with modern technology.' },
    { vehicle_id: 'VEL-MS-002', brand: 'Maserati', model: 'MC20',               year: 2024, transmission: 'Auto', seats: 2, doors: 2, daily_price: 110000, status: 'Available', image: '../Searchpage/All_brands/Maserati-MC20_Auto_2_Seats_2_Doors.jpg',               description: 'The MC20 marks Maserati\'s return to the supercar segment. A 630 hp twin-turbo V6 Nettuno engine in a butterfly-door carbon fiber body — pure Italian passion on wheels.' },
    { vehicle_id: 'VEL-MS-003', brand: 'Maserati', model: 'Quattroporte',       year: 2023, transmission: 'Auto', seats: 5, doors: 4, daily_price: 78000,  status: 'Available', image: '../Searchpage/All_brands/Maserati-Quattroporte_Auto_5_Seats_4_Doors.jpg',       description: 'The Quattroporte is the world\'s fastest luxury saloon. A twin-turbo V8 and hand-stitched Italian leather interior create an experience that is simultaneously thrilling and deeply refined.' },
    { vehicle_id: 'VEL-MB-001', brand: 'Mercedes-Benz', model: 'AMG GT Black Series', year: 2024, transmission: 'Auto', seats: 2, doors: 2, daily_price: 145000, status: 'Available', image: '../Searchpage/All_brands/Mercedes-Benz-AMG-GT-Black-Series_Auto_2_Seats_2_Doors.jpg', description: 'The AMG GT Black Series is the most powerful AMG V8 ever built — 730 hp in a rear-wheel drive track monster with a dual-clutch transmission and aerodynamics inspired by racing.' },
    { vehicle_id: 'VEL-MB-002', brand: 'Mercedes-Benz', model: 'CLE 63 AMG',   year: 2025, transmission: 'Auto', seats: 4, doors: 2, daily_price: 115000, status: 'Available', image: '../Searchpage/All_brands/Mercedes-Benz-CLE-63-AMG_Auto_4_Seats_2_Doors.jpg',    description: 'The CLE 63 AMG is a high-performance coupé with a plug-in hybrid drivetrain producing 671 hp combined. Elegant, fast, and surprisingly efficient.' },
    { vehicle_id: 'VEL-MB-003', brand: 'Mercedes-Benz', model: 'G 63 AMG',     year: 2025, transmission: 'Auto', seats: 5, doors: 5, daily_price: 125000, status: 'Available', image: '../Searchpage/All_brands/Mercedes-Benz-G-63-AMG_Auto_5_Seats_5_Doors.jpg',      description: 'The G 63 AMG is an icon reinvented. The legendary G-Wagen body houses a 577 hp biturbo V8 and the latest AMG performance technology — unstoppable on and off the road.' },
    { vehicle_id: 'VEL-PC-001', brand: 'Porsche', model: '911 GT3 RS',          year: 2025, transmission: 'Auto', seats: 2, doors: 2, daily_price: 135000, status: 'Available', image: '../Searchpage/All_brands/Porsche-911-GT3-RS_Auto_2_Seats_2_Doors.jpg',          description: 'The 911 GT3 RS is the most extreme naturally aspirated 911 ever made. 518 hp, massive aerodynamic downforce, and a naturally aspirated flat-six that revs to 9,000 rpm.' },
    { vehicle_id: 'VEL-PC-002', brand: 'Porsche', model: '918 Spyder',          year: 2024, transmission: 'Auto', seats: 2, doors: 2, daily_price: 120000, status: 'Available', image: '../Searchpage/All_brands/Porsche-918-Spyder_Auto_2_Seats_2_Doors.jpg',          description: 'The 918 Spyder is a plug-in hybrid hypercar that redefined what\'s possible. 887 hp combined, 0-100 in 2.5 seconds, and a Nürburgring lap time under 7 minutes.' },
    { vehicle_id: 'VEL-PC-003', brand: 'Porsche', model: 'Macan',               year: 2025, transmission: 'Auto', seats: 5, doors: 5, daily_price: 65000,  status: 'Available', image: '../Searchpage/All_brands/Porsche-Macan_Auto_5_Seats_5_Doors.jpg',               description: 'The Macan is the sports car of compact SUVs. Precise steering, a low center of gravity, and Porsche DNA in every corner make this the most fun-to-drive SUV in its class.' },
    { vehicle_id: 'VEL-TS-001', brand: 'Tesla', model: 'Model 3',               year: 2025, transmission: 'Auto', seats: 5, doors: 4, daily_price: 45000,  status: 'Available', image: '../Searchpage/All_brands/Tesla-Model-3_Auto_5_Seats_4_Doors.jpg',               description: 'The Model 3 is Tesla\'s most popular electric sedan — combining a 358-mile range with quick acceleration and the world\'s most advanced autopilot system in a minimalist interior.' },
    { vehicle_id: 'VEL-TS-002', brand: 'Tesla', model: 'Model Y',               year: 2025, transmission: 'Auto', seats: 5, doors: 5, daily_price: 48000,  status: 'Available', image: '../Searchpage/All_brands/Tesla-Model-Y_Auto_5_Seats_5_Doors.jpg',               description: 'The best-selling electric vehicle in the world. The Model Y offers practicality, range, and Tesla\'s signature performance in a versatile crossover body.' },
    { vehicle_id: 'VEL-TS-003', brand: 'Tesla', model: 'Roadster',              year: 2025, transmission: 'Auto', seats: 4, doors: 2, daily_price: 80000,  status: 'Available', image: '../Searchpage/All_brands/Tesla-Roadster_Auto_4_Seats_2_Doors.jpg',               description: 'The fastest production car ever made. The Tesla Roadster does 0-100 in under 2 seconds with a 620-mile range — shattering every performance benchmark with zero emissions.' },
];

// ===================================================
//  NORMALIZE  (maps DB field names → UI field names)
// ===================================================
function normalize(car) {
    return {
        ...car,
        brand:       car.car_brands  || car.brand       || '',
        model:       car.car_model   || car.model       || '',
        description: car.details     || car.description || '',
        image:       car.image_url   || car.image       || '',
    };
}

// ===================================================
//  FETCH SINGLE CAR BY ID
// ===================================================
async function fetchCarById(id) {
    try {
        const res = await fetch(`${API_BASE}/api/vehicles/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('API error');
        return normalize(await res.json());
    } catch {
        // Fallback: match by string ID (mock) or numeric ID (DB)
        const mock = ALL_MOCK_CARS.find(c => String(c.vehicle_id) === String(id));
        return mock ? normalize(mock) : null;
    }
}

// ===================================================
//  FETCH "YOU MAY ALSO LIKE" CARS
//  — same brand, excluding current car (max 3)
// ===================================================
async function fetchAlsoLike(brand, excludeId) {
    try {
        const res = await fetch(`${API_BASE}/api/vehicles?brand=${encodeURIComponent(brand)}`);
        if (!res.ok) throw new Error('API error');
        const all = (await res.json()).map(normalize);
        return all.filter(c => String(c.vehicle_id) !== String(excludeId)).slice(0, 3);
    } catch {
        return ALL_MOCK_CARS
            .filter(c => c.brand === brand && String(c.vehicle_id) !== String(excludeId))
            .map(normalize)
            .slice(0, 3);
    }
}

// ===================================================
//  RENDER MAIN DETAIL
// ===================================================
function renderDetail(car) {
    document.title = `Velocità - ${car.year} ${car.brand} ${car.model}`;

    const imgEl = document.getElementById('detail-img');
    imgEl.style.display = 'block';
    imgEl.src = car.image || '';
    document.getElementById('detail-img-label').textContent = `${car.year} ${car.brand} ${car.model.split(' ')[0]}`;
    document.getElementById('detail-price').textContent    = car.daily_price.toLocaleString();

    const tagline = `Experience the exceptional with the ${car.year} ${car.brand} ${car.model} S.`;
    document.getElementById('detail-tagline').textContent = tagline;
    document.getElementById('detail-desc-text').textContent = car.description || '';

    // Spec badges
    const badgesEl = document.getElementById('spec-badges');
    badgesEl.innerHTML = `
        <span class="spec-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            ${car.seats} Passengers
        </span>
        <span class="spec-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
            </svg>
            ${car.transmission}
        </span>
        <span class="spec-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            ${car.doors} Doors
        </span>
    `;
}

// ===================================================
//  RENDER "YOU MAY ALSO LIKE"
// ===================================================
function renderAlsoLike(cars) {
    const grid = document.getElementById('also-like-grid');
    grid.innerHTML = '';

    cars.forEach(car => {
        const card = document.createElement('div');
        card.className = 'also-card';
        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${encodeURIComponent(car.vehicle_id)}`;
        });

        card.innerHTML = `
            <img class="also-card-img" src="${car.image || ''}" alt="${car.brand} ${car.model}"
                onerror="this.src=''; this.style.background='#1e1e1e';">
            <div class="also-card-body">
                <p class="also-card-name">${car.year} ${car.brand} ${car.model}</p>
                <div class="also-card-badges">
                    <span class="badge-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${car.seats}
                    </span>
                    <span class="badge-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                            <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
                        </svg>
                        ${car.transmission}
                    </span>
                </div>
                <div class="also-card-price">
                    <span class="also-price-amount">${car.daily_price.toLocaleString()}</span>
                    <span class="also-price-unit">/ day</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ===================================================
//  INIT
// ===================================================
(async () => {
    if (!vehicleId) {
        document.getElementById('detail-section').innerHTML =
            '<p style="color:#aaa;padding:3rem;text-align:center;font-family:Inter,sans-serif;">No vehicle selected.</p>';
        return;
    }

    const car = await fetchCarById(vehicleId);
    if (!car) {
        document.getElementById('detail-section').innerHTML =
            '<p style="color:#aaa;padding:3rem;text-align:center;font-family:Inter,sans-serif;">Vehicle not found.</p>';
        return;
    }

    renderDetail(car);

    const alsoLike = await fetchAlsoLike(car.brand || car.car_brands, car.vehicle_id);
    renderAlsoLike(alsoLike);
})();
