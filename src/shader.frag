varying vec3 x_clipPos;

void main()
{
    vec3 dx = dFdx(x_clipPos);
    vec3 dy = dFdy(x_clipPos);
    vec3 normal = normalize(cross(dx, dy));

    gl_FragColor = vec4(.5+.5*normal, 1);
}