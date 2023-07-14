uniform sampler2D currentTexture;
uniform sampler2D nextTexture;
uniform float mixValue;

varying vec2 vUv;

void main() {
  vec4 color1 = texture2D(currentTexture, vUv);
  vec4 color2 = texture2D(nextTexture, vUv);

  gl_FragColor = mix(color1, color2, mixValue);
}
