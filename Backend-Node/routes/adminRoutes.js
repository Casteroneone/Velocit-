const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/admin/login", adminController.login);
router.get("/admin/:id", adminController.getAdmin);
router.put("/admin/:id", adminController.updateAdmin);
router.delete("/admin/:id", adminController.deleteAdmin);

module.exports = router;