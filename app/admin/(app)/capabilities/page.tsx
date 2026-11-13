import type { JSX } from "react";
import { prisma } from "@/lib/prisma";
import { CapabilitiesManager } from "./CapabilitiesManager";

const AdminCapabilitiesPage = async (): Promise<JSX.Element> => {
	const capabilities = await prisma.capability.findMany({
		orderBy: { order: "asc" },
	});

	return (
		<div>
			<h1 className="text-2xl font-black tracking-tight text-ink">Capabilities</h1>
			<div className="mt-8">
				<CapabilitiesManager capabilities={capabilities} />
			</div>
		</div>
	);
};

export default AdminCapabilitiesPage;
