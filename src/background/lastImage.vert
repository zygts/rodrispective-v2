uniform vec2 uResolution;
uniform float uDisplacementFactor;  // Controla la animación
varying vec2 vUv;
attribute float triangleID;
varying float vTriangleID;

void main() {
    vUv = uv;
    vec3 pos = position;

    // Desplazamiento basado en el triangleID
    pos.y += sin(triangleID * 5.0) * uDisplacementFactor;

    float aspect = uResolution.x / uResolution.y;
    float imageAspect = 14.0 / 8.5;
    
    if(aspect > imageAspect) {
        pos.y *= imageAspect / aspect;
    } else {
        pos.x *= aspect / imageAspect;
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
