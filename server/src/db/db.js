import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQLITE_FILE = path.join(__dirname, "katalogwa.sqlite");
const DATA_FILE = path.join(__dirname, "data.json");

class SqliteDatabase {
  constructor() {
    this.db = new DatabaseSync(SQLITE_FILE);
    this.initTables();
    this.seedInitialData();
  }

  initTables() {
    // Enable foreign keys
    this.db.exec("PRAGMA foreign_keys = ON;");

    // 1. Categories Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Products Table (Relational with Foreign Key to categories)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
        price INTEGER NOT NULL,
        driver_fee INTEGER NOT NULL DEFAULT 0,
        min_rental INTEGER NOT NULL DEFAULT 1,
        stock_status TEXT NOT NULL DEFAULT 'Tersedia',
        transmission TEXT NOT NULL DEFAULT 'Matic',
        seats INTEGER NOT NULL DEFAULT 5,
        fuel TEXT NOT NULL DEFAULT 'Bensin',
        model_year INTEGER,
        description TEXT,
        image TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    this.ensureProductColumns();

    // 3. Settings Key-Value Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // 4. Admin Authentication Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Popular Routes Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS routes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        note TEXT,
        distance TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Testimonials Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        quote TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT,
        company TEXT,
        avatar TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_products_cat ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_status);
    `);
  }

  ensureProductColumns() {
    // Database lama hanya punya kolom skema awal. Tambahkan kolom
    // kendaraan tanpa menghapus data yang sudah ada.
    const columns = new Set(
      this.db
        .prepare("PRAGMA table_info(products)")
        .all()
        .map((column) => column.name),
    );
    const additions = [
      ["transmission", "TEXT NOT NULL DEFAULT 'Matic'"],
      ["seats", "INTEGER NOT NULL DEFAULT 5"],
      ["fuel", "TEXT NOT NULL DEFAULT 'Bensin'"],
      ["model_year", "INTEGER"],
      ["driver_fee", "INTEGER NOT NULL DEFAULT 0"],
      ["min_rental", "INTEGER NOT NULL DEFAULT 1"],
    ];

    for (const [name, definition] of additions) {
      if (!columns.has(name)) {
        this.db.exec(`ALTER TABLE products ADD COLUMN ${name} ${definition}`);
      }
    }
  }

  seedInitialData() {
    const seedData = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    // Seed Settings
    const existingSettings = this.db
      .prepare("SELECT COUNT(*) AS count FROM settings")
      .get();
    if (existingSettings.count === 0) {
      const insertSetting = this.db.prepare(
        "INSERT INTO settings (key, value) VALUES (?, ?)",
      );
      for (const [key, value] of Object.entries(seedData.settings)) {
        insertSetting.run(key, String(value));
      }
    }

    // Seed Admin
    const existingAdmin = this.db
      .prepare("SELECT COUNT(*) AS count FROM admins")
      .get();
    if (existingAdmin.count === 0) {
      const hashedPassword = bcrypt.hashSync(seedData.admin.password, 10);
      this.db
        .prepare(
          "INSERT INTO admins (id, name, email, password) VALUES (?, ?, ?, ?)",
        )
        .run(
          seedData.admin.id,
          seedData.admin.name,
          seedData.admin.email,
          hashedPassword,
        );
    }

    // Seed Categories
    const existingCategories = this.db
      .prepare("SELECT COUNT(*) AS count FROM categories")
      .get();
    if (existingCategories.count === 0) {
      const insertCat = this.db.prepare(
        "INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)",
      );
      for (const category of seedData.categories) {
        insertCat.run(category.id, category.name, category.slug);
      }
    }

    // Seed Products
    const existingProducts = this.db
      .prepare("SELECT COUNT(*) AS count FROM products")
      .get();
    if (existingProducts.count === 0) {
      const insertProduct = this.db.prepare(`
        INSERT INTO products (
          id, name, category_id, price, driver_fee, min_rental,
          stock_status, transmission, seats, fuel, model_year, description, image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const product of seedData.products) {
        const stockStatus =
          typeof product.stockStatus === "string"
            ? product.stockStatus === "Disewa"
              ? "Disewa"
              : "Tersedia"
            : Number(product.stockStatus) > 0
              ? "Tersedia"
              : "Disewa";
        insertProduct.run(
          product.id,
          product.name,
          product.categoryId,
          product.price,
          Number(product.driverFee) || 0,
          Math.max(1, Number(product.minRental) || 1),
          stockStatus,
          product.transmission || "Matic",
          Math.max(1, Number(product.seats) || 5),
          product.fuel || "Bensin",
          Number(product.modelYear) || null,
          product.description,
          product.image,
        );
      }
    }

    // Seed Popular Routes
    const existingRoutes = this.db
      .prepare("SELECT COUNT(*) AS count FROM routes")
      .get();
    if (existingRoutes.count === 0 && Array.isArray(seedData.routes)) {
      const insertRoute = this.db.prepare(
        "INSERT INTO routes (id, name, note, distance) VALUES (?, ?, ?, ?)",
      );
      for (const route of seedData.routes) {
        insertRoute.run(
          route.id,
          route.name,
          route.note || "",
          route.distance || "",
        );
      }
    }

    // Seed Testimonials
    const existingTestimonials = this.db
      .prepare("SELECT COUNT(*) AS count FROM testimonials")
      .get();
    if (
      existingTestimonials.count === 0 &&
      Array.isArray(seedData.testimonials)
    ) {
      const insertTestimonial = this.db.prepare(
        `INSERT INTO testimonials (id, quote, name, role, company, avatar)
         VALUES (?, ?, ?, ?, ?, ?)`,
      );
      for (const testimonial of seedData.testimonials) {
        insertTestimonial.run(
          testimonial.id,
          testimonial.quote,
          testimonial.name,
          testimonial.role || "",
          testimonial.company || "",
          testimonial.avatar || "",
        );
      }
    }
  }

  // --- Settings SQL Operations ---
  getSettings() {
    const rows = this.db.prepare("SELECT key, value FROM settings").all();
    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return settings;
  }

  updateSettings(newSettings) {
    const upsert = this.db.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    for (const [key, val] of Object.entries(newSettings)) {
      upsert.run(key, String(val));
    }
    return this.getSettings();
  }

  // --- Popular Routes SQL Operations ---
  getRoutes() {
    return this.db
      .prepare(
        `SELECT id, name, note, distance, created_at AS createdAt
         FROM routes
         ORDER BY created_at ASC, rowid ASC`,
      )
      .all();
  }

  getRouteById(id) {
    return this.db
      .prepare(
        "SELECT id, name, note, distance FROM routes WHERE id = ?",
      )
      .get(id);
  }

  addRoute({ name, note, distance }) {
    const id = `route-${Date.now()}`;
    this.db
      .prepare(
        "INSERT INTO routes (id, name, note, distance) VALUES (?, ?, ?, ?)",
      )
      .run(id, name, note || "", distance || "");
    return { id, name, note: note || "", distance: distance || "" };
  }

  updateRoute(id, data) {
    const current = this.getRouteById(id);
    if (!current) return null;

    const next = {
      name: data.name ?? current.name,
      note: data.note ?? current.note,
      distance: data.distance ?? current.distance,
    };

    this.db
      .prepare("UPDATE routes SET name = ?, note = ?, distance = ? WHERE id = ?")
      .run(next.name, next.note, next.distance, id);

    return { id, ...next };
  }

  deleteRoute(id) {
    const res = this.db.prepare("DELETE FROM routes WHERE id = ?").run(id);
    return res.changes > 0;
  }

  // --- Testimonial SQL Operations ---
  getTestimonials() {
    return this.db
      .prepare(
        `SELECT id, quote, name, role, company, avatar, created_at AS createdAt
         FROM testimonials
         ORDER BY created_at ASC, rowid ASC`,
      )
      .all();
  }

  getTestimonialById(id) {
    return this.db
      .prepare(
        `SELECT id, quote, name, role, company, avatar
         FROM testimonials WHERE id = ?`,
      )
      .get(id);
  }

  addTestimonial(data) {
    const id = `testi-${Date.now()}`;
    this.db
      .prepare(
        `INSERT INTO testimonials (id, quote, name, role, company, avatar)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        data.quote,
        data.name,
        data.role || "",
        data.company || "",
        data.avatar || "",
      );
    return { id, ...data };
  }

  updateTestimonial(id, data) {
    const current = this.getTestimonialById(id);
    if (!current) return null;

    const next = {
      quote: data.quote ?? current.quote,
      name: data.name ?? current.name,
      role: data.role ?? current.role,
      company: data.company ?? current.company,
      avatar: data.avatar ?? current.avatar,
    };

    this.db
      .prepare(
        `UPDATE testimonials
         SET quote = ?, name = ?, role = ?, company = ?, avatar = ?
         WHERE id = ?`,
      )
      .run(next.quote, next.name, next.role, next.company, next.avatar, id);

    return { id, ...next };
  }

  deleteTestimonial(id) {
    const res = this.db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);
    return res.changes > 0;
  }

  // --- Admin SQL Operations ---
  getAdmin() {
    return this.db
      .prepare("SELECT id, name, email, password FROM admins LIMIT 1")
      .get();
  }

  getAdminById(id) {
    // Token lama bisa saja belum menyimpan id. Jangan teruskan nilai yang
    // tidak bisa di-bind ke SQLite (undefined/object) ke prepared statement.
    if (typeof id !== "string" && typeof id !== "number") return null;

    return this.db
      .prepare("SELECT id, name, email, password FROM admins WHERE id = ?")
      .get(id);
  }

  getAdminByEmail(email) {
    if (typeof email !== "string" || !email.trim()) return null;

    return this.db
      .prepare(
        "SELECT id, name, email, password FROM admins WHERE LOWER(email) = LOWER(?)",
      )
      .get(email);
  }

  getAdmins() {
    return this.db
      .prepare(
        `SELECT id, name, email, created_at AS createdAt
         FROM admins
         ORDER BY created_at ASC`,
      )
      .all();
  }

  countAdmins() {
    return this.db.prepare("SELECT COUNT(*) AS count FROM admins").get().count;
  }

  addAdmin({ name, email, password }) {
    const id = `admin-${Date.now()}`;
    this.db
      .prepare(
        "INSERT INTO admins (id, name, email, password) VALUES (?, ?, ?, ?)",
      )
      .run(id, name, email, password);
    return {
      id,
      name,
      email,
      createdAt: new Date().toISOString(),
    };
  }

  updateAdmin(id, { name, email, password }) {
    const current = this.getAdminById(id);
    if (!current) return null;

    const next = {
      name: name ?? current.name,
      email: email ?? current.email,
      password: password ?? current.password,
    };

    this.db
      .prepare("UPDATE admins SET name = ?, email = ?, password = ? WHERE id = ?")
      .run(next.name, next.email, next.password, id);

    return {
      id,
      name: next.name,
      email: next.email,
    };
  }

  deleteAdmin(id) {
    const res = this.db.prepare("DELETE FROM admins WHERE id = ?").run(id);
    return res.changes > 0;
  }

  // --- Category SQL Operations ---
  getCategories() {
    // Relational SQL query with LEFT JOIN and COUNT
    return this.db
      .prepare(
        `
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.created_at AS createdAt,
        COUNT(p.id) AS productCount
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `,
      )
      .all();
  }

  getCategoryById(id) {
    return this.db
      .prepare("SELECT id, name, slug FROM categories WHERE id = ?")
      .get(id);
  }

  addCategory(name) {
    const id = `cat-${Date.now()}`;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    this.db
      .prepare("INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)")
      .run(id, name, slug);
    return { id, name, slug, productCount: 0 };
  }

  updateCategory(id, name) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const res = this.db
      .prepare("UPDATE categories SET name = ?, slug = ? WHERE id = ?")
      .run(name, slug, id);
    if (res.changes === 0) return null;
    return { id, name, slug };
  }

  deleteCategory(id) {
    const res = this.db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    return res.changes > 0;
  }

  // --- Product SQL Operations ---
  getProducts(filters = {}) {
    let sql = `
      SELECT 
        p.id, 
        p.name, 
        p.category_id AS categoryId, 
        c.name AS categoryName, 
        p.price, 
        p.driver_fee AS driverFee,
        p.min_rental AS minRental,
        p.stock_status AS stockStatus, 
        p.transmission,
        p.seats,
        p.fuel,
        p.model_year AS modelYear,
        p.description, 
        p.image, 
        p.created_at AS createdAt,
        p.updated_at AS updatedAt
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.categoryId) {
      sql += " AND p.category_id = ?";
      params.push(filters.categoryId);
    }

    if (filters.stockStatus) {
      sql += " AND p.stock_status = ?";
      params.push(filters.stockStatus);
    }

    if (filters.search) {
      sql += " AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ?)";
      const queryPattern = `%${filters.search.toLowerCase()}%`;
      params.push(queryPattern, queryPattern);
    }

    sql += " ORDER BY p.created_at DESC";

    return this.db.prepare(sql).all(...params);
  }

  getProductById(id) {
    return this.db
      .prepare(
        `
      SELECT 
        p.id, 
        p.name, 
        p.category_id AS categoryId, 
        c.name AS categoryName, 
        p.price, 
        p.driver_fee AS driverFee,
        p.min_rental AS minRental,
        p.stock_status AS stockStatus, 
        p.transmission,
        p.seats,
        p.fuel,
        p.model_year AS modelYear,
        p.description, 
        p.image, 
        p.created_at AS createdAt,
        p.updated_at AS updatedAt
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `,
      )
      .get(id);
  }

  addProduct(productData) {
    const id = `prod-${Date.now()}`;
    const price = Number(productData.price) || 0;
    const driverFee = Number(productData.driverFee) || 0;
    const minRental = Math.max(1, Number(productData.minRental) || 1);
    const stockStatus = productData.stockStatus || "Tersedia";
    const transmission = productData.transmission || "Matic";
    const seats = Math.max(1, Number(productData.seats) || 5);
    const fuel = productData.fuel || "Bensin";
    const modelYear = Number(productData.modelYear) || null;
    const description = productData.description || "";
    const image = productData.image || "";

    this.db
      .prepare(
        `
      INSERT INTO products (
        id, name, category_id, price, driver_fee, min_rental,
        stock_status, transmission, seats, fuel, model_year, description, image
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        id,
        productData.name,
        productData.categoryId,
        price,
        driverFee,
        minRental,
        stockStatus,
        transmission,
        seats,
        fuel,
        modelYear,
        description,
        image,
      );

    return this.getProductById(id);
  }

  updateProduct(id, productData) {
    const current = this.getProductById(id);
    if (!current) return null;

    const name =
      productData.name !== undefined ? productData.name : current.name;
    const categoryId =
      productData.categoryId !== undefined
        ? productData.categoryId
        : current.categoryId;
    const price =
      productData.price !== undefined
        ? Number(productData.price)
        : current.price;
    const driverFee =
      productData.driverFee !== undefined
        ? Number(productData.driverFee) || 0
        : current.driverFee;
    const minRental =
      productData.minRental !== undefined
        ? Math.max(1, Number(productData.minRental) || 1)
        : current.minRental;
    const stockStatus =
      productData.stockStatus !== undefined
        ? productData.stockStatus
        : current.stockStatus;
    const transmission =
      productData.transmission !== undefined
        ? productData.transmission
        : current.transmission;
    const seats =
      productData.seats !== undefined
        ? Math.max(1, Number(productData.seats) || 5)
        : current.seats;
    const fuel =
      productData.fuel !== undefined ? productData.fuel : current.fuel;
    const modelYear =
      productData.modelYear !== undefined
        ? Number(productData.modelYear) || null
        : current.modelYear;
    const description =
      productData.description !== undefined
        ? productData.description
        : current.description;
    const image =
      productData.image !== undefined ? productData.image : current.image;

    this.db
      .prepare(
        `
      UPDATE products 
      SET name = ?, category_id = ?, price = ?, driver_fee = ?, min_rental = ?,
          stock_status = ?, transmission = ?, seats = ?, fuel = ?, model_year = ?,
          description = ?, image = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      )
      .run(
        name,
        categoryId,
        price,
        driverFee,
        minRental,
        stockStatus,
        transmission,
        seats,
        fuel,
        modelYear,
        description,
        image,
        id,
      );

    return this.getProductById(id);
  }

  toggleStock(id) {
    const product = this.getProductById(id);
    if (!product) return null;

    const newStock = product.stockStatus === "Tersedia" ? "Disewa" : "Tersedia";
    this.db
      .prepare(
        `
      UPDATE products 
      SET stock_status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `,
      )
      .run(newStock, id);

    return this.getProductById(id);
  }

  deleteProduct(id) {
    const res = this.db.prepare("DELETE FROM products WHERE id = ?").run(id);
    return res.changes > 0;
  }
}

export const db = new SqliteDatabase();
