import type { ReactNode } from "react";

import { AuthProvider } from "@/context/auth";
import { BookingProvider } from "@/context/booking";
import { ConsultationsProvider } from "@/context/consultations";
import { PetProfileProvider } from "@/context/pet-profile";

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<AuthProvider>
			<PetProfileProvider>
				<BookingProvider>
					<ConsultationsProvider>{children}</ConsultationsProvider>
				</BookingProvider>
			</PetProfileProvider>
		</AuthProvider>
	);
}
