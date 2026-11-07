import express from "express";
import { db } from "../db/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

function testimonialPayload(body = {}) {
  return {
    quote: String(body.quote ?? "").trim(),
    name: String(body.name ?? "").trim(),
    role: String(body.role ?? "").trim(),
    company: String(body.company ?? "").trim(),
    avatar: String(body.avatar ?? "").trim(),
  };
}

// GET /api/testimonials -> daftar testimoni (publik)
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: db.getTestimonials(),
  });
});

// POST /api/testimonials -> tambah testimoni
router.post("/", authenticateToken, (req, res) => {
  const payload = testimonialPayload(req.body);
  if (!payload.quote || !payload.name) {
    return res.status(400).json({
      success: false,
      message: "Quote and name are required",
    });
  }

  const testimonial = db.addTestimonial(payload);
  res.status(201).json({
    success: true,
    data: testimonial,
    message: "Testimonial added successfully",
  });
});

// PUT /api/testimonials/:id -> ubah testimoni
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  if (!db.getTestimonialById(id)) {
    return res.status(404).json({
      success: false,
      message: "Testimonial not found",
    });
  }

  const payload = {};
  for (const [key, value] of Object.entries(testimonialPayload(req.body))) {
    if (req.body[key] !== undefined) payload[key] = value;
  }

  if (payload.quote !== undefined && !payload.quote) {
    return res.status(400).json({
      success: false,
      message: "Quote is required",
    });
  }
  if (payload.name !== undefined && !payload.name) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  const testimonial = db.updateTestimonial(id, payload);
  res.json({
    success: true,
    data: testimonial,
    message: "Testimonial updated successfully",
  });
});

// DELETE /api/testimonials/:id -> hapus testimoni
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  if (!db.deleteTestimonial(id)) {
    return res.status(404).json({
      success: false,
      message: "Testimonial not found",
    });
  }

  res.json({
    success: true,
    message: "Testimonial deleted successfully",
  });
});

export default router;
