import type { JSX } from "react";
import { AdminNav } from "../AdminNav";

// Admin pages read the database per request; prerendering them breaks the build when it is unreachable.
export const dynamic = "force-dynamic";

const AdminAppLayout = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	return (
		<div className="min-h-screen bg-paper">
			<AdminNav />
			<main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
		</div>
	);
};

export default AdminAppLayout;
