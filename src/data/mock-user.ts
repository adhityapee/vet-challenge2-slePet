import type { Address, User } from "@/data/types";

export const DEMO_EMAIL = "demo@petsehat.id";

export const demoAddress: Address = {
	id: "addr-demo-1",
	label: "home",
	recipient: "Sari Wijaya",
	phone: "081234567890",
	street: "Jl. Kemang Raya No. 27, RT 04 RW 02",
	kelurahan: "Bangka",
	kecamatan: "Mampang Prapatan",
	city: "Jakarta Selatan",
	province: "DKI Jakarta",
	postalCode: "12730",
	isDefault: true,
};

export const demoUser: User = {
	id: "user-demo",
	name: "Sari Wijaya",
	email: DEMO_EMAIL,
	phone: "081234567890",
	addresses: [demoAddress],
};
