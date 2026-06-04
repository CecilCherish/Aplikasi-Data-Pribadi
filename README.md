# Halo, Ini Merupakan Web Untuk Gambaran Aplikasi Data Pribadi
Saya menggunakan CRUD sederhana, serta menggunakan:
- **Front End**: HTML, CSS, JavaScript (jQuery 3.7 + Bootstrap 5.3)
- **Penyimpanan**: `localStorage` browser (tanpa backend / database)

Field: 
NIK (PK, angka), Nama Lengkap, Jenis Kelamin (L/P), Tanggal Lahir, Umur (auto), Alamat, Negara.

Fitur: 
Search (NIK & Nama), Add, Edit, Detail, Delete (dengan konfirmasi), validasi form.

## Live Demo

Aplikasi Data Pribadi dapat diakses melalui:

🔗 [Demo Aplikasi Data Pribadi](https://cecilcherish.github.io/Aplikasi-Data-Pribadi/)

## Source Code

💻 [Repository GitHub](https://github.com/CecilCherish/Aplikasi-Data-Pribadi)

## Catatan

Back End **Java (Spring/Hibernate)** atau **C# (ASP.NET)**. Versi ini **hanya frontend** dengan localStorage — cocok jika test fokus pada UI/logika CRUD. Jika backend + database sungguhan, perlu membuat REST API terpisah (Spring Boot / ASP.NET Web API + MySQL/SQL Server) dan mengganti fungsi `loadAll/saveAll` di `app.js` dengan AJAX (`$.ajax`) ke endpoint API.

## Menjalankan Lokal

Cukup buka `index.html` di browser. (Atau jalankan `python3 -m http.server` di folder ini lalu buka `http://localhost:8000`.)

## Disclaimer

Kode ini dibuat dengan bantuan AI atau biasa disebut vibe coding, yang dimana hanya untuk membantu saya agar tidak mengerjakan semua dari awal untuk mempercepat proses pembuatan kode.

## Thankyou
~Cecillia C. M.