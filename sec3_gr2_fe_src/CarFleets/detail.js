// ===================================================
//  Velocità — Car Detail Page
// ===================================================

const API_BASE  = 'http://localhost:3030';
const params    = new URLSearchParams(window.location.search);
const vehicleId = params.get('id') || '';

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
    const res = await fetch(`${API_BASE}/api/cars/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Car not found: ${res.status}`);
    return normalize(await res.json());
}

// ===================================================
//  FETCH "YOU MAY ALSO LIKE"
//  — same brand, excluding current car (max 3)
// ===================================================
async function fetchAlsoLike(brand, excludeId) {
    const res = await fetch(`${API_BASE}/api/cars/search?brand=${encodeURIComponent(brand)}`);
    if (!res.ok) throw new Error('Could not load similar cars');
    const all = (await res.json()).map(normalize);
    return all
        .filter(c => String(c.vehicle_id) !== String(excludeId))
        .slice(0, 3);
}

// ===================================================
//  STATUS HELPER
// ===================================================
function getStatusStyle(status) {
    switch (status) {
        case 'Available':   return { cls: 'status-available', label: 'Available'   };
        case 'Rented':      return { cls: 'status-reserved',  label: 'Rented'      };
        case 'Maintenance': return { cls: 'status-repair',    label: 'Maintenance' };
        default:            return { cls: 'status-available', label: status        };
    }
}

// ===================================================
//  RENDER MAIN DETAIL
// ===================================================
function renderDetail(car) {
    document.title = `Velocità - ${car.year} ${car.brand} ${car.model}`;

    // Image
    const imgEl = document.getElementById('detail-img');
    if (car.image) {
        imgEl.src = car.image;
        imgEl.style.display = 'block';
    }
    document.getElementById('detail-img-label').textContent =
        `${car.year} ${car.brand} ${car.model.split(' ')[0]}`;

    // Price
    document.getElementById('detail-price').textContent =
        Number(car.daily_price).toLocaleString();

    // Tagline & description
    document.getElementById('detail-tagline').textContent =
        `Experience the exceptional with the ${car.year} ${car.brand} ${car.model}.`;
    document.getElementById('detail-desc-text').textContent =
        car.description || '';

    // Status badge
    const { cls, label } = getStatusStyle(car.status);
    const statusBadge = document.getElementById('detail-status');
    if (statusBadge) {
        statusBadge.textContent  = label;
        statusBadge.className    = `status-badge ${cls}`;
    }

    // Spec badges
    document.getElementById('spec-badges').innerHTML = `
        <span class="spec-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
            ${car.seats} Passengers
        </span>
        <span class="spec-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
            </svg>
            ${car.transmission}
        </span>
        <span class="spec-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 5v3h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            ${car.doors} Doors
        </span>
        <span class="spec-badge ${cls}" style="border-color: currentColor;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${label}
        </span>
    `;
}

// ===================================================
//  RENDER "YOU MAY ALSO LIKE"
// ===================================================
function renderAlsoLike(cars) {
    const grid = document.getElementById('also-like-grid');
    grid.innerHTML = '';

    if (cars.length === 0) {
        grid.innerHTML = '<p style="color:#888; font-family:Inter,sans-serif;">No similar cars found.</p>';
        return;
    }

    cars.forEach(car => {
        const { cls, label } = getStatusStyle(car.status);
        const card = document.createElement('article');
        card.className = 'also-card';
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = `detail.html?id=${encodeURIComponent(car.vehicle_id)}`;
        });

        card.innerHTML = `
            <div style="position: relative;">
                <img class="also-card-img"
                     src="${car.image || ''}"
                     alt="${car.brand} ${car.model}"
                     onerror="this.src=''; this.style.background='#1e1e1e';">
                <span class="status-badge ${cls}" style="
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    font-size: 10px;
                    padding: 2px 8px;
                    border-radius: 20px;
                    font-weight: 600;
                    pointer-events: none;
                ">${label}</span>
            </div>
            <div class="also-card-body">
                <p class="also-card-name">${car.year} ${car.brand} ${car.model}</p>
                <div class="also-card-badges">
                    <span class="badge-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${car.seats}
                    </span>
                    <span class="badge-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                            <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
                        </svg>
                        ${car.transmission}
                    </span>
                </div>
                <div class="also-card-price">
                    <span class="also-price-amount">${Number(car.daily_price).toLocaleString()}</span>
                    <span class="also-price-unit">/ day</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ===================================================
//  PUBLIC WEB SERVICE: Live Currency Rates
//  Source: Frankfurter API (https://api.frankfurter.app) — free, no API key
// ===================================================
async function fetchCurrencyRates(priceInTHB) {
    try {
        const res = await fetch('https://api.frankfurter.app/latest?from=THB&to=USD,EUR,GBP,JPY');
        if (!res.ok) return;
        const data = await res.json();

        const currencies = [
            { code: 'USD', symbol: '$' },
            { code: 'EUR', symbol: '€' },
            { code: 'GBP', symbol: '£' },
            { code: 'JPY', symbol: '¥' },
        ];

        const grid = document.getElementById('currency-grid');
        grid.innerHTML = currencies.map(c => {
            const rate      = data.rates[c.code];
            const converted = (priceInTHB * rate).toLocaleString(undefined, {
                maximumFractionDigits: c.code === 'JPY' ? 0 : 2,
            });
            return `<span style="
                background:rgba(255,255,255,0.07);
                border:1px solid rgba(255,255,255,0.12);
                border-radius:8px;
                padding:0.35rem 0.75rem;
                font-family:Inter,sans-serif;
                font-size:0.85rem;
                color:#e8d5b0;
            "><strong>${c.code}</strong> ${c.symbol}${converted}</span>`;
        }).join('');

        document.getElementById('currency-section').style.display = 'block';
    } catch (err) {
        console.error('Currency fetch failed:', err);
    }
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

    try {
        const car = await fetchCarById(vehicleId);
        renderDetail(car);

        // Fetch live exchange rates for the car's daily price (public web service)
        fetchCurrencyRates(Number(car.daily_price));

        try {
            const alsoLike = await fetchAlsoLike(car.brand, car.vehicle_id);
            renderAlsoLike(alsoLike);
        } catch {
            // "also like" failing shouldn't break the whole page
            document.getElementById('also-like-grid').innerHTML =
                '<p style="color:#888;">Could not load similar cars.</p>';
        }

    } catch (err) {
        console.error(err);
        document.getElementById('detail-section').innerHTML =
            '<p style="color:#aaa;padding:3rem;text-align:center;font-family:Inter,sans-serif;">Vehicle not found.</p>';
    }
})();