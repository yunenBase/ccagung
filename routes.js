const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();
const path = require("path");
const { getArtikel } = require("./dbService");
const dbConfig = require("./dbConfig");
const multer = require("multer");

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Folder tempat menyimpan file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nama file unik
  },
});
const upload = multer({ storage: storage });

// Route untuk menampilkan halaman utama dengan data dari database
router.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT c.id, c.title, c.description, c.image_url, c.created_at, cat.name AS category, c.author
      FROM cards c
      JOIN categories cat ON c.category_id = cat.id;
    `);
    console.log("Data yang diambil:", rows); // Tambahkan logging
    await connection.end();
    res.render("index", { cards: rows });
  } catch (err) {
    console.error("❌ Error retrieving data:", err.message);
    res.status(500).send("Error retrieving data from database");
  }
});

// Route untuk menampilkan halaman tambah berita
router.get("/add-news", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig); // Koneksi ke database
    const [categories] = await connection.query(
      "SELECT id, name FROM categories"
    ); // Ambil data categories
    await connection.end();

    res.render("add-news", { categories }); // Kirim data categories ke template EJS
  } catch (err) {
    console.error("❌ Error retrieving categories:", err.message);
    res.status(500).send("Error retrieving categories from database");
  }
});

// Route untuk menangani form tambah berita
router.post("/add-news", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, author } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; // Path file yang di-upload

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      `
        INSERT INTO cards (title, description, category_id, author, image_url, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `,
      [title, description, category, author, imageUrl]
    );

    await connection.end();

    res.redirect("/"); // Redirect ke halaman utama setelah berita ditambahkan
  } catch (err) {
    console.error("❌ Error menambahkan berita:", err.message);
    res.status(500).send("Error menambahkan berita");
  }
});

// Route untuk menghapus berita
router.post("/delete-news/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("DELETE FROM cards WHERE id = ?", [id]); // Parameterized query
    await connection.end();

    res.redirect("/"); // Kembali ke halaman utama setelah menghapus berita
  } catch (err) {
    console.error("❌ Error menghapus berita:", err.message);
    res.status(500).send("Error menghapus berita");
  }
});

module.exports = router;
