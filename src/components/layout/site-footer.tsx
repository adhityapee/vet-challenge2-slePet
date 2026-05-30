import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";

const CONSULT_LINKS = [
	{ to: "/vets", label: "Cari Dokter" },
	{ to: "/booking/intake", label: "Booking Konsultasi" },
	{ to: "/account/consultations", label: "Jadwal Konsultasi" },
] as const;

const ADVICE_LINKS = [
	{ to: "/advice", label: "Artikel Dokter" },
	{ to: "/advice/symptom-checker", label: "Cek Gejala" },
	{ to: "/advice/ask", label: "Tanya Dokter" },
] as const;

const ACCOUNT_LINKS = [
	{ to: "/account", label: "Akun Saya" },
	{ to: "/account/consultations", label: "Konsultasi Saya" },
	{ to: "/account/pets", label: "Profil Hewan" },
] as const;

export function SiteFooter() {
	return (
		<footer className="border-t border-border bg-muted/40">
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
					<div className="lg:col-span-2">
						<div className="flex items-center gap-1.5">
							<PawPrint className="size-6 text-primary" aria-hidden="true" />
							<span className="font-display text-xl font-bold text-primary">
								PetSehat
							</span>
						</div>
						<p className="mt-3 max-w-sm text-sm text-muted-foreground">
							Platform telehealth hewan kesayangan. Konsultasi langsung dengan
							dokter hewan berlisensi kapan pun hewanmu membutuhkan pertolongan.
						</p>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-foreground">
							Konsultasi
						</h3>
						<ul className="mt-3 space-y-2">
							{CONSULT_LINKS.map((link) => (
								<li key={link.label}>
									<Link
										to={link.to}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-foreground">
							Saran Dokter
						</h3>
						<ul className="mt-3 space-y-2">
							{ADVICE_LINKS.map((link) => (
								<li key={link.label}>
									<Link
										to={link.to}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-foreground">Akun</h3>
						<ul className="mt-3 space-y-2">
							{ACCOUNT_LINKS.map((link) => (
								<li key={link.label}>
									<Link
										to={link.to}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
					<p>
						Pembayaran konsultasi via GoPay, OVO, DANA, QRIS, dan Virtual
						Account.
					</p>
					<p>8 dokter hewan spesialis siap membantu hewanmu.</p>
				</div>
				<p className="mt-4 text-xs text-muted-foreground">
					&copy; {new Date().getFullYear()} PetSehat. Platform telehealth hewan
					untuk tujuan peragaan.
				</p>
			</div>
		</footer>
	);
}
