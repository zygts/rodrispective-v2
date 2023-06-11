uniform float uPointSize;
uniform float uProgress;
uniform float uFrequency;

attribute vec3 initPosition;

varying vec2 vTexCoords;

void main() {
    #include <begin_vertex>

    transformed = initPosition + ((position - initPosition) * uProgress);
    transformed.y += sin(transformed.x * uFrequency);
    transformed.z += sin(transformed.y * uFrequency);

    #include <project_vertex>

    gl_PointSize = uPointSize;

    vTexCoords = position.xy;

}