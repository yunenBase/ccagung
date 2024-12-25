const mysql = require("mysql2/promise"); // Gunakan library mysql2 dengan dukungan Promise
const dbConfig = require("./dbConfig"); // Konfigurasi database

// Fungsi untuk mengecek koneksi database
async function checkDatabaseConnection() {
  try {
    console.log("🔄 Mencoba koneksi ke database...");
    const connection = await mysql.createConnection(dbConfig); // Membuat koneksi
    console.log("✅ Koneksi ke database berhasil!");
    await connection.end(); // Tutup koneksi
  } catch (err) {
    console.error("❌ Gagal koneksi ke database:", err.message);
  }
}

// Fungsi untuk mengambil data artikel dari database
async function getArtikel() {
  try {
    console.log("🔄 Mengambil data dari database...");
    const connection = await mysql.createConnection(dbConfig); // Membuka koneksi
    console.log("✅ Koneksi berhasil. Menjalankan query...");
    const [rows] = await connection.execute("SELECT * FROM cards"); // Eksekusi query
    console.log("✅ Data berhasil diambil:", rows);
    await connection.end(); // Tutup koneksi
    return rows; // Mengembalikan hasil
  } catch (err) {
    console.error("❌ Error mengambil data:", err.message);
    throw new Error("Error mengambil data dari database: " + err.message);
  }
}

module.exports = {
  checkDatabaseConnection,
  getArtikel,
};
