import type { ClothHalf, CurtainRenderer, OpenAmountAt } from "@/types/curtain";

import { createClothHalf, writeClothNormals } from "./cloth";
import { CLOTH, MAX_PIXEL_RATIO, VERTICES_PER_HALF } from "./constants";
import { CURTAIN_ATTRIBUTES, CURTAIN_FRAGMENT_SHADER, CURTAIN_VERTEX_SHADER } from "./shaders";

const { COLUMNS, ROWS } = CLOTH;
const HALF_COUNT = 2;
const HALF_FLOATS = VERTICES_PER_HALF * 3;

interface MeshTopology {
	/** per vertex: x runs 0..1 across the whole curtain, y runs 0..1 from track to hem */
	clothCoords: Float32Array;
	indices: Uint16Array;
}

const buildMeshTopology = (): MeshTopology => {
	const clothCoords = new Float32Array(VERTICES_PER_HALF * HALF_COUNT * 2);
	const indices: number[] = [];
	for (let half = 0; half < HALF_COUNT; half += 1) {
		for (let j = 0; j < ROWS; j += 1) {
			for (let i = 0; i < COLUMNS; i += 1) {
				const index = half * VERTICES_PER_HALF + j * COLUMNS + i;
				const across = (i / (COLUMNS - 1)) * 0.5;
				clothCoords[index * 2] = half === 0 ? across : 1 - across;
				clothCoords[index * 2 + 1] = j / (ROWS - 1);
				if (i < COLUMNS - 1 && j < ROWS - 1) {
					indices.push(index, index + COLUMNS, index + 1, index + 1, index + COLUMNS, index + COLUMNS + 1);
				}
			}
		}
	}
	return { clothCoords, indices: Uint16Array.from(indices) };
};

const compileShader = (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader => {
	const shader = gl.createShader(type);
	if (!shader) throw new Error("Curtain: could not create a shader");
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(`Curtain: shader failed to compile: ${gl.getShaderInfoLog(shader)}`);
	}
	return shader;
};

const createProgram = (gl: WebGL2RenderingContext): WebGLProgram => {
	const program = gl.createProgram();
	if (!program) throw new Error("Curtain: could not create a program");
	gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, CURTAIN_VERTEX_SHADER));
	gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, CURTAIN_FRAGMENT_SHADER));
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(`Curtain: program failed to link: ${gl.getProgramInfoLog(program)}`);
	}
	return program;
};

const createAttribute = (
	gl: WebGL2RenderingContext,
	location: number,
	size: number,
	data: Float32Array,
	usage: number,
): WebGLBuffer | null => {
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, usage);
	gl.enableVertexAttribArray(location);
	gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
	return buffer;
};

/**
 * Draws the two cloth halves into the canvas. Returns null when WebGL2 is not
 * available; throws if the shaders fail to build.
 */
export const createCurtainRenderer = (canvas: HTMLCanvasElement): CurtainRenderer | null => {
	const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: true, depth: true });
	if (!gl) return null;

	const program = createProgram(gl);
	gl.useProgram(program);
	gl.enable(gl.DEPTH_TEST);
	const aspectLocation = gl.getUniformLocation(program, "uAspect");

	const { clothCoords, indices } = buildMeshTopology();
	const positions = new Float32Array(HALF_FLOATS * HALF_COUNT);
	const normals = new Float32Array(HALF_FLOATS * HALF_COUNT);
	const positionBuffer = createAttribute(gl, CURTAIN_ATTRIBUTES.POSITION, 3, positions, gl.DYNAMIC_DRAW);
	const normalBuffer = createAttribute(gl, CURTAIN_ATTRIBUTES.NORMAL, 3, normals, gl.DYNAMIC_DRAW);
	const clothBuffer = createAttribute(gl, CURTAIN_ATTRIBUTES.CLOTH, 2, clothCoords, gl.STATIC_DRAW);
	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	let halves: ClothHalf[] = [];
	let openAmountAt: OpenAmountAt = () => 0;
	let airDrag: number = CLOTH.AIR_DRAG;
	let simulated = 0;
	let aspect = 1;

	const draw = (): void => {
		halves.forEach((half, index) => {
			positions.set(half.position, index * HALF_FLOATS);
			writeClothNormals(half.position, normals, index * HALF_FLOATS);
		});
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.uniform1f(aspectLocation, aspect);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, normals);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	};

	return {
		reset: (timeline: OpenAmountAt): void => {
			const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
			canvas.width = Math.round(canvas.clientWidth * pixelRatio);
			canvas.height = Math.round(canvas.clientHeight * pixelRatio);
			aspect = canvas.width / canvas.height;
			openAmountAt = timeline;
			airDrag = CLOTH.AIR_DRAG;
			halves = [
				createClothHalf(1, 0, aspect, timeline(0)),
				createClothHalf(-1, CLOTH.RIGHT_HALF_PHASE, aspect, timeline(0)),
			];
			simulated = 0;
		},
		advanceTo: (seconds: number): void => {
			while (simulated < seconds) {
				const openAmount = openAmountAt(simulated);
				for (const half of halves) half.step(openAmount, airDrag);
				simulated += CLOTH.SIM_STEP;
			}
			draw();
		},
		setAirDrag: (value: number): void => {
			airDrag = value;
		},
		dispose: (): void => {
			for (const buffer of [positionBuffer, normalBuffer, clothBuffer, indexBuffer]) gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
		},
		// The curtain mounts a new canvas per page, and browsers cap live contexts
		releaseContext: (): void => {
			gl.getExtension("WEBGL_lose_context")?.loseContext();
		},
	};
};
