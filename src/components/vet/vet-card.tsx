import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { RatingStars } from "@/components/common/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpecialtyBadge } from "@/components/vet/specialty-badge";
import type { Vet } from "@/data/types";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface VetCardProps {
	vet: Vet;
	className?: string;
}

function isAvailableToday(nextAvailable: string): boolean {
	const available = new Date(nextAvailable);
	const today = new Date();
	return (
		available.getFullYear() === today.getFullYear() &&
		available.getMonth() === today.getMonth() &&
		available.getDate() === today.getDate()
	);
}

export function VetCard({ vet, className }: VetCardProps) {
	const availableToday = isAvailableToday(vet.nextAvailable);

	return (
		<article
			className={cn(
				"group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md",
				className,
			)}
		>
			<div className="relative">
				<img
					src={vet.photoUrl}
					alt={`Foto ${vet.name}`}
					className="h-48 w-full object-cover object-center"
					loading="lazy"
				/>
				{availableToday && (
					<div className="absolute top-3 right-3">
						<Badge className="bg-green-500 text-white border-0 shadow-sm">
							Tersedia hari ini
						</Badge>
					</div>
				)}
			</div>

			<div className="flex flex-col flex-1 p-4 gap-3">
				<div>
					<h3 className="font-display font-semibold text-lg text-foreground leading-tight">
						{vet.name}
					</h3>
					<p className="text-sm text-muted-foreground mt-0.5">
						{vet.credential}
					</p>
				</div>

				<RatingStars value={vet.rating} count={vet.reviewCount} size={14} />

				<div className="flex flex-wrap gap-1.5">
					{vet.specialties.slice(0, 2).map((s) => (
						<SpecialtyBadge key={s} specialty={s} />
					))}
					{vet.specialties.length > 2 && (
						<Badge variant="outline" className="text-muted-foreground">
							+{vet.specialties.length - 2}
						</Badge>
					)}
				</div>

				<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<Languages className="size-3.5 shrink-0" aria-hidden="true" />
					<span>{vet.languages.join(", ")}</span>
				</div>

				<div className="mt-auto pt-2 flex items-center justify-between border-t border-border">
					<div>
						<p className="text-xs text-muted-foreground">Mulai dari</p>
						<p className="font-semibold text-primary text-base">
							{formatIDR(vet.consultFee)}
						</p>
					</div>
					<Button
						size="sm"
						render={<Link to="/vet/$slug" params={{ slug: vet.slug }} />}
						className="min-h-11 shrink-0"
					>
						Pilih Jadwal
					</Button>
				</div>
			</div>
		</article>
	);
}

export { isAvailableToday };
