uniform float u_intensity;
uniform float u_time;

varying vec2 vUv;
varying float vDisplacement;

void main() {
    float distort = 4.0 * vDisplacement * u_intensity * sin(vUv.y * 10.0 + u_time); // Aumenta el factor de distorsión
vec3 calculatedColor = vec3(abs(vUv - 0.5) * 2.0 * (1.0 - distort), abs(vUv - 0.3) * 1.0 * (1.0 - distort));

    // Mezcla el color calculado con un color gris
    vec3 gray = vec3(0.5); // Define un color gris
    float mixAmount = 0.85; // Ajusta la cantidad de mezcla para enfatizar más la distorsión
    vec3 mixedColor = mix(calculatedColor, gray, mixAmount); // Mezcla los colores

    // Aumenta el contraste del color final
    float contrastFactor = 1.5; // Ajusta este valor para controlar el contraste
    vec3 finalColor = mixedColor * contrastFactor; // Multiplica por el factor de contraste

    // Aumenta el brillo del color final
    float brightnessFactor = 1.2; // Ajusta este valor para controlar el brillo
    finalColor *= brightnessFactor; // Multiplica por el factor de brillo

    gl_FragColor = vec4(finalColor, 1.0);
}
