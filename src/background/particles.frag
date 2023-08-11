uniform sampler2D uTexture;
uniform float uNbLines;
uniform float uNbColumns;
uniform float uProgress;
uniform float uFrequency;
uniform float uSoundVolume;
uniform float uIntensity;
uniform vec2 uMousePos;
uniform vec2 uResolution;
uniform float uAspectRatio;
uniform float uShowIntro;

varying vec2 vTexCoords;

float circle(vec2 uv, float border) {
    float radius = 0.5;
    float dist = radius - distance(uv, vec2(0.5));
    return smoothstep(0.0, border, dist);
}

void main() {
    vec2 uv = gl_PointCoord;
    uv.y *= -1.0;

    uv /= vec2(uNbColumns, uNbLines);

    float texOffsetU = vTexCoords.x / uNbColumns;
    float texOffsetV = vTexCoords.y / uNbLines;
    uv += vec2(texOffsetU, texOffsetV);
    uv += vec2(0.5);

    vec4 texture = texture2D(uTexture, uv);

    gl_FragColor = texture;
    if(gl_FragColor.r < 0.1){
        discard;
    }

    gl_FragColor.a *= circle(gl_PointCoord, 0.2);
    
    // gl_FragColor.a *= uProgress * ((uAmount * 2.0) + 0.3);
    vec2 mousePos = uMousePos.xy;
    vec2 fragCoord = gl_FragCoord.xy / uResolution;
    fragCoord = fragCoord * 1.0 - 1.0;
    fragCoord.y /= uAspectRatio;
    float dist = distance(fragCoord, mousePos);

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float result = alpha * uShowIntro;

    // gl_FragColor.a *= result + uIntensity + (uSoundVolume * 0.75);
    gl_FragColor.a *= alpha + uIntensity + (uSoundVolume * 0.75);
    // gl_FragColor.a *= 0.5;
}