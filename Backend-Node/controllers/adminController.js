// ===================================================
//  Velocità — Admin Controller
//  Tables: admin_login + admin_info (JOIN)
// ===================================================

const { pool } = require("../config/db");

// SQL: JOIN admin_login + admin_info
const BASE_SELECT = `
  SELECT l.admin_id, l.username, l.email,
         i.first_name, i.last_name, i.role,
         i.date_of_birth, i.address
  FROM admin_login l
  LEFT JOIN admin_info i ON l.admin_id = i.admin_id
`;

// ══════════════════════════════════════════════════════
//  POST /api/admin/login — Admin authentication
// ══════════════════════════════════════════════════════
//
// Testing 1: Login with valid credentials
//   method: POST
//   URL: http://localhost:3000/api/admin/login
//   body: raw JSON
//   {
//     "username": "admin1",
//     "password": "1234"
//   }
//   Expected: 200 OK — returns admin object with admin_id, username, email, etc.
//
// Testing 2: Login with invalid credentials
//   method: POST
//   URL: http://localhost:3000/api/admin/login
//   body: raw JSON
//   {
//     "username": "wronguser",
//     "password": "wrongpass"
//   }
//   Expected: 401 Unauthorized — { "detail": "Invalid username or password" }
//
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ detail: "Username and password are required" });
    }

    const sql = BASE_SELECT + `
      WHERE (l.username = ? OR l.email = ?)
        AND l.password = ?
    `;
    const [rows] = await pool.execute(sql, [username, username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ detail: "Invalid username or password" });
    }

    const admin = rows[0];
    if (admin.date_of_birth) {
      admin.date_of_birth = String(admin.date_of_birth);
    }

    return res.json(admin);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
};

// ══════════════════════════════════════════════════════
//  GET /api/admin/:id — Get admin by ID
// ══════════════════════════════════════════════════════
//
// Testing 1: Get existing admin
//   method: GET
//   URL: http://localhost:3000/api/admin/1
//   Expected: 200 OK — returns admin object
//
// Testing 2: Get non-existing admin
//   method: GET
//   URL: http://localhost:3000/api/admin/99999
//   Expected: 404 Not Found — { "detail": "Admin not found" }
//
exports.getAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = BASE_SELECT + " WHERE l.admin_id = ?";
    const [rows] = await pool.execute(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ detail: "Admin not found" });
    }

    const admin = rows[0];
    if (admin.date_of_birth) {
      admin.date_of_birth = String(admin.date_of_birth);
    }

    return res.json(admin);
  } catch (err) {
    console.error("Get admin error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
};

// ══════════════════════════════════════════════════════
//  PUT /api/admin/:id — Update admin info
// ══════════════════════════════════════════════════════
//
// Testing 1: Update admin name
//   method: PUT
//   URL: http://localhost:3000/api/admin/1
//   body: raw JSON
//   {
//     "first_name": "John",
//     "last_name": "Doe"
//   }
//   Expected: 200 OK — returns updated admin object
//
// Testing 2: Update with no fields
//   method: PUT
//   URL: http://localhost:3000/api/admin/1
//   body: raw JSON
//   {}
//   Expected: 400 Bad Request — { "detail": "No fields to update" }
//
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ["first_name", "last_name", "role", "date_of_birth", "address"];

    // เลือกเฉพาะ field ที่อนุญาตและมีค่าส่งมา
    const data = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ detail: "No fields to update" });
    }

    const setClause = Object.keys(data).map((k) => `${k} = ?`).join(", ");
    const values = [...Object.values(data), id];

    const [result] = await pool.execute(
      `UPDATE admin_info SET ${setClause} WHERE admin_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ detail: "Admin not found" });
    }

    // Return updated admin
    const [rows] = await pool.execute(BASE_SELECT + " WHERE l.admin_id = ?", [id]);
    const admin = rows[0];
    if (admin && admin.date_of_birth) {
      admin.date_of_birth = String(admin.date_of_birth);
    }

    return res.json(admin);
  } catch (err) {
    console.error("Update admin error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
};

// ══════════════════════════════════════════════════════
//  DELETE /api/admin/:id — Delete admin
// ══════════════════════════════════════════════════════
//
// Testing 1: Delete existing admin
//   method: DELETE
//   URL: http://localhost:3000/api/admin/2
//   Expected: 200 OK — { "message": "Deleted", "admin_id": 2 }
//
// Testing 2: Delete non-existing admin
//   method: DELETE
//   URL: http://localhost:3000/api/admin/99999
//   Expected: 404 Not Found — { "detail": "Admin not found" }
//
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // ลบ admin_info ก่อน → แล้วลบ admin_login
    await pool.execute("DELETE FROM admin_info WHERE admin_id = ?", [id]);
    const [result] = await pool.execute("DELETE FROM admin_login WHERE admin_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ detail: "Admin not found" });
    }

    return res.json({ message: "Deleted", admin_id: parseInt(id) });
  } catch (err) {
    console.error("Delete admin error:", err);
    return res.status(500).json({ detail: "Internal server error" });
  }
};
