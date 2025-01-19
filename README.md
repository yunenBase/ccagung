Ini merupakan kode web server dengan express js untuk di deploy dalam VM Azure yang akan dihubungkan dengan VM Azure (mysql server) dengan langkah berikut :

# Cloud Computing

Buat layanan Infrastructure as a Service (IaaS) yang memungkinkan komunikasi web server dan sql server melalui private/static ip 

# Step 1 : Buat 2 Virtual Machine (VM)

 dengan rincian :

- 1 VM untuk webserver menggunakan NodeJs
- 1 VM untuk MySQL server

Usahakan membuat VM dalam satu *Resource Group* yang sama untuk memudahkan proses *peering*

# Step 2 : Peering

Hubungkan kedua VM dengan melakukan peering dengan menghubungkan virtual net (vnet) vm satu ke vm lainnya. 

Dalam proses ini pastikan subnet dan Network Interface tidak saling tumpang tindih satu sama lain (collision)

Contohnya :

- VM 1 memiliki subnet : 10.0.0.0/16, VM 2 memiliki subnet : 10.0.0.0/16, hal ini akan menyebabkan *peering* gagal karena kedua subnet saling tumpang tindih
- VM 1 memiliki subnet 10.0.1.0/15, VM 2 memiliki subnet : 10.0.0.0/16, hal ini dapat dilakukan karena tidak menyebabkan collision

Peering dilakukan agar kedua VM saling terhubung dalam satu virtual net yang sama sehingga dapat melakukan komunikasi dengan static/private ip

# Step 3 : Konfigurasi VM 2 (MySQL Server)

Masuk ke SSH VM 2 (MySQL Server) dan lakukan konfigurasi dengan :

`sudo apt-get update && sudo apt upgrade -y`

untuk melakukan update SSH, kemudian lakukan :

- instalasi MySQL server
- login ke akun “root” mysql untuk masuk sebagai admin mysql dan buat username baru bernama “username”
- berikan hak akses penuh untuk mengelola database (create, read, update, delete) ke “username” yang baru dibuat tadi
- konfigurasi bind adress agar memperbolehkan traffic dari semua ip adress dengan mengganti blok kode menjadi 0.0.0.0

Konfigurasi sengaja dibuat menjadi 0.0.0.0 (dapat menerima akses dari ip manapun agar dapat melakukan pengujian secara lokal dengan bebas)

- buat database dan tabel yang akan digunakan

langkah lanjutan (opsional)

- koneksikan vm mysql server dengan mysql workbench agar lebih mudah dikelola

# Step 4 : Konfigurasi VM 1 (Web Server)

VM 1 ditujukan sebagai web server yang akan di isi dengan kode frontend dan backend program yang menggunakan database dari mysql server dengan memanfaatkan private ip vm 2 sebagai media komunikasi

Sebelum melakukan deploy web ke vm, disarankan untuk menggunakan vscode (pengujian lokal) dengan menggunakan public ip vm 2 agar terkoneksi

Percobaan dengan lokal menggunakan ip publik karena penggunaan ip private hanya dapat digunakan di dalam virtual network yang sama. Dalam konteks ini, hanya dapat dilakukan di dalam VM Azure yang terhubung di dalam Virtual Network/Resources Group yang sama

Beberapa teknologi yang digunakan untuk web server :

- NPM : Sebagai runtime untuk menjalankan seluruh webserver
- Express Js : Untuk penanganan logika backend
- EJS : Untuk menampilkan frontend
- MySQL2 : Sebagai MySQL Client

### Setelah berhasil melakukan Konfigurasi dan berhasil terkoneksi dengan database, buat web sederhana yang menampilkan data dari database

Setelah itu, lakukan deploy kode ke github untuk memudahkan pemindahan kode ke VM, kemudian di dalam VM lakukan :

- Update SSH
- Install NPM
- Clone repository yang berisi kode webserver
- change directory project dengan : `cd ccdavi`
- Install dependencies yang diperlukan dengan :`npm install`
- ubah database congig dengan : `nano dbConfig.js` kemudian ubah bagian ‘host’ dalam kode yang semula berisi public ip. Ganti dengan private IP MySQL Server
- Jalankan kode dengan : `node index.js`

Dengan ini, VM 1 (webserver) telah berhasil terhubung dengan VM 2 (MySQL server) melalui ip private VM 2.

### Beberapa hal yang perlu diketahui :

- Dalam proses pengujian secara lokal (development), komunikasi dilakukan dengan public ip VM 2 (mysql server) karena peering hanya dilakukan untuk VM 1 yang digunakan untuk deployment diakhir proses saat semua kode sudah dipastikan dapat berjalan. Proses ini dapat disebut proses development
- Dalam proses deployment ke VM 1, host yang berisi ip VM 2 harus diganti agar komunikasi dapat dilakukan dengan private IP VM 2

### PENTING!

Project ini bersifat IaaS karena semua service dikelola secara penuh oleh user, mulai dari menyiapkan virtual machine, konfigurasi OS, storage, dan lain lain, semuanya dilakukan dan dikendalikan penuh oleh user, sehingga user punya kendali penuh atas infrastruktur virtual yang diletakkan di Azure Cloud Service
