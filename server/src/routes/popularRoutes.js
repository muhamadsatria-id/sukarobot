import express from "express";
import { db } from "../db/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/routes -> daftar rute populer (publik)
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: db.getRoutes(),
  });
});

// POST /api/routes -> tambah rute populer
router.post("/", authenticateToken, (req, res) => {
  const name = String(req.body?.name || "").trim();
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Route name is required",
    });
  }

  const route = db.addRoute({
    name,
    note: String(req.body?.note || "").trim(),
    distance: String(req.body?.distance || "").trim(),
  });

  res.status(201).json({
    success: true,
    data: route,
    message: "Route added successfully",
  });
});

// PUT /api/routes/:id -> ubah rute populer
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  if (!db.getRouteById(id)) {
    return res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }

  if (req.body?.name !== undefined && !String(req.body.name).trim()) {
    return res.status(400).json({
      success: false,
      message: "Route name is required",
    });
  }

  const payload = {};
  if (req.body?.name !== undefined) {
    payload.name = String(req.body.name).trim();
  }
  if (req.body?.note !== undefined) {
    payload.note = String(req.body.note).trim();
  }
  if (req.body?.distance !== undefined) {
    payload.distance = String(req.body.distance).trim();
  }

  const route = db.updateRoute(id, payload);
  res.json({
    success: true,
    data: route,
    message: "Route updated successfully",
  });
});

// DELETE /api/routes/:id -> hapus rute populer
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  if (!db.deleteRoute(id)) {
    return res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }

  res.json({
    success: true,
    message: "Route deleted successfully",
  });
});

export default router;
