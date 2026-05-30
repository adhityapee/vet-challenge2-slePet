import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ClipboardList } from "lucide-react";

import { ConsultStatusBadge } from "@/components/booking/consult-status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useConsultations } from "@/context/consultations";
import { formatConsultDateTime } from "@/lib/format";

export const Route = createFileRoute("/account/consultations/")({
	component: ConsultationsListPage,
});

function ConsultationsListPage() {
	const { upcoming, past } = useConsultations();

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="font-display text-2xl font-bold text-foreground">
						Konsultasi Saya
					</h1>
					<Button
						variant="outline"
						size="sm"
						render={<Link to="/vets" />}
						className="min-h-9"
					>
						Cari Dokter
					</Button>
				</div>

				{/* Upcoming */}
				<section className="mb-8">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
						Akan Datang
					</h2>
					{upcoming.length === 0 ? (
						<EmptyState
							icon={Calendar}
							title="Tidak ada jadwal konsultasi"
							description="Booking konsultasi dengan dokter hewan pilihanmu sekarang."
							action={<Button render={<Link to="/vets" />}>Cari Dokter</Button>}
						/>
					) : (
						<div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
							{upcoming.map((c) => (
								<Link
									key={c.id}
									to="/account/consultations/$consultId"
									params={{ consultId: c.id }}
									className="flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition-colors"
								>
									<img
										src={c.vetPhotoUrl}
										alt={c.vetName}
										className="size-11 rounded-full object-cover object-center shrink-0"
									/>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-foreground truncate">
											{c.vetName}
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											{formatConsultDateTime(c.slot.date, c.slot.time)}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{c.intake.petName}
										</p>
									</div>
									<ConsultStatusBadge status={c.status} />
								</Link>
							))}
						</div>
					)}
				</section>

				<Separator className="mb-8" />

				{/* Past */}
				<section>
					<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
						Riwayat
					</h2>
					{past.length === 0 ? (
						<EmptyState
							icon={ClipboardList}
							title="Belum ada riwayat konsultasi"
							description="Riwayat konsultasi yang sudah selesai akan muncul di sini."
						/>
					) : (
						<div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
							{past.map((c) => (
								<Link
									key={c.id}
									to="/account/consultations/$consultId"
									params={{ consultId: c.id }}
									className="flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition-colors opacity-80"
								>
									<img
										src={c.vetPhotoUrl}
										alt={c.vetName}
										className="size-11 rounded-full object-cover object-center shrink-0 grayscale"
									/>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-foreground truncate">
											{c.vetName}
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											{formatConsultDateTime(c.slot.date, c.slot.time)}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{c.intake.petName}
										</p>
									</div>
									<ConsultStatusBadge status={c.status} />
								</Link>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
