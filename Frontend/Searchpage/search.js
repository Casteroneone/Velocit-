// ===================================================
//  Velocità — Search Page Filter Logic
// ===================================================

// ---------- Toggle active state for filter buttons ----------
document.querySelectorAll('.filter-input button').forEach(btn => {
    btn.addEventListener('click', () => {
        const group = btn.closest('.filter-input');
        const isActive = btn.classList.contains('active');
        group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        if (!isActive) btn.classList.add('active');
    });
});

// ---------- Helper: check if any filter is selected ----------
function hasAnyFilter() {
    const brand        = document.querySelector('#brand-select').value;
    const model        = document.querySelector('#model-input').value.trim();
    const transActive  = document.querySelector('#transmission-group .active');
    const seatsActive  = document.querySelector('#seats-group .active');
    const doorsActive  = document.querySelector('#doors-group .active');

    return brand !== '' || model !== '' || transActive || seatsActive || doorsActive;
}

// ---------- Search button ----------
document.querySelector('.search-action-btn').addEventListener('click', () => {
    const warning = document.querySelector('#filter-warning');

    if (!hasAnyFilter()) {
        // Show warning, keep results hidden
        warning.style.display = 'flex';
        return;
    }

    // Hide warning, show results
    warning.style.display = 'none';
    document.querySelector('#results-section').style.display = 'block';

    filterCars();

    // Smooth scroll to results
    document.querySelector('#results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ---------- Clear button ----------
document.querySelector('.clear-btn').addEventListener('click', () => {
    // Reset all filters
    document.querySelectorAll('.filter-input button').forEach(b => b.classList.remove('active'));
    document.querySelector('#brand-select').selectedIndex = 0;   // back to blank
    document.querySelector('#model-input').value = '';

    // Hide results and warning
    document.querySelector('#results-section').style.display = 'none';
    document.querySelector('#filter-warning').style.display = 'none';
});

// ---------- Core filter function ----------
function filterCars() {
    const brand        = document.querySelector('#brand-select').value;
    const model        = document.querySelector('#model-input').value.trim().toLowerCase();
    const transBtn     = document.querySelector('#transmission-group .active');
    const seatsBtn     = document.querySelector('#seats-group .active');
    const doorsBtn     = document.querySelector('#doors-group .active');

    const transmission = transBtn ? transBtn.textContent.toLowerCase() : '';
    const seats        = seatsBtn ? seatsBtn.textContent : '';
    const doors        = doorsBtn ? doorsBtn.textContent : '';

    const cards = document.querySelectorAll('.result-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const matchBrand        = !brand || brand === 'all' || card.dataset.brand === brand;
        const matchModel        = !model || card.dataset.model.toLowerCase().includes(model);
        const matchTransmission = !transmission || card.dataset.transmission === transmission;
        const matchSeats        = !seats || card.dataset.seats === seats;
        const matchDoors        = !doors || card.dataset.doors === doors;

        if (matchBrand && matchModel && matchTransmission && matchSeats && matchDoors) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Update count label
    const label = document.querySelector('.result-count');
    label.textContent = `${visibleCount} car${visibleCount !== 1 ? 's' : ''} found`;

    // Show / hide no-result message
    document.querySelector('#no-result').style.display = visibleCount === 0 ? 'flex' : 'none';
}
