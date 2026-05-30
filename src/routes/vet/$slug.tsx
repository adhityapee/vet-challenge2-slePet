import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Award, Calendar, Globe, Languages, Star } from "lucide-react";
import { useRef, useState } from "react";

import { AvailabilityPicker } from "@/components/booking/availability-picker";
import { EmptyState } from "@/components/common/empty-state";
import { RatingStars } from "@/components/common/rating-stars";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	SPECIALTY_LABELS,
	SpecialtyBadge,
} from "@/components/vet/specialty-badge";
import { useBooking } from "@/context/booking";
import type { PetSpecies } from "@/data/types";
import { getVetBySlug } from "@/data/vets";
import { track } from "@/lib/analytics";
import { formatIDR } from "@/lib/format";

const SPECIES_LABELS: Record<PetSpecies, string> = {
	dog: "Anjing",
	cat: "Kucing",
	rabbit: "Kelinci",
	bird: "Burung",
	fish: "Ikan",
	other: "Lainnya",
};

export const Route = createFileRoute("/vet/$slug")({
	component: VetProfilePage,
	notFoundComponent: VetNotFound,
	loader: ({ params }) => {
		const vet = getVetBySlug(params.slug);
		if (!vet) throw notFound();
		return vet;
	},
});

function VetNotFound() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-16">
			<EmptyState
				title="Dokter tidak ditemukan"
				description="Dokter yang Anda cari mungkin tidak tersedia. Telusuri direktori dokter untuk menemukan yang tepat."
				action={
					<Button render={<Link to="/vets" />}>Lihat semua dokter</Button>
				}
			/>
		</div>
	);
}

function VetProfilePage() {
	const vet = Route.useLoaderData();
	const { setVet } = useBooking();
	const [activeTab, setActiveTab] = useState("about");
	const tabsRef = useRef<HTMLDivElement>(null);

	function handleSelectSchedule() {
		setVet(vet.id);
		setActiveTab("schedule");
		track("vet_profile_view", { vetId: vet.id, slug: vet.slug });
		setTimeout(() => {
			tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 50);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
				<Breadcrumb className="mb-6">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink render={<Link to="/" />}>Beranda</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink render={<Link to="/vets" />}>
								Cari Dokter
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{vet.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Left: Doctor info */}
					<div className="lg:col-span-1">
						<div className="sticky top-20 space-y-5">
							<div className="overflow-hidden rounded-2xl border border-border bg-card">
								<img
									src={vet.photoUrl}
									alt={`Foto ${vet.name}`}
									className="h-64 w-full object-cover object-top"
								/>
								<div className="p-5 space-y-4">
									<div>
										<h1 className="font-display text-2xl font-bold text-foreground">
											{vet.name}
										</h1>
										<p className="text-sm text-muted-foreground mt-1">
											{vet.credential}
										</p>
									</div>

									<RatingStars
										value={vet.rating}
										count={vet.reviewCount}
										size={16}
									/>

									<div className="flex flex-wrap gap-1.5">
										{vet.specialties.map((s) => (
											<SpecialtyBadge key={s} specialty={s} />
										))}
									</div>

									<div className="space-y-2 text-sm text-muted-foreground pt-1">
										<div className="flex items-center gap-2">
											<Award
												className="size-4 shrink-0 text-primary"
												aria-hidden="true"
											/>
											<span>{vet.yearsExperience} tahun pengalaman</span>
										</div>
										<div className="flex items-center gap-2">
											<Languages
												className="size-4 shrink-0 text-primary"
												aria-hidden="true"
											/>
											<span>{vet.languages.join(", ")}</span>
										</div>
										<div className="flex items-center gap-2">
											<Globe
												className="size-4 shrink-0 text-primary"
												aria-hidden="true"
											/>
											<span>
												{vet.species.map((s) => SPECIES_LABELS[s]).join(", ")}
											</span>
										</div>
									</div>

									<div className="pt-2 border-t border-border">
										<p className="text-xs text-muted-foreground">
											Biaya konsultasi
										</p>
										<p className="text-2xl font-bold text-primary mt-0.5">
											{formatIDR(vet.consultFee)}
										</p>
										<p className="text-xs text-muted-foreground">per sesi</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right: Tabs */}
					<div className="lg:col-span-2" ref={tabsRef}>
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="w-full mb-6">
								<TabsTrigger value="about" className="flex-1">
									Tentang
								</TabsTrigger>
								<TabsTrigger value="reviews" className="flex-1">
									Ulasan ({vet.reviewCount})
								</TabsTrigger>
								<TabsTrigger value="schedule" className="flex-1">
									Jadwal
								</TabsTrigger>
							</TabsList>

							<TabsContent value="about" className="space-y-4">
								<div className="rounded-xl border border-border bg-card p-5">
									<h2 className="font-display font-semibold text-lg text-foreground mb-3">
										Tentang Dokter
									</h2>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{vet.bio}
									</p>
								</div>

								<div className="rounded-xl border border-border bg-card p-5">
									<h2 className="font-display font-semibold text-lg text-foreground mb-3">
										Spesialisasi
									</h2>
									<div className="flex flex-wrap gap-2">
										{vet.specialties.map((s) => (
											<div
												key={s}
												className="flex flex-col items-start gap-1 rounded-lg border border-border bg-muted/40 px-3 py-2"
											>
												<SpecialtyBadge specialty={s} />
												<p className="text-xs text-muted-foreground pl-1">
													{SPECIALTY_LABELS[s]}
												</p>
											</div>
										))}
									</div>
								</div>
							</TabsContent>

							<TabsContent value="reviews" className="space-y-4">
								{vet.reviews.length === 0 ? (
									<EmptyState
										icon={Star}
										title="Belum ada ulasan"
										description="Jadilah yang pertama memberikan ulasan setelah konsultasi."
									/>
								) : (
									<div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
										{vet.reviews.map((review) => (
											<div key={review.id} className="p-5 space-y-2">
												<div className="flex items-start justify-between gap-2">
													<div className="flex items-center gap-2.5">
														<div className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary text-sm font-semibold shrink-0">
															{review.author.charAt(0)}
														</div>
														<div>
															<p className="text-sm font-medium text-foreground">
																{review.author}
															</p>
															<p className="text-xs text-muted-foreground">
																{review.date}
															</p>
														</div>
													</div>
													<RatingStars
														value={review.rating}
														showValue={false}
														size={14}
													/>
												</div>
												{review.title && (
													<p className="text-sm font-medium text-foreground">
														{review.title}
													</p>
												)}
												<p className="text-sm text-muted-foreground">
													{review.body}
												</p>
											</div>
										))}
									</div>
								)}
							</TabsContent>

							<TabsContent value="schedule" id="jadwal">
								<div className="rounded-xl border border-border bg-card p-5">
									<h2 className="font-display font-semibold text-lg text-foreground mb-1">
										Pilih Jadwal Konsultasi
									</h2>
									<p className="text-sm text-muted-foreground mb-5">
										Pilih tanggal dan waktu yang tersedia untuk sesi konsultasi
										video bersama {vet.name}.
									</p>
									<AvailabilityPicker vetId={vet.id} />
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>

			{/* Sticky CTA for mobile */}
			<div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background/95 backdrop-blur px-4 py-3 md:hidden">
				<Button
					className="w-full min-h-12 text-base"
					onClick={handleSelectSchedule}
				>
					<Calendar className="size-4 mr-2" aria-hidden="true" />
					Pilih Jadwal Konsultasi
				</Button>
			</div>
		</div>
	);
}
