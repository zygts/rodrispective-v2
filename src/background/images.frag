uniform sampler2D currentTexture;
uniform sampler2D nextTexture;
uniform sampler2D uDisplacement;
uniform float mixValue;
uniform float uGlitch;

varying vec2 vUv;

void main() {
  vec4 displacementImage = texture2D(uDisplacement, (vUv * 2.0)- 0.5);
  vec2 displacedUV = vec2(vUv.x, vUv.y * (1.0 + (displacementImage.r - 0.5) * uGlitch));

  vec4 color1 = texture2D(currentTexture, displacedUV);
  vec4 color2 = texture2D(nextTexture, displacedUV);

  gl_FragColor = mix(color1, color2, mixValue);
}
