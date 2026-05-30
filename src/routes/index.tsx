import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Stethoscope } from "lucide-react";

import { PageSection } from "@/components/common/page-section";
import { ArticleCard } from "@/components/home/article-card";
import { Hero } from "@/components/home/hero";
import { TrustBand } from "@/components/home/trust-band";
import { articles } from "@/data/articles";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const featuredArticles = articles.slice(0, 3);

	return (
		<div className="flex flex-col gap-4 py-6 md:gap-6 md:py-8">
			<Hero />

			<TrustBand />

			{/* Telehealth CTA (primary) */}
			<section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-secondary/30 to-background p-6 md:p-8">
				<div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
					<div className="flex items-start gap-4">
						<span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
							<Stethoscope className="size-6" aria-hidden="true" />
						</span>
						<div className="max-w-xl">
							<p className="text-xs font-semibold uppercase tracking-wide text-primary">
								Telehealth hewan
							</p>
							<h2 className="mt-1 font-display text-2xl font-semibold text-foreground md:text-3xl">
								Hewanmu terlihat kurang sehat?
							</h2>
							<p className="mt-2 text-sm text-muted-foreground">
								Jangan tunggu sampai parah. Booking konsultasi video dengan
								dokter hewan berlisensi sekarang dan dapatkan saran yang tepat
								untuk hewanmu.
							</p>
						</div>
					</div>
					<Link
						to="/vets"
						className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						Cari Dokter
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</div>
			</section>

			{/* Symptom checker entry */}
			<section className="overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
				<div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
					<div className="flex items-start gap-4">
						<span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
							<Stethoscope className="size-6" aria-hidden="true" />
						</span>
						<div className="max-w-xl">
							<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Pemeriksa gejala
							</p>
							<h2 className="mt-1 font-display text-xl font-semibold text-foreground md:text-2xl">
								Belum yakin perlu ke dokter?
							</h2>
							<p className="mt-2 text-sm text-muted-foreground">
								Coba pemeriksa gejala kami dan dapatkan panduan langkah
								selanjutnya.
							</p>
						</div>
					</div>
					<Link
						to="/advice/symptom-checker"
						className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						Coba pemeriksa gejala
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</div>
			</section>

			{/* Articles */}
			<PageSection
				eyebrow="Saran dokter hewan"
				title="Artikel yang ditulis dokter hewan"
				description="Panduan praktis tentang nutrisi, pencegahan, dan tanda-tanda yang perlu Anda kenali."
				action={
					<Link
						to="/advice"
						className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						Semua artikel
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				}
				contentClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
			>
				{featuredArticles.map((article) => (
					<ArticleCard key={article.id} article={article} />
				))}
			</PageSection>

			{/* Social proof band */}
			<section className="rounded-2xl border border-border bg-card p-6 text-center md:p-10">
				<span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
					<Sparkles className="size-6" aria-hidden="true" />
				</span>
				<h2 className="mx-auto mt-4 max-w-2xl font-display text-2xl font-semibold text-foreground md:text-3xl">
					Tempat ribuan pemilik merawat hewan kesayangannya
				</h2>
				<p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
					Dokter hewan berlisensi, saran berbasis ilmu pengetahuan, dan
					konsultasi kapan pun kamu butuhkan.
				</p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
					<Stat value="8" label="Dokter spesialis" />
					<Stat value="Gratis" label="Pemeriksa gejala" />
					<Stat value="4,8★" label="Rata-rata penilaian" />
					<Stat value="Rp 90rb" label="Mulai dari per sesi" />
				</div>
			</section>
		</div>
	);
}

function Stat({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex flex-col items-center">
			<span className="font-display text-3xl font-bold text-primary">
				{value}
			</span>
			<span className="text-xs text-muted-foreground">{label}</span>
		</div>
	);
}
