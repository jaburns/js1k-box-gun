varying highp vec3 x_clipPos;

void main()
{
    gl_FragColor = vec4(.5+.5*normalize(cross(dFdx(x_clipPos), dFdy(x_clipPos))), 1);
}