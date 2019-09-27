attribute vec3 C;
uniform float g;
varying highp vec3 A;

void main()
{
    gl_Position = vec4(
        C.x / g,
        C.y - 5.,   // Camera Y offset
        19. - C.z,  // Camera Z offset minus a little
        20. - C.z   // Camera Z offset
    );
    A = C;
}