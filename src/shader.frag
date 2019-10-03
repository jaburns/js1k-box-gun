varying highp vec3 C;

void main()
{
    float i_brightness = exp(-.1 * (length(vec3(0,10,20) - C) - 9.));
    gl_FragColor = vec4(i_brightness*vec3(.5,1,.9) ,1);                 // No depth effect
//  gl_FragColor = vec4(i_brightness*vec3(.5,.4+.5*i_brightness,1) ,1); // Blue/cyan with depth effect
//  gl_FragColor = vec4(i_brightness*vec3(1,.4+i_brightness*.5,.5) ,1); // Yellow/orange with depth effect
}