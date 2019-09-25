attribute vec3 x_position;
uniform float x_aspect;
varying highp vec3 x_worldPos;

void main()
{
    gl_Position = vec4(
        x_position.x / x_aspect,
        -5. + x_position.y,
        19.84 - x_position.z,
        20. - x_position.z
    );
    //gl_Position = __metaExpr('vpMatrix') * vec4(x_position, 1); 
    x_worldPos = x_position;
}