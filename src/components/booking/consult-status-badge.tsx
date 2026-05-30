import { Badge } from "@/components/ui/badge";
import type { ConsultStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
	ConsultStatus,
	{ label: string; className: string }
> = {
	scheduled: {
		label: "Terjadwal",
		className: "bg-blue-50 text-blue-700 border-blue-200",
	},
	waiting: {
		label: "Ruang Tunggu",
		className: "bg-amber-50 text-amber-700 border-amber-200",
	},
	live: {
		label: "Berlangsung",
		className: "bg-green-50 text-green-700 border-green-200",
	},
	ended: {
		label: "Selesai",
		className: "bg-muted text-muted-foreground border-border",
	},
	cancelled: {
		label: "Dibatalkan",
		className: "bg-red-50 text-red-700 border-red-200",
	},
};

interface ConsultStatusBadgeProps {
	status: ConsultStatus;
	className?: string;
}

export function ConsultStatusBadge({
	status,
	className,
}: ConsultStatusBadgeProps) {
	const config = STATUS_CONFIG[status];
	return (
		<Badge
			variant="outline"
			className={cn("border font-medium", config.className, className)}
		>
			{config.label}
		</Badge>
	);
}
