import {
	Boxes,
	Cloud,
	Database,
	Palette,
	Server,
	Smartphone,
	Wrench,
	type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
	Boxes,
	Cloud,
	Database,
	Palette,
	Server,
	Smartphone,
};

export const resolveIcon = (name: string): LucideIcon => {
	return ICON_MAP[name] ?? Wrench;
};
