# CLAUDE CODE PROMPT — Transformasi PetSehat: Ecommerce Produk → Telehealth Booking

> Paste seluruh isi file ini sebagai pesan pertama di Claude Code (VS Code), di dalam folder repo `vet-ecommerce`.

---

## PERAN & MISI

Kamu mentransformasi **PetSehat** dari toko produk hewan (jual makanan, produk kesehatan, supplies) menjadi **platform telehealth hewan** — tempat pemilik hewan yang sedang khawatir memesan konsultasi video dengan dokter hewan berlisensi (mirip Vetster / Dutch). Brand dan design system tetap. Yang berubah adalah **model transaksi**: dari "beli barang" menjadi "booking waktu & keahlian dokter".

Pembelinya adalah **pemilik hewan yang sedang cemas di momen khawatir**, bukan pembeli santai. Setiap keputusan UX harus menenangkan, cepat, dan membangun kepercayaan — bukan ramai dan penuh distraksi.

---

## ATURAN WAJIB (BACA SEBELUM MENULIS KODE)

Ini repo dengan kontrak ketat. **Patuhi `AGENTS_CONTRACT.md` dan `CLAUDE.md` secara penuh.** Ringkasan aturan yang tidak boleh dilanggar:

1. **Skill wajib:** Sebelum membangun atau merapikan UI apa pun, **invoke `/design-taste-frontend` (taste skill)**. Untuk setiap interaksi beranimasi, invoke `/web-animation-design`. Ini non-negotiable — menjaga output keluar dari "AI slop". Terapkan **taste skill** (judgment desain, intensionalitas, hierarki visual) dan **impeccable skill** (kualitas eksekusi, nol broken state, konsistensi) di seluruh pekerjaan.
2. **Frontend-only mock.** Tidak ada network request. Semua data statis di `src/data/`. Semua state mutable lewat `localStorage` (SSR-safe — pakai pola `safeGet`/`safeSet` dari `src/lib/storage.ts`).
3. **TypeScript strict.** `import type` untuk type-only import (`verbatimModuleSyntax`). Tidak ada `any`, tidak ada unused locals/params.
4. **Biome:** indent **tabs**, **double quotes**. Jalankan `pnpm check` sebelum selesai. **JANGAN** sentuh `src/routeTree.gen.ts` (auto-generated) atau token desain di `src/styles.css`.
5. **shadcn/ui (Base UI, new-york) untuk semua primitive interaktif.** Tambah komponen via `pnpm dlx shadcn@latest add <name>`. Jangan bikin headless primitive sendiri kalau shadcn sudah menyediakan (sudah ada: accordion, alert-dialog, avatar, badge, breadcrumb, button, card, checkbox, dialog, dropdown-menu, input, label, radio-group, select, separator, sheet, skeleton, slider, sonner, tabs, textarea, tooltip).
6. **Design token saja.** Pakai kelas Tailwind yang mapped ke token di `styles.css` (`bg-primary`, `text-accent-foreground`, `bg-card`, `border-border`, `font-display`, dll). Coral primary + honey-yellow accent + warm off-white. **Jangan skema grayscale flat.** Headline pakai `font-display` (Fraunces); body pakai Geist.
7. **Bahasa UI: Bahasa Indonesia.** Harga format `Rp 150.000` (integer rupiah, pakai `formatIDR` dari `src/lib/format.ts`).
8. **Larangan copywriting:** JANGAN pakai em-dash `—` atau hyphen `-` sebagai penghubung kalimat di UI copy. Tulis kalimat utuh.
9. **Responsif 360px → 1440px+.** Mobile single-column. Touch target ≥ 44px. Tidak ada aksi hover-only.
10. **Aksesibilitas WCAG AA:** HTML semantik, ARIA label pada icon button, keyboard reachable, alt text deskriptif pada gambar.
11. **Analytics:** panggil `track()` dari `src/lib/analytics.ts` di setiap interaksi penting (lihat pola di `src/context/cart.tsx`).
12. **Path alias:** import pakai `@/...` (= `src/`).
13. **Pola context:** ikuti persis pola di `src/context/cart.tsx` — `createContext`, hydrate dari storage di `useEffect` mount, `safeSet` saat berubah, guard `hydrated`. Daftarkan provider baru di `src/context/providers.tsx`.

---

## STEP 0 — EKSPLORASI (lakukan dulu, sebelum mengubah apa pun)

1. Baca `AGENTS_CONTRACT.md`, `CLAUDE.md`, `PRD.html`, dan `src/data/types.ts` secara lengkap.
2. Baca `src/context/cart.tsx`, `src/context/pet-profile.tsx`, `src/context/providers.tsx`, `src/lib/storage.ts`, `src/lib/format.ts`, `src/lib/analytics.ts`, `src/lib/ids.ts`.
3. Baca `src/components/advice/symptom-checker.tsx` dan `src/data/symptom-tree.ts` — kita akan pakai ulang untuk triage.
4. Baca `src/routes/product/$slug.tsx` (product detail eksisting) dan `src/components/layout/site-header.tsx`.
5. Laporkan ringkasan singkat temuan dan rencana eksekusimu sebelum lanjut. **Tunggu konfirmasi.**

---

## STEP 1 — DATA LAYER: ENTITAS DOKTER (VET)

Buat tipe baru di `src/data/types.ts` (tambahkan, jangan hapus tipe lama — produk lama tetap dipakai untuk handoff rekomendasi).

```ts
export type VetSpecialty = "general" | "dermatology" | "nutrition" | "behavior" | "surgery" | "exotic" | "dental";
export type ConsultStatus = "scheduled" | "waiting" | "live" | "ended" | "cancelled";
export type SlotStatus = "available" | "booked" | "blocked";

export interface Vet {
	id: string;
	slug: string;
	name: string;            // "drh. Siti Rahmawati"
	credential: string;      // "drh., M.Sc"
	photoUrl: string;        // Unsplash portrait
	specialties: VetSpecialty[];
	species: PetSpecies[];   // hewan yang ditangani
	languages: string[];     // ["Bahasa Indonesia", "English"]
	bio: string;
	yearsExperience: number;
	rating: number;          // 4.0 - 5.0
	reviewCount: number;
	consultFee: number;      // integer rupiah per sesi
	reviews: Review[];       // pakai ulang tipe Review yang ada
	nextAvailable: string;   // ISO, untuk badge "tersedia hari ini"
}

export interface TimeSlot {
	id: string;              // `${vetId}-${dateISO}-${time}`
	vetId: string;
	date: string;            // "YYYY-MM-DD"
	time: string;            // "09:00"
	status: SlotStatus;
}

export interface SymptomIntake {
	petProfileId: string | null;  // null jika isi cepat tanpa simpan profil
	concern: string;              // keluhan utama, free text
	durationDays: number;
	symptomNodeId?: string;       // hasil dari symptom-tree bila dipakai
	urgency: "routine" | "soon" | "urgent";
	photoDataUrls: string[];      // 0-3 foto (base64 di localStorage, mock)
}

export interface Consultation {
	id: string;              // "CS-YYYYMMDD-XXXXX"
	vetId: string;
	vetName: string;
	vetPhotoUrl: string;
	slot: TimeSlot;
	intake: SymptomIntake;
	status: ConsultStatus;
	createdAt: string;
	fee: number;
	paymentMethodId: string;
	notes?: ConsultNote;     // diisi setelah konsultasi selesai
}

export interface ConsultNote {
	summary: string;
	diagnosis: string;
	recommendations: string;
	prescribedProductIds: string[];  // sambung ke produk eksisting
	followUpInDays: number | null;
	issuedAt: string;
}
```

Buat `src/data/vets.ts`: **minimal 8 dokter** dengan data realistis Indonesia (nama `drh. ...`, spesialisasi variatif, bahasa, rating, fee misal `Rp 90.000`–`Rp 250.000`, foto Unsplash portrait, 3-6 review per dokter pakai tipe `Review`). Sediakan helper `getVetBySlug`, `getVetById`, `getAllVets`, mengikuti pola `src/data/products.ts`.

Buat `src/data/slots.ts`: generator slot deterministik untuk 14 hari ke depan per dokter (jam kerja 09:00-17:00, interval 1 jam). Tandai ~40% slot sebagai `"booked"` dengan pola realistis (blok berurutan, bukan acak). Ekspor `getSlotsForVet(vetId)` dan `getSlotsForVetOnDate(vetId, dateISO)`.

---

## STEP 2 — STATE: BOOKING FLOW (PENGGANTI CART) & RIWAYAT KONSULTASI

Buat `src/context/booking.tsx` — context untuk **draft booking yang sedang berjalan** (ini yang menggantikan peran cart, tapi single-item / single-consult, bukan keranjang multi-item). Ikuti pola `cart.tsx` persis.

State draft:
```ts
{
	vetId: string | null;
	selectedSlot: TimeSlot | null;
	intake: SymptomIntake | null;
	setVet, selectSlot, setIntake, clearDraft,
	isSlotStillAvailable(slot): boolean,   // cek konflik terhadap slots.ts + konsultasi tersimpan
}
```

Buat `src/context/consultations.tsx` — riwayat konsultasi tersimpan (mirip `orders.tsx`). Simpan ke `localStorage`. Fungsi: `book(draft, paymentMethodId)` → buat `Consultation` status `"scheduled"`, `cancel(id)`, `reschedule(id, newSlot)`, `addNote(id, note)`, plus selector `getById`, `upcoming`, `past`. Saat `book`, tandai slot terkait jadi tidak tersedia (cek konflik).

Tambahkan `STORAGE_KEYS.bookingDraft` dan `STORAGE_KEYS.consultations` di `src/lib/storage.ts`. Daftarkan `BookingProvider` dan `ConsultationsProvider` di `providers.tsx` (urutan: setelah `PetProfileProvider`, karena triage butuh profil hewan).

Panggil `track()` di: `select_slot`, `start_intake`, `book_consultation`, `cancel_consultation`, `reschedule_consultation`.

---

## STEP 3 — CHALLENGE 2: PRODUK → PRAKTISI (Profil Dokter & Direktori)

**3a. Direktori dokter** — route baru `src/routes/vets/index.tsx` (dan jadikan ini landing utama booking). Grid kartu dokter. Buat komponen:
- `src/components/vet/vet-card.tsx` — foto, nama+credential, badge spesialisasi, `rating-stars` (pakai ulang `src/components/product/rating-stars.tsx`), bahasa, fee, badge "Tersedia hari ini" bila `nextAvailable` hari ini.
- `src/components/vet/specialty-badge.tsx` — badge spesialisasi pakai `Badge` shadcn + token warna.
- Filter berdasarkan spesialisasi & species (pakai ulang pola `src/components/catalog/filter-chips.tsx`).

**3b. Profil dokter** — route baru `src/routes/vet/$slug.tsx` (paralel dengan `product/$slug.tsx` lama). Arsitektur halaman:
- Header: foto, nama, credential, rating, tahun pengalaman, bahasa, spesialisasi.
- Tab (shadcn `tabs`): "Tentang", "Ulasan" (pakai ulang `review-list.tsx`), "Jadwal".
- Tab Jadwal menampilkan `<AvailabilityPicker vetId=... />` (Step 4).
- CTA utama lengket (sticky di mobile): **"Pilih Jadwal Konsultasi"** (pengganti "Tambah ke Keranjang"). Saat slot dipilih → lanjut ke triage.

Terapkan **taste skill**: profil harus membangun kepercayaan cepat — hierarki jelas (nama & kredibilitas dominan), rating menonjol, foto profesional. Bukan tampilan padat seperti kartu produk.

---

## STEP 4 — CHALLENGE 1: PILIH SLOT (PENGGANTI ADD-TO-CART)

Buat `src/components/booking/availability-picker.tsx`.

Perilaku:
- Pemilih tanggal horizontal (14 hari ke depan, hari ini di kiri).
- Setelah pilih tanggal, tampilkan grid slot jam (pakai `getSlotsForVetOnDate`).
- Tiap slot: `available` (bisa diklik, token netral/teal), `booked` (disabled, muted, dicoret), terpilih (token primary coral).
- Tombol "Lanjutkan" aktif hanya setelah satu slot dipilih → simpan ke `booking` draft (`selectSlot`) lalu navigasi ke triage.
- Empty state bila satu hari penuh terisi: ajak pilih tanggal lain (jangan layar kosong).

Terapkan **taste skill**: ini inti transaksi. Transisi antar tanggal halus (200-300ms via `tw-animate-css`). Slot terpilih jelas dominan. **impeccable skill**: tidak ada slot yang bisa dipilih ganda; konflik dicek real-time terhadap konsultasi tersimpan.

---

## STEP 5 — CHALLENGE 3: TRIAGE SEBELUM BOOKING (gerbang yang menenangkan)

Route baru `src/routes/booking/intake.tsx` (hanya bisa diakses jika draft punya `vetId` + `selectedSlot`; kalau tidak, redirect ke profil dokter).

Multi-step, pakai pola `checkout-steps.tsx`. Langkah:
1. **Pilih hewan** — daftar `PetProfile` yang ada (pakai ulang `usePetProfiles`), atau "isi cepat" (nama, species, umur) tanpa wajib simpan. Pakai ulang `pet-profile-form.tsx`/`quick-profile-modal.tsx` bila cocok.
2. **Keluhan & gejala** — free text keluhan + durasi (hari) + tingkat urgensi (radio: rutin / segera / mendesak). Opsional: tombol "Bantu saya jelaskan" yang membuka `symptom-checker.tsx` eksisting dan menyimpan `symptomNodeId`.
3. **Foto (mock)** — 3 kotak upload. Pakai `FileReader` → simpan `dataURL` ke draft (mock, tetap di localStorage). Beri tahu "Foto membantu dokter menilai lebih cepat". Foto opsional, bukan penghalang.
4. **Ringkasan** → tombol "Lanjut ke Pembayaran".

Terapkan **taste skill** — ini titik paling rawan secara emosional. Copy menenangkan ("Ceritakan yang kamu khawatirkan, dokter akan membantu"), progress bar terlihat, satu pertanyaan fokus per layar di mobile, tidak ada peringatan menakutkan. Simpan ke draft via `setIntake`.

---

## STEP 6 — CHECKOUT KONSULTASI (adaptasi checkout eksisting)

Route baru `src/routes/booking/confirm.tsx` (atau adaptasi pola `src/routes/checkout.tsx`). Bukan alamat pengiriman/kurir, melainkan:
- Ringkasan: dokter + slot (tanggal & jam) + ringkasan keluhan + hewan.
- Pilih metode pembayaran (pakai ulang `payment-method-select.tsx` + `payments.ts`).
- Biaya: `consultFee` dokter (pakai `formatIDR`).
- Tombol "Konfirmasi & Bayar" → panggil `consultations.book(...)`, set slot jadi booked, navigasi ke success.
- Success: `src/routes/booking/success.tsx` — nomor konsultasi (pakai `ids.ts`), info "Masuk ruang tunggu 5 menit sebelum jadwal", tombol ke detail konsultasi. Pakai ulang pola `checkout/success.tsx`.

---

## STEP 7 — CHALLENGE 4: SIKLUS HIDUP KONSULTASI

**7a. Daftar konsultasi** — route `src/routes/account/consultations/index.tsx` (paralel dengan `account/orders`). Dua bagian: "Akan datang" dan "Riwayat". Tiap baris: dokter, tanggal/jam, status badge. Tambah link "Konsultasi" di akun & header.

**7b. Detail + lifecycle** — route `src/routes/account/consultations/$consultId.tsx`. Tampilan tergantung status:
- `scheduled`: detail jadwal + tombol **Jadwalkan ulang** (buka `availability-picker` lagi → `reschedule`) + **Batalkan** (shadcn `alert-dialog` konfirmasi → `cancel`). Hitung mundur ke jadwal.
- `waiting`: layar **ruang tunggu** menenangkan — "Dokter akan segera bergabung", animasi halus, ringkasan keluhan terlihat, tombol "Masuk ke konsultasi". (Aktifkan state `waiting` bila waktu sekarang dalam 5 menit sebelum slot — boleh disimulasikan dengan tombol demo "Simulasikan waktu konsultasi" untuk keperluan presentasi.)
- `live`: UI panggilan video **mock** — area video placeholder, kontrol mic/kamera (UI saja, non-fungsional), panel chat sederhana opsional, tombol "Akhiri konsultasi" → set `ended`.
- `ended`: arahkan ke handoff (Step 8).

Buat komponen `src/components/booking/consult-status-badge.tsx` (pola `order-status-badge.tsx`) dan `src/components/booking/waiting-room.tsx`.

Terapkan **impeccable skill**: tiap status punya tampilan & aksi terdefinisi, tidak ada dead-end. **taste skill**: ruang tunggu menenangkan, reschedule/cancel terasa mudah supaya user tidak merasa terjebak.

---

## STEP 8 — CHALLENGE 5: HANDOFF HASIL (catatan dokter + resep)

Pada konsultasi status `ended`, tampilkan **kartu hasil konsultasi** di halaman detail (dan mock-isi `ConsultNote` saat konsultasi diakhiri, supaya presentasi punya data):
- Ringkasan, diagnosis, rekomendasi dokter (teks).
- **Produk yang direkomendasikan** — render `prescribedProductIds` sebagai `product-card.tsx` eksisting, dengan tombol "Tambah ke Keranjang" yang memakai `useCart` lama. **Inilah jembatan kembali ke ecommerce** (produk lama tidak dibuang, justru jadi muara natural).
- Tombol "Unduh ringkasan" (mock, non-fungsional atau window.print) dan "Jadwalkan tindak lanjut" bila `followUpInDays` ada → buka availability-picker dokter yang sama.

Buat `src/components/booking/consult-notes-card.tsx`. Terapkan **taste skill**: hasil terasa seperti rangkuman medis yang tepercaya dan menenangkan, bukan struk belanja.

---

## STEP 9 — NAVIGASI, HOME, & PEMBINGKAIAN ULANG

- Update `src/components/layout/site-header.tsx` & `mobile-nav.tsx`: nav utama jadi **"Cari Dokter"** (→ `/vets`), **"Konsultasi Saya"** (→ `/account/consultations`), pertahankan "Produk" & cart (untuk handoff), "Advice". Badge cart tetap.
- Update `src/routes/index.tsx` (home): hero diarahkan ke booking konsultasi ("Khawatir dengan hewanmu? Konsultasi dengan dokter hewan hari ini"), CTA utama "Cari Dokter". Pertahankan trust-band & advice. Pakai ulang `hero.tsx`, sesuaikan copy (tanpa em-dash).
- Pastikan alur lengkap berfungsi: home → /vets → /vet/$slug → pilih slot → /booking/intake → /booking/confirm → /booking/success → /account/consultations/$id (scheduled → waiting → live → ended → handoff).

---

## STANDAR TASTE SKILL (terapkan di SETIAP komponen)

1. Hierarki tipografi disengaja: nama dokter & kredibilitas, jadwal, dan status konsultasi harus dominan; info sekunder jelas subordinat.
2. Warna semantik via token: tersedia = tenang, booked/disabled = muted, urgensi/deadline = eskalasi terkontrol, sukses = aksen positif. Jangan grayscale flat.
3. Empty state didesain: belum ada konsultasi, hari penuh terisi, belum ada profil hewan — semua punya copy & visual, bukan layar kosong.
4. Transisi halus 200-300ms untuk pergantian tanggal, langkah triage, dan perubahan status.
5. Copy fashion-forward versi medis-menenangkan: "Pilih Jadwal Konsultasi", "Masuk Ruang Tunggu", "Konfirmasi & Bayar". Hindari bahasa ecommerce generik. Tanpa em-dash/hyphen penghubung.

## STANDAR IMPECCABLE SKILL

1. TypeScript strict, semua tipe baru terdefinisi, tidak ada `any`, `import type` untuk type-only.
2. Tiap komponen baru di file sendiri, penamaan konsisten dengan konvensi repo (kebab-case file).
3. Tidak ada broken state: setiap interaksi punya outcome; guard redirect bila draft tidak lengkap.
4. Responsif 360-1440px, touch target ≥ 44px, keyboard navigable, ARIA pada icon button.
5. `pnpm check` lulus (Biome) dan `pnpm dev` jalan tanpa error console di semua rute.
6. SSR-safe: semua akses `localStorage` lewat `safeGet`/`safeSet`, guard `hydrated`.

---

## URUTAN EKSEKUSI (konfirmasi tiap fase sebelum lanjut)

1. ✅ Eksplorasi + laporan rencana (Step 0)
2. ✅ Data layer: types, vets.ts, slots.ts (Step 1)
3. ✅ State: booking.tsx, consultations.tsx, daftarkan provider (Step 2)
4. ✅ Direktori & profil dokter (Step 3)
5. ✅ Availability picker (Step 4)
6. ✅ Triage intake (Step 5)
7. ✅ Checkout konsultasi + success (Step 6)
8. ✅ Lifecycle konsultasi: list, detail, waiting, live (Step 7)
9. ✅ Handoff hasil + resep (Step 8)
10. ✅ Navigasi, home, pembingkaian ulang (Step 9)
11. ✅ Final: `pnpm check`, `pnpm dev`, telusuri seluruh alur, perbaiki error

---

## CHECKLIST VERIFIKASI AKHIR

- [ ] /vets menampilkan direktori dokter dengan filter
- [ ] /vet/$slug menampilkan profil + tab jadwal + availability picker
- [ ] Pilih slot → simpan draft → masuk triage (slot booked tidak bisa dipilih)
- [ ] Triage multi-step: pilih hewan, keluhan, foto mock, ringkasan
- [ ] Checkout konsultasi: metode bayar, fee benar, konfirmasi → success
- [ ] /account/consultations: upcoming & past tampil
- [ ] Detail konsultasi: scheduled (reschedule/cancel), waiting room, live mock, ended
- [ ] Handoff: catatan dokter + produk rekomendasi yang bisa masuk cart lama
- [ ] Header/home sudah diarahkan ke booking; cart tetap untuk handoff
- [ ] Tanpa em-dash/hyphen di UI copy; semua Bahasa Indonesia; harga `Rp ...`
- [ ] `pnpm check` lulus; tanpa error console; responsif mobile→desktop

---

*Submission challenge mentor. Patuhi AGENTS_CONTRACT.md & CLAUDE.md. Invoke /design-taste-frontend (taste skill) sebelum tiap UI dan /web-animation-design untuk animasi. Terapkan taste skill (judgment desain) & impeccable skill (kualitas eksekusi, nol broken state) menyeluruh. Jangan sentuh routeTree.gen.ts dan token di styles.css.*
