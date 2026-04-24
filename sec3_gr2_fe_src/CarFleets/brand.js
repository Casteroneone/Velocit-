// ===================================================
//  Velocità — Car Fleets Brand Page
// ===================================================

const API_BASE = 'http://localhost:3030';

// Get brand from URL param e.g. brand.html?brand=Aston+Martin
const params    = new URLSearchParams(window.location.search);
const brandName = params.get('brand') || 'Aston Martin';

// Update page title
document.title = `Velocità - ${brandName}`;
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
//  FETCH AVAILABLE CARS BY BRAND FROM DB
// ===================================================
async function fetchCarsByBrand(brand) {
    const res = await fetch(
        `${API_BASE}/api/cars/search?brand=${encodeURIComponent(brand)}&status=Available`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.map(normalize);
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
        const card = document.createElement('article');
        card.className = 'car-card';
        card.style.cursor = 'pointer';
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${car.seats} Seats
                    </span>
                    <span class="badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                            <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
                        </svg>
                        ${car.transmission}
                    </span>
                    <span class="badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2"/>
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                        </svg>
                        ${car.doors} Doors
                    </span>
                </div>
                <div class="car-card-price">
                    <span class="price-amount">${Number(car.daily_price).toLocaleString()}</span>
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
    const grid = document.getElementById('cars-grid');
    grid.innerHTML = '<p style="color:#ccc; font-family:Inter,sans-serif; padding:2rem;">Loading...</p>';

    try {
        const cars = await fetchCarsByBrand(brandName);
        renderCards(cars);
    } catch (err) {
        console.error('Failed to load cars:', err);
        grid.innerHTML = '<p style="color:#e74c3c; font-family:Inter,sans-serif; padding:2rem;">Failed to load cars. Make sure the server is running.</p>';
    }
})();