import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	ShieldCheck,
	Sparkles,
	Stethoscope,
	Video,
} from "lucide-react";

export function Hero() {
	return (
		<section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/60 via-background to-background">
			<div
				className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/30 blur-3xl"
				aria-hidden="true"
			/>
			<div className="relative grid items-center gap-8 p-6 md:grid-cols-2 md:gap-6 md:p-10 lg:p-14">
				<div className="flex flex-col items-start gap-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
					<div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5">
						<ShieldCheck className="size-4 text-primary" aria-hidden="true" />
						<span className="text-xs font-semibold text-primary">
							Dokter hewan berlisensi
						</span>
					</div>

					<h1 className="font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
						Khawatir dengan hewanmu? Konsultasi dengan dokter hari ini
					</h1>
					<p className="max-w-md text-base text-muted-foreground md:text-lg">
						Video call langsung dengan dokter hewan berpengalaman dari rumah.
						Diagnosis cepat, saran tepat, untuk ketenangan pikiranmu.
					</p>

					<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
						<Link
							to="/vets"
							className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
						>
							<Stethoscope className="size-5" aria-hidden="true" />
							Cari Dokter
						</Link>
						<Link
							to="/advice"
							className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-background px-6 text-base font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
						>
							Saran Dokter
							<ArrowRight className="size-4" aria-hidden="true" />
						</Link>
					</div>

					<p className="flex items-center gap-1.5 text-sm text-muted-foreground">
						<Sparkles className="size-4 text-primary" aria-hidden="true" />8
						dokter spesialis siap membantu, mulai Rp 90.000 per sesi.
					</p>
				</div>

				<div className="relative animate-in fade-in zoom-in-95 duration-700">
					<div className="overflow-hidden rounded-2xl border border-border shadow-sm">
						<img
							src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1100&q=80"
							alt="Kucing dan anjing peliharaan yang sehat berdampingan"
							className="aspect-[4/3] size-full object-cover"
						/>
					</div>
					<div className="absolute -bottom-4 -left-4 hidden max-w-56 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-md sm:flex">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
							<Video className="size-5" aria-hidden="true" />
						</span>
						<p className="text-sm font-medium leading-snug text-foreground">
							Konsultasi video kapan saja, dari rumah.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
