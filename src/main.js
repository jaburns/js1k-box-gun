__defMacro('DIST',
    Math.hypot(...[0,1,2].map($c => $verts[$a+$c]-$verts[$b+$c]))
)

// ===== Shader compilation and WebGL setup =====

g.enable(g.DEPTH_TEST),
$shader = g.createProgram(),

$a = __shader('shader.vert'),
$b = g.createShader(g.VERTEX_SHADER),
g.shaderSource($b, $a),
g.compileShader($b),
g.attachShader($shader, $b),
//console.log(g.getShaderInfoLog($b)),

$a = __shader('shader.frag'),
$b = g.createShader(g.FRAGMENT_SHADER),
g.shaderSource($b, $a),
g.compileShader($b),
g.attachShader($shader, $b),
//console.log(g.getShaderInfoLog($b)),

g.linkProgram($shader),
g.clearColor($time=0,0,0,1),

// ===== Main loop =====

setInterval($c => {

    // Geometry and constraints initialization
    if (!$time++) {
        for (
            $constraints = [],
            $tris = [...'012123'],
            $verts = [...'040840048848'].map($c => $c*99-396),

            $a = $b = $c = $d = 12;
            $c < 3612; // $verts.length = 3612
            ($a += 3) >= $c + 24 && ($a = $b += 3) >= $c + 24 && ($b = $c += 24)
        )
            $d < 1220 && ( // 150 (cube count) * 8 (verts per cube) + 20 (iteration offset)
                $verts = $verts.concat([...'080180090190081181091191'].map($c => ~~$c)),
                $tris = $tris.concat([...'102123456657537513062046405015267732'].map($c => ~~$c + $d - 8))
            ),
            $a ^ $b && (
                $constraints.push([$b, $a, DIST]),
                $constraints.push([$a, $b, DIST])
            ),
            $d += 8;

        $oldVerts = $verts.map(($a,$b) => $b > 11 ? $a + .6*Math.random()-.3 : $a)
    }

    $time %= 540,

    $time > 50 && 

        // Vertex position and velocity updates
        $verts.map(($a,$b) => (
            $verts[$b] += $a - $oldVerts[$b] - ($b%3^1 ? 0 : 2e-3),
            $oldVerts[$b] = $a,

            // If the vertex is through the floor
            ($time < 500 || $b < 12) && (
                $b%3^1 || $verts[$b] < 0 && (
                    // Restore position and reflect y velocity
                    $verts[$b] = 0,
                    $oldVerts[$b] *= $c = -1,

                    // Zero out velocity along xz plane for friction
                    $oldVerts[$b+$c] = $verts[$b+$c],
                    $c *= -1,
                    $oldVerts[$b+$c] = $verts[$b+$c]
                )
            )
        ))

        &&

        // Apply all distance constraints
        $constraints.map(([$a,$b,$length]) =>
            [0,1,2].map($c =>
                $verts[$a+$c] =
                    ($verts[$a+$c] + $verts[$b+$c]) * .5 +
                    ($verts[$a+$c] - $verts[$b+$c]) * .5 * $length / DIST),
        )
    ,

    g.clear(16640), // g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT

    $a = g.ARRAY_BUFFER,

    g.vertexAttribPointer(
        0, 3, g.FLOAT,
        g.enableVertexAttribArray(g.useProgram($shader)), // false,
        g.bindBuffer($a, g.createBuffer()), // 0, 
        g.bufferData($a, Float32Array.from($verts), ++$a + 81) // 0, // g.ARRAY_BUFFER + 82 = g.STATIC_DRAW
    ),

    g.bindBuffer($a, g.createBuffer()), // g.ARRAY_BUFFER + 1 = g.ELEMENT_ARRAY_BUFFER
    g.bufferData($a, Int16Array.from($tris), $a + 81),

    g.uniform3f(g.getUniformLocation($shader, 'g'), a.width/a.height, $time<50?50-$time:0, 0),

    g.drawElements(g.TRIANGLES, 5406, g.UNSIGNED_SHORT, 0) // $tris.length = 5406

}, 16)