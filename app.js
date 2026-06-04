// ============ menggunakan jQuery + Bootstrap + localStorage ============

const STORAGE_KEY = "data-pribadi-v1";

const COUNTRIES = [
  "Indonesia","Malaysia","Singapura","Thailand","Filipina","Vietnam","Brunei",
  "Jepang","Korea Selatan","Tiongkok","India","Australia","Amerika Serikat",
  "Inggris","Jerman","Prancis","Belanda","Argentina"
];

const SEED = [
  { nik:"3201010101900001", namaLengkap:"Lionel Messi", jenisKelamin:"L", tanggalLahir:"1987-06-24", alamat:"Rosario, Santa Fe", negara:"Argentina" },
  { nik:"3201010202920002", namaLengkap:"Siti Aminah",  jenisKelamin:"P", tanggalLahir:"1995-03-12", alamat:"Jl. Merdeka No. 10, Jakarta", negara:"Indonesia" },
];

// ---------- Storage ----------
function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { saveAll(SEED); return SEED.slice(); }
    return JSON.parse(raw);
  } catch { return []; }
}
function saveAll(rows) { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); }

// ---------- Helpers ----------
function calcUmur(dateStr) {
  if (!dateStr) return 0;
  const dob = new Date(dateStr), now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function showToast(msg, ok = true) {
  const $t = $("#toast");
  $t.removeClass("text-bg-success text-bg-danger").addClass(ok ? "text-bg-success" : "text-bg-danger");
  $("#toastMsg").text(msg);
  bootstrap.Toast.getOrCreateInstance($t[0], { delay: 2500 }).show();
}

// ---------- State ----------
let rows = [];
let filter = { nik: "", nama: "" };
let deleteTargetNik = null;


function render() {
  const filtered = rows.filter(r =>
    (!filter.nik || r.nik.includes(filter.nik)) &&
    (!filter.nama || r.namaLengkap.toLowerCase().includes(filter.nama.toLowerCase()))
  );
  const $tbody = $("#tbody").empty();
  if (filtered.length === 0) {
    $tbody.append(`<tr><td colspan="9" class="text-center text-muted py-4">Tidak ada data.</td></tr>`);
    return;
  }
  filtered.forEach((r, i) => {
    $tbody.append(`
      <tr>
        <td>${i + 1}</td>
        <td class="font-monospace small">${escapeHtml(r.nik)}</td>
        <td class="fw-medium">${escapeHtml(r.namaLengkap)}</td>
        <td>${calcUmur(r.tanggalLahir)}</td>
        <td>${escapeHtml(r.tanggalLahir || "-")}</td>
        <td><span class="badge bg-secondary">${r.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}</span></td>
        <td class="truncate" title="${escapeHtml(r.alamat)}">${escapeHtml(r.alamat || "-")}</td>
        <td>${escapeHtml(r.negara)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-info"    data-action="detail" data-nik="${escapeHtml(r.nik)}" title="Detail"><i class="bi bi-eye"></i></button>
          <button class="btn btn-sm btn-outline-primary" data-action="edit"   data-nik="${escapeHtml(r.nik)}" title="Edit"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger"  data-action="delete" data-nik="${escapeHtml(r.nik)}" title="Hapus"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `);
  });
}

// ---------- Form ----------
function openForm(mode, data) {
  $("#mode").val(mode);
  $("#originalNik").val(data?.nik ?? "");
  $("#formTitle").text(mode === "add" ? "Tambah Data" : mode === "edit" ? "Edit Data" : "Detail Data");

  $("#nik").val(data?.nik ?? "").prop("disabled", mode !== "add");
  $("#namaLengkap").val(data?.namaLengkap ?? "");
  $(`input[name="jk"][value="${data?.jenisKelamin ?? "L"}"]`).prop("checked", true);
  $("#tanggalLahir").val(data?.tanggalLahir ?? "");
  $("#alamat").val(data?.alamat ?? "");
  $("#negara").val(data?.negara ?? "Indonesia");

  const readOnly = mode === "detail";
  $("#dataForm :input").not("#mode,#originalNik,#nik,#btnCancel,.btn-close").prop("disabled", readOnly);
  $("#btnSave").toggle(!readOnly);
  $("#btnCancel").text(readOnly ? "Tutup" : "Batal");

  $(".is-invalid").removeClass("is-invalid");
  bootstrap.Modal.getOrCreateInstance(document.getElementById("formModal")).show();
}

function validate() {
  let ok = true;
  const nik = $("#nik").val().trim();
  const nama = $("#namaLengkap").val().trim();
  const mode = $("#mode").val();

  $(".is-invalid").removeClass("is-invalid");

  if (!nik) { $("#nik").addClass("is-invalid"); $("#nikError").text("NIK wajib diisi"); ok = false; }
  else if (!/^\d+$/.test(nik)) { $("#nik").addClass("is-invalid"); $("#nikError").text("NIK harus berupa angka"); ok = false; }
  else if (mode === "add" && rows.some(r => r.nik === nik)) { $("#nik").addClass("is-invalid"); $("#nikError").text("NIK sudah terdaftar"); ok = false; }

  if (!nama) { $("#namaLengkap").addClass("is-invalid"); $("#namaError").text("Nama wajib diisi"); ok = false; }
  return ok;
}

// ---------- Events ----------
$(function () {
  // populate countries
  COUNTRIES.forEach(c => $("#negara").append(`<option value="${c}">${c}</option>`));

  rows = loadAll();
  render();

  $("#btnSearch").on("click", () => {
    filter = { nik: $("#searchNik").val().trim(), nama: $("#searchNama").val().trim() };
    render();
  });
  $("#btnReset").on("click", () => {
    $("#searchNik,#searchNama").val("");
    filter = { nik: "", nama: "" };
    render();
  });
  $("#searchNik").on("input", function(){ this.value = this.value.replace(/\D/g, ""); });
  $("#searchNik,#searchNama").on("keydown", e => { if (e.key === "Enter") $("#btnSearch").click(); });

  $("#nik").on("input", function(){ this.value = this.value.replace(/\D/g, ""); });

  $("#btnAdd").on("click", () => openForm("add", null));

  $("#tbody").on("click", "button[data-action]", function () {
    const action = $(this).data("action");
    const nik = String($(this).data("nik"));
    const row = rows.find(r => r.nik === nik);
    if (!row) return;
    if (action === "detail") openForm("detail", row);
    else if (action === "edit") openForm("edit", row);
    else if (action === "delete") {
      deleteTargetNik = nik;
      $("#deleteName").text(row.namaLengkap);
      bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteModal")).show();
    }
  });

  $("#btnConfirmDelete").on("click", () => {
    const row = rows.find(r => r.nik === deleteTargetNik);
    rows = rows.filter(r => r.nik !== deleteTargetNik);
    saveAll(rows);
    bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
    showToast(`Data ${row?.namaLengkap ?? ""} dihapus`);
    render();
  });

  $("#dataForm").on("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    const mode = $("#mode").val();
    const data = {
      nik: $("#nik").val().trim(),
      namaLengkap: $("#namaLengkap").val().trim(),
      jenisKelamin: $('input[name="jk"]:checked').val(),
      tanggalLahir: $("#tanggalLahir").val(),
      alamat: $("#alamat").val().trim(),
      negara: $("#negara").val(),
    };
    if (mode === "add") {
      rows.push(data);
      showToast("Data berhasil ditambahkan");
    } else if (mode === "edit") {
      rows = rows.map(r => r.nik === data.nik ? data : r);
      showToast("Data berhasil diperbarui");
    }
    saveAll(rows);
    bootstrap.Modal.getInstance(document.getElementById("formModal")).hide();
    render();
  });
});
