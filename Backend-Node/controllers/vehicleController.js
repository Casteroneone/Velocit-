// ===================================================
//  Velocità — Vehicles Controller
//  Table: car + image (JOIN เอา Google Drive link)
// ===================================================

const { pool } = require("../config/db");

// SQL: JOIN car + image
const BASE_SELECT = `
  SELECT c.vehicle_id, c.car_brands, c.car_model, c.year,
         c.daily_price, c.license_plate, c.status,
         c.transmission, c.seats, c.doors,
         i.description AS details,
         i.url AS image_url
  FROM car c
  LEFT JOIN image i ON c.vehicle_id = i.vehicle_id
`;

// ══════════════════════════════════════════════════════
//  GET /api/vehicles — Get all vehicles (with filters)
// ══════════════════════════════════════════════════════
//
// Testing 1: No criteria search (get all)
//   method: GET
//   URL: http://localhost:3000/api/vehicles
//   Expected: 200 OK — returns array of all vehicles
//
// Testing 2: Criteria search — filter by brand
//   method: GET
//   URL: http://localhost:3000/api/vehicles?brand=Porsche
//   Expected: 200 OK — returns only Porsche vehicles
//
// Testing 3: Criteria search — filter by brand + status + year
//   method: GET
//   URL: http://localhost:3000/api/vehicles?brand=Tesla&status=Available&year=2024
//   Expected: 200 OK — returns Tesla, Available, year 2024 only
//
// Testing 4: Criteria search — filter by price range
//   method: GET
//   URL: http://localhost:3000/api/vehicles?minPrice=80000&maxPrice=100000
//   Expected: 200 OK — returns vehicles with daily_price between 80000-100000
//
// Testing 5: Criteria search — filter by transmission
//   method: GET
//   URL: http://localhost:3000/api/vehicles?transmission=Auto&brand=BMW
//   Expected: 200 OK — returns BMW Auto vehicles
//
// Supported criteria (at least 3):
//   1. brand       — filter by car_brands
//   2. status      — filter by status (Available, Reserved, etc.)
//   3. year        — filter by year
//   4. transmission — filter by transmission (Auto, Manual)
//   5. minPrice    — minimum daily_price
//   6. maxPrice    — maximum daily_price
//
exports.getAll = async (req, res) => {
  try {
    let sql = BASE_SELECT + " WHERE 1=1";
    const params = [];

    // Criteria 1: brand
    if (req.query.brand) {
      sql += " AND c.car_brands = ?";
      params.push(req.query.brand);
    }

    // Criteria 2: status
    if (req.query.status) {
      sql += " AND c.status = ?";
      params.push(req.query.status);
    }

    // Criteria 3: year
    if (req.query.year) {
      sql += " AND c.year = ?";
      params.push(req.query.year);
    }

    // Criteria 4: transmission
    if (req.query.transmission) {
      sql += " AND c.transmission = ?";
      params.push(req.query.transmission);
    }

    // Criteria 5: minPrice
    if (req.query.minPrice) {
      sql += " AND c.daily_price >= ?";
      params.push(req.query.minPrice);
    }

    // Criteria 6: maxPrice
    if (req.query.maxPrice) {
      sql += " AND c.daily_price <= ?";
      params.push(req.query.maxPrice);
    }

    sql += " ORDER BY c.vehicle_id";
    const [rows] = await pool.execute(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error("Get vehicles error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
};

// ══════════════════════════════════════════════════════
//  GET /api/vehicles/:id — Get vehicle by ID
// ══════════════════════════════════════════════════════
//
// Testing 1: Get existing vehicle
//   method: GET
//   URL: http://localhost:3000/api/vehicles/1
//   Expected: 200 OK — returns vehicle object with vehicle_id = 1
//
// Testing 2: Get non-existing vehicle
//   method: GET
//   URL: http://localhost:3000/api/vehicles/99999
//   Expected: 404 Not Found — { "detail": "Vehicle not found" }
//
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = BASE_SELECT + " WHERE c.vehicle_id = ?";
    const [rows] = await pool.execute(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ detail: "Vehicle not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("Get vehicle error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
};

// ══════════════════════════════════════════════════════
//  POST /api/vehicles — Create new vehicle
// ══════════════════════════════════════════════════════
//
// Testing 1: Insert a new vehicle (with image)
//   method: POST
//   URL: http://localhost:3000/api/vehicles
//   body: raw JSON
//   {
//     "car_brands": "Toyota",
//     "car_model": "Supra",
//     "year": 2024,
//     "daily_price": 5000,
//     "license_plate": "ABC-1234",
//     "status": "Available",
//     "transmission": "Auto",
//     "seats": 2,
//     "doors": 2,
//     "details": "Sports car",
//     "image_url": "https://drive.google.com/uc?id=example"
//   }
//   Expected: 201 Created — returns the created vehicle object
//
// Testing 2: Insert a new vehicle (minimal fields)
//   method: POST
//   URL: http://localhost:3000/api/vehicles
//   body: raw JSON
//   {
//     "car_brands": "Honda",
//     "car_model": "Civic",
//     "year": 2023,
//     "daily_price": 3000,
//     "license_plate": "XYZ-5678"
//   }
//   Expected: 201 Created — returns vehicle with defaults (status=Available, transmission=Auto)
//
exports.create = async (req, res) => {
  try {
    const {
      car_brands, car_model, year, daily_price, license_plate,
      status = "Available", transmission = "Auto",
      seats = 2, doors = 2, details, image_url,
    } = req.body;

    // Validate required fields
    if (!car_brands || !car_model || !year || !daily_price || !license_plate) {
      return res.status(400).json({
        detail: "Required fields: car_brands, car_model, year, daily_price, license_plate",
      });
    }

    // Insert ลง table car
    const [carResult] = await pool.execute(
      `INSERT INTO car
         (car_brands, car_model, year, daily_price, license_plate,
          status, transmission, seats, doors)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [car_brands, car_model, year, daily_price, license_plate,
       status, transmission, seats, doors]
    );
    const newId = carResult.insertId;

    // Insert ลง table image (ถ้ามี URL)
    if (image_url) {
      await pool.execute(
        `INSERT INTO image (url, description, vehicle_id)
         VALUES (?, ?, ?)`,
        [image_url, details || "", newId]
      );
    }

    // Return created vehicle (JOIN กลับ)
    const [rows] = await pool.execute(BASE_SELECT + " WHERE c.vehicle_id = ?", [newId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Create vehicle error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
};

// ══════════════════════════════════════════════════════
//  PUT /api/vehicles/:id — Update vehicle
// ══════════════════════════════════════════════════════
//
// Testing 1: Update price and status
//   method: PUT
//   URL: http://localhost:3000/api/vehicles/1
//   body: raw JSON
//   {
//     "daily_price": 6000,
//     "status": "Reserved"
//   }
//   Expected: 200 OK — returns updated vehicle object
//
// Testing 2: Update non-existing vehicle
//   method: PUT
//   URL: http://localhost:3000/api/vehicles/99999
//   body: raw JSON
//   {
//     "daily_price": 9999
//   }
//   Expected: 404 Not Found — { "detail": "Vehicle not found" }
//
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const carAllowed = [
      "car_brands", "car_model", "year", "daily_price",
      "license_plate", "status", "transmission", "seats", "doors",
    ];

    // แยก fields: table car vs table image
    const carData = {};
    for (const key of carAllowed) {
      if (req.body[key] !== undefined) {
        carData[key] = req.body[key];
      }
    }
    const imageUrl = req.body.image_url;
    const details = req.body.details;

    if (Object.keys(carData).length === 0 && imageUrl === undefined && details === undefined) {
      return res.status(400).json({ detail: "No fields to update" });
    }

    // Update table car
    if (Object.keys(carData).length > 0) {
      const setClause = Object.keys(carData).map((k) => `${k} = ?`).join(", ");
      const values = [...Object.values(carData), id];
      await pool.execute(`UPDATE car SET ${setClause} WHERE vehicle_id = ?`, values);
    }

    // Update table image
    if (imageUrl !== undefined || details !== undefined) {
      const [existing] = await pool.execute(
        "SELECT * FROM image WHERE vehicle_id = ?", [id]
      );

      if (existing.length > 0) {
        const imgUpdates = {};
        if (imageUrl !== undefined) imgUpdates.url = imageUrl;
        if (details !== undefined) imgUpdates.description = details;

        const setClause = Object.keys(imgUpdates).map((k) => `${k} = ?`).join(", ");
        await pool.execute(
          `UPDATE image SET ${setClause} WHERE vehicle_id = ?`,
          [...Object.values(imgUpdates), id]
        );
      } else {
        await pool.execute(
          `INSERT INTO image (url, description, vehicle_id) VALUES (?, ?, ?)`,
          [imageUrl || "", details || "", id]
        );
      }
    }

    // Return updated vehicle
    const [rows] = await pool.execute(BASE_SELECT + " WHERE c.vehicle_id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ detail: "Vehicle not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("Update vehicle error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
};

// ══════════════════════════════════════════════════════
//  DELETE /api/vehicles/:id — Delete vehicle
// ══════════════════════════════════════════════════════
//
// Testing 1: Delete existing vehicle
//   method: DELETE
//   URL: http://localhost:3000/api/vehicles/40
//   Expected: 200 OK — { "message": "Deleted", "vehicle_id": 40 }
//
// Testing 2: Delete non-existing vehicle
//   method: DELETE
//   URL: http://localhost:3000/api/vehicles/99999
//   Expected: 404 Not Found — { "detail": "Vehicle not found" }
//
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // ลบ image ก่อน (FK) → แล้วลบ car
    await pool.execute("DELETE FROM image WHERE vehicle_id = ?", [id]);
    const [result] = await pool.execute("DELETE FROM car WHERE vehicle_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ detail: "Vehicle not found" });
    }

    return res.json({ message: "Deleted", vehicle_id: parseInt(id) });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
};
