export type PetSpecies = "dog" | "cat" | "rabbit" | "bird" | "fish" | "other";
export type Lifestage = "puppy_kitten" | "junior" | "adult" | "senior"; // 0-12, 13-24, 25-84, 85+ months
export type Sex = "male" | "female" | "unknown";
export type TriState = "yes" | "no" | "unknown";

export interface Review {
	id: string;
	author: string;
	petType: PetSpecies;
	rating: number; // 1-5
	title?: string;
	body: string;
	date: string; // ISO yyyy-mm-dd
	photoUrl?: string;
}

export interface PetProfile {
	id: string;
	name: string;
	species: PetSpecies;
	breed?: string;
	ageMonths: number;
	weightKg?: number;
	sex: Sex;
	neutered: TriState;
	healthNotes?: string; // max 500 chars
	createdAt: string;
}

export type ArticleTopic = "nutrition" | "preventive" | "symptoms" | "breed";
export interface Article {
	id: string;
	slug: string;
	title: string;
	topic: ArticleTopic;
	vetAuthor: { name: string; credential: string };
	readMinutes: number;
	publishedAt: string; // ISO
	petTypes: PetSpecies[];
	coverImage: string;
	excerpt: string;
	body: string; // markdown-ish; render paragraphs split on blank lines
}

export interface Guide {
	id: string;
	slug: string;
	title: string;
	vetAuthor: { name: string; credential: string };
	intro: string;
}

// Symptom checker decision tree
export interface SymptomOutcome {
	assessment: string;
	seeVet: "yes" | "no" | "maybe";
}
export interface SymptomNode {
	id: string;
	label: string;
	children?: SymptomNode[];
	outcome?: SymptomOutcome; // terminal nodes have outcome
}
export interface SymptomTree {
	// keyed by species; each species has body-area nodes
	[species: string]: SymptomNode[];
}

export interface Address {
	id: string;
	label: "home" | "office" | "other";
	recipient: string;
	phone: string;
	street: string;
	kelurahan: string;
	kecamatan: string;
	city: string;
	province: string;
	postalCode: string;
	isDefault: boolean;
}

export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	addresses: Address[];
}

export type PaymentMethodId = "gopay" | "ovo" | "dana" | "qris" | "va";
export interface PaymentMethod {
	id: PaymentMethodId;
	name: string;
	description: string;
	kind: "ewallet" | "qris" | "va";
}

// ─── Telehealth / Vet Consultation ───────────────────────────────────────────

export type VetSpecialty =
	| "general"
	| "dermatology"
	| "nutrition"
	| "behavior"
	| "surgery"
	| "exotic"
	| "dental";

export type ConsultStatus =
	| "scheduled"
	| "waiting"
	| "live"
	| "ended"
	| "cancelled";

export type SlotStatus = "available" | "booked" | "blocked";

export interface Vet {
	id: string;
	slug: string;
	name: string; // "drh. Siti Rahmawati"
	credential: string; // "drh., M.Sc"
	photoUrl: string; // Unsplash portrait
	specialties: VetSpecialty[];
	species: PetSpecies[]; // hewan yang ditangani
	languages: string[]; // ["Bahasa Indonesia", "English"]
	bio: string;
	yearsExperience: number;
	rating: number; // 4.0 - 5.0
	reviewCount: number;
	consultFee: number; // integer rupiah per sesi
	reviews: Review[];
	nextAvailable: string; // ISO, untuk badge "tersedia hari ini"
}

export interface TimeSlot {
	id: string; // `${vetId}-${dateISO}-${time}`
	vetId: string;
	date: string; // "YYYY-MM-DD"
	time: string; // "09:00"
	status: SlotStatus;
}

export interface SymptomIntake {
	petProfileId: string | null; // null jika isi cepat tanpa simpan profil
	petName: string;
	petSpecies: PetSpecies;
	concern: string; // keluhan utama, free text
	durationDays: number;
	symptomNodeId?: string; // hasil dari symptom-tree bila dipakai
	urgency: "routine" | "soon" | "urgent";
	photoDataUrls: string[]; // 0-3 foto (base64 di localStorage, mock)
}

export interface Consultation {
	id: string; // "CS-YYYYMMDD-XXXXX"
	vetId: string;
	vetName: string;
	vetPhotoUrl: string;
	slot: TimeSlot;
	intake: SymptomIntake;
	status: ConsultStatus;
	createdAt: string;
	fee: number;
	paymentMethodId: string;
	notes?: ConsultNote; // diisi setelah konsultasi selesai
}

export interface ConsultNote {
	summary: string;
	diagnosis: string;
	recommendations: string;
	followUpInDays: number | null;
	issuedAt: string;
}
