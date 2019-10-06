## JS1k Cubes

Exploding and bouncing cubes in 1024 bytes of JavaScript. This project is built against the [JS1k](https://js1k.com/) competition environment: a canvas element reference is assumed to be in `a`, and its WebGL context is assumed to be in `g`, but otherwise no assumptions are made about the environment.

### [View it live](https://jaburns.github.io/js1k-cubes/)

### Final minified source before packing
``` 
for(b in g)g[b[0]+[b[7]]+[b[13]]]=g[b];g.e(2929),d=g.cr(),i=`attribute vec3 A;uniform vec3 g;varying
 highp vec3 C;void main(){gl_Position=(C=A,C.z+=g.y,vec4(C.x/g.x,C.y-5.,19.-C.z,20.-C.z));}`,A=g.ch(
35633),g.so(A,i),g.cS(A),g.ah(d,A),i=`varying highp vec3 C;void main(){gl_FragColor=vec4(exp(.9-leng
th(vec3(0,1,2)-.1*C))*vec3(.5,.4+C.z/50.,1),1);}`,A=g.ch(35632),g.so(A,i),g.cS(A),g.ah(d,A),g.lg(d),
g.cl(f=0,0,0,1),setInterval(C=>{if(!f++)for(b=[],h=[...`012123`],e=[...`040840048848`].map(C=>C*99-3
96),i=A=C=l=12;C<2412;(i+=3)>=C+24&&(i=A+=3)>=C+24&&(A=C+=24))l<820&&(e=e.concat([...`08018009019008
1181091191`].map(C=>~~C)),h=h.concat([...`102123456657537513062046405015267732`].map(C=>~~C+l-8)),c=
e.map((i,A)=>A<12?i:i+.6*Math.random()-.3)),i^A&&(b.push([A,i,Math.hypot(...[0,1,2].map(C=>e[i+C]-e[
A+C]))]),b.push([i,A,Math.hypot(...[0,1,2].map(C=>e[i+C]-e[A+C]))])),l+=8;f%=540,f>50&&e.map((i,A)=>
(e[A]+=i-c[A]-(A%3^1?0:2e-3),c[A]=i,(f<500||A<12)&&(A%3^1||e[A]<0&&(e[A]=0,c[A]*=C=-1,c[A+C]=e[A+C],
C*=-1,c[A+C]=e[A+C]))))&&b.map(([i,A,l])=>[0,1,2].map(C=>e[i+C]=(e[i+C]+e[A+C])*.5+(e[i+C]-e[A+C])*.
5*l/Math.hypot(...[0,1,2].map(C=>e[i+C]-e[A+C]))),),g.clear(16640),i=34962,g.vto(0,3,5126,g.eet(g.ur
(d)),g.bf(i,g.cu()),g.ba(i,Float32Array.from(e),++i+81)),g.bf(i,g.cu()),g.ba(i,Int16Array.from(h),i+
81),g.uniform3f(g.goa(d,`g`),a.width/a.height,f<50?50-f:0,0),g.dm(4,3606,5123,0)},16)
```

### Building from source

```
npm install
npm run pack
open docs/index.html
```

The final result is built from the readable source found in `src/`. The build script (`build.js`) performs a few simple transformations to the source before feeding it to the final packing step:

 - Replace all unique tokens that start with `$` with single letters.
 - Replace macros defined using `__defMacro()` with the verbatim contents of the macro. This is useful because RegPack will find repetitive chunks of code and replace them with a single byte. Because of this, it's often smaller to repeat the same code multiple times than to pull it in to a function.
 - Replace instances of `__shader()` with the minified contents of that shader file, as produced by [Shader Minifier](http://www.ctrl-alt-test.fr/glsl-minifier/).
 - Remove all comments and whitespace. 

Finally, the resulting minified JS code is fed to [RegPack](https://github.com/Siorki/RegPack), and inserted in to the JS1k shim.
