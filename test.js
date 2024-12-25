const mysql = require("mysql2");

// Konfigurasi koneksi MySQL
const dbConfig = {
  host: "13.70.149.54", // Ganti dengan IP publik VM Anda
  port: 3306, // Port default MySQL
  user: "username", // Ganti dengan username MySQL Anda
  password: "password", // Ganti dengan password MySQL Anda
  database: "dbdavi", // Ganti dengan nama database Anda
};

// Fungsi untuk menguji koneksi
async function testConnection() {
  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error("Gagal koneksi ke MySQL:", err.message);
    } else {
      console.log("Koneksi berhasil ke MySQL!");
    }
    connection.end(); // Tutup koneksi setelah selesai
  });
}

// Jalankan fungsi untuk menguji koneksi
testConnection();
