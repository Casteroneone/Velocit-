const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

router.get("/vehicles", vehicleController.getAll);
router.get("/vehicles/:id", vehicleController.getById);
router.post("/vehicles", vehicleController.create);
router.put("/vehicles/:id", vehicleController.update);
router.delete("/vehicles/:id", vehicleController.remove);

module.exports = router;