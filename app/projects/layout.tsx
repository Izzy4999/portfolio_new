import type { JSX, ReactNode } from "react";

import { SiteShell } from "../components/canopy/SiteShell";

const ProjectsLayout = ({ children }: { children: ReactNode }): JSX.Element => {
	return <SiteShell>{children}</SiteShell>;
};

export default ProjectsLayout;
