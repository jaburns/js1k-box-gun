// ===== Geometry and constraints initialization =====

$tris = [],
$verts = [];
for ($a = 0; $a < 50; ++$a)
    $verts = $verts.concat([
        0,10,0,1,10,0,0,11,0,1,11,0,0,10,1,1,10,1,0,11,1,1,11,1
    ]),
    $tris = $tris.concat([
        1,0,2,1,2,3,4,5,6,6,5,7,5,3,7,5,1,3,0,6,2,0,4,6,4,0,5,0,1,5,2,6,7,7,3,2
    ].map($b => $b + 8*$a));

$oldVerts = $verts.map($a => $a + .1*Math.random()-.05),

$diff = ($a,$b) => [0,1,2].map($c => $verts[$a+$c] - $verts[$b+$c]),

$dist = ($a,$b) => Math.sqrt($diff($a,$b).reduce(($a,$b) => $a + $b*$b,0)),

$constraints = [];
for ($a = 0; $a < $verts.length; $a+=24)
    for ($b = $a; $b < $a+21; $b+=3)
        for ($c = $b+3; $c < $a+24; $c+=3)
            $constraints.push([$b,$c,$dist($b,$c)]);


// ===== Shader compilation and WebGL setup =====

g.enable(g.DEPTH_TEST),
$shader = g.createProgram(),
$vertexBuffer = g.createBuffer(),
$indexBuffer = g.createBuffer(),

$a = __shader('shader.vert'),
$b = g.createShader(g.VERTEX_SHADER),
g.shaderSource($b, $a),
g.compileShader($b),
g.attachShader($shader, $b),
//  log = g.getShaderInfoLog($b);
//  if (log === null || log.length > 0 && log.indexOf('ERROR') >= 0) {
//      console.log(log);
//  }

$a = __shader('shader.frag'),
$b = g.createShader(g.FRAGMENT_SHADER),
g.shaderSource($b, $a),
g.compileShader($b),
g.attachShader($shader, $b),
//  log = g.getShaderInfoLog($b);
//  if (log === null || log.length > 0 && log.indexOf('ERROR') >= 0) {
//      console.log(log);
//  }

g.linkProgram($shader),
g.useProgram($shader),


// ===== Main loop =====

setInterval(_ => (

    // Vertex position updates

    $verts.forEach(($a,$b) => (
        $verts[$b] += $a - $oldVerts[$b] - (($b-1)%3 ? 0 : .0001),
        $oldVerts[$b] = $a,

        ($b-1) % 3 || $verts[$b] < 0 && (
            $verts[$b] = 0, $oldVerts[$b] *= -1
        )
    )),

    // Apply all distance constraints

    $constraints.forEach(([$a,$b,$c]) => (
        $addScaledVec = ($x, $y) => [0,1,2].map($d =>
            $verts[$x+$d] =
                ($verts[$a+$d] + $verts[$b+$d]) / 2 +
                $diff($a, $b)[$d] * $c * $y / $dist($a, $b)
        ),
        $addScaledVec($a,  .5),
        $addScaledVec($b, -.5)
    )),

    // Draw

    g.clearColor(.2,.2,.2,1),
    g.clear(16640), // g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT

    g.bindBuffer($a = g.ARRAY_BUFFER, $vertexBuffer),
    g.bufferData($a, Float32Array.from($verts), g.STATIC_DRAW),
    g.enableVertexAttribArray(0),
    g.vertexAttribPointer(0, 3, g.FLOAT, false, 0, 0),

    g.uniform3f(g.getUniformLocation($shader, 'x_aspect'), a.width/a.height,0,0,0),

    g.bindBuffer($a = g.ELEMENT_ARRAY_BUFFER, $indexBuffer),
    g.bufferData($a, Uint16Array.from($tris), g.STATIC_DRAW),
    g.drawElements(g.TRIANGLES, $tris.length, g.UNSIGNED_SHORT, 0)
), 5)