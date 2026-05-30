import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useBooking } from "@/context/booking";
import { useConsultations } from "@/context/consultations";
import { getDateRange, getSlotsForVetOnDate } from "@/data/slots";
import type { TimeSlot } from "@/data/types";
import { formatSlotDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AvailabilityPickerProps {
	vetId: string;
}

export function AvailabilityPicker({ vetId }: AvailabilityPickerProps) {
	const { setVet, selectSlot, isSlotStillAvailable } = useBooking();
	const { consultations } = useConsultations();
	const navigate = useNavigate();
	const dates = useMemo(() => getDateRange(), []);
	const [selectedDate, setSelectedDate] = useState(dates[0]);
	const [dateScrollIdx, setDateScrollIdx] = useState(0);

	const slots = useMemo(
		() => getSlotsForVetOnDate(vetId, selectedDate),
		[vetId, selectedDate],
	);

	const availableSlots = slots.filter(
		(s) => s.status === "available" && isSlotStillAvailable(s, consultations),
	);

	const [chosenSlot, setChosenSlot] = useState<TimeSlot | null>(null);

	function selectDate(dateISO: string) {
		setSelectedDate(dateISO);
		setChosenSlot(null);
	}

	function handleContinue() {
		if (!chosenSlot) return;
		setVet(vetId);
		selectSlot(chosenSlot);
		navigate({ to: "/booking/intake" });
	}

	const VISIBLE_DATES = 5;
	const visibleDates = dates.slice(
		dateScrollIdx,
		dateScrollIdx + VISIBLE_DATES,
	);

	return (
		<div className="space-y-5">
			{/* Date picker */}
			<div>
				<div className="flex items-center gap-2 mb-3">
					<button
						type="button"
						onClick={() => setDateScrollIdx((i) => Math.max(0, i - 1))}
						disabled={dateScrollIdx === 0}
						aria-label="Tanggal sebelumnya"
						className="min-h-9 min-w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground disabled:opacity-30 hover:bg-muted transition-colors"
					>
						<ChevronLeft className="size-4" aria-hidden="true" />
					</button>

					<div className="flex gap-2 flex-1 overflow-hidden">
						{visibleDates.map((dateISO) => {
							const { day, date } = formatSlotDate(dateISO);
							const isSelected = selectedDate === dateISO;
							const isToday = dateISO === dates[0];
							return (
								<button
									key={dateISO}
									type="button"
									onClick={() => selectDate(dateISO)}
									className={cn(
										"flex-1 min-h-14 min-w-[3.5rem] flex flex-col items-center justify-center rounded-xl border text-center transition-all duration-200",
										isSelected
											? "border-primary bg-primary text-primary-foreground shadow-sm"
											: "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/60",
									)}
								>
									<span className="text-[10px] font-medium uppercase tracking-wide opacity-75">
										{isToday ? "Hari ini" : day}
									</span>
									<span className="text-xs font-semibold mt-0.5">{date}</span>
								</button>
							);
						})}
					</div>

					<button
						type="button"
						onClick={() =>
							setDateScrollIdx((i) =>
								Math.min(dates.length - VISIBLE_DATES, i + 1),
							)
						}
						disabled={dateScrollIdx >= dates.length - VISIBLE_DATES}
						aria-label="Tanggal berikutnya"
						className="min-h-9 min-w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground disabled:opacity-30 hover:bg-muted transition-colors"
					>
						<ChevronRight className="size-4" aria-hidden="true" />
					</button>
				</div>
			</div>

			{/* Slot grid */}
			<div>
				<p className="text-sm font-medium text-foreground mb-2.5">
					Pilih waktu konsultasi
				</p>

				{slots.length === 0 ? (
					<div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
						Tidak ada jadwal tersedia untuk tanggal ini.
					</div>
				) : availableSlots.length === 0 ? (
					<div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
						Semua jadwal pada hari ini sudah terisi. Coba pilih tanggal lain.
					</div>
				) : (
					<div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
						{slots.map((slot) => {
							const isBooked =
								slot.status === "booked" ||
								!isSlotStillAvailable(slot, consultations);
							const isChosen = chosenSlot?.id === slot.id;

							return (
								<button
									key={slot.id}
									type="button"
									disabled={isBooked}
									onClick={() => setChosenSlot(isChosen ? null : slot)}
									className={cn(
										"min-h-11 rounded-lg border text-sm font-medium transition-all duration-200",
										isBooked
											? "border-border bg-muted/40 text-muted-foreground/40 line-through cursor-not-allowed"
											: isChosen
												? "border-primary bg-primary text-primary-foreground shadow-sm scale-[1.02]"
												: "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/60",
									)}
									aria-pressed={isChosen}
									aria-disabled={isBooked}
								>
									{slot.time}
								</button>
							);
						})}
					</div>
				)}
			</div>

			{/* CTA */}
			<div className="pt-2">
				<Button
					className="w-full min-h-12 text-base"
					disabled={!chosenSlot}
					onClick={handleContinue}
				>
					{chosenSlot
						? `Lanjutkan jam ${chosenSlot.time}`
						: "Pilih jadwal terlebih dahulu"}
				</Button>
			</div>
		</div>
	);
}
