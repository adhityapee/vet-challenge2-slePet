import { Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Consultation } from "@/data/types";

interface WaitingRoomProps {
	consultation: Consultation;
	onJoin: () => void;
}

export function WaitingRoom({ consultation, onJoin }: WaitingRoomProps) {
	return (
		<div className="flex flex-col items-center text-center px-4 py-10 space-y-6">
			{/* Pulsing indicator */}
			<div className="relative flex items-center justify-center">
				<span className="absolute inline-flex size-20 rounded-full bg-green-400/30 animate-ping" />
				<div className="relative flex size-16 items-center justify-center rounded-full bg-green-100">
					<Video className="size-8 text-green-600" aria-hidden="true" />
				</div>
			</div>

			<div className="space-y-2">
				<h2 className="font-display text-2xl font-bold text-foreground">
					Ruang Tunggu
				</h2>
				<p className="text-muted-foreground text-sm max-w-sm">
					Dokter akan segera bergabung. Tetap tenang ya, bantuan sudah dalam
					perjalanan.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card text-left p-4 w-full max-w-sm space-y-2">
				<div className="flex items-center gap-3">
					<img
						src={consultation.vetPhotoUrl}
						alt={consultation.vetName}
						className="size-10 rounded-full object-cover object-top shrink-0"
					/>
					<div>
						<p className="text-sm font-medium text-foreground">
							{consultation.vetName}
						</p>
						<p className="text-xs text-muted-foreground">
							Dokter hewan berlisensi
						</p>
					</div>
				</div>
				<div className="pt-2 border-t border-border">
					<p className="text-xs text-muted-foreground">Ringkasan keluhan</p>
					<p className="text-sm text-foreground mt-0.5 line-clamp-3">
						{consultation.intake.concern}
					</p>
				</div>
			</div>

			<Button className="w-full max-w-sm min-h-12 text-base" onClick={onJoin}>
				<Video className="size-4 mr-2" aria-hidden="true" />
				Masuk ke Konsultasi
			</Button>
		</div>
	);
}
