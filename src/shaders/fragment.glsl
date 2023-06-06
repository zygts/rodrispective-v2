uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 0.8 + 1.0;
    gl_FragColor = textureColor;
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
}