uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  float aspect = uResolution.x / uResolution.y;
  float imageAspect = 20.0 / 9.0;

  // Ajuste para mantener la relación de aspecto de la imagen
  if (aspect > imageAspect) {
    pos.y *= aspect / imageAspect;
  } else {
    pos.x *= imageAspect / aspect;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
