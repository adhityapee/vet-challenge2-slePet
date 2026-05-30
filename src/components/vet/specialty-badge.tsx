import { Badge } from "@/components/ui/badge";
import type { VetSpecialty } from "@/data/types";
import { cn } from "@/lib/utils";

const SPECIALTY_LABELS: Record<VetSpecialty, string> = {
	general: "Umum",
	dermatology: "Dermatologi",
	nutrition: "Nutrisi",
	behavior: "Perilaku",
	surgery: "Bedah",
	exotic: "Hewan Eksotis",
	dental: "Gigi",
};

const SPECIALTY_COLORS: Record<VetSpecialty, string> = {
	general: "bg-blue-50 text-blue-700 border-blue-200",
	dermatology: "bg-pink-50 text-pink-700 border-pink-200",
	nutrition: "bg-green-50 text-green-700 border-green-200",
	behavior: "bg-purple-50 text-purple-700 border-purple-200",
	surgery: "bg-orange-50 text-orange-700 border-orange-200",
	exotic: "bg-teal-50 text-teal-700 border-teal-200",
	dental: "bg-amber-50 text-amber-700 border-amber-200",
};

interface SpecialtyBadgeProps {
	specialty: VetSpecialty;
	className?: string;
}

export function SpecialtyBadge({ specialty, className }: SpecialtyBadgeProps) {
	return (
		<Badge
			variant="outline"
			className={cn(
				"border font-medium",
				SPECIALTY_COLORS[specialty],
				className,
			)}
		>
			{SPECIALTY_LABELS[specialty]}
		</Badge>
	);
}

export { SPECIALTY_LABELS };
