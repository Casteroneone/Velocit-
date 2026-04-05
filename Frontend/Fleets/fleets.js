// ===================================================
//  Velocità — Fleets Management Page
//  DB columns: vehicle_id (int), car_brands, car_model, year,
//              daily_price, license_plate, status, transmission,
//              seats, doors, details, image_url (joined)
// ===================================================

const API_BASE = 'http://localhost:5000';

// ===================================================
//  STATE
// ===================================================
let vehicles       = [];
let filteredVehicles = [];
let selectedIds    = new Set();   // stores vehicle_id numbers
let deleteTargetId = null;        // single-row delete
let editingId      = null;        // null = add mode, number = edit mode

// ===================================================
//  LOAD DATA FROM API
// ===================================================
async function loadVehicles() {
    try {
        const res = await fetch(`${API_BASE}/api/vehicles`);
        if (!res.ok) throw new Error();
        vehicles = await res.json();
    } catch {
        // API unavailable — use empty list (no mock needed now DB is real)
        vehicles = [];
    }
    applyFilters();
}

// ===================================================
//  FILTERS
// ===================================================
function applyFilters() {
    const brand  = document.getElementById('filter-brand').value;
    const status = document.getElementById('filter-status').value;
    const plate  = document.getElementById('filter-plate').value.trim().toLowerCase();

    filteredVehicles = vehicles.filter(v => {
        const matchBrand  = !brand  || v.car_brands === brand;
        const matchStatus = !status || v.status === status;
        const matchPlate  = !plate  || v.license_plate.toLowerCase().includes(plate);
        return matchBrand && matchStatus && matchPlate;
    });

    renderTable();
}

document.getElementById('filter-brand').addEventListener('change',  applyFilters);
document.getElementById('filter-status').addEventListener('change', applyFilters);
document.getElementById('filter-plate').addEventListener('input',   applyFilters);

// ===================================================
//  RENDER TABLE
// ===================================================
function renderTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    filteredVehicles.forEach(v => {
        const id = v.vehicle_id;
        const tr = document.createElement('tr');
        tr.dataset.id = id;

        const statusClass = {
            'Available':   'status-available',
            'Rented':      'status-reserved',
            'Maintenance': 'status-repair',
        }[v.status] || 'status-available';

        tr.innerHTML = `
            <td class="col-check">
                <input type="checkbox" class="row-check" data-id="${id}" ${selectedIds.has(id) ? 'checked' : ''}>
            </td>
            <td>${id}</td>
            <td>${v.car_brands}</td>
            <td>${v.car_model}</td>
            <td>${v.year}</td>
            <td>${Number(v.daily_price).toLocaleString()}</td>
            <td>${v.license_plate}</td>
            <td><span class="status-badge ${statusClass}">${v.status}</span></td>
            <td>
                <div class="action-icons">
                    <button class="icon-btn edit-btn" data-id="${id}" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="icon-btn del-btn" data-id="${id}" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Checkbox listeners
    tbody.querySelectorAll('.row-check').forEach(cb => {
        const id = parseInt(cb.dataset.id);
        if (selectedIds.has(id)) cb.closest('tr').classList.add('row-selected');

        cb.addEventListener('change', () => {
            if (cb.checked) {
                selectedIds.add(id);
                cb.closest('tr').classList.add('row-selected');
            } else {
                selectedIds.delete(id);
                cb.closest('tr').classList.remove('row-selected');
            }
            updateDeleteBtn();
            syncCheckAll();
        });
    });

    // Edit / delete row buttons
    tbody.querySelectorAll('.edit-btn').forEach(btn =>
        btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)))
    );
    tbody.querySelectorAll('.del-btn').forEach(btn =>
        btn.addEventListener('click', () => openDeleteModal(parseInt(btn.dataset.id)))
    );

    document.getElementById('table-count').textContent =
        `Showing ${filteredVehicles.length} of ${vehicles.length}`;
}

// ===================================================
//  SELECT ALL
// ===================================================
document.getElementById('check-all').addEventListener('change', function () {
    const checked = this.checked;
    filteredVehicles.forEach(v => {
        if (checked) selectedIds.add(v.vehicle_id);
        else         selectedIds.delete(v.vehicle_id);
    });
    document.querySelectorAll('.row-check').forEach(cb => {
        cb.checked = checked;
        cb.closest('tr').classList.toggle('row-selected', checked);
    });
    updateDeleteBtn();
});

function syncCheckAll() {
    const allChecked = filteredVehicles.length > 0 &&
                       filteredVehicles.every(v => selectedIds.has(v.vehicle_id));
    document.getElementById('check-all').checked = allChecked;
}

function updateDeleteBtn() {
    document.getElementById('btn-delete-selected').disabled = selectedIds.size === 0;
}

// ===================================================
//  DELETE MODAL
// ===================================================
function openDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('modal-delete').style.display = 'flex';
}

function closeDeleteModal() {
    deleteTargetId = null;
    document.getElementById('modal-delete').style.display = 'none';
}

document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);

document.getElementById('confirm-delete').addEventListener('click', async () => {
    const idsToDelete = deleteTargetId !== null ? [deleteTargetId] : [...selectedIds];

    await Promise.all(idsToDelete.map(id =>
        fetch(`${API_BASE}/api/vehicles/${id}`, { method: 'DELETE' }).catch(() => {})
    ));

    vehicles = vehicles.filter(v => !idsToDelete.includes(v.vehicle_id));
    idsToDelete.forEach(id => selectedIds.delete(id));
    deleteTargetId = null;
    document.getElementById('btn-delete-selected').disabled = true;
    document.getElementById('check-all').checked = false;
    closeDeleteModal();
    applyFilters();
});

// Bulk delete
document.getElementById('btn-delete-selected').addEventListener('click', () => {
    if (selectedIds.size === 0) return;
    deleteTargetId = null;
    document.getElementById('modal-delete').style.display = 'flex';
});

// ===================================================
//  ADD / EDIT MODAL
// ===================================================
function openAddModal() {
    editingId = null;
    document.getElementById('form-title').textContent = 'Add Vehicle';
    document.getElementById('form-save').textContent  = 'Save Changes';
    resetForm();
    document.getElementById('modal-form').style.display = 'flex';
}

function openEditModal(id) {
    editingId = id;
    const v = vehicles.find(x => x.vehicle_id === id);
    if (!v) return;

    document.getElementById('form-title').textContent = 'Edit Vehicle';
    document.getElementById('form-save').textContent  = 'Save Changes';

    document.getElementById('f-brand').value   = v.car_brands;
    document.getElementById('f-model').value   = v.car_model;
    document.getElementById('f-title').value   = '';
    document.getElementById('f-year').value    = v.year;
    document.getElementById('f-price').value   = v.daily_price;
    document.getElementById('f-plate').value   = v.license_plate;
    document.getElementById('f-details').value = v.details || '';

    setToggle('f-transmission', v.transmission);
    setToggle('f-seats',        String(v.seats));
    setToggle('f-doors',        String(v.doors));

    const statusRadio = document.querySelector(`input[name="f-status"][value="${v.status}"]`);
    if (statusRadio) statusRadio.checked = true;

    const preview = document.getElementById('form-img-preview');
    const placeholder = document.getElementById('img-placeholder');
    if (v.image_url) {
        preview.src = v.image_url;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        preview.style.display = 'none';
        placeholder.style.display = 'flex';
    }

    document.getElementById('modal-form').style.display = 'flex';
}

function closeFormModal() {
    editingId = null;
    document.getElementById('modal-form').style.display = 'none';
}

function resetForm() {
    ['f-brand','f-model','f-title','f-year','f-price','f-plate','f-details'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('input[name="f-status"]').forEach(r => (r.checked = false));
    document.getElementById('form-img-preview').style.display = 'none';
    document.getElementById('img-placeholder').style.display  = 'flex';
    document.getElementById('form-img-preview').src = '';
}

function setToggle(groupId, value) {
    document.getElementById(groupId).querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.val === value);
    });
}

// Toggle button group
document.querySelectorAll('.toggle-group').forEach(group => {
    group.addEventListener('click', e => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Image upload preview
document.getElementById('img-file-input').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('form-img-preview').src = e.target.result;
        document.getElementById('form-img-preview').style.display = 'block';
        document.getElementById('img-placeholder').style.display  = 'none';
    };
    reader.readAsDataURL(file);
});

// Save (Add / Edit)
document.getElementById('form-save').addEventListener('click', async () => {
    const car_brands   = document.getElementById('f-brand').value;
    const car_model    = document.getElementById('f-model').value.trim();
    const year         = parseInt(document.getElementById('f-year').value);
    const daily_price  = parseInt(document.getElementById('f-price').value);
    const license_plate = document.getElementById('f-plate').value.trim();
    const details      = document.getElementById('f-details').value.trim();
    const transmission = document.querySelector('#f-transmission .toggle-btn.active')?.dataset.val || '';
    const seats        = parseInt(document.querySelector('#f-seats .toggle-btn.active')?.dataset.val || '0');
    const doors        = parseInt(document.querySelector('#f-doors .toggle-btn.active')?.dataset.val || '0');
    const status       = document.querySelector('input[name="f-status"]:checked')?.value || '';

    if (!car_brands || !car_model || !year || !daily_price || !license_plate || !transmission || !seats || !doors || !status) {
        alert('Please fill all required fields.');
        return;
    }

    const payload = { car_brands, car_model, year, daily_price, license_plate, details, transmission, seats, doors, status };

    if (editingId !== null) {
        // EDIT
        try {
            const res = await fetch(`${API_BASE}/api/vehicles/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error();
            const updated = await res.json();
            const idx = vehicles.findIndex(v => v.vehicle_id === editingId);
            if (idx !== -1) vehicles[idx] = updated;
        } catch {
            const idx = vehicles.findIndex(v => v.vehicle_id === editingId);
            if (idx !== -1) vehicles[idx] = { ...vehicles[idx], ...payload };
        }
    } else {
        // ADD
        try {
            const res = await fetch(`${API_BASE}/api/vehicles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error();
            const created = await res.json();
            vehicles.push(created);
        } catch {
            vehicles.push({ vehicle_id: Date.now(), ...payload, image_url: null });
        }
    }

    closeFormModal();
    applyFilters();
});

document.getElementById('form-cancel').addEventListener('click', closeFormModal);
document.getElementById('btn-add').addEventListener('click', openAddModal);

// Close on backdrop click
document.getElementById('modal-delete').addEventListener('click', e => { if (e.target === e.currentTarget) closeDeleteModal(); });
document.getElementById('modal-form').addEventListener('click',   e => { if (e.target === e.currentTarget) closeFormModal(); });

// ===================================================
//  INIT
// ===================================================
loadVehicles();
