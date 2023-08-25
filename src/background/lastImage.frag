uniform sampler2D uTexture;
uniform float u_opacity;

varying vec2 vUv;
varying float vTriangleID;

void main() {

  vec2 uv = vUv;
//   float scroll = uScroll;

  // Define los bordes de tu rectángulo al inicio
  vec2 rectMinStart = vec2(0.41, 0.12);
  vec2 rectMaxStart = vec2(0.59, 0.54);

  // Define los bordes de tu rectángulo al final
  vec2 rectMinEnd = vec2(0.22, 0.08);
  vec2 rectMaxEnd = vec2(0.78, 0.65);

  // Interpola los bordes del rectángulo en función de uScroll
  vec2 rectMin = mix(rectMinStart, rectMinEnd, 1.0);
  vec2 rectMax = mix(rectMaxStart, rectMaxEnd, 1.0);

  // Calcula si este píxel se encuentra dentro del rectángulo
  float mask = step(rectMin.x, uv.x) * step(rectMin.y, uv.y) * (1.0 - step(rectMax.x, uv.x)) * (1.0 - step(rectMax.y, uv.y));

  vec4 texColor = texture2D(uTexture, vUv);
  texColor.a *= mask;
    gl_FragColor = texColor * u_opacity;
}
