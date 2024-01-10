uniform float uTime;
uniform sampler2D uTexture;
uniform float uDarken; // Nueva uniforme para oscurecimiento

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 0.8 + 1.0;

    // Oscurece el color si uDarken es mayor que 1.0
    textureColor.rgb *= uDarken;

    gl_FragColor = textureColor;
}
