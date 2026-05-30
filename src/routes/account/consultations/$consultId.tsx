import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	CalendarCheck,
	CalendarClock,
	ChevronRight,
	Mic,
	MicOff,
	PhoneOff,
	Video,
	VideoOff,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ConsultNotesCard } from "@/components/booking/consult-notes-card";
import { ConsultStatusBadge } from "@/components/booking/consult-status-badge";
import { WaitingRoom } from "@/components/booking/waiting-room";
import { EmptyState } from "@/components/common/empty-state";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useConsultations } from "@/context/consultations";
import { getDateRange, getSlotsForVetOnDate } from "@/data/slots";
import type { ConsultNote, TimeSlot } from "@/data/types";
import { getVetById } from "@/data/vets";
import { formatConsultDateTime, formatIDR, formatSlotDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/consultations/$consultId")({
	component: ConsultDetailPage,
});

const SPECIES_LABELS: Record<string, string> = {
	dog: "Anjing",
	cat: "Kucing",
	rabbit: "Kelinci",
	bird: "Burung",
	fish: "Ikan",
	other: "Lainnya",
};

function buildMockNote(): ConsultNote {
	return {
		summary:
			"Hewan dalam kondisi yang memerlukan perhatian. Berdasarkan keluhan dan foto yang disampaikan, kondisi saat ini masih dapat ditangani dengan perawatan di rumah disertai pemantauan ketat.",
		diagnosis:
			"Kemungkinan iritasi ringan atau reaksi alergi yang bersifat sementara. Tidak ditemukan tanda-tanda penyakit serius pada sesi konsultasi ini.",
		recommendations:
			"Berikan makanan sesuai porsi yang dianjurkan. Pastikan akses air bersih tersedia setiap saat. Hindari paparan pemicu alergi yang teridentifikasi. Lakukan kontrol kembali jika gejala memburuk atau tidak membaik dalam 3 hari.",
		prescribedProductIds: ["p-001", "p-015"],
		followUpInDays: 7,
		issuedAt: new Date().toISOString(),
	};
}

interface ReschedulePickerProps {
	vetId: string;
	consultations: ReturnType<typeof useConsultations>["consultations"];
	onSelect: (slot: TimeSlot) => void;
	onCancel: () => void;
}

function ReschedulePicker({
	vetId,
	consultations,
	onSelect,
	onCancel,
}: ReschedulePickerProps) {
	const dates = useMemo(() => getDateRange(), []);
	const [selectedDate, setSelectedDate] = useState(dates[0]);
	const [chosenSlot, setChosenSlot] = useState<TimeSlot | null>(null);

	const slots = useMemo(
		() => getSlotsForVetOnDate(vetId, selectedDate),
		[vetId, selectedDate],
	);

	function checkAvailable(slot: TimeSlot): boolean {
		return !consultations.some(
			(c) =>
				c.vetId === slot.vetId &&
				c.slot.date === slot.date &&
				c.slot.time === slot.time &&
				c.status !== "cancelled",
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex gap-1.5 overflow-x-auto pb-1">
				{dates.slice(0, 7).map((dateISO) => {
					const { day, date } = formatSlotDate(dateISO);
					const isSelected = selectedDate === dateISO;
					return (
						<button
							key={dateISO}
							type="button"
							onClick={() => {
								setSelectedDate(dateISO);
								setChosenSlot(null);
							}}
							className={cn(
								"flex-shrink-0 flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-center text-xs min-h-[3.5rem] transition-all",
								isSelected
									? "border-primary bg-primary text-primary-foreground"
									: "border-border bg-card text-foreground hover:border-primary/50",
							)}
						>
							<span className="opacity-75">{day}</span>
							<span className="font-semibold">{date}</span>
						</button>
					);
				})}
			</div>

			<div className="grid grid-cols-3 gap-2">
				{slots.map((slot) => {
					const isBooked = slot.status === "booked" || !checkAvailable(slot);
					const isChosen = chosenSlot?.id === slot.id;
					return (
						<button
							key={slot.id}
							type="button"
							disabled={isBooked}
							onClick={() => setChosenSlot(isChosen ? null : slot)}
							className={cn(
								"min-h-11 rounded-lg border text-sm font-medium transition-all",
								isBooked
									? "border-border bg-muted/40 text-muted-foreground/40 line-through cursor-not-allowed"
									: isChosen
										? "border-primary bg-primary text-primary-foreground"
										: "border-border bg-card text-foreground hover:border-primary/50",
							)}
							aria-pressed={isChosen}
							aria-disabled={isBooked}
						>
							{slot.time}
						</button>
					);
				})}
			</div>

			<Button
				className="w-full min-h-11"
				disabled={!chosenSlot}
				onClick={() => chosenSlot && onSelect(chosenSlot)}
			>
				{chosenSlot ? `Jadwalkan ulang jam ${chosenSlot.time}` : "Pilih waktu"}
			</Button>
			<Button variant="ghost" className="w-full" onClick={onCancel}>
				Batal
			</Button>
		</div>
	);
}

function ConsultDetailPage() {
	const { consultId } = Route.useParams();
	const navigate = useNavigate();
	const { getById, cancel, reschedule, addNote, updateStatus, consultations } =
		useConsultations();
	const consultation = getById(consultId);

	const [showReschedule, setShowReschedule] = useState(false);
	const [micOn, setMicOn] = useState(true);
	const [camOn, setCamOn] = useState(true);

	if (!consultation) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16">
				<EmptyState
					icon={CalendarClock}
					title="Konsultasi tidak ditemukan"
					description="Konsultasi ini mungkin sudah dihapus atau belum dibuat."
					action={
						<Button render={<Link to="/account/consultations" />}>
							Kembali ke daftar
						</Button>
					}
				/>
			</div>
		);
	}

	const vet = getVetById(consultation.vetId);

	function handleCancel() {
		cancel(consultId);
	}

	function handleReschedule(newSlot: TimeSlot) {
		reschedule(consultId, newSlot);
		setShowReschedule(false);
	}

	function handleJoinLive() {
		updateStatus(consultId, "live");
	}

	function handleEndConsult() {
		addNote(consultId, buildMockNote());
	}

	function handleSimulateWaiting() {
		updateStatus(consultId, "waiting");
	}

	const { status } = consultation;
	const isEnded = status === "ended";
	const isCancelled = status === "cancelled";
	const isScheduled = status === "scheduled";
	const isWaiting = status === "waiting";
	const isLive = status === "live";

	// Countdown calculation
	const targetMs = new Date(
		`${consultation.slot.date}T${consultation.slot.time}:00`,
	).getTime();
	const nowMs = Date.now();
	const secondsLeft = Math.max(0, Math.floor((targetMs - nowMs) / 1000));

	function formatClock(seconds: number): string {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		if (h > 0) return `${h}j ${String(m).padStart(2, "0")}m`;
		return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
				<button
					type="button"
					onClick={() => navigate({ to: "/account/consultations" })}
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
				>
					<ChevronRight className="size-4 rotate-180" aria-hidden="true" />
					Konsultasi Saya
				</button>

				<div className="flex items-start justify-between gap-3 mb-6">
					<div>
						<h1 className="font-display text-xl font-bold text-foreground">
							Detail Konsultasi
						</h1>
						<p className="text-xs text-muted-foreground mt-0.5 font-mono">
							{consultation.id}
						</p>
					</div>
					<ConsultStatusBadge status={consultation.status} />
				</div>

				{/* Vet + slot info */}
				<div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
					<div className="flex items-center gap-4 p-4">
						<img
							src={consultation.vetPhotoUrl}
							alt={consultation.vetName}
							className={cn(
								"size-14 rounded-full object-cover object-top shrink-0",
								isCancelled && "grayscale opacity-60",
							)}
						/>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-foreground">
								{consultation.vetName}
							</p>
							{vet && (
								<p className="text-xs text-muted-foreground">
									{vet.credential}
								</p>
							)}
						</div>
					</div>
					<Separator />
					<div className="grid grid-cols-2 divide-x divide-border">
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
							<p className="text-xs text-muted-foreground">Biaya</p>
							<p className="text-sm font-medium text-primary mt-0.5">
								{formatIDR(consultation.fee)}
							</p>
						</div>
					</div>
					<Separator />
					<div className="px-4 py-3.5">
						<p className="text-xs text-muted-foreground">Hewan</p>
						<p className="text-sm font-medium text-foreground mt-0.5">
							{consultation.intake.petName} (
							{SPECIES_LABELS[consultation.intake.petSpecies] ??
								consultation.intake.petSpecies}
							)
						</p>
						<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
							{consultation.intake.concern}
						</p>
					</div>
				</div>

				{/* Status-specific UI */}
				{isScheduled && (
					<div className="space-y-5">
						<div className="rounded-xl border border-border bg-card p-5 text-center">
							<p className="text-xs text-muted-foreground uppercase tracking-wide">
								Waktu Mulai
							</p>
							<p
								className={cn(
									"font-display text-4xl font-bold mt-1 tabular-nums",
									secondsLeft < 300 ? "text-primary" : "text-foreground",
								)}
							>
								{secondsLeft > 0
									? formatClock(secondsLeft)
									: "Saatnya konsultasi"}
							</p>
							{secondsLeft > 0 && (
								<p className="text-xs text-muted-foreground mt-1">
									Masuk ruang tunggu 5 menit sebelum jadwal
								</p>
							)}
						</div>

						<div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-3">
							<div className="flex items-start gap-3">
								<Zap
									className="size-5 text-amber-600 shrink-0 mt-0.5"
									aria-hidden="true"
								/>
								<div>
									<p className="text-sm font-semibold text-amber-900">
										Butuh bantuan sekarang?
									</p>
									<p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
										Kamu tidak perlu menunggu jadwal tiba. Tekan tombol di bawah
										untuk langsung masuk ke ruang tunggu dan berbicara dengan
										doktermu.
									</p>
								</div>
							</div>
							<Button
								className="w-full min-h-11"
								onClick={handleSimulateWaiting}
							>
								Mulai Konsultasi Sekarang
							</Button>
						</div>

						<div className="flex gap-3">
							<Dialog open={showReschedule} onOpenChange={setShowReschedule}>
								<Button
									variant="outline"
									className="flex-1 min-h-11 gap-2"
									onClick={() => setShowReschedule(true)}
								>
									<CalendarCheck className="size-4" aria-hidden="true" />
									Jadwalkan Ulang
								</Button>
								<DialogContent className="sm:max-w-lg">
									<DialogHeader>
										<DialogTitle>Jadwalkan Ulang Konsultasi</DialogTitle>
									</DialogHeader>
									{vet && (
										<ReschedulePicker
											vetId={vet.id}
											consultations={consultations}
											onSelect={handleReschedule}
											onCancel={() => setShowReschedule(false)}
										/>
									)}
								</DialogContent>
							</Dialog>

							<AlertDialog>
								<AlertDialogTrigger
									render={
										<Button
											variant="outline"
											className="flex-1 min-h-11 text-destructive border-destructive/30 hover:bg-destructive/5"
										>
											Batalkan
										</Button>
									}
								/>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Batalkan Konsultasi?</AlertDialogTitle>
										<AlertDialogDescription>
											Pembatalan tidak dapat dibatalkan. Kamu dapat menjadwalkan
											konsultasi baru kapan saja.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Batal</AlertDialogCancel>
										<AlertDialogAction
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
											onClick={handleCancel}
										>
											Ya, Batalkan
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
				)}

				{isWaiting && (
					<WaitingRoom consultation={consultation} onJoin={handleJoinLive} />
				)}

				{isLive && (
					<div className="space-y-4">
						<div className="relative rounded-2xl overflow-hidden bg-zinc-900 aspect-video flex items-center justify-center">
							<div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
								<div className="size-20 rounded-full bg-zinc-700 flex items-center justify-center">
									<span className="font-display text-3xl">
										{consultation.vetName.charAt(5).toUpperCase()}
									</span>
								</div>
								<p className="text-sm opacity-75">{consultation.vetName}</p>
							</div>
							<div className="absolute bottom-4 right-4 w-24 rounded-xl overflow-hidden bg-zinc-800 aspect-video flex items-center justify-center">
								<Video className="size-6 text-zinc-500" aria-hidden="true" />
							</div>
						</div>

						<div className="flex items-center justify-center gap-4 py-2">
							<button
								type="button"
								onClick={() => setMicOn((v) => !v)}
								aria-label={micOn ? "Matikan mikrofon" : "Aktifkan mikrofon"}
								className={cn(
									"flex size-14 items-center justify-center rounded-full transition-colors",
									micOn
										? "bg-muted text-foreground hover:bg-muted/80"
										: "bg-destructive/10 text-destructive",
								)}
							>
								{micOn ? (
									<Mic className="size-6" aria-hidden="true" />
								) : (
									<MicOff className="size-6" aria-hidden="true" />
								)}
							</button>

							<button
								type="button"
								onClick={() => setCamOn((v) => !v)}
								aria-label={camOn ? "Matikan kamera" : "Aktifkan kamera"}
								className={cn(
									"flex size-14 items-center justify-center rounded-full transition-colors",
									camOn
										? "bg-muted text-foreground hover:bg-muted/80"
										: "bg-destructive/10 text-destructive",
								)}
							>
								{camOn ? (
									<Video className="size-6" aria-hidden="true" />
								) : (
									<VideoOff className="size-6" aria-hidden="true" />
								)}
							</button>

							<AlertDialog>
								<AlertDialogTrigger
									render={
										<button
											type="button"
											aria-label="Akhiri konsultasi"
											className="flex size-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
										>
											<PhoneOff className="size-6" aria-hidden="true" />
										</button>
									}
								/>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Akhiri Konsultasi?</AlertDialogTitle>
										<AlertDialogDescription>
											Setelah sesi diakhiri, kamu akan melihat ringkasan dan
											rekomendasi dari dokter.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Kembali</AlertDialogCancel>
										<AlertDialogAction onClick={handleEndConsult}>
											Akhiri Sesi
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
				)}

				{isEnded && consultation.notes && vet && (
					<ConsultNotesCard notes={consultation.notes} vet={vet} />
				)}

				{isCancelled && (
					<div className="rounded-xl border border-red-200 bg-red-50 p-5 flex items-start gap-3">
						<AlertCircle
							className="size-5 text-red-600 shrink-0 mt-0.5"
							aria-hidden="true"
						/>
						<div>
							<p className="text-sm font-medium text-red-800">
								Konsultasi ini telah dibatalkan
							</p>
							<p className="text-xs text-red-700 mt-1">
								Kamu dapat menjadwalkan konsultasi baru kapan saja bersama
								dokter pilihanmu.
							</p>
							<Button
								size="sm"
								className="mt-3 min-h-9"
								render={<Link to="/vets" />}
							>
								Cari Dokter
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
