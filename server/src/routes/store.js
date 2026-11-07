import express from "express";
import { db } from "../db/db.js";
import { authenticateToken } from "../middleware/auth.js";
import { imageUpload } from "../lib/imageUpload.js";

const router = express.Router();

// GET /api/stores -> ambil pengaturan toko
router.get(`/`, (req, res) => {
  const settings = db.getSettings();
  res.json({
    success: true,
    data: settings,
  });
});

// PUT /api/stores -> ubah pengaturan toko (butuh token login)
router.put(`/`, authenticateToken, (req, res) => {
  const {
    storeName,
    tagline,
    address,
    phone,
    slug,
    currency,
    activeWhatsApp,
    operationalHours,
    instagram,
    rentalNote,
    heroImage,
  } = req.body || {};

  const current = db.getSettings();

  const updated = db.updateSettings({
    storeName: storeName ?? current.storeName,
    tagline: tagline ?? current.tagline,
    address: address ?? current.address,
    phone:
      phone !== undefined
        ? String(phone).replace(/[^0-9]/g, "")
        : current.phone,
    slug: slug ?? current.slug,
    currency: currency ?? current.currency,
    activeWhatsApp:
      activeWhatsApp !== undefined
        ? String(
            typeof activeWhatsApp === "string"
              ? activeWhatsApp !== "false"
              : Boolean(activeWhatsApp),
          )
        : current.activeWhatsApp,
    operationalHours: operationalHours ?? current.operationalHours,
    instagram: instagram ?? current.instagram,
    rentalNote: rentalNote ?? current.rentalNote,
    heroImage: heroImage ?? current.heroImage ?? "",
  });

  res.json({
    success: true,
    data: updated,
    message: "Store settings updated successfully",
  });
});

// POST /api/stores/hero -> unggah foto background hero
router.post(
  "/hero",
  authenticateToken,
  imageUpload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const updated = db.updateSettings({
      heroImage: `/uploads/${req.file.filename}`,
    });

    res.json({
      success: true,
      data: updated,
      message: "Hero background updated successfully",
    });
  },
);

export default router;
