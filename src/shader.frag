varying highp vec3 C;

void main()
{
    float i_brightness = exp(-.1 * (length(vec3(0,10,20) - C) - 9.));
    gl_FragColor = vec4(i_brightness*vec3(.5,.4+C.z/50.,1),1);
}