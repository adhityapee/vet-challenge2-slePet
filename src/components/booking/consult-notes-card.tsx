import { Link } from "@tanstack/react-router";
import { Download, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ConsultNote, Vet } from "@/data/types";
import { formatDateID } from "@/lib/format";

interface ConsultNotesCardProps {
	notes: ConsultNote;
	vet: Vet;
}

export function ConsultNotesCard({ notes, vet }: ConsultNotesCardProps) {
	function handlePrint() {
		window.print();
	}

	return (
		<div className="space-y-5">
			<div className="rounded-xl border border-border bg-card overflow-hidden">
				<div className="px-4 py-3 border-b border-border bg-muted/30">
					<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						Catatan Dokter
					</p>
					<p className="text-xs text-muted-foreground mt-0.5">
						Diterbitkan {formatDateID(notes.issuedAt)} oleh {vet.name}
					</p>
				</div>

				<div className="divide-y divide-border">
					<div className="px-4 py-4">
						<h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
							Ringkasan
						</h3>
						<p className="text-sm text-foreground leading-relaxed">
							{notes.summary}
						</p>
					</div>
					<div className="px-4 py-4">
						<h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
							Diagnosis
						</h3>
						<p className="text-sm text-foreground leading-relaxed">
							{notes.diagnosis}
						</p>
					</div>
					<div className="px-4 py-4">
						<h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
							Rekomendasi
						</h3>
						<p className="text-sm text-foreground leading-relaxed">
							{notes.recommendations}
						</p>
					</div>
					{notes.followUpInDays && (
						<div className="px-4 py-3.5">
							<p className="text-xs text-muted-foreground">
								Tindak lanjut disarankan dalam{" "}
								<span className="font-medium text-foreground">
									{notes.followUpInDays} hari
								</span>
							</p>
						</div>
					)}
				</div>
			</div>

			<div className="flex gap-3">
				<Button
					variant="outline"
					className="flex-1 min-h-11 gap-2"
					onClick={handlePrint}
				>
					<Download className="size-4" aria-hidden="true" />
					Unduh Ringkasan
				</Button>
				{notes.followUpInDays && (
					<Button
						className="flex-1 min-h-11 gap-2"
						render={<Link to="/vets" />}
					>
						<RotateCcw className="size-4" aria-hidden="true" />
						Jadwalkan Tindak Lanjut
					</Button>
				)}
			</div>
		</div>
	);
}
