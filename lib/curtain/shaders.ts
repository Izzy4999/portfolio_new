export const CURTAIN_ATTRIBUTES = { POSITION: 0, NORMAL: 1, CLOTH: 2 } as const;

export const CURTAIN_VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aCloth;

uniform float uAspect;

out vec3 vNormal;
out vec2 vCloth;
out float vDepth;

// folds nearer the viewer draw slightly larger, which is what makes the hem wavy
const float PERSPECTIVE = 0.35;

void main() {
  float scale = 1.0 + PERSPECTIVE * aPosition.z;
  gl_Position = vec4(aPosition.x / uAspect * scale, aPosition.y * scale, -aPosition.z, 1.0);
  vNormal = aNormal;
  vCloth = aCloth;
  vDepth = aPosition.z;
}
`;

// Colour constants mirror the palette in tailwind.config.js (indigo, saffron, madder, plum).
export const CURTAIN_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec3 vNormal;
in vec2 vCloth;
in float vDepth;

out vec4 outColor;

const vec3 INDIGO = vec3(0.169, 0.184, 0.498);
const vec3 SAFFRON = vec3(0.949, 0.702, 0.102);
const vec3 MADDER = vec3(0.698, 0.227, 0.396);
const vec3 PLUM = vec3(0.416, 0.239, 0.561);
const vec3 SHEEN = vec3(0.62, 0.68, 1.0);
const vec3 LIGHT = vec3(-0.406, 0.0, 0.914);
const vec3 HALF_VECTOR = vec3(-0.2075, 0.0, 0.978);

// One soft wash across the cloth: indigo at the side walls, through plum and
// madder, to a thin saffron glow at the leading edges where the curtain opens.
vec3 silkColor(vec2 cloth) {
  float fromSeam = abs(cloth.x - 0.5) * 2.0;
  vec3 color = mix(PLUM, INDIGO, smoothstep(0.35, 0.8, fromSeam));
  color = mix(MADDER, color, smoothstep(0.1, 0.5, fromSeam));
  return mix(SAFFRON, color, smoothstep(0.0, 0.16, fromSeam));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec3 normal = normalize(vNormal);
  if (normal.z < 0.0) normal = -normal; // the cloth is lit from the front on both faces

  float diffuse = clamp(dot(normal, LIGHT), 0.0, 1.0);
  float specular = pow(clamp(dot(normal, HALF_VECTOR), 0.0, 1.0), 14.0);
  float occlusion = mix(0.72, 1.0, smoothstep(-0.06, 0.04, vDepth)); // folds set back sit in shade

  vec3 color = silkColor(vCloth) * (0.5 + 0.62 * diffuse) * occlusion;
  color += SHEEN * specular * 0.12;
  color *= mix(0.82, 1.0, smoothstep(0.0, 0.18, vCloth.y));
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.015;

  outColor = vec4(color, 1.0);
}
`;
