import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SPECIALTY_LABELS } from "@/components/vet/specialty-badge";
import { VetCard } from "@/components/vet/vet-card";
import type { PetSpecies, VetSpecialty } from "@/data/types";
import { getAllVets } from "@/data/vets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vets/")({
	component: VetsPage,
});

const SPECIES_LABELS: Record<PetSpecies, string> = {
	dog: "Anjing",
	cat: "Kucing",
	rabbit: "Kelinci",
	bird: "Burung",
	fish: "Ikan",
	other: "Lainnya",
};

const ALL_SPECIALTIES: VetSpecialty[] = [
	"general",
	"dermatology",
	"nutrition",
	"behavior",
	"surgery",
	"exotic",
	"dental",
];

const ALL_SPECIES: PetSpecies[] = [
	"dog",
	"cat",
	"rabbit",
	"bird",
	"fish",
	"other",
];

function VetsPage() {
	const allVets = getAllVets();
	const [query, setQuery] = useState("");
	const [selectedSpecialties, setSelectedSpecialties] = useState<
		VetSpecialty[]
	>([]);
	const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies[]>([]);

	const filtered = useMemo(() => {
		return allVets.filter((vet) => {
			if (query) {
				const q = query.toLowerCase();
				const matches =
					vet.name.toLowerCase().includes(q) ||
					vet.specialties.some((s) =>
						SPECIALTY_LABELS[s].toLowerCase().includes(q),
					);
				if (!matches) return false;
			}
			if (selectedSpecialties.length > 0) {
				if (!selectedSpecialties.some((s) => vet.specialties.includes(s)))
					return false;
			}
			if (selectedSpecies.length > 0) {
				if (!selectedSpecies.some((s) => vet.species.includes(s))) return false;
			}
			return true;
		});
	}, [allVets, query, selectedSpecialties, selectedSpecies]);

	function toggleSpecialty(s: VetSpecialty) {
		setSelectedSpecialties((prev) =>
			prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
		);
	}

	function toggleSpecies(s: PetSpecies) {
		setSelectedSpecies((prev) =>
			prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
		);
	}

	function clearAll() {
		setQuery("");
		setSelectedSpecialties([]);
		setSelectedSpecies([]);
	}

	const hasFilters =
		query.length > 0 ||
		selectedSpecialties.length > 0 ||
		selectedSpecies.length > 0;

	return (
		<div className="min-h-screen bg-background">
			<div className="border-b border-border bg-card/60">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
					<h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
						Temukan Dokter Hewan
					</h1>
					<p className="mt-2 text-muted-foreground max-w-xl">
						Konsultasi dengan dokter hewan berlisensi dan berpengalaman. Pilih
						spesialisasi yang sesuai dengan kebutuhan hewanmu.
					</p>

					<div className="mt-6 relative max-w-md">
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
							aria-hidden="true"
						/>
						<Input
							type="search"
							placeholder="Cari nama dokter atau spesialisasi..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="pl-9"
							aria-label="Cari dokter hewan"
						/>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
				<div className="flex flex-col gap-6 lg:flex-row">
					{/* Sidebar filter */}
					<aside className="w-full lg:w-56 shrink-0">
						<div className="sticky top-20 space-y-5">
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
									Spesialisasi
								</p>
								<div className="flex flex-wrap gap-1.5">
									{ALL_SPECIALTIES.map((s) => (
										<button
											key={s}
											type="button"
											onClick={() => toggleSpecialty(s)}
											className={cn(
												"min-h-9 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
												selectedSpecialties.includes(s)
													? "border-primary bg-primary text-primary-foreground"
													: "border-border bg-card text-foreground hover:bg-muted",
											)}
										>
											{SPECIALTY_LABELS[s]}
										</button>
									))}
								</div>
							</div>

							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
									Jenis Hewan
								</p>
								<div className="flex flex-wrap gap-1.5">
									{ALL_SPECIES.map((s) => (
										<button
											key={s}
											type="button"
											onClick={() => toggleSpecies(s)}
											className={cn(
												"min-h-9 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
												selectedSpecies.includes(s)
													? "border-primary bg-primary text-primary-foreground"
													: "border-border bg-card text-foreground hover:bg-muted",
											)}
										>
											{SPECIES_LABELS[s]}
										</button>
									))}
								</div>
							</div>

							{hasFilters && (
								<button
									type="button"
									onClick={clearAll}
									className="flex items-center gap-1.5 text-sm text-primary hover:underline"
								>
									<X className="size-3.5" aria-hidden="true" />
									Hapus semua filter
								</button>
							)}
						</div>
					</aside>

					{/* Main content */}
					<div className="flex-1">
						<div className="mb-4 flex items-center justify-between">
							<p className="text-sm text-muted-foreground">
								{filtered.length} dokter ditemukan
							</p>
							{hasFilters && (
								<div className="flex flex-wrap gap-1.5">
									{selectedSpecialties.map((s) => (
										<Badge
											key={s}
											variant="secondary"
											className="cursor-pointer gap-1 pr-1"
											onClick={() => toggleSpecialty(s)}
										>
											{SPECIALTY_LABELS[s]}
											<X
												className="size-3"
												aria-label={`Hapus filter ${SPECIALTY_LABELS[s]}`}
											/>
										</Badge>
									))}
									{selectedSpecies.map((s) => (
										<Badge
											key={s}
											variant="secondary"
											className="cursor-pointer gap-1 pr-1"
											onClick={() => toggleSpecies(s)}
										>
											{SPECIES_LABELS[s]}
											<X
												className="size-3"
												aria-label={`Hapus filter ${SPECIES_LABELS[s]}`}
											/>
										</Badge>
									))}
								</div>
							)}
						</div>

						{filtered.length === 0 ? (
							<EmptyState
								icon={SlidersHorizontal}
								title="Tidak ada dokter yang cocok"
								description="Coba ubah filter atau kata kunci pencarianmu."
								action={
									<Button variant="outline" onClick={clearAll}>
										Hapus filter
									</Button>
								}
							/>
						) : (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
								{filtered.map((vet) => (
									<VetCard key={vet.id} vet={vet} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
