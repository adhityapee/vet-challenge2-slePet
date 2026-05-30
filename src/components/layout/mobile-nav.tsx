import { Link } from "@tanstack/react-router";
import {
	BookOpen,
	Home,
	type LucideIcon,
	Stethoscope,
	User as UserIcon,
	Video,
} from "lucide-react";

interface NavItem {
	to: string;
	label: string;
	icon: LucideIcon;
	exact?: boolean;
}

const ITEMS: NavItem[] = [
	{ to: "/", label: "Beranda", icon: Home, exact: true },
	{ to: "/vets", label: "Dokter", icon: Stethoscope },
	{ to: "/account/consultations", label: "Konsultasi", icon: Video },
	{ to: "/advice", label: "Saran", icon: BookOpen },
	{ to: "/account", label: "Akun", icon: UserIcon },
];

export function MobileNav() {
	return (
		<nav
			className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden"
			aria-label="Navigasi utama"
		>
			<ul className="mx-auto flex max-w-md items-stretch justify-around">
				{ITEMS.map((item) => {
					const Icon = item.icon;
					return (
						<li key={item.to} className="flex-1">
							<Link
								to={item.to}
								activeOptions={{ exact: item.exact }}
								className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 py-1.5 text-[0.65rem] font-medium text-muted-foreground transition-colors [&.active]:text-primary"
								aria-label={item.label}
							>
								<Icon className="size-5" />
								{item.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
