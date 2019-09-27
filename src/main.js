// ===== Geometry and constraints initialization =====

$tris = [...'012123'],
$verts = [...'404804408808'].map($a => $a|0&&$a*99-594);

for ($a = 0; $a < 150; $a++)
    $verts = $verts.concat([...'080180090190081181091191'].map($a => $a|0)),
    $tris = $tris.concat([...'102123456657537513062046405015267732'].map($b => ($b|0) + 8*$a + 4));

$oldVerts = $verts.map(($a,$b) => $b>11 ? $a + .1*Math.random()-.05 : $a);

__defMacro('DIST',
    ($xc = 0,
    [0,1,2].map($d => $xc += ($xe=$verts[$a+$d]-$verts[$b+$d])*$xe),
    Math.sqrt($xc))
)

$constraints = [];
for ($c = 12; $c < 3612; $c+=24)  // $verts.length = 3612
    for ($b = $c; $b < $c+21; $b+=3)
        for ($a = $b+3; $a < $c+24; $a+=3)
            $constraints.push([$b, $a, DIST]),
            $constraints.push([$a, $b, DIST]);


// ===== Shader compilation and WebGL setup =====

g.enable(g.DEPTH_TEST),
$shader = g.createProgram(),

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
g.clearColor($time=0,0,0,1),

// ===== Main loop =====

setInterval(_ => (

    ++$time>99 && (

        // Vertex position and velocity updates
        $verts.map(($a,$b) => (
            $verts[$b] += $a - $oldVerts[$b] - ($b%3^1 ? 0 : 2e-4),
            $oldVerts[$b] = $a,

            // If the vertex is through the floor
            $b%3^1 || $verts[$b] < 0 && (
                // Restore position and reflect velocity
                $verts[$b] = 0,
                $oldVerts[$b] *= $x = -1,

                // Apply friction along xz 
                $oldVerts[$b+$x] = .8*($oldVerts[$b+$x] - $verts[$b+$x]) + $verts[$b+$x],
                $x *= -1,
                $oldVerts[$b+$x] = .8*($oldVerts[$b+$x] - $verts[$b+$x]) + $verts[$b+$x]
            )
        )),

        // Apply all distance constraints
        $constraints.map(([$a,$b,$c]) =>
            [0,1,2].map($d =>
                $verts[$a+$d] =
                    ($verts[$a+$d] + $verts[$b+$d]) * .5 +
                    ($verts[$a+$d] - $verts[$b+$d]) * .5 * $c / DIST),
        )
    ),

    g.clear(16640), // g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT

    $a = g.ARRAY_BUFFER,

    g.vertexAttribPointer(
        0, 3, g.FLOAT,
        g.enableVertexAttribArray(g.useProgram($shader)), // false,
        g.bindBuffer($a, g.createBuffer()), // 0, 
        g.bufferData($a, Float32Array.from($verts), ++$a + 81) // 0, // g.ARRAY_BUFFER + 82 = g.STATIC_DRAW
    ),

    g.uniform1f(g.getUniformLocation($shader, 'x_aspect'), a.width/a.height),

    g.bindBuffer($a, g.createBuffer()), // g.ARRAY_BUFFER + 1 = g.ELEMENT_ARRAY_BUFFER
    g.bufferData($a, Int16Array.from($tris), $a + 81),
    g.drawElements(g.TRIANGLES, 5406, g.UNSIGNED_SHORT, 0) // $tris.length = 5406

), 5)