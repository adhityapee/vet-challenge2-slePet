import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import type { Consultation, SymptomIntake, TimeSlot } from "@/data/types";
import { track } from "@/lib/analytics";
import { STORAGE_KEYS, safeGet, safeSet } from "@/lib/storage";

interface BookingDraft {
	vetId: string | null;
	selectedSlot: TimeSlot | null;
	intake: SymptomIntake | null;
}

interface BookingValue extends BookingDraft {
	setVet: (id: string) => void;
	selectSlot: (slot: TimeSlot) => void;
	setIntake: (intake: SymptomIntake) => void;
	clearDraft: () => void;
	isSlotStillAvailable: (
		slot: TimeSlot,
		consultations: Consultation[],
	) => boolean;
}

const BookingContext = createContext<BookingValue | null>(null);

const EMPTY_DRAFT: BookingDraft = {
	vetId: null,
	selectedSlot: null,
	intake: null,
};

export function BookingProvider({ children }: { children: ReactNode }) {
	const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setDraft(safeGet<BookingDraft>(STORAGE_KEYS.bookingDraft, EMPTY_DRAFT));
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) safeSet(STORAGE_KEYS.bookingDraft, draft);
	}, [draft, hydrated]);

	const setVet = useCallback((id: string) => {
		setDraft((prev) => ({
			...prev,
			vetId: id,
			selectedSlot: null,
			intake: null,
		}));
	}, []);

	const selectSlot = useCallback((slot: TimeSlot) => {
		setDraft((prev) => ({ ...prev, selectedSlot: slot }));
		track("select_slot", {
			vetId: slot.vetId,
			date: slot.date,
			time: slot.time,
		});
	}, []);

	const setIntake = useCallback((intake: SymptomIntake) => {
		setDraft((prev) => ({ ...prev, intake }));
	}, []);

	const clearDraft = useCallback(() => {
		setDraft(EMPTY_DRAFT);
	}, []);

	const isSlotStillAvailable = useCallback(
		(slot: TimeSlot, consultations: Consultation[]): boolean => {
			return !consultations.some(
				(c) =>
					c.vetId === slot.vetId &&
					c.slot.date === slot.date &&
					c.slot.time === slot.time &&
					c.status !== "cancelled",
			);
		},
		[],
	);

	const value = useMemo<BookingValue>(
		() => ({
			...draft,
			setVet,
			selectSlot,
			setIntake,
			clearDraft,
			isSlotStillAvailable,
		}),
		[draft, setVet, selectSlot, setIntake, clearDraft, isSlotStillAvailable],
	);

	return (
		<BookingContext.Provider value={value}>{children}</BookingContext.Provider>
	);
}

export function useBooking(): BookingValue {
	const ctx = useContext(BookingContext);
	if (!ctx)
		throw new Error(
			"useBooking must be used within <BookingProvider> (see <AppProviders>).",
		);
	return ctx;
}
