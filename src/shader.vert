attribute vec3 x_position;
uniform vec3 x_aspect;
varying vec3 x_clipPos;

void main()
{
    vec4 p = __metaExpr('vpMatrix') * vec4(x_position, 1); 
    x_clipPos = x_position;
    gl_Position = p;
}