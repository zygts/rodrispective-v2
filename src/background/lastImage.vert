uniform vec2 uResolution;
uniform float uDisplacementFactor;

varying vec2 vUv;
varying float vTriangleID;

attribute float triangleID;

void main() {
    vUv = uv;
    vec3 pos = position;

    // Desplazamiento basado en el triangleID
    pos.y += cos(triangleID * 2.0) * uDisplacementFactor;


  float aspect = uResolution.x / uResolution.y;
  float imageAspect = 20.0 / 9.0;

  // Ajuste para mantener la relación de aspecto de la imagen
  if (aspect > imageAspect) {
    pos.y *= aspect / imageAspect;
  } else {
    pos.x *= imageAspect / aspect;
  }

    // Coordenadas del centro del mesh
    vec3 center = vec3(0.5, 0.5, 0.0);

    // Vector desde el vértice actual hasta el centro
    vec3 toCenter = center - pos.xyz;

    // Ángulo de rotación basado en el ID del triángulo y el factor de desplazamiento
    float angle = triangleID * 0.1 + uDisplacementFactor * 2.0;

    // Matriz de rotación
    mat3 rotation = mat3(
        cos(angle), sin(angle), 0,
        -sin(angle), cos(angle), 0,
        0, 0, 1
    );

    // Aplica la rotación y el desplazamiento
    pos.xyz = pos.xyz + rotation * toCenter * uDisplacementFactor;

    // Desplazamiento basado en el triangleID
    pos.y += cos(triangleID * 2.0) * uDisplacementFactor;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
