uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  float aspect = uResolution.x / uResolution.y;
  float imageAspect = 14.0 / 9.0;
  
  // Mantén la relación de aspecto 16:9
  if(aspect > imageAspect) {
    // Si la pantalla es más ancha que 16:9, ajusta el eje Y
    pos.y *= imageAspect / aspect;
  } else {
    // Si la pantalla es más alta que 16:9, ajusta el eje X
    pos.x *= aspect / imageAspect;
  }
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
