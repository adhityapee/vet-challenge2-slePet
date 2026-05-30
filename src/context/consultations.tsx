import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import type {
	Consultation,
	ConsultNote,
	SymptomIntake,
	TimeSlot,
} from "@/data/types";
import { getVetById } from "@/data/vets";
import { track } from "@/lib/analytics";
import { consultationNumber } from "@/lib/ids";
import { STORAGE_KEYS, safeGet, safeSet } from "@/lib/storage";

export interface BookConsultInput {
	vetId: string;
	selectedSlot: TimeSlot;
	intake: SymptomIntake;
}

interface ConsultationsValue {
	consultations: Consultation[];
	book: (input: BookConsultInput, paymentMethodId: string) => Consultation;
	cancel: (id: string) => void;
	reschedule: (id: string, newSlot: TimeSlot) => void;
	addNote: (id: string, note: ConsultNote) => void;
	updateStatus: (id: string, status: Consultation["status"]) => void;
	getById: (id: string) => Consultation | undefined;
	upcoming: Consultation[];
	past: Consultation[];
}

const ConsultationsContext = createContext<ConsultationsValue | null>(null);

export function ConsultationsProvider({ children }: { children: ReactNode }) {
	const [consultations, setConsultations] = useState<Consultation[]>([]);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setConsultations(safeGet<Consultation[]>(STORAGE_KEYS.consultations, []));
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) safeSet(STORAGE_KEYS.consultations, consultations);
	}, [consultations, hydrated]);

	const book = useCallback(
		(input: BookConsultInput, paymentMethodId: string): Consultation => {
			const vet = getVetById(input.vetId);
			const now = new Date();
			const consultation: Consultation = {
				id: consultationNumber(now),
				vetId: input.vetId,
				vetName: vet?.name ?? "drh. (Dokter)",
				vetPhotoUrl: vet?.photoUrl ?? "",
				slot: { ...input.selectedSlot, status: "booked" },
				intake: input.intake,
				status: "scheduled",
				createdAt: now.toISOString(),
				fee: vet?.consultFee ?? 0,
				paymentMethodId,
			};
			setConsultations((prev) => [consultation, ...prev]);
			track("book_consultation", {
				consultId: consultation.id,
				vetId: input.vetId,
				fee: consultation.fee,
			});
			return consultation;
		},
		[],
	);

	const cancel = useCallback((id: string) => {
		setConsultations((prev) =>
			prev.map((c) => (c.id === id ? { ...c, status: "cancelled" } : c)),
		);
		track("cancel_consultation", { consultId: id });
	}, []);

	const reschedule = useCallback((id: string, newSlot: TimeSlot) => {
		setConsultations((prev) =>
			prev.map((c) =>
				c.id === id
					? {
							...c,
							slot: { ...newSlot, status: "booked" },
							status: "scheduled",
						}
					: c,
			),
		);
		track("reschedule_consultation", {
			consultId: id,
			newDate: newSlot.date,
			newTime: newSlot.time,
		});
	}, []);

	const addNote = useCallback((id: string, note: ConsultNote) => {
		setConsultations((prev) =>
			prev.map((c) =>
				c.id === id ? { ...c, notes: note, status: "ended" } : c,
			),
		);
	}, []);

	const updateStatus = useCallback(
		(id: string, status: Consultation["status"]) => {
			setConsultations((prev) =>
				prev.map((c) => (c.id === id ? { ...c, status } : c)),
			);
		},
		[],
	);

	const getById = useCallback(
		(id: string) => consultations.find((c) => c.id === id),
		[consultations],
	);

	const now = new Date().toISOString();

	const upcoming = useMemo(
		() =>
			consultations.filter(
				(c) =>
					(c.status === "scheduled" ||
						c.status === "waiting" ||
						c.status === "live") &&
					`${c.slot.date}T${c.slot.time}` >= now.slice(0, 16),
			),
		[consultations, now],
	);

	const past = useMemo(
		() =>
			consultations.filter(
				(c) =>
					c.status === "ended" ||
					c.status === "cancelled" ||
					(c.status === "scheduled" &&
						`${c.slot.date}T${c.slot.time}` < now.slice(0, 16)),
			),
		[consultations, now],
	);

	const value = useMemo<ConsultationsValue>(
		() => ({
			consultations,
			book,
			cancel,
			reschedule,
			addNote,
			updateStatus,
			getById,
			upcoming,
			past,
		}),
		[
			consultations,
			book,
			cancel,
			reschedule,
			addNote,
			updateStatus,
			getById,
			upcoming,
			past,
		],
	);

	return (
		<ConsultationsContext.Provider value={value}>
			{children}
		</ConsultationsContext.Provider>
	);
}

export function useConsultations(): ConsultationsValue {
	const ctx = useContext(ConsultationsContext);
	if (!ctx)
		throw new Error(
			"useConsultations must be used within <ConsultationsProvider> (see <AppProviders>).",
		);
	return ctx;
}
