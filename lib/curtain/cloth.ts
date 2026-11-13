import type { ClothHalf } from "@/types/curtain";

import { CLOTH, VERTICES_PER_HALF } from "./constants";
import { lerp } from "./timeline";

const TAU = Math.PI * 2;
const { COLUMNS, ROWS, PLEAT_COLUMNS, TOP_Y, HEM_Y, SIM_STEP } = CLOTH;
const PINNED_END = COLUMNS * 3;
const FALL = CLOTH.GRAVITY * SIM_STEP * SIM_STEP;

/**
 * One half of a traveler curtain. The top row rides runners on the track: the
 * lead runner is pulled toward the wall and pushes the others into a stack.
 * Everything below the top row is free cloth, solved with Verlet integration
 * and distance links. mirror: 1 builds the left half, -1 the right.
 * An open amount of 0 is fully shut, 1 is stacked off screen past the wall.
 */
export const createClothHalf = (
	mirror: 1 | -1,
	phase: number,
	halfWidth: number,
	startOpenAmount: number,
): ClothHalf => {
	const span = halfWidth * (1 + CLOTH.WALL_MARGIN + CLOTH.CENTRE_OVERLAP);
	const closedPitch = span / (COLUMNS - 1);
	const rest = closedPitch * CLOTH.FULLNESS;
	const stackPitch = rest * CLOTH.STACK_PITCH;
	const drop = (TOP_Y - HEM_Y) / (ROWS - 1);
	const diagonal = Math.hypot(rest, drop);
	const closedLead = halfWidth * CLOTH.CENTRE_OVERLAP;
	const exitLead = -halfWidth * CLOTH.EXIT_LEAD;
	const wallX = closedLead - span;

	const position = new Float32Array(VERTICES_PER_HALF * 3);
	const previous = new Float32Array(VERTICES_PER_HALF * 3);
	const runnerX = new Float32Array(COLUMNS);

	const pinTop = (leadX: number): void => {
		for (let i = 0; i < COLUMNS; i += 1) {
			runnerX[i] = Math.min(wallX + i * closedPitch, leadX - (COLUMNS - 1 - i) * stackPitch);
		}
		for (let i = 0; i < COLUMNS; i += 1) {
			const pitch = i < COLUMNS - 1 ? runnerX[i + 1] - runnerX[i] : runnerX[i] - runnerX[i - 1];
			// the closer the runners, the deeper the fold has to be to hold the same cloth
			const depth = (PLEAT_COLUMNS / TAU) * Math.sqrt(2 * Math.max(rest * rest - pitch * pitch, 0));
			const at = i * 3;
			position[at] = mirror * runnerX[i];
			position[at + 1] = TOP_Y;
			position[at + 2] = depth * Math.sin((TAU * i) / PLEAT_COLUMNS + phase);
		}
	};

	pinTop(lerp(closedLead, exitLead, startOpenAmount));
	for (let j = 1; j < ROWS; j += 1) {
		for (let i = 0; i < COLUMNS; i += 1) {
			const at = (j * COLUMNS + i) * 3;
			position[at] = position[i * 3];
			position[at + 1] = TOP_Y - j * drop;
			position[at + 2] = position[i * 3 + 2];
		}
	}
	previous.set(position);

	// Links run top row first, so one solver pass carries a correction all the way down.
	// The first vertex of a link is the only one that can be pinned.
	const pairs: number[] = [];
	const lengths: number[] = [];
	for (let j = 0; j < ROWS; j += 1) {
		for (let i = 0; i < COLUMNS; i += 1) {
			const index = j * COLUMNS + i;
			if (j > 0 && i < COLUMNS - 1) {
				pairs.push(index, index + 1);
				lengths.push(rest);
			}
			if (j < ROWS - 1) {
				pairs.push(index, index + COLUMNS);
				lengths.push(drop);
			}
			if (j < ROWS - 1 && i < COLUMNS - 1) {
				pairs.push(index, index + COLUMNS + 1, index + 1, index + COLUMNS);
				lengths.push(diagonal, diagonal);
			}
		}
	}
	const linkPairs = Uint16Array.from(pairs);
	const linkLengths = Float32Array.from(lengths);

	const integrate = (airDrag: number): void => {
		const keep = 1 - airDrag * SIM_STEP;
		for (let at = PINNED_END; at < position.length; at += 3) {
			const moveX = (position[at] - previous[at]) * keep;
			const moveY = (position[at + 1] - previous[at + 1]) * keep - FALL;
			const moveZ = (position[at + 2] - previous[at + 2]) * keep;
			previous[at] = position[at];
			previous[at + 1] = position[at + 1];
			previous[at + 2] = position[at + 2];
			position[at] += moveX;
			position[at + 1] += moveY;
			position[at + 2] += moveZ;
		}
	};

	const solveLinks = (): void => {
		for (let k = 0; k < linkLengths.length; k += 1) {
			const a = linkPairs[k * 2] * 3;
			const b = linkPairs[k * 2 + 1] * 3;
			const dx = position[b] - position[a];
			const dy = position[b + 1] - position[a + 1];
			const dz = position[b + 2] - position[a + 2];
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || linkLengths[k];
			const stretch = (distance - linkLengths[k]) / distance;
			if (a < PINNED_END) {
				position[b] -= dx * stretch;
				position[b + 1] -= dy * stretch;
				position[b + 2] -= dz * stretch;
				continue;
			}
			const share = stretch * 0.5;
			position[a] += dx * share;
			position[a + 1] += dy * share;
			position[a + 2] += dz * share;
			position[b] -= dx * share;
			position[b + 1] -= dy * share;
			position[b + 2] -= dz * share;
		}
	};

	const step = (openAmount: number, airDrag: number): void => {
		pinTop(lerp(closedLead, exitLead, openAmount));
		integrate(airDrag);
		for (let pass = 0; pass < CLOTH.SOLVER_PASSES; pass += 1) solveLinks();
	};

	for (let settle = 0; settle < CLOTH.SETTLE_STEPS; settle += 1) step(startOpenAmount, CLOTH.AIR_DRAG);

	return { position, step };
};

/** Writes one unnormalised normal per vertex of a half into `normal`, starting at `offset`. */
export const writeClothNormals = (position: Float32Array, normal: Float32Array, offset: number): void => {
	for (let j = 0; j < ROWS; j += 1) {
		const up = Math.max(j - 1, 0) * COLUMNS;
		const down = Math.min(j + 1, ROWS - 1) * COLUMNS;
		for (let i = 0; i < COLUMNS; i += 1) {
			const left = (j * COLUMNS + Math.max(i - 1, 0)) * 3;
			const right = (j * COLUMNS + Math.min(i + 1, COLUMNS - 1)) * 3;
			const above = (up + i) * 3;
			const below = (down + i) * 3;
			const acrossX = position[right] - position[left];
			const acrossY = position[right + 1] - position[left + 1];
			const acrossZ = position[right + 2] - position[left + 2];
			const alongX = position[below] - position[above];
			const alongY = position[below + 1] - position[above + 1];
			const alongZ = position[below + 2] - position[above + 2];
			const at = offset + (j * COLUMNS + i) * 3;
			normal[at] = alongY * acrossZ - alongZ * acrossY;
			normal[at + 1] = alongZ * acrossX - alongX * acrossZ;
			normal[at + 2] = alongX * acrossY - alongY * acrossX;
		}
	}
};
