import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion, ShieldCheck } from "lucide-react";

import { VetByline } from "@/components/advice/vet-byline";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { guides } from "@/data/guides";

export const Route = createFileRoute("/advice/guide/$slug")({
	component: GuideDetail,
});

function GuideDetail() {
	const { slug } = useParams({ from: "/advice/guide/$slug" });
	const guide = guides.find((g) => g.slug === slug);

	if (!guide) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16">
				<EmptyState
					icon={FileQuestion}
					title="Panduan tidak ditemukan"
					description="Panduan yang kamu cari mungkin sudah dipindahkan atau tautannya keliru."
					action={
						<Button render={<Link to="/advice" />}>
							Kembali ke Saran Dokter
						</Button>
					}
				/>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
			<Button
				variant="ghost"
				size="sm"
				className="mb-5 -ml-2"
				render={<Link to="/advice" />}
			>
				<ArrowLeft className="size-4" />
				Kembali ke Saran Dokter
			</Button>

			<header className="space-y-4">
				<span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-accent/40">
					<ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
					Panduan terkurasi dokter
				</span>
				<h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
					{guide.title}
				</h1>
				<p className="max-w-2xl text-lg text-muted-foreground">{guide.intro}</p>
				<div className="border-y border-border py-4">
					<VetByline
						name={guide.vetAuthor.name}
						credential={guide.vetAuthor.credential}
						size="md"
					/>
				</div>
			</header>

			<aside className="mt-10 rounded-2xl bg-secondary/50 p-6 text-center">
				<h2 className="font-display text-lg font-semibold text-foreground">
					Ingin bertanya langsung ke dokter?
				</h2>
				<p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
					Konsultasikan kondisi hewanmu secara langsung melalui video call
					bersama dokter hewan berlisensi.
				</p>
				<Button className="mt-4" render={<Link to="/vets" />}>
					Cari Dokter
				</Button>
			</aside>
		</div>
	);
}
