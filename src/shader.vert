attribute vec3 A;
uniform vec2 g;
varying highp vec3 C;

void main()
{
    C = A;
    C.z += .3*(396.-g.y);

    gl_Position = vec4(
        C.x / g.x,
        C.y - 5.,   // Camera Y offset
        19. - C.z,  // Camera Z offset minus a little
        20. - C.z   // Camera Z offset
    );
}