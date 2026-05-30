import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, ClipboardList } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useConsultations } from "@/context/consultations";
import { formatConsultDateTime } from "@/lib/format";

export const Route = createFileRoute("/booking/success")({
	validateSearch: (search: Record<string, unknown>): { consult?: string } => ({
		consult: typeof search.consult === "string" ? search.consult : undefined,
	}),
	component: BookingSuccessPage,
});

function BookingSuccessPage() {
	const { consult: consultId } = Route.useSearch();
	const { getById } = useConsultations();

	const consultation = consultId ? getById(consultId) : undefined;

	if (!consultation) {
		return (
			<div className="py-10 px-4">
				<EmptyState
					icon={ClipboardList}
					title="Konsultasi tidak ditemukan"
					description="Coba buka dari daftar konsultasimu."
					action={
						<Button render={<Link to="/account/consultations" />}>
							Lihat konsultasi saya
						</Button>
					}
				/>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-md px-4 py-12 sm:px-6 text-center">
				<div className="flex justify-center mb-5">
					<div className="flex size-20 items-center justify-center rounded-full bg-green-100">
						<CheckCircle2
							className="size-10 text-green-600"
							aria-hidden="true"
						/>
					</div>
				</div>

				<h1 className="font-display text-2xl font-bold text-foreground mb-2">
					Konsultasi Terjadwal
				</h1>
				<p className="text-muted-foreground text-sm mb-6">
					Pembayaranmu sedang diproses. Bersiap untuk konsultasi bersama dokter.
				</p>

				<div className="rounded-xl border border-border bg-card text-left divide-y divide-border mb-8 overflow-hidden">
					<div className="px-4 py-3.5">
						<p className="text-xs text-muted-foreground">Nomor konsultasi</p>
						<p className="font-mono font-semibold text-foreground mt-0.5">
							{consultation.id}
						</p>
					</div>
					<div className="px-4 py-3.5 flex items-center gap-3">
						<img
							src={consultation.vetPhotoUrl}
							alt={consultation.vetName}
							className="size-10 rounded-full object-cover object-top shrink-0"
						/>
						<div>
							<p className="text-xs text-muted-foreground">Dokter</p>
							<p className="text-sm font-medium text-foreground">
								{consultation.vetName}
							</p>
						</div>
					</div>
					<div className="px-4 py-3.5">
						<p className="text-xs text-muted-foreground">Jadwal</p>
						<p className="text-sm font-medium text-foreground mt-0.5">
							{formatConsultDateTime(
								consultation.slot.date,
								consultation.slot.time,
							)}
						</p>
					</div>
					<div className="px-4 py-3.5">
						<p className="text-xs text-muted-foreground">Hewan</p>
						<p className="text-sm font-medium text-foreground mt-0.5">
							{consultation.intake.petName}
						</p>
					</div>
				</div>

				<div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-left mb-8">
					<p className="text-sm font-medium text-amber-900 flex items-center gap-2">
						<CalendarCheck className="size-4 shrink-0" aria-hidden="true" />
						Masuk ruang tunggu 5 menit sebelum jadwal
					</p>
					<p className="text-xs text-amber-700 mt-1">
						Dokter akan bergabung tepat waktu. Pastikan kamera dan mikrofon
						perangkatmu berfungsi.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<Button
						className="w-full min-h-12"
						render={<Link to="/account/consultations" />}
					>
						Konsultasi Saya
					</Button>
					<Button
						variant="outline"
						className="w-full min-h-12"
						render={<Link to="/vets" />}
					>
						Cari Dokter Lain
					</Button>
				</div>
			</div>
		</div>
	);
}
