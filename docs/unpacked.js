for(b in g)g[b[0]+[b[7]]+[b[13]]]=g[b];g.e(2929),d=g.cr(),i=`attribute vec3 A;uniform vec3 g;varying
 highp vec3 C;void main(){gl_Position=(C=A,C.z+=g.y,vec4(C.x/g.x,C.y-5.,19.-C.z,20.-C.z));}`,A=g.ch(
35633),g.so(A,i),g.cS(A),g.ah(d,A),i=`varying highp vec3 C;void main(){gl_FragColor=vec4(exp(.9-leng
th(vec3(0,1,2)-.1*C))*vec3(.5,.4+C.z/50.,1),1);}`,A=g.ch(35632),g.so(A,i),g.cS(A),g.ah(d,A),g.lg(d),
g.cl(f=0,0,0,1),setInterval(C=>{if(!f++)for(b=[],h=[...`012123`],e=[...`040840048848`].map(C=>C*99-3
96),i=A=C=l=12;C<2412;(i+=3)>=C+24&&(i=A+=3)>=C+24&&(A=C+=24))l<820&&(e=e.concat([...`08018009019008
1181091191`].map(C=>~~C)),h=h.concat([...`102123456657537513062046405015267732`].map(C=>~~C+l-8)),c=
e.map((i,A)=>A<12?i:i+.6*Math.random()-.3)),i^A&&(b=b.concat([[A,i,Math.hypot(...[0,1,2].map(C=>e[i+
C]-e[A+C]))],[i,A,Math.hypot(...[0,1,2].map(C=>e[i+C]-e[A+C]))]])),l+=8;f%=540,f>50&&e.map((i,A)=>(e
[A]+=i-c[A]-(A%3^1?0:2e-3),c[A]=i,(f<500||A<12)&&(A%3^1||e[A]<0&&(e[A]=0,c[A]*=C=-1,c[A+C]=e[A+C],C*
=-1,c[A+C]=e[A+C]))))&&b.map(([i,A,l])=>[0,1,2].map(C=>e[i+C]=(e[i+C]+e[A+C])*.5+(e[i+C]-e[A+C])*.5*
l/Math.hypot(...[0,1,2].map(C=>e[i+C]-e[A+C]))),),g.clear(16640),i=34962,g.vto(0,3,5126,g.eet(g.ur(d
)),g.bf(i,g.cu()),g.ba(i,Float32Array.from(e),++i+81)),g.bf(i,g.cu()),g.ba(i,Int16Array.from(h),i+81
),g.uniform3f(g.goa(d,`g`),a.width/a.height,f<50?50-f:0,0),g.dm(4,3606,5123,0)},16)

