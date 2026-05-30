import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	Camera,
	ChevronRight,
	Clock,
	Stethoscope,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useBooking } from "@/context/booking";
import { usePetProfiles } from "@/context/pet-profile";
import type { PetSpecies, SymptomIntake } from "@/data/types";
import { getVetById } from "@/data/vets";
import { track } from "@/lib/analytics";
import { formatConsultDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/booking/intake")({
	component: IntakePage,
});

const SPECIES_LABELS: Record<PetSpecies, string> = {
	dog: "Anjing",
	cat: "Kucing",
	rabbit: "Kelinci",
	bird: "Burung",
	fish: "Ikan",
	other: "Lainnya",
};

const SPECIES_OPTIONS: { value: PetSpecies; emoji: string }[] = [
	{ value: "dog", emoji: "🐶" },
	{ value: "cat", emoji: "🐱" },
	{ value: "rabbit", emoji: "🐰" },
	{ value: "bird", emoji: "🐦" },
	{ value: "fish", emoji: "🐟" },
	{ value: "other", emoji: "🐾" },
];

const STEP_IDS = ["s0", "s1", "s2", "s3", "s4", "s5"];

function StepIndicator({ current, total }: { current: number; total: number }) {
	return (
		<div className="flex items-center gap-2 mb-6">
			{STEP_IDS.slice(0, total).map((stepId, i) => (
				<div
					key={stepId}
					className={cn(
						"h-1.5 flex-1 rounded-full transition-all duration-300",
						i < current
							? "bg-primary"
							: i === current
								? "bg-primary/50"
								: "bg-border",
					)}
				/>
			))}
		</div>
	);
}

function IntakePage() {
	const navigate = useNavigate();
	const { vetId, selectedSlot, setIntake, intake } = useBooking();
	const { profiles } = usePetProfiles();

	useEffect(() => {
		if (!vetId || !selectedSlot) {
			navigate({ to: "/vets" });
		}
	}, [vetId, selectedSlot, navigate]);

	const vet = vetId ? getVetById(vetId) : null;

	const [step, setStep] = useState(0);
	const TOTAL_STEPS = 4;

	// Step 0: Pet selection
	const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
		intake?.petProfileId ?? null,
	);
	const [quickPetName, setQuickPetName] = useState(intake?.petName ?? "");
	const [quickPetSpecies, setQuickPetSpecies] = useState<PetSpecies>(
		intake?.petSpecies ?? "dog",
	);
	const [useQuickPet, setUseQuickPet] = useState(
		intake?.petProfileId === null && !!intake?.petName,
	);

	// Step 1: Concern
	const [concern, setConcern] = useState(intake?.concern ?? "");
	const [durationDays, setDurationDays] = useState(
		String(intake?.durationDays ?? 1),
	);
	const [urgency, setUrgency] = useState<SymptomIntake["urgency"]>(
		intake?.urgency ?? "routine",
	);

	// Step 2: Photos
	const [photos, setPhotos] = useState<string[]>(intake?.photoDataUrls ?? []);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function handlePhotoAdd(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? []);
		files.slice(0, 3 - photos.length).forEach((file) => {
			const reader = new FileReader();
			reader.onload = (ev) => {
				const result = ev.target?.result as string;
				setPhotos((prev) => [...prev, result].slice(0, 3));
			};
			reader.readAsDataURL(file);
		});
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function removePhoto(idx: number) {
		setPhotos((prev) => prev.filter((_, i) => i !== idx));
	}

	function validateStep0(): boolean {
		if (useQuickPet) return quickPetName.trim().length > 0;
		return selectedProfileId !== null;
	}

	function validateStep1(): boolean {
		return concern.trim().length >= 5 && Number(durationDays) >= 1;
	}

	function goNext() {
		if (step === 0 && !validateStep0()) return;
		if (step === 1 && !validateStep1()) return;
		setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
		if (step === 0) track("start_intake", { vetId });
	}

	function goBack() {
		if (step === 0) {
			navigate({
				to: vet ? "/vet/$slug" : "/vets",
				params: vet ? { slug: vet.slug } : undefined,
			});
			return;
		}
		setStep((s) => Math.max(0, s - 1));
	}

	function buildIntake(): SymptomIntake {
		const profile = profiles.find((p) => p.id === selectedProfileId);
		return {
			petProfileId: useQuickPet ? null : selectedProfileId,
			petName: useQuickPet ? quickPetName : (profile?.name ?? ""),
			petSpecies: useQuickPet ? quickPetSpecies : (profile?.species ?? "dog"),
			concern: concern.trim(),
			durationDays: Number(durationDays),
			urgency,
			photoDataUrls: photos,
		};
	}

	function handleFinish() {
		const intakeData = buildIntake();
		setIntake(intakeData);
		track("intake_completed", { vetId, urgency: intakeData.urgency });
		navigate({ to: "/booking/confirm" });
	}

	const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
	const petDisplayName = useQuickPet
		? quickPetName
		: (selectedProfile?.name ?? "");
	const petDisplaySpecies = useQuickPet
		? quickPetSpecies
		: (selectedProfile?.species ?? "dog");

	if (!vetId || !selectedSlot) return null;

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
				{/* Header */}
				<div className="mb-6">
					<button
						type="button"
						onClick={goBack}
						className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
					>
						<ChevronRight className="size-4 rotate-180" aria-hidden="true" />
						Kembali
					</button>
					<h1 className="font-display text-2xl font-bold text-foreground">
						Ceritakan Kondisi Hewanmu
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Dokter akan membantu lebih baik dengan informasi ini.
					</p>
				</div>

				{/* Appointment info */}
				{vet && selectedSlot && (
					<div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
						<img
							src={vet.photoUrl}
							alt={vet.name}
							className="size-10 rounded-full object-cover object-top shrink-0"
						/>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-foreground truncate">
								{vet.name}
							</p>
							<p className="text-xs text-muted-foreground">
								{formatConsultDateTime(selectedSlot.date, selectedSlot.time)}
							</p>
						</div>
						<Clock
							className="size-4 text-muted-foreground shrink-0"
							aria-hidden="true"
						/>
					</div>
				)}

				<StepIndicator current={step} total={TOTAL_STEPS} />

				{/* Step 0: Pet selection */}
				{step === 0 && (
					<div className="space-y-5">
						<h2 className="font-semibold text-foreground">
							Konsultasi untuk hewan siapa?
						</h2>

						{profiles.length > 0 && !useQuickPet && (
							<div className="space-y-2">
								{profiles.map((profile) => (
									<button
										key={profile.id}
										type="button"
										onClick={() => setSelectedProfileId(profile.id)}
										className={cn(
											"w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all min-h-[3.5rem]",
											selectedProfileId === profile.id
												? "border-primary bg-primary/5"
												: "border-border bg-card hover:border-primary/50",
										)}
									>
										<span className="text-2xl" aria-hidden="true">
											{
												SPECIES_OPTIONS.find((s) => s.value === profile.species)
													?.emoji
											}
										</span>
										<div className="flex-1">
											<p className="font-medium text-foreground">
												{profile.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{SPECIES_LABELS[profile.species]}
											</p>
										</div>
										{selectedProfileId === profile.id && (
											<div className="size-5 rounded-full bg-primary flex items-center justify-center shrink-0">
												<ChevronRight
													className="size-3 text-primary-foreground"
													aria-hidden="true"
												/>
											</div>
										)}
									</button>
								))}

								<button
									type="button"
									onClick={() => {
										setUseQuickPet(true);
										setSelectedProfileId(null);
									}}
									className="w-full flex items-center gap-3 rounded-xl border border-dashed border-border p-4 text-left text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all min-h-[3.5rem]"
								>
									<span className="text-2xl" aria-hidden="true">
										🐾
									</span>
									<span className="text-sm">Isi data hewan baru</span>
								</button>
							</div>
						)}

						{(profiles.length === 0 || useQuickPet) && (
							<div className="space-y-4 rounded-xl border border-border bg-card p-4">
								<div className="space-y-2">
									<Label htmlFor="pet-name">Nama hewan</Label>
									<Input
										id="pet-name"
										placeholder="Misal: Milo, Cici"
										value={quickPetName}
										onChange={(e) => setQuickPetName(e.target.value)}
										autoFocus
									/>
								</div>
								<div className="space-y-2">
									<Label>Jenis hewan</Label>
									<div className="grid grid-cols-3 gap-2">
										{SPECIES_OPTIONS.map((opt) => (
											<button
												key={opt.value}
												type="button"
												onClick={() => setQuickPetSpecies(opt.value)}
												className={cn(
													"flex flex-col items-center gap-1 rounded-lg border p-3 text-xs font-medium min-h-[3.5rem] transition-all",
													quickPetSpecies === opt.value
														? "border-primary bg-primary/5 text-primary"
														: "border-border bg-card text-muted-foreground hover:border-primary/50",
												)}
											>
												<span className="text-xl" aria-hidden="true">
													{opt.emoji}
												</span>
												{SPECIES_LABELS[opt.value]}
											</button>
										))}
									</div>
								</div>
								{profiles.length > 0 && (
									<button
										type="button"
										onClick={() => setUseQuickPet(false)}
										className="text-sm text-primary hover:underline"
									>
										Pilih dari profil tersimpan
									</button>
								)}
							</div>
						)}
					</div>
				)}

				{/* Step 1: Concern */}
				{step === 1 && (
					<div className="space-y-5">
						<h2 className="font-semibold text-foreground">
							Apa yang kamu khawatirkan?
						</h2>
						<p className="text-sm text-muted-foreground">
							Ceritakan kondisi {petDisplayName} dengan kata-katamu sendiri.
							Dokter akan membantu.
						</p>

						<div className="space-y-2">
							<Label htmlFor="concern">Keluhan utama</Label>
							<Textarea
								id="concern"
								placeholder="Contoh: Kucing saya tidak mau makan sejak kemarin dan badannya terasa hangat..."
								value={concern}
								onChange={(e) => setConcern(e.target.value)}
								rows={4}
								className="resize-none"
							/>
							<p className="text-xs text-muted-foreground">
								Semakin detail, semakin tepat saran dokternya.
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="duration">Sudah berapa hari?</Label>
							<Input
								id="duration"
								type="number"
								min={1}
								max={365}
								value={durationDays}
								onChange={(e) => setDurationDays(e.target.value)}
								className="w-32"
							/>
						</div>

						<div className="space-y-2">
							<Label>Tingkat urgensi</Label>
							<RadioGroup
								value={urgency}
								onValueChange={(v) => setUrgency(v as SymptomIntake["urgency"])}
								className="space-y-2"
							>
								{[
									{
										value: "routine",
										label: "Konsultasi rutin",
										desc: "Tidak ada tanda bahaya, ingin saran umum",
									},
									{
										value: "soon",
										label: "Perlu diperhatikan",
										desc: "Ada gejala yang perlu ditangani dalam beberapa hari",
									},
									{
										value: "urgent",
										label: "Segera",
										desc: "Kondisi memburuk atau butuh penanganan cepat",
									},
								].map((opt) => (
									<Label
										key={opt.value}
										className={cn(
											"flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all",
											urgency === opt.value
												? "border-primary bg-primary/5"
												: "border-border bg-card hover:border-primary/40",
										)}
									>
										<RadioGroupItem value={opt.value} className="mt-0.5" />
										<div>
											<p className="font-medium text-foreground text-sm">
												{opt.label}
											</p>
											<p className="text-xs text-muted-foreground">
												{opt.desc}
											</p>
										</div>
									</Label>
								))}
							</RadioGroup>
						</div>
					</div>
				)}

				{/* Step 2: Photos */}
				{step === 2 && (
					<div className="space-y-5">
						<h2 className="font-semibold text-foreground">
							Tambahkan foto (opsional)
						</h2>
						<p className="text-sm text-muted-foreground">
							Foto membantu dokter menilai kondisi {petDisplayName} lebih cepat.
							Kamu bisa melanjutkan tanpa foto.
						</p>

						<div className="grid grid-cols-3 gap-3">
							{photos.map((url, idx) => (
								<div key={url.slice(-16)} className="relative aspect-square">
									<img
										src={url}
										alt={`Foto ${idx + 1}`}
										className="w-full h-full object-cover rounded-xl border border-border"
									/>
									<button
										type="button"
										onClick={() => removePhoto(idx)}
										aria-label={`Hapus foto ${idx + 1}`}
										className="absolute -top-2 -right-2 size-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm"
									>
										<X className="size-3.5" aria-hidden="true" />
									</button>
								</div>
							))}

							{photos.length < 3 && (
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-primary/50 hover:bg-muted/40 transition-all"
								>
									<Camera className="size-6" aria-hidden="true" />
									<span className="text-xs font-medium">Tambah foto</span>
								</button>
							)}
						</div>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							multiple
							className="sr-only"
							aria-label="Upload foto hewan"
							onChange={handlePhotoAdd}
						/>

						<div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800">
							<AlertCircle
								className="size-4 shrink-0 mt-0.5"
								aria-hidden="true"
							/>
							<p>
								Foto disimpan sementara di perangkatmu dan tidak dikirim ke
								server.
							</p>
						</div>
					</div>
				)}

				{/* Step 3: Summary */}
				{step === 3 && (
					<div className="space-y-5">
						<h2 className="font-semibold text-foreground">
							Ringkasan sebelum lanjut
						</h2>

						<div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
							<div className="px-4 py-3.5 flex justify-between items-start gap-2">
								<div>
									<p className="text-xs text-muted-foreground">Dokter</p>
									<p className="text-sm font-medium text-foreground mt-0.5">
										{vet?.name}
									</p>
								</div>
							</div>
							<div className="px-4 py-3.5 flex justify-between items-start gap-2">
								<div>
									<p className="text-xs text-muted-foreground">Jadwal</p>
									<p className="text-sm font-medium text-foreground mt-0.5">
										{selectedSlot &&
											formatConsultDateTime(
												selectedSlot.date,
												selectedSlot.time,
											)}
									</p>
								</div>
							</div>
							<div className="px-4 py-3.5">
								<p className="text-xs text-muted-foreground">Hewan</p>
								<p className="text-sm font-medium text-foreground mt-0.5">
									{petDisplayName} ({SPECIES_LABELS[petDisplaySpecies]})
								</p>
							</div>
							<div className="px-4 py-3.5">
								<p className="text-xs text-muted-foreground">Keluhan</p>
								<p className="text-sm text-foreground mt-0.5">{concern}</p>
								<p className="text-xs text-muted-foreground mt-1">
									Durasi: {durationDays} hari
								</p>
							</div>
							<div className="px-4 py-3.5 flex justify-between">
								<div>
									<p className="text-xs text-muted-foreground">
										Tingkat urgensi
									</p>
									<p className="text-sm font-medium text-foreground mt-0.5 capitalize">
										{urgency === "routine"
											? "Rutin"
											: urgency === "soon"
												? "Perlu diperhatikan"
												: "Segera"}
									</p>
								</div>
								{urgency === "urgent" && (
									<Stethoscope
										className="size-5 text-destructive"
										aria-hidden="true"
									/>
								)}
							</div>
							{photos.length > 0 && (
								<div className="px-4 py-3.5">
									<p className="text-xs text-muted-foreground mb-2">
										Foto ({photos.length})
									</p>
									<div className="flex gap-2">
										{photos.map((url, idx) => (
											<img
												key={url.slice(-16)}
												src={url}
												alt={`Foto ${idx + 1}`}
												className="size-14 rounded-lg object-cover border border-border"
											/>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Navigation */}
				<div className="mt-8 flex gap-3">
					{step > 0 && (
						<Button
							variant="outline"
							onClick={goBack}
							className="min-h-12 px-6"
						>
							Kembali
						</Button>
					)}
					{step < TOTAL_STEPS - 1 ? (
						<Button
							className="flex-1 min-h-12 text-base"
							onClick={goNext}
							disabled={
								step === 0
									? !validateStep0()
									: step === 1
										? !validateStep1()
										: false
							}
						>
							Lanjutkan
						</Button>
					) : (
						<Button
							className="flex-1 min-h-12 text-base"
							onClick={handleFinish}
						>
							Lanjut ke Pembayaran
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
