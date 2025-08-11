uniform float uDisplacementFactor;

varying vec2 vUv;
varying float vTriangleID;

attribute float triangleID;

void main() {
    vUv = uv;
    vTriangleID = triangleID;

    vec3 pos = position;

    // --- Desplazamiento (solo una vez; decide si pre o post-rotación) ---
    pos.y += cos(triangleID * 2.0) * uDisplacementFactor;

    // --- Centro correcto del mesh (plano centrado en el origen) ---
    vec3 center = vec3(0.0);

    // Vector hacia el centro
    vec3 toCenter = center - pos;

    // Ángulo en función del ID y factor
    float angle = triangleID * 0.1 + uDisplacementFactor * 2.0;

    // Rotación en Z
    mat3 rotation = mat3(
        cos(angle),  sin(angle), 0.0,
       -sin(angle),  cos(angle), 0.0,
        0.0,         0.0,        1.0
    );

    // Aplica rotación alrededor del centro + desplazamiento adicional si quieres
    pos += rotation * toCenter * uDisplacementFactor;

    // (Opcional) Si prefieres el desplazamiento *después* de rotar, muévelo aquí:
    // pos.y += cos(triangleID * 2.0) * uDisplacementFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
