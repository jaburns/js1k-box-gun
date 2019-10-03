varying highp vec3 C;

void main()
{
    float i_brightness = exp(.9 - length(vec3(0,1,2) - .1*C));
    gl_FragColor = vec4(i_brightness*vec3(.5,.4+C.z/50.,1),1);
}