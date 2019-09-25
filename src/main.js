// ===== Geometry and constraints initialization =====

$numList = $a => $a[0].split('').map($a=>$a|0);

$tris = $numList`012123`,
$verts = $numList`101201102202`.map($a => $a&&$a*200-300);

for ($a = 0; $a++ < 99;)
    $verts = $verts.concat($numList`080180090190081181091191`),
    $tris = $tris.concat($numList`102123456657537513062046405015267732`.map($b => $b + 8*$a + 4));

$oldVerts = $verts.map(($a,$b) => $b>11 ? $a + .1*Math.random()-.05 : $a);

$dist = ($a,$b) => Math.sqrt([0,1,2].map($d => $verts[$a+$d] - $verts[$b+$d]).reduce(($a,$b) => $a + $b*$b,0)),

// $dist = ($a,$b) => Math.sqrt(
//     $y=0, $d=0,
//     $x=$verts[$a+$d] - $verts[$b+$d++], $y += $x*$x,
//     $x=$verts[$a+$d] - $verts[$b+$d++], $y += $x*$x,
//     $x=$verts[$a+$d] - $verts[$b+$d++], $y += $x*$x,
//     $y
// ),

$constraints = [];
for ($a = 12; $a < 2388; $a+=24)  // $verts.length = 2388
    for ($b = $a; $b < $a+21; $b+=3)
        for ($c = $b+3; $c < $a+24; $c+=3)
            $constraints.push([$b,$c,$dist($b,$c)]);


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

// ===== Main loop =====

$time = 0,

setInterval(_ => (

    ++$time>99 && (

    // Vertex position updates

        $verts.forEach(($a,$b) => (
            $verts[$b] += $a - $oldVerts[$b] - (($b-1)%3 ? 0 : 2e-4),
            $oldVerts[$b] = $a,

            ($b-1) % 3 || $verts[$b] < 0 && (
                $verts[$b] = 0,
                $oldVerts[$b] *= -1,
                

                // Apply friction along xz 
                $x = -1,
                $oldVerts[$b+$x] = .8*($oldVerts[$b+$x] - $verts[$b+$x]) + $verts[$b+$x],
                $x =  1,
                $oldVerts[$b+$x] = .8*($oldVerts[$b+$x] - $verts[$b+$x]) + $verts[$b+$x]
            )
        )),

        // Apply all distance constraints

        $constraints.forEach(([$a,$b,$c]) => (
            $x = $a, $y = .5,
            [0,1,2].map($d =>
                $verts[$x+$d] =
                    ($verts[$a+$d] + $verts[$b+$d]) / 2 +
                    ($verts[$a+$d] - $verts[$b+$d]) * $c * $y / $dist($a, $b)),

            $x = $b, $y = -.5,
            [0,1,2].map($d =>
                $verts[$x+$d] =
                    ($verts[$a+$d] + $verts[$b+$d]) / 2 +
                    ($verts[$a+$d] - $verts[$b+$d]) * $c * $y / $dist($a, $b))
        ))
    ),

    // Draw

    g.clearColor(0,0,0,1),
    g.clear(16640), // g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT

    $a = g.ARRAY_BUFFER,

    g.vertexAttribPointer(
        0, 3, g.FLOAT,
        g.enableVertexAttribArray(g.useProgram($shader)), // false,
        g.bindBuffer($a, g.createBuffer()), // 0, 
        g.bufferData($a, Float32Array.from($verts), ++$a + 81) // 0,  // g.ARRAY_BUFFER + 82 = g.STATIC_DRAW
    ),

    g.uniform1f(g.getUniformLocation($shader, 'x_aspect'), a.width/a.height),

    g.bindBuffer($a, g.createBuffer()), // g.ARRAY_BUFFER + 1 = g.ELEMENT_ARRAY_BUFFER
    g.bufferData($a, Uint16Array.from($tris), $a + 81),
    g.drawElements(g.TRIANGLES, 3570, g.UNSIGNED_SHORT, 0) // $tris.length = 3570

), 5)