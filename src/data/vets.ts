import type { PetSpecies, Review, Vet } from "@/data/types";

const REVIEW_AUTHORS = [
	"Dewi A.",
	"Rizky P.",
	"Maya S.",
	"Bayu N.",
	"Putri H.",
	"Andi W.",
	"Sinta R.",
	"Fajar L.",
	"Nadia K.",
	"Yoga T.",
	"Lia M.",
	"Hendra D.",
	"Citra B.",
	"Dimas F.",
	"Reni S.",
];

const VET_REVIEW_BODIES = [
	{
		title: "Sangat membantu dan ramah",
		body: "Dokternya sabar menjelaskan kondisi hewan saya. Diagnosisnya tepat dan langkah perawatannya mudah diikuti.",
	},
	{
		title: "Profesional dan terpercaya",
		body: "Konsultasi berjalan lancar, dokter memberikan penjelasan detail dan tidak terburu-buru. Kucing saya pulih setelah mengikuti saran beliau.",
	},
	{
		title: "Recommended untuk semua pemilik hewan",
		body: "Sudah konsultasi dua kali dan selalu puas. Dokternya benar-benar paham kondisi hewan saya.",
	},
	{
		title: "Cepat dan akurat",
		body: "Dalam 30 menit masalah anjing saya sudah teridentifikasi. Rekomendasi produknya juga tepat sasaran.",
	},
	{
		title: "Pelayanan terbaik",
		body: "Dokternya responsif, penjelasannya jelas, dan follow-up-nya bagus. Sangat puas dengan konsultasinya.",
	},
	{
		title: "Sangat berpengalaman",
		body: "Pengalaman beliau terasa dari cara diagnosa yang sistematis. Kelinci saya langsung membaik setelah ikuti sarannya.",
	},
];

let vetReviewSeed = 1;

function buildVetReviews(
	count: number,
	petType: PetSpecies,
	baseRating: number,
): Review[] {
	const reviews: Review[] = [];
	for (let i = 0; i < count; i++) {
		const pick =
			VET_REVIEW_BODIES[(i + vetReviewSeed) % VET_REVIEW_BODIES.length];
		const rating =
			baseRating >= 4.8 ? 5 : baseRating >= 4.5 ? (i === count - 1 ? 4 : 5) : 4;
		const month = ((i + vetReviewSeed) % 12) + 1;
		const day = ((i * 7 + vetReviewSeed) % 27) + 1;
		reviews.push({
			id: `vr-${vetReviewSeed}-${i}`,
			author: REVIEW_AUTHORS[(i + vetReviewSeed) % REVIEW_AUTHORS.length],
			petType,
			rating,
			title: pick.title,
			body: pick.body,
			date: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
		});
	}
	vetReviewSeed += 7;
	return reviews;
}

function portrait(unsplashId: string): string {
	return `https://images.unsplash.com/photo-${unsplashId}?auto=format&fit=crop&w=400&q=80`;
}

function todayPlus(days: number): string {
	const d = new Date();
	d.setDate(d.getDate() + days);
	d.setHours(9, 0, 0, 0);
	return d.toISOString();
}

const vetSeeds: Omit<Vet, "reviews">[] = [
	{
		id: "vet-001",
		slug: "siti-rahmawati",
		name: "drh. Siti Rahmawati",
		credential: "drh., M.Sc",
		photoUrl: portrait("1494790108377-be9c29b29330"),
		specialties: ["general", "nutrition"],
		species: ["dog", "cat", "rabbit"],
		languages: ["Bahasa Indonesia", "English"],
		bio: "Dokter hewan dengan pengalaman lebih dari 10 tahun di bidang nutrisi dan kesehatan umum hewan kesayangan. Lulusan Fakultas Kedokteran Hewan IPB dengan gelar master dari Universitas Utrecht, Belanda. Berfokus pada pencegahan penyakit melalui pola makan yang tepat.",
		yearsExperience: 10,
		rating: 4.9,
		reviewCount: 127,
		consultFee: 150000,
		nextAvailable: todayPlus(0),
	},
	{
		id: "vet-002",
		slug: "budi-santoso",
		name: "drh. Budi Santoso",
		credential: "drh., Sp.KH",
		photoUrl: portrait("1612349317150-e413f6a5b16d"),
		specialties: ["surgery", "general"],
		species: ["dog", "cat"],
		languages: ["Bahasa Indonesia"],
		bio: "Spesialis bedah hewan bersertifikat dengan keahlian dalam prosedur ortopedi dan bedah jaringan lunak. Telah menangani lebih dari 500 kasus operasi selama karier 12 tahun. Aktif mengajar di Universitas Gadjah Mada sebagai dosen tamu.",
		yearsExperience: 12,
		rating: 4.8,
		reviewCount: 98,
		consultFee: 200000,
		nextAvailable: todayPlus(1),
	},
	{
		id: "vet-003",
		slug: "anisa-pertiwi",
		name: "drh. Anisa Pertiwi",
		credential: "drh., M.Vet",
		photoUrl: portrait("1594744803329-e58b31de8bf5"),
		specialties: ["dermatology", "general"],
		species: ["dog", "cat", "rabbit"],
		languages: ["Bahasa Indonesia", "English"],
		bio: "Spesialis dermatologi hewan dengan minat khusus pada alergi dan penyakit kulit kronis. Menyelesaikan fellowship dermatologi hewan di Royal Veterinary College London. Berkomitmen membantu hewan kesayangan tampil sehat dari luar dan dalam.",
		yearsExperience: 8,
		rating: 4.9,
		reviewCount: 84,
		consultFee: 175000,
		nextAvailable: todayPlus(0),
	},
	{
		id: "vet-004",
		slug: "rahmat-hidayat",
		name: "drh. Rahmat Hidayat",
		credential: "drh.",
		photoUrl: portrait("1507003211169-0a1dd7228f2d"),
		specialties: ["behavior", "general"],
		species: ["dog", "cat", "bird", "rabbit"],
		languages: ["Bahasa Indonesia"],
		bio: "Dokter hewan yang fokus pada perilaku dan kesejahteraan hewan. Membantu pemilik memahami bahasa tubuh dan kebutuhan psikologis hewan peliharaan mereka. Konselor perilaku bersertifikat dengan pengalaman 7 tahun menangani kasus agresi dan kecemasan.",
		yearsExperience: 7,
		rating: 4.7,
		reviewCount: 62,
		consultFee: 120000,
		nextAvailable: todayPlus(0),
	},
	{
		id: "vet-005",
		slug: "maya-kusuma",
		name: "drh. Maya Kusuma",
		credential: "drh., Ph.D",
		photoUrl: portrait("1573496359142-b8d87734a5a2"),
		specialties: ["exotic", "general"],
		species: ["bird", "rabbit", "fish", "other"],
		languages: ["Bahasa Indonesia", "English", "Mandarin"],
		bio: "Dokter hewan hewan eksotis dengan gelar doktor dalam bidang zoologi hewan liar dari Universitas Airlangga. Telah merawat lebih dari 200 spesies berbeda termasuk reptil, burung langka, dan mamalia kecil. Penulis buku panduan perawatan hewan eksotis di Indonesia.",
		yearsExperience: 9,
		rating: 4.8,
		reviewCount: 73,
		consultFee: 180000,
		nextAvailable: todayPlus(1),
	},
	{
		id: "vet-006",
		slug: "dian-pramesti",
		name: "drh. Dian Pramesti",
		credential: "drh., M.Sc",
		photoUrl: portrait("1580489944761-15a19d654956"),
		specialties: ["dental", "general"],
		species: ["dog", "cat"],
		languages: ["Bahasa Indonesia", "English"],
		bio: "Spesialis kesehatan gigi dan mulut hewan dengan pelatihan khusus dari Japan Veterinary Dental Society. Percaya bahwa kesehatan gigi adalah fondasi kesehatan menyeluruh hewan kesayangan. Aktif mengkampanyekan perawatan gigi rutin untuk hewan peliharaan di Indonesia.",
		yearsExperience: 6,
		rating: 4.7,
		reviewCount: 45,
		consultFee: 130000,
		nextAvailable: todayPlus(0),
	},
	{
		id: "vet-007",
		slug: "fariz-abdurrahman",
		name: "drh. Fariz Abdurrahman",
		credential: "drh., M.Vet",
		photoUrl: portrait("1472099645785-5658abf4ff4e"),
		specialties: ["general", "nutrition", "behavior"],
		species: ["dog", "cat", "rabbit", "fish"],
		languages: ["Bahasa Indonesia"],
		bio: "Dokter hewan praktik umum dengan pengalaman luas di klinik hewan urban Jakarta. Dikenal dengan pendekatan holistik yang mempertimbangkan nutrisi, perilaku, dan lingkungan secara bersamaan. Telah melayani lebih dari 1.000 pasien hewan dalam 9 tahun karier.",
		yearsExperience: 9,
		rating: 4.6,
		reviewCount: 156,
		consultFee: 90000,
		nextAvailable: todayPlus(0),
	},
	{
		id: "vet-008",
		slug: "linda-oktavia",
		name: "drh. Linda Oktavia",
		credential: "drh., Sp.KH",
		photoUrl: portrait("1534528741775-53994a69daeb"),
		specialties: ["general", "dermatology", "nutrition"],
		species: ["dog", "cat", "rabbit"],
		languages: ["Bahasa Indonesia", "English"],
		bio: "Dokter hewan spesialis dengan keahlian di bidang dermatologi dan nutrisi klinis. Memperoleh spesialisasi dari Universitas Udayana Bali. Berkomitmen memberikan konsultasi yang menenangkan dan berbasis bukti ilmiah untuk setiap pemilik hewan yang datang dengan kekhawatiran.",
		yearsExperience: 11,
		rating: 4.9,
		reviewCount: 112,
		consultFee: 160000,
		nextAvailable: todayPlus(0),
	},
];

const VET_PET_TYPES: PetSpecies[] = ["dog", "cat", "rabbit", "bird"];

export const vets: Vet[] = vetSeeds.map((seed, idx) => ({
	...seed,
	reviews: buildVetReviews(
		4 + (idx % 3),
		VET_PET_TYPES[idx % VET_PET_TYPES.length],
		seed.rating,
	),
}));

export function getAllVets(): Vet[] {
	return vets;
}

export function getVetById(id: string): Vet | undefined {
	return vets.find((v) => v.id === id);
}

export function getVetBySlug(slug: string): Vet | undefined {
	return vets.find((v) => v.slug === slug);
}
