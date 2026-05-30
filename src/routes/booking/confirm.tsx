import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar, ChevronRight, User } from "lucide-react";
import { useEffect, useState } from "react";

import { PaymentMethodSelect } from "@/components/booking/payment-method-select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBooking } from "@/context/booking";
import type { BookConsultInput } from "@/context/consultations";
import { useConsultations } from "@/context/consultations";
import type { PaymentMethodId } from "@/data/types";
import { getVetById } from "@/data/vets";
import { track } from "@/lib/analytics";
import { formatConsultDateTime, formatIDR } from "@/lib/format";

export const Route = createFileRoute("/booking/confirm")({
	component: ConfirmPage,
});

const SPECIES_LABELS: Record<string, string> = {
	dog: "Anjing",
	cat: "Kucing",
	rabbit: "Kelinci",
	bird: "Burung",
	fish: "Ikan",
	other: "Lainnya",
};

function ConfirmPage() {
	const navigate = useNavigate();
	const { vetId, selectedSlot, intake, clearDraft } = useBooking();
	const { book } = useConsultations();

	useEffect(() => {
		if (!vetId || !selectedSlot || !intake) {
			navigate({ to: "/vets" });
		}
	}, [vetId, selectedSlot, intake, navigate]);

	const vet = vetId ? getVetById(vetId) : null;

	const [paymentId, setPaymentId] = useState<PaymentMethodId | null>(null);
	const [vaBank, setVaBank] = useState<string | null>(null);
	const [isBooking, setIsBooking] = useState(false);
	const [paymentError, setPaymentError] = useState<string | null>(null);

	async function handleConfirm() {
		if (!paymentId) {
			setPaymentError("Pilih metode pembayaran terlebih dahulu.");
			return;
		}
		if (!vetId || !selectedSlot || !intake) return;

		setIsBooking(true);
		const input: BookConsultInput = { vetId, selectedSlot, intake };
		const consultation = book(input, paymentId);
		clearDraft();
		track("book_consultation", {
			consultId: consultation.id,
			paymentMethod: paymentId,
		});
		navigate({ to: "/booking/success", search: { consult: consultation.id } });
	}

	if (!vetId || !selectedSlot || !intake || !vet) return null;

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
				<button
					type="button"
					onClick={() => navigate({ to: "/booking/intake" })}
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
				>
					<ChevronRight className="size-4 rotate-180" aria-hidden="true" />
					Kembali
				</button>

				<h1 className="font-display text-2xl font-bold text-foreground mb-6">
					Konfirmasi Konsultasi
				</h1>

				{/* Booking summary */}
				<div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
					<div className="px-4 py-3 bg-muted/30 border-b border-border">
						<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Detail Konsultasi
						</p>
					</div>

					<div className="divide-y divide-border">
						<div className="flex items-center gap-3 px-4 py-4">
							<img
								src={vet.photoUrl}
								alt={vet.name}
								className="size-12 rounded-full object-cover object-top shrink-0"
							/>
							<div className="flex-1 min-w-0">
								<p className="font-medium text-foreground">{vet.name}</p>
								<p className="text-xs text-muted-foreground">
									{vet.credential}
								</p>
							</div>
						</div>

						<div className="px-4 py-3.5 flex items-center gap-3">
							<Calendar
								className="size-4 text-primary shrink-0"
								aria-hidden="true"
							/>
							<div>
								<p className="text-xs text-muted-foreground">Jadwal</p>
								<p className="text-sm font-medium text-foreground">
									{formatConsultDateTime(selectedSlot.date, selectedSlot.time)}
								</p>
							</div>
						</div>

						<div className="px-4 py-3.5 flex items-center gap-3">
							<User
								className="size-4 text-primary shrink-0"
								aria-hidden="true"
							/>
							<div>
								<p className="text-xs text-muted-foreground">Hewan</p>
								<p className="text-sm font-medium text-foreground">
									{intake.petName} (
									{SPECIES_LABELS[intake.petSpecies] ?? intake.petSpecies})
								</p>
							</div>
						</div>

						<div className="px-4 py-3.5">
							<p className="text-xs text-muted-foreground mb-1">Keluhan</p>
							<p className="text-sm text-foreground line-clamp-3">
								{intake.concern}
							</p>
						</div>
					</div>
				</div>

				{/* Payment method */}
				<div className="mb-6">
					<h2 className="font-semibold text-foreground mb-3">
						Metode Pembayaran
					</h2>
					<PaymentMethodSelect
						selectedId={paymentId}
						onSelect={(id) => {
							setPaymentId(id);
							setPaymentError(null);
						}}
						vaBank={vaBank}
						onSelectBank={setVaBank}
					/>
					{paymentError && (
						<p className="mt-2 text-sm text-destructive">{paymentError}</p>
					)}
				</div>

				{/* Price breakdown */}
				<div className="rounded-xl border border-border bg-card p-4 mb-6 space-y-2.5">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Biaya konsultasi</span>
						<span className="font-medium text-foreground">
							{formatIDR(vet.consultFee)}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Biaya layanan</span>
						<span className="font-medium text-foreground">Gratis</span>
					</div>
					<Separator />
					<div className="flex justify-between text-base font-bold">
						<span className="text-foreground">Total</span>
						<span className="text-primary">{formatIDR(vet.consultFee)}</span>
					</div>
				</div>

				<Button
					className="w-full min-h-12 text-base"
					onClick={handleConfirm}
					disabled={isBooking}
				>
					{isBooking ? "Memproses..." : "Konfirmasi dan Bayar"}
				</Button>

				<p className="text-center text-xs text-muted-foreground mt-3">
					Dengan menekan tombol di atas, kamu menyetujui syarat dan ketentuan
					layanan PetSehat.
				</p>
			</div>
		</div>
	);
}
