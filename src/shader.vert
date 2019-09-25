attribute vec3 x_position;
uniform vec3 x_aspect;
varying highp vec3 x_worldPos;

void main()
{
    gl_Position = __metaExpr('vpMatrix') * vec4(x_position, 1); 
    x_worldPos = x_position;
}