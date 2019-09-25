

$numList = $a => $a[0].split('').map($a=>$a|0);

$verts = $numList`101201102202`.map($a => $a&&$a*200-300);

for ($a = 0; $a++ < 99;)
    $verts = $verts.concat($numList`080180090190081181091191`);

$oldVerts = $verts.map(($a,$b) => $b>11 ? $a + .1*Math.random()-.05 : $a);

$dist = ($a,$b) => Math.sqrt([0,1,2].map($d => $verts[$a+$d] - $verts[$b+$d]).reduce(($a,$b) => $a + $b*$b,0)),




$constraints = [];
for ($a = 12; $a < $verts.length; $a+=24)
    for ($b = $a; $b < $a+21; $b+=3)
        for ($c = $b+3; $c < $a+24; $c+=3)
            $constraints.push([$b,$c,$dist($b,$c)]);


        $verts.forEach(($a,$b) => (
            $verts[$b] += $a - $oldVerts[$b] - (($b-1)%3 ? 0 : 2e-4),
            $oldVerts[$b] = $a,

            ($b-1) % 3 || $verts[$b] < 0 && (
                $verts[$b] = 0,
                $oldVerts[$b] *= -1,

                // Apply friction along xz 
                [-1,1].map($x => $oldVerts[$b+$x] = .9*($oldVerts[$b+$x] - $verts[$b+$x]) + $verts[$b+$x])
            )
        )),

        // Apply all distance constraints

        $constraints.forEach(([$a,$b,$c]) => (
            $addScaledVec = ($x, $y) => [0,1,2].map($d =>
                $verts[$x+$d] =
                    ($verts[$a+$d] + $verts[$b+$d]) / 2 +
                    ($verts[$a+$d] - $verts[$b+$d]) * $c * $y / $dist($a, $b)
            ),
            $addScaledVec($a,  .5),
            $addScaledVec($b, -.5)
        ))



$p = g.createProgram();

$i = __shader('shader.vert');
$s = g.createShader(g.VERTEX_SHADER);
g.shaderSource($s, $i);
g.compileShader($s);
g.attachShader($p, $s);

$i = __shader('shader.frag');
$s = g.createShader(g.FRAGMENT_SHADER);
g.shaderSource($s, $i);
g.compileShader($s);
g.attachShader($p, $s);
//  log = g.getShaderInfoLog($s);
//  if (log === null || log.length > 0 && log.indexOf('ERROR') >= 0) {
//      console.log(log);
//  }

g.vertexAttribPointer(
    g.linkProgram($p),
    2,
    g.BYTE,
    g.enableVertexAttribArray(g.useProgram($p)),
    g.bindBuffer($x = g.ARRAY_BUFFER, g.createBuffer()),
    g.bufferData($x, Int8Array.of(2, 2, 2, -4, -4, 2), $x + 82) // ARRAY_BUFFER + 82 = STATIC_DRAW
);

$texture = g.createTexture();
g.bindTexture($x=g.TEXTURE_2D, $texture);
g.texParameteri($x, g.TEXTURE_MIN_FILTER, g.NEAREST);
g.texImage2D($x, 0, g.RGBA, 4, 1, 0, g.RGBA, g.FLOAT, Float32Array.of(1,0,0,1,0,1,0,1,0,0,1,1,0,0,0,0));

$i = new Date / 1e3;
$f = _ => {
    g.uniform1i(g.getUniformLocation($p, 'x_tex'), 0);
    g.drawArrays(
        g.TRIANGLES,
        g.uniform4f(g.getUniformLocation($p, 'x_uni'), a.width, a.height, new Date / 1e3 - $i, requestAnimationFrame($f)),
        3
    );
};
$f()