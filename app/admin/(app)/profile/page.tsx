import type { JSX } from "react";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

const AdminProfilePage = async (): Promise<JSX.Element> => {
	const profile = await prisma.profile.findFirst();

	if (!profile) {
		return (
			<p className="font-mono text-sm text-ink/60">
				Profile has not been seeded yet. Run `pnpm db:seed`.
			</p>
		);
	}

	return (
		<div>
			<h1 className="text-2xl font-black tracking-tight text-ink">Profile</h1>
			<div className="mt-8">
				<ProfileForm profile={profile} />
			</div>
		</div>
	);
};

export default AdminProfilePage;
