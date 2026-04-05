// ===================================================
//  Velocità — Car Fleets Brand Page
// ===================================================

// ---- CONFIG: set your API base URL here ----
const API_BASE = 'http://localhost:5000';   // change to your backend URL

// Get brand from URL param e.g. brand.html?brand=Aston+Martin
const params    = new URLSearchParams(window.location.search);
const brandName = params.get('brand') || 'Aston Martin';

// Update page title
document.title          = `Velocità - ${brandName}`;
document.getElementById('brand-title').textContent = brandName;

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
//  FETCH CARS
// ===================================================
async function fetchCarsByBrand(brand) {
    try {
        const res = await fetch(`${API_BASE}/api/vehicles?brand=${encodeURIComponent(brand)}`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        return data.map(normalize);
    } catch (err) {
        console.warn('API unavailable, using mock data:', err.message);
        return getMockCars(brand);        // fallback (mock already has correct field names)
    }
}

// ===================================================
//  MOCK DATA  (wait for removal once backend is ready)
// ===================================================
function getMockCars(brand) {
    const allMock = {
        'Aston Martin': [
            { vehicle_id: 'VEL-AM-001', brand: 'Aston Martin', model: 'Vintage DB12',   year: 2026, transmission: 'Auto', seats: 2, doors: 2, daily_price: 89000, status: 'Available', image: '../Searchpage/All_brands/Aston-Martin-DB11_Auto_2_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-AM-002', brand: 'Aston Martin', model: 'DB11 Navy',      year: 2018, transmission: 'Auto', seats: 4, doors: 2, daily_price: 75000, status: 'Available', image: '../Searchpage/All_brands/Aston-Martin-DBX_Auto_5_Seats_5_Doors.jpg' },
            { vehicle_id: 'VEL-AM-003', brand: 'Aston Martin', model: 'V12 Vanquish',   year: 2025, transmission: 'Auto', seats: 2, doors: 2, daily_price: 95000, status: 'Available', image: '../Searchpage/All_brands/Aston-Martin-Victor_Manual_2_Seats_2_Doors.jpg' },
        ],
        'BMW': [
            { vehicle_id: 'VEL-BM-001', brand: 'BMW', model: 'M8 Competition', year: 2025, transmission: 'Auto', seats: 4, doors: 2, daily_price: 98000, status: 'Available', image: '../Searchpage/All_brands/BMW-M8-Coupe_Auto_4_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-BM-002', brand: 'BMW', model: 'X6 M',           year: 2024, transmission: 'Auto', seats: 5, doors: 5, daily_price: 85000, status: 'Available', image: '../Searchpage/All_brands/BMW-X6-M_Auto_5_Seats_5_Doors.jpg' },
            { vehicle_id: 'VEL-BM-003', brand: 'BMW', model: 'i8 Roadster',    year: 2023, transmission: 'Auto', seats: 2, doors: 2, daily_price: 72000, status: 'Available', image: '../Searchpage/All_brands/BMW-i8-Roadster_Auto_2_Seats_2_Doors.jpg' },
        ],
        'Ferrari': [
            { vehicle_id: 'VEL-FR-001', brand: 'Ferrari', model: '812 Superfast', year: 2024, transmission: 'Auto', seats: 2, doors: 2, daily_price: 150000, status: 'Available', image: '../Searchpage/All_brands/Ferrari-812-Superfast_Auto_2_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-FR-002', brand: 'Ferrari', model: 'F8 Tributo',    year: 2023, transmission: 'Auto', seats: 2, doors: 2, daily_price: 130000, status: 'Available', image: '../Searchpage/All_brands/Ferrari-F8-Tributo_Auto_2_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-FR-003', brand: 'Ferrari', model: 'Purosangue',    year: 2025, transmission: 'Auto', seats: 4, doors: 5, daily_price: 180000, status: 'Available', image: '../Searchpage/All_brands/Ferrari-Purosangue_Auto_4_Seats_5_Doors.jpg' },
        ],
        'Lamborghini': [
            { vehicle_id: 'VEL-LB-001', brand: 'Lamborghini', model: 'Huracan EVO-X',    year: 2025, transmission: 'Auto', seats: 2, doors: 2, daily_price: 120000, status: 'Available', image: '../Searchpage/All_brands/Lamborghini-Huracan_Auto_2_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-LB-002', brand: 'Lamborghini', model: 'Aventador SVJ',    year: 2025, transmission: 'Auto', seats: 2, doors: 2, daily_price: 160000, status: 'Available', image: '../Searchpage/All_brands/Lamborghini-Revuelto_Auto_2_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-LB-003', brand: 'Lamborghini', model: 'Urus Performante', year: 2025, transmission: 'Auto', seats: 5, doors: 5, daily_price: 100000, status: 'Available', image: '../Searchpage/All_brands/Lamborghini-Urus_Auto_5_Seats_5_Doors.jpg' },
        ],
        'Maserati': [
            { vehicle_id: 'VEL-MS-001', brand: 'Maserati', model: 'GranTurismo',   year: 2024, transmission: 'Auto', seats: 4, doors: 2, daily_price: 95000, status: 'Available', image: '../Searchpage/All_brands/Maserati-GranTurismo_Auto_4_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-MS-002', brand: 'Maserati', model: 'MC20',          year: 2024, transmission: 'Auto', seats: 2, doors: 2, daily_price: 110000, status: 'Available', image: '../Searchpage/All_brands/Maserati-MC20_Auto_2_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-MS-003', brand: 'Maserati', model: 'Quattroporte',  year: 2023, transmission: 'Auto', seats: 5, doors: 4, daily_price: 78000,  status: 'Available', image: '../Searchpage/All_brands/Maserati-Quattroporte_Auto_5_Seats_4_Doors.jpg' },
        ],
        'Mercedes-Benz': [
            { vehicle_id: 'VEL-MB-001', brand: 'Mercedes-Benz', model: 'AMG GT Black Series', year: 2024, transmission: 'Auto', seats: 2, doors: 2, daily_price: 145000, status: 'Available', image: '../Searchpage/All_brands/Mercedes-Benz-AMG-GT-Black-Series_Auto_2_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-MB-002', brand: 'Mercedes-Benz', model: 'CLE 63 AMG',          year: 2025, transmission: 'Auto', seats: 4, doors: 2, daily_price: 115000, status: 'Available', image: '../Searchpage/All_brands/Mercedes-Benz-CLE-63-AMG_Auto_4_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-MB-003', brand: 'Mercedes-Benz', model: 'G 63 AMG',            year: 2025, transmission: 'Auto', seats: 5, doors: 5, daily_price: 125000, status: 'Available', image: '../Searchpage/All_brands/Mercedes-Benz-G-63-AMG_Auto_5_Seats_5_Doors.jpg' },
        ],
        'Porsche': [
            { vehicle_id: 'VEL-PC-001', brand: 'Porsche', model: '911 GT3 RS', year: 2025, transmission: 'Auto', seats: 2, doors: 2, daily_price: 135000, status: 'Available', image: '../Searchpage/All_brands/Porsche-911-GT3-RS_Auto_2_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-PC-002', brand: 'Porsche', model: '918 Spyder', year: 2024, transmission: 'Auto', seats: 2, doors: 2, daily_price: 120000, status: 'Available', image: '../Searchpage/All_brands/Porsche-918-Spyder_Auto_2_Seats_2_Doors.jpg' },
            { vehicle_id: 'VEL-PC-003', brand: 'Porsche', model: 'Macan',      year: 2025, transmission: 'Auto', seats: 5, doors: 5, daily_price: 65000,  status: 'Available', image: '../Searchpage/All_brands/Porsche-Macan_Auto_5_Seats_5_Doors.jpg' },
        ],
        'Tesla': [
            { vehicle_id: 'VEL-TS-001', brand: 'Tesla', model: 'Model 3',  year: 2025, transmission: 'Auto', seats: 5, doors: 4, daily_price: 45000, status: 'Available', image: '../Searchpage/All_brands/Tesla-Model-3_Auto_5_Seats_4_Doors.jpg' },
            { vehicle_id: 'VEL-TS-002', brand: 'Tesla', model: 'Model Y',  year: 2025, transmission: 'Auto', seats: 5, doors: 5, daily_price: 48000, status: 'Available', image: '../Searchpage/All_brands/Tesla-Model-Y_Auto_5_Seats_5_Doors.jpg' },
            { vehicle_id: 'VEL-TS-003', brand: 'Tesla', model: 'Roadster', year: 2025, transmission: 'Auto', seats: 4, doors: 2, daily_price: 80000, status: 'Available', image: '../Searchpage/All_brands/Tesla-Roadster_Auto_4_Seats_2_Doors.jpg' },
        ],
    };
    return allMock[brand] || [];
}

// ===================================================
//  RENDER CAR CARDS
// ===================================================
function renderCards(cars) {
    const grid   = document.getElementById('cars-grid');
    const noCars = document.getElementById('no-cars');

    grid.innerHTML = '';

    if (!cars || cars.length === 0) {
        noCars.style.display = 'block';
        return;
    }
    noCars.style.display = 'none';

    cars.forEach(car => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${encodeURIComponent(car.vehicle_id)}`;
        });

        card.innerHTML = `
            <img
                class="car-card-img"
                src="${car.image || ''}"
                alt="${car.brand} ${car.model}"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            >
            <div class="car-card-img-placeholder" style="display:none;">No image available</div>
            <div class="car-card-body">
                <p class="car-card-name">${car.year} ${car.brand} ${car.model}</p>
                <div class="car-card-badges">
                    <span class="badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${car.seats}
                    </span>
                    <span class="badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                            <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
                        </svg>
                        ${car.transmission}
                    </span>
                </div>
                <div class="car-card-price">
                    <span class="price-amount">${car.daily_price.toLocaleString()}</span>
                    <span class="price-unit">/ day</span>
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
    const cars = await fetchCarsByBrand(brandName);
    renderCards(cars);
})();
