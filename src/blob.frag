uniform float u_intensity;
uniform float u_time;

varying vec2 vUv;
varying float vDisplacement;

void main() {
    float distort = 2.0 * vDisplacement * u_intensity * sin(vUv.y * 10.0 + u_time);
    vec3 calculatedColor = vec3(abs(vUv - 0.3) * 2.0  * (1.0 - distort), 1.0);

    // Mezcla el color calculado con un color gris
    vec3 gray = vec3(0.5); // Define un color gris
    float mixAmount = 0.9; // Define cuánto quieres mezclar el color gris con el color calculado
    vec3 mixedColor = mix(calculatedColor, gray, mixAmount); // Mezcla los colores

    // Aumenta el brillo del color final
    float brightnessFactor = 1.5; // Ajusta este valor para controlar el brillo
    vec3 finalColor = mixedColor * brightnessFactor; // Multiplica por el factor de brillo

    gl_FragColor = vec4(finalColor, 1.0);
}
