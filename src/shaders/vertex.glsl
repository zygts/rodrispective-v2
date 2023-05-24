uniform float shapeState;
uniform vec2 uFrequency;
uniform float uTime;
uniform float uRadius;
uniform float uDistortCircular;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 distortedPosition = modelPosition;

    // Convierte las coordenadas cartesianas a polares
    float theta = atan(distortedPosition.y, distortedPosition.x);

    // Controla la distorsión
    float r = length(distortedPosition.xy);
    float distortPower = 0.7;
    r = pow(r, distortPower);

    // Distorsiona el radio para que todos los puntos estén a la distancia uRadius desde el origen
    r = mix(r, uRadius, r * uDistortCircular); // <-- Aquí está el cambio

    // Convierte las coordenadas polares de vuelta a cartesianas
    distortedPosition.xy = r * vec2(cos(theta), sin(theta));

    // Interpola entre la posición original y la posición distorsionada
    modelPosition.xy = mix(modelPosition.xy, distortedPosition.xy, uDistortCircular);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z += elevation * 0.03;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = elevation;
}