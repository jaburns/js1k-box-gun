uniform vec4 x_uni;
uniform sampler2D x_tex;

vec4 sampleTexStrip(float index) {
    float width = 4.;
    return texture2D(x_tex, vec2((index+.5)/width,0));
}

float sdBox(vec3 p, vec3 b)
{
    vec3 d = abs(p) - b;
    return length(max(d,0.0));
}

float distfunc(vec3 x) {
    return sdBox(x, vec3(1.0));
}

void main(){
    vec4 m = vec4(gl_FragCoord-x_uni*.5)/x_uni.y;

    vec3 i_cameraOrigin = vec3(0,0,10);
    vec3 i_rayDir = normalize(vec3(m.xy, -1));

    gl_FragColor = vec4(1,1,1,1);

    float a=0.,e;
    for (int i = 0; i < 98; i++)
        if ((e=distfunc(i_cameraOrigin + i_rayDir*(a+=e*.5)))<.01) {
            gl_FragColor = vec4(0,0,0,1);
            break;
        }

}