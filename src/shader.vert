attribute vec3 x_position;
uniform vec3 x_aspect;
varying highp vec3 x_clipPos;

void main()
{
    gl_Position = __metaExpr('vpMatrix') * vec4(x_position, 1); 
    x_clipPos = x_position;
}