import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function currentAdmin(req) {
  return (
    db.getAdminById(req.user?.id) ||
    db.getAdminByEmail(req.user?.email || "") ||
    null
  );
}

// GET /api/users -> daftar akun admin
router.get("/", authenticateToken, (req, res) => {
  const current = currentAdmin(req);
  res.json({
    success: true,
    data: db.getAdmins(),
    currentUserId: current?.id || null,
  });
});

// POST /api/users -> tambah akun admin
router.post("/", authenticateToken, (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password || "");

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email is required",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }
  if (db.getAdminByEmail(email)) {
    return res.status(409).json({
      success: false,
      message: "Email is already used by another account",
    });
  }

  const user = db.addAdmin({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  });

  res.status(201).json({
    success: true,
    data: user,
    message: "User added successfully",
  });
});

// PUT /api/users/:id -> ubah nama, email, atau password akun
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const existing = db.getAdminById(id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const payload = {};
  if (req.body?.name !== undefined) {
    const name = String(req.body.name).trim();
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    payload.name = name;
  }

  if (req.body?.email !== undefined) {
    const email = String(req.body.email).trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required",
      });
    }
    const owner = db.getAdminByEmail(email);
    if (owner && owner.id !== id) {
      return res.status(409).json({
        success: false,
        message: "Email is already used by another account",
      });
    }
    payload.email = email;
  }

  if (req.body?.password !== undefined && String(req.body.password) !== "") {
    const password = String(req.body.password);
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    payload.password = bcrypt.hashSync(password, 10);
  }

  const user = db.updateAdmin(id, payload);
  res.json({
    success: true,
    data: user,
    message: "User updated successfully",
  });
});

// DELETE /api/users/:id -> hapus akun admin
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const current = currentAdmin(req);

  if (!db.getAdminById(id)) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  if (current?.id === id) {
    return res.status(400).json({
      success: false,
      message: "You cannot delete the account you are currently using",
    });
  }
  if (db.countAdmins() <= 1) {
    return res.status(400).json({
      success: false,
      message: "At least one admin account must remain",
    });
  }

  db.deleteAdmin(id);
  res.json({
    success: true,
    message: "User deleted successfully",
  });
});

export default router;
