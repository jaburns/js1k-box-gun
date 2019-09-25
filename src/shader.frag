varying highp vec3 x_worldPos;

void main()
{
    vec3 i_normal = normalize(cross(dFdx(x_worldPos), dFdy(x_worldPos)));
    highp vec3 fromLight = vec3(0,10,20)-x_worldPos;
    gl_FragColor = vec4(vec3(100.*dot(normalize(fromLight),i_normal)) / pow(length(fromLight),2.), 1);
}