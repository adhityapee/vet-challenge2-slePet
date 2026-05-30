import type { Guide } from "@/data/types";

export const guides: Guide[] = [
	{
		id: "g-001",
		slug: "makanan-terbaik-anjing-senior",
		title: "Makanan Terbaik untuk Anjing Senior",
		vetAuthor: {
			name: "drh. Bagus Santoso",
			credential: "Dokter Hewan, Spesialis Geriatri",
		},
		intro:
			"Anjing senior butuh makanan yang lebih mudah dicerna, rendah kalori, dan mendukung kesehatan sendi. Berikut pilihan yang sering kami sarankan di klinik.",
	},
	{
		id: "g-002",
		slug: "memulai-anak-kucing-makan-padat",
		title: "Memulai Anak Kucing Makan Makanan Padat",
		vetAuthor: {
			name: "drh. Anika Putri",
			credential: "Dokter Hewan, Klinik Sehat Bersama",
		},
		intro:
			"Masa transisi dari susu ke makanan padat penting dilakukan bertahap. Mulai dari tekstur lembut sebelum beralih ke pakan kering khusus anak kucing.",
	},
	{
		id: "g-003",
		slug: "paket-perawatan-kutu-dan-caplak",
		title: "Paket Lengkap Perawatan Kutu dan Caplak",
		vetAuthor: {
			name: "drh. Citra Lestari",
			credential: "Dokter Hewan, Klinik Hewan Nusantara",
		},
		intro:
			"Mengatasi kutu butuh kombinasi pengobatan dan kebersihan. Kami merangkum produk yang saling melengkapi untuk hasil yang menyeluruh.",
	},
	{
		id: "g-004",
		slug: "kebutuhan-dasar-kelinci-baru",
		title: "Kebutuhan Dasar untuk Kelinci yang Baru Diadopsi",
		vetAuthor: {
			name: "drh. Citra Lestari",
			credential: "Dokter Hewan, Klinik Hewan Nusantara",
		},
		intro:
			"Menyambut kelinci baru jadi lebih mudah dengan perlengkapan yang tepat. Ini daftar dasar yang membuat kelinci nyaman sejak hari pertama.",
	},
	{
		id: "g-005",
		slug: "rutinitas-perawatan-gigi-di-rumah",
		title: "Rutinitas Perawatan Gigi di Rumah",
		vetAuthor: {
			name: "drh. Anika Putri",
			credential: "Dokter Hewan, Klinik Sehat Bersama",
		},
		intro:
			"Merawat gigi hewan di rumah tidak harus rumit. Dengan beberapa alat sederhana, Anda bisa mencegah masalah gigi yang mahal di kemudian hari.",
	},
];

export function getGuideBySlug(slug: string): Guide | undefined {
	return guides.find((g) => g.slug === slug);
}

