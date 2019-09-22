attribute vec3 x_position;
varying vec3 x_uv;
uniform vec3 x_aspect;

void main()
{
    gl_Position = __metaExpr('vpMatrix') * vec4(x_position, 1);
    x_uv = x_position*0.5 + 0.5;
}