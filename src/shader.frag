varying highp vec3 A;

void main()
{
    float i_brightness = exp(-.1 * (length(vec3(0,10,20) - A) - 9.));
    gl_FragColor = vec4(i_brightness*vec3(1,.5,1),1);
}