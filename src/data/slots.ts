import type { SlotStatus, TimeSlot } from "@/data/types";
import { getAllVets } from "@/data/vets";

const WORK_HOURS = [
	"09:00",
	"10:00",
	"11:00",
	"13:00",
	"14:00",
	"15:00",
	"16:00",
];
const DAYS_AHEAD = 14;

function dateToISO(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

// Deterministic hash: maps vetId + date + time to a stable number 0-99
function stableHash(vetId: string, dateISO: string, time: string): number {
	const str = `${vetId}|${dateISO}|${time}`;
	let h = 5381;
	for (let i = 0; i < str.length; i++) {
		h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
	}
	return h % 100;
}

// Generate booked pattern: blocks of 2-3 consecutive slots per day (~40% fill)
function slotStatus(
	vetId: string,
	dateISO: string,
	time: string,
	slotIdx: number,
): SlotStatus {
	const hash = stableHash(vetId, dateISO, time);
	// Create block patterns: if previous or current hash is in a booked range
	const blockHash = stableHash(vetId, dateISO, String(Math.floor(slotIdx / 2)));
	if (blockHash < 40) return "booked";
	if (hash > 95) return "blocked";
	return "available";
}

function generateSlotsForVetOnDate(vetId: string, dateISO: string): TimeSlot[] {
	return WORK_HOURS.map((time, idx) => ({
		id: `${vetId}-${dateISO}-${time}`,
		vetId,
		date: dateISO,
		time,
		status: slotStatus(vetId, dateISO, time, idx) as SlotStatus,
	}));
}

// Precompute all slots for all vets across 14 days
const allSlotsCache: Map<string, TimeSlot[]> = new Map();

function buildCache(): void {
	if (allSlotsCache.size > 0) return;
	const vets = getAllVets();
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	for (const vet of vets) {
		const vetSlots: TimeSlot[] = [];
		for (let day = 0; day < DAYS_AHEAD; day++) {
			const date = new Date(today);
			date.setDate(today.getDate() + day);
			const dateISO = dateToISO(date);
			const daySlots = generateSlotsForVetOnDate(vet.id, dateISO);
			vetSlots.push(...daySlots);
		}
		allSlotsCache.set(vet.id, vetSlots);
	}
}

export function getSlotsForVet(vetId: string): TimeSlot[] {
	buildCache();
	return allSlotsCache.get(vetId) ?? [];
}

export function getSlotsForVetOnDate(
	vetId: string,
	dateISO: string,
): TimeSlot[] {
	return getSlotsForVet(vetId).filter((s) => s.date === dateISO);
}

export function getDateRange(): string[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const dates: string[] = [];
	for (let day = 0; day < DAYS_AHEAD; day++) {
		const date = new Date(today);
		date.setDate(today.getDate() + day);
		dates.push(dateToISO(date));
	}
	return dates;
}
