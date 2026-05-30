export type PetSpecies = "dog" | "cat" | "rabbit" | "bird" | "fish" | "other";
export type Lifestage = "puppy_kitten" | "junior" | "adult" | "senior"; // 0-12, 13-24, 25-84, 85+ months
export type CategorySlug = "food" | "health" | "supplies";
export type Sex = "male" | "female" | "unknown";
export type TriState = "yes" | "no" | "unknown";

export interface VetNote {
	text: string;
	vetName: string;
	credential: string;
}

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

export interface Product {
	id: string;
	slug: string; // url-safe, unique
	name: string;
	brand: string;
	category: CategorySlug;
	subcategory: string; // matches a Category.subcategories[].slug
	description: string;
	petTypes: PetSpecies[];
	lifestages: Lifestage[];
	price: number; // INTEGER RUPIAH. 150000 => "Rp 150.000". No cents.
	compareAtPrice?: number; // optional original price for discount display
	images: string[]; // Unsplash URLs, first = primary
	specs: Record<string, string>;
	ingredients?: string;
	rating: number; // aggregate, e.g. 4.6
	reviewCount: number;
	reviews: Review[]; // 4-8 per product
	vetNote?: VetNote;
	vetRecommended: boolean;
	subscriptionEligible: boolean;
	frequentlyBoughtTogether: string[]; // product ids
	stockStatus: "in_stock" | "low_stock";
	createdAt: string; // ISO, for "newest" sort
}

export interface Category {
	slug: CategorySlug;
	name: string; // Bahasa Indonesia label
	tagline: string;
	image: string;
	subcategories: { slug: string; name: string }[];
	featuredProductIds: string[];
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
	relatedProductIds: string[];
}

export interface Guide {
	id: string;
	slug: string;
	title: string;
	vetAuthor: { name: string; credential: string };
	intro: string;
	productIds: string[];
}

// Symptom checker decision tree
export interface SymptomOutcome {
	assessment: string;
	seeVet: "yes" | "no" | "maybe";
	productIds: string[]; // 0-3
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

export type SubscriptionFrequency = "biweekly" | "monthly" | "bimonthly"; // 14/30/60 days
export interface Subscription {
	id: string;
	productId: string;
	productName: string;
	productImage: string;
	unitPrice: number; // after 5% subscribe discount, integer rupiah
	quantity: number;
	frequency: SubscriptionFrequency;
	nextDeliveryDate: string; // ISO
	address: Address;
	paymentMethod: string; // payment method id
	status: "active" | "cancelled";
	paused: boolean;
	createdAt: string;
	cancelledAt?: string;
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

export interface OrderItem {
	productId: string;
	name: string;
	image: string;
	price: number; // unit price at purchase, integer rupiah
	quantity: number;
}
export type OrderStatus =
	| "payment_pending"
	| "processing"
	| "packed"
	| "in_transit"
	| "delivered"
	| "cancelled";
export interface TrackingEvent {
	status: OrderStatus;
	label: string;
	timestamp: string;
	done: boolean;
}
export interface Order {
	id: string; // PS-YYYYMMDD-XXXXX
	createdAt: string; // ISO
	items: OrderItem[];
	address: Address;
	courierId: string;
	paymentMethodId: string;
	subtotal: number;
	deliveryFee: number;
	discount: number;
	total: number;
	status: OrderStatus;
	trackingNumber: string;
	timeline: TrackingEvent[];
}

export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	addresses: Address[];
}

export interface Courier {
	id: "jne" | "jnt" | "sicepat";
	name: string;
	etaDays: string; // "2-3 hari"
	fee: number; // integer rupiah
	logo?: string;
}

export type PaymentMethodId = "gopay" | "ovo" | "dana" | "qris" | "va";
export interface PaymentMethod {
	id: PaymentMethodId;
	name: string;
	description: string;
	kind: "ewallet" | "qris" | "va";
}

export interface CartItem {
	productId: string;
	quantity: number;
}
export interface PromoCode {
	code: string;
	type: "percent" | "fixed";
	value: number;
	label: string;
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
	prescribedProductIds: string[]; // sambung ke produk eksisting
	followUpInDays: number | null;
	issuedAt: string;
}
