uniform float uPointSize;
uniform float uProgress;
uniform float uFrequency;
uniform float uTime;
uniform float uSoundVolume;

attribute vec3 initPosition;

varying vec2 vTexCoords;

void main() {
    #include <begin_vertex>

    float speed = uTime * uSoundVolume;
    float strenght = uSoundVolume * 0.09;
    float zPosition = 0.99 + (uSoundVolume * 0.01);

    transformed = initPosition + ((position - initPosition) * uProgress);

    transformed.z += (sin((transformed.y + speed) * uFrequency)) * (strenght) ;
    transformed.y += (sin((transformed.x + speed) * uFrequency)) * (strenght * 5.0);

    #include <project_vertex>

    gl_PointSize = uPointSize;

    vTexCoords = position.xy;

}