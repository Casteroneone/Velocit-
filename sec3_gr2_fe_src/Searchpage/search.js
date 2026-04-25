// ===================================================
//  Velocità — Search Page
//  Pulls results from /api/cars/search
// ===================================================

const API_BASE = 'http://localhost:3030';

// ── State ─────────────────────────────────────────
let selectedTransmission = null;
let selectedSeats        = null;
let selectedDoors        = null;

// ── Toggle button groups ───────────────────────────
function initToggleGroup(groupId, onSelect) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const already = btn.classList.contains('active');
            group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            if (!already) {
                btn.classList.add('active');
                onSelect(btn.textContent.trim());
            } else {
                onSelect(null);
            }
        });
    });
}

initToggleGroup('transmission-group', val => { selectedTransmission = val; });
initToggleGroup('seats-group',        val => { selectedSeats        = val; });
initToggleGroup('doors-group',        val => { selectedDoors        = val; });

// ── Search button ──────────────────────────────────
document.getElementById('search-btn').addEventListener('click', runSearch);

// ── Clear button ───────────────────────────────────
document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('brand-select').selectedIndex = 0;
    document.getElementById('model-input').value = '';
    selectedTransmission = null;
    selectedSeats        = null;
    selectedDoors        = null;

    document.querySelectorAll('#transmission-group button, #seats-group button, #doors-group button')
        .forEach(b => b.classList.remove('active'));

    document.getElementById('filter-warning').style.display  = 'none';
    document.getElementById('results-section').style.display = 'none';
});

// ── Status helper ──────────────────────────────────
function getStatusStyle(status) {
    switch (status) {
        case 'Available':   return { cls: 'status-available', label: 'Available'   };
        case 'Rented':      return { cls: 'status-reserved',  label: 'Rented'      };
        case 'Maintenance': return { cls: 'status-repair',    label: 'Maintenance' };
        default:            return { cls: 'status-available', label: status        };
    }
}

// ── Run search ─────────────────────────────────────
async function runSearch() {
    const brand        = document.getElementById('brand-select').value;
    const model        = document.getElementById('model-input').value.trim();
    const transmission = selectedTransmission;
    const seats        = selectedSeats;
    const doors        = selectedDoors;

    // Require at least one filter
    const hasFilter = (brand && brand !== '') || model || transmission || seats || doors;
    if (!hasFilter) {
        document.getElementById('filter-warning').style.display = 'block';
        return;
    }
    document.getElementById('filter-warning').style.display = 'none';

    // Build query string
    const params = new URLSearchParams();
    if (brand)        params.append('brand',        brand);
    if (model)        params.append('model',        model);
    if (transmission) params.append('transmission', transmission);
    if (seats)        params.append('seats',        seats);
    if (doors)        params.append('doors',        doors);

    // UI setup
    const resultsSection = document.getElementById('results-section');
    const grid           = document.querySelector('.results-grid');
    const noResult       = document.getElementById('no-result');
    const countEl        = document.querySelector('.result-count');

    resultsSection.style.display = 'block';
    grid.innerHTML = '<p style="color:#ccc; padding:20px;">Searching...</p>';
    noResult.style.display = 'none';

    try {
        const res  = await fetch(`${API_BASE}/api/cars/search?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const cars = await res.json();

        grid.innerHTML = '';

        if (cars.length === 0) {
            noResult.style.display = 'block';
            countEl.textContent    = '0 cars found';
            return;
        }

        countEl.textContent = `${cars.length} car${cars.length !== 1 ? 's' : ''} found`;

        cars.forEach(car => {
            const card = document.createElement('article');
            card.className = 'result-card card-visible';

            // ── Make card clickable → go to detail page ──
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
            window.location.href = `../CarFleets/detail.html?id=${car.vehicle_id}`;
            });

            const imgSrc         = car.image_url || 'https://placehold.co/400x220/1a1a1a/888?text=No+Image';
            const { cls, label } = getStatusStyle(car.status);

            card.innerHTML = `
                <div style="position: relative;">
                    <img class="car-card-img"
                         src="${imgSrc}"
                         alt="${car.car_brands} ${car.car_model}"
                         onerror="this.src='https://placehold.co/400x220/1a1a1a/888?text=No+Image'">
                    <span class="status-badge ${cls}">${label}</span>
                </div>
                <div class="car-card-body">
                    <p class="car-card-name">${car.car_brands} ${car.car_model}</p>
                    <div class="car-card-badges">
                        <span class="badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            ${car.seats}
                        </span>
                        <span class="badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                                <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
                            </svg>
                            ${car.transmission}
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

    } catch (err) {
        console.error('Search error:', err);
        grid.innerHTML = '<p style="color:#e74c3c; padding:20px;">Failed to search. Make sure the server is running.</p>';
    }
}