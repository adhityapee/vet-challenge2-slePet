import { PhoneCall, Video } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Consultation } from "@/data/types";
import { cn } from "@/lib/utils";

interface WaitingRoomProps {
	consultation: Consultation;
	onJoin: () => void;
}

const DOCTOR_READY_DELAY_MS = 4000;

export function WaitingRoom({ consultation, onJoin }: WaitingRoomProps) {
	const [doctorReady, setDoctorReady] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setDoctorReady(true), DOCTOR_READY_DELAY_MS);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="flex flex-col items-center text-center px-4 py-10 space-y-6">
			{/* Pulsing indicator */}
			<div className="relative flex items-center justify-center">
				<span
					className={cn(
						"absolute inline-flex size-20 rounded-full animate-ping",
						doctorReady ? "bg-green-400/30" : "bg-amber-400/40",
					)}
				/>
				<div
					className={cn(
						"relative flex size-16 items-center justify-center rounded-full transition-colors duration-500",
						doctorReady ? "bg-green-100" : "bg-amber-100",
					)}
				>
					{doctorReady ? (
						<Video className="size-8 text-green-600" aria-hidden="true" />
					) : (
						<PhoneCall className="size-8 text-amber-600" aria-hidden="true" />
					)}
				</div>
			</div>

			{/* Headline & deskripsi */}
			<div className="space-y-2">
				<h2 className="font-display text-2xl font-bold text-foreground">
					{doctorReady ? "Dokter sudah siap!" : "Menghubungkan ke dokter..."}
				</h2>
				<p className="text-muted-foreground text-sm max-w-sm">
					{doctorReady
						? "Doktermu sudah berada di dalam ruang konsultasi. Kamu bisa masuk sekarang."
						: "Harap tunggu, kami sedang menghubungkan kamu dengan doktermu."}
				</p>
			</div>

			{/* Kartu dokter + status */}
			<div className="rounded-xl border border-border bg-card text-left p-4 w-full max-w-sm space-y-2">
				<div className="flex items-center gap-3">
					<img
						src={consultation.vetPhotoUrl}
						alt={consultation.vetName}
						className="size-10 rounded-full object-cover object-top shrink-0"
					/>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-foreground">
							{consultation.vetName}
						</p>
						<div className="flex items-center gap-1.5 mt-0.5">
							<span
								className={cn(
									"size-2 rounded-full shrink-0",
									doctorReady ? "bg-green-500" : "bg-amber-400 animate-pulse",
								)}
								aria-hidden="true"
							/>
							<p className="text-xs text-muted-foreground">
								{doctorReady
									? "Siap bergabung"
									: "Sedang mempersiapkan diri..."}
							</p>
						</div>
					</div>
				</div>
				<div className="pt-2 border-t border-border">
					<p className="text-xs text-muted-foreground">Ringkasan keluhan</p>
					<p className="text-sm text-foreground mt-0.5 line-clamp-3">
						{consultation.intake.concern}
					</p>
				</div>
			</div>

			{/* Tombol — disabled saat calling */}
			<Button
				className="w-full max-w-sm min-h-12 text-base"
				disabled={!doctorReady}
				onClick={onJoin}
			>
				<Video className="size-4 mr-2" aria-hidden="true" />
				{doctorReady ? "Masuk ke Konsultasi" : "Menunggu dokter bergabung..."}
			</Button>
		</div>
	);
}
