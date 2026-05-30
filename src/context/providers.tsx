import type { ReactNode } from "react";

import { AuthProvider } from "@/context/auth";
import { BookingProvider } from "@/context/booking";
import { CartProvider } from "@/context/cart";
import { CatalogProvider } from "@/context/catalog";
import { ConsultationsProvider } from "@/context/consultations";
import { OrdersProvider } from "@/context/orders";
import { PetProfileProvider } from "@/context/pet-profile";
import { SubscriptionsProvider } from "@/context/subscriptions";

/**
 * Composes every app provider in dependency order. Catalog is static and outermost;
 * auth/orders/subscriptions depend on the user session conceptually but are independent
 * at runtime, so ordering here favours readability. BookingProvider and
 * ConsultationsProvider follow PetProfileProvider since triage references pet profiles.
 */
export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<CatalogProvider>
			<AuthProvider>
				<PetProfileProvider>
					<BookingProvider>
						<ConsultationsProvider>
							<CartProvider>
								<OrdersProvider>
									<SubscriptionsProvider>{children}</SubscriptionsProvider>
								</OrdersProvider>
							</CartProvider>
						</ConsultationsProvider>
					</BookingProvider>
				</PetProfileProvider>
			</AuthProvider>
		</CatalogProvider>
	);
}
