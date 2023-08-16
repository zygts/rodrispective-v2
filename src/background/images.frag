uniform sampler2D currentTexture;
uniform sampler2D nextTexture;
uniform sampler2D uDisplacement;
uniform float mixValue;
uniform float uGlitch;
uniform float uScroll;
uniform vec3 uRandomValues;
uniform float u_opacity;

varying vec2 vUv;

void main() {
  // vec4 displacementImage = texture2D(uDisplacement, (vUv * 5.0)- 2.0);
  vec4 displacementImage = texture2D(uDisplacement, vUv * 3.0 - 1.2);

  // vec2 displacedUV = vec2(vUv.x, vUv.y * (1.0 + (displacementImage.r - 0.5) * uGlitch));

  vec2 displacedUV = vec2(vUv.x, vUv.y);
  displacedUV.y = mix(vUv.y, displacementImage.r, uGlitch);  

  vec4 color1 = texture2D(currentTexture, displacedUV);
  color1.r = texture2D(currentTexture, displacedUV + vec2(-0.05 + uRandomValues.r) * uGlitch).r;
  color1.g = texture2D(currentTexture, displacedUV + vec2(-0.005 + uRandomValues.g) * uGlitch).g;
  color1.b = texture2D(currentTexture, displacedUV + vec2(0.05 + uRandomValues.b) * uGlitch).b;


  vec4 color2 = texture2D(nextTexture, displacedUV);

  vec2 uv = vUv;
  float scroll = uScroll;

  // Define los bordes de tu rectángulo al inicio
  vec2 rectMinStart = vec2(0.41, 0.12);
  vec2 rectMaxStart = vec2(0.59, 0.54);

  // Define los bordes de tu rectángulo al final
  vec2 rectMinEnd = vec2(0.22, 0.08);
  vec2 rectMaxEnd = vec2(0.78, 0.65);

  // Interpola los bordes del rectángulo en función de uScroll
  vec2 rectMin = mix(rectMinStart, rectMinEnd, scroll);
  vec2 rectMax = mix(rectMaxStart, rectMaxEnd, scroll);

  // Calcula si este píxel se encuentra dentro del rectángulo
  float mask = step(rectMin.x, uv.x) * step(rectMin.y, uv.y) * (1.0 - step(rectMax.x, uv.x)) * (1.0 - step(rectMax.y, uv.y));

  vec4 finalMix = mix(color1, color2, mixValue);
  finalMix.a *= mask;

  // gl_FragColor = color;
  gl_FragColor = finalMix * u_opacity;
}
