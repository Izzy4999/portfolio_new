"use client";

import type { JSX } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Capability } from "@prisma/client";
import { ICON_MAP } from "@/lib/icon-map";

interface CapabilitiesManagerProps {
	capabilities: Capability[];
}

const iconNames = Object.keys(ICON_MAP);

export const CapabilitiesManager = ({
	capabilities,
}: CapabilitiesManagerProps): JSX.Element => {
	const router = useRouter();
	const [label, setLabel] = useState("");
	const [icon, setIcon] = useState(iconNames[0]);
	const [order, setOrder] = useState(capabilities.length);
	const [error, setError] = useState<string | null>(null);

	const handleAdd = async (): Promise<void> => {
		if (!label.trim()) {
			setError("Label is required");
			return;
		}
		setError(null);

		const res = await fetch("/api/admin/capabilities", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ label, icon, order }),
		});

		if (!res.ok) {
			const body = await res.json().catch(() => null);
			setError(body?.message ?? "Something went wrong");
			return;
		}

		setLabel("");
		setOrder(order + 1);
		router.refresh();
	};

	const handleDelete = async (id: string): Promise<void> => {
		await fetch(`/api/admin/capabilities/${id}`, { method: "DELETE" });
		router.refresh();
	};

	const handleReorder = async (id: string, newOrder: number): Promise<void> => {
		await fetch(`/api/admin/capabilities/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ order: newOrder }),
		});
		router.refresh();
	};

	const inputClass =
		"border border-ink/20 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink";

	return (
		<div className="space-y-8">
			<div className="border border-ink/15">
				{capabilities.map((capability) => (
					<div
						key={capability.id}
						className="flex items-center justify-between gap-4 border-b border-ink/15 p-4 last:border-b-0"
					>
						<div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
							<input
								type="number"
								defaultValue={capability.order}
								onBlur={(e) => handleReorder(capability.id, Number(e.target.value))}
								className={`${inputClass} w-16`}
							/>
							<span className="text-sm text-ink">{capability.label}</span>
							<span className="font-mono text-xs uppercase tracking-[0.04em] text-ink/50">
								{capability.icon}
							</span>
						</div>
						<button
							type="button"
							onClick={() => handleDelete(capability.id)}
							className="shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-ink/70 transition-colors duration-150 hover:text-signal"
						>
							Delete
						</button>
					</div>
				))}
			</div>

			<div className="flex flex-wrap items-end gap-4 border border-ink/15 p-4">
				<div>
					<label className="block font-mono text-xs uppercase tracking-[0.08em] text-ink/70">
						Label
					</label>
					<input
						value={label}
						onChange={(e) => setLabel(e.target.value)}
						className={`${inputClass} mt-2`}
						placeholder="Next.js & React"
					/>
				</div>
				<div>
					<label className="block font-mono text-xs uppercase tracking-[0.08em] text-ink/70">
						Icon
					</label>
					<select
						value={icon}
						onChange={(e) => setIcon(e.target.value)}
						className={`${inputClass} mt-2`}
					>
						{iconNames.map((name) => (
							<option key={name} value={name}>
								{name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block font-mono text-xs uppercase tracking-[0.08em] text-ink/70">
						Order
					</label>
					<input
						type="number"
						value={order}
						onChange={(e) => setOrder(Number(e.target.value))}
						className={`${inputClass} mt-2 w-20`}
					/>
				</div>
				<button
					type="button"
					onClick={handleAdd}
					className="bg-ink px-6 py-2.5 font-mono text-sm uppercase tracking-[0.04em] text-paper"
				>
					Add
				</button>
			</div>
			{error ? <p className="text-xs text-signal">{error}</p> : null}
		</div>
	);
};
