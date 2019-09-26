attribute vec3 x_position;
uniform float x_aspect;
varying highp vec3 x_worldPos;

/*
float far = 100, near = 0.1, x = 0, y = -5, z = -20;
mat4 projMatrix = mat4(
    1 / aspect, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    x / aspect, y, (2. * far * near) / (near - far) + (far + near) / (near - far) * z, -z
);
gl_Position = projMatrix * x_position;
*/

void main()
{
    gl_Position = vec4(
        x_position.x / x_aspect,
        -5. + x_position.y,
        19.84 - x_position.z,
        20. - x_position.z
    );
    x_worldPos = x_position;
}