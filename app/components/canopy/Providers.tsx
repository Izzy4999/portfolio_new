"use client";

import type { JSX, ReactNode } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: ReactNode }): JSX.Element => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster
				position="top-center"
				toastOptions={{
					classNames: {
						toast: "!rounded-sm !border !border-indigo/30 !bg-white !font-canopy !text-indigo !shadow-[0_18px_40px_-20px_rgba(43,47,127,0.5)]",
					},
				}}
			/>
		</QueryClientProvider>
	);
};
