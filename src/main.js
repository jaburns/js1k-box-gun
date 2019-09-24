$shader = g.createProgram();

$tris = [];
$verts = [];
for ($i = 0; $i < 50; ++$i)
    $verts = $verts.concat([
        0,10,0,1,10,0,0,11,0,1,11,0,0,10,1,1,10,1,0,11,1,1,11,1
    ]),
    $tris = $tris.concat([
        1,0,2,1,2,3,4,5,6,6,5,7,5,3,7,5,1,3,0,6,2,0,4,6,4,0,5,0,1,5,2,6,7,7,3,2
    ].map($x => $x+8*$i));

$oldVerts = $verts.map(x=>x+.1*(Math.random()-.5));

$diff = ($i,$j) => [
    $verts[$i]-$verts[$j],
    $verts[$i+1]-$verts[$j+1],
    $verts[$i+2]-$verts[$j+2]
];

$dist = ($i,$j) => (
    $dx = $verts[$i]-$verts[$j],
    $dy = $verts[$i+1]-$verts[$j+1],
    $dz = $verts[$i+2]-$verts[$j+2],
    Math.sqrt($dx*$dx+$dy*$dy+$dz*$dz)
);

$midPoint = ($i,$j) => [
    ($verts[$i]+$verts[$j])/2,
    ($verts[$i+1]+$verts[$j+1])/2,
    ($verts[$i+2]+$verts[$j+2])/2
];

$addScaledVec = ($i, $x, $y, $k) => {
    $verts[$i]   = $x[0] + $y[0]*$k;
    $verts[$i+1] = $x[1] + $y[1]*$k;
    $verts[$i+2] = $x[2] + $y[2]*$k;
};

$constraints = [];
for ($k = 0; $k < $verts.length; $k+=24)
    for ($i = $k; $i < $k+21; $i+=3)
        for ($j = $i+3; $j < $k+24; $j+=3)
            $constraints.push([$i,$j,$dist($i,$j)]);

$shaderSource = __shader('shader.vert');
$newShader = g.createShader(g.VERTEX_SHADER);
g.shaderSource($newShader, $shaderSource);
g.compileShader($newShader);
g.attachShader($shader, $newShader);
/*
    $log = g.getShaderInfoLog($newShader);
    if ($log === null || $log.length > 0 && $log.indexOf('ERROR') >= 0) {
        console.log($log);
    }
*/

$shaderSource = __shader('shader.frag');
$newShader = g.createShader(g.FRAGMENT_SHADER);
g.shaderSource($newShader, $shaderSource);
g.compileShader($newShader);
g.attachShader($shader, $newShader);
/*
    $log = g.getShaderInfoLog($newShader);
    if ($log === null || $log.length > 0 && $log.indexOf('ERROR') >= 0) {
        console.log($log);
    }
*/

g.linkProgram($shader);
g.useProgram($shader);

g.enable(g.DEPTH_TEST);

$vertexBuffer = g.createBuffer();
$indexBuffer = g.createBuffer();

setInterval(_ => {
    // Verlet integration of vertex positions, updating previous positions
    $verts.forEach(($x,$i) => {
        $verts[$i] += $x - $oldVerts[$i] - (($i-1)%3 ? 0 : .0001);
        $oldVerts[$i] = $x;

        if (!(($i-1)%3)) {
            if ($verts[$i] < 0) {
                $verts[$i] = 0;
                $oldVerts[$i] *= -1;
            }
        }
    });

    // Apply all distance constraints
    $constraints.forEach(([$i,$j,$k]) => {
        $x = $midPoint($i, $j);
        $curDist = $dist($i, $j);
        $iFromJ = $diff($i, $j);

        $addScaledVec($i, $x, $iFromJ,  .5 / $curDist * $k);
        $addScaledVec($j, $x, $iFromJ, -.5 / $curDist * $k);
    });

    g.clearColor(.2,.2,.2,1);
    g.clear(16640); // g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT

    g.bindBuffer($bufferKind = g.ARRAY_BUFFER, $vertexBuffer);
    g.bufferData($bufferKind, Float32Array.from($verts), g.STATIC_DRAW);
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 3, g.FLOAT, false, 0, 0);

    g.uniform3f(g.getUniformLocation($shader, 'x_aspect'), a.width/a.height,0,0,0);

    g.bindBuffer($bufferKind = g.ELEMENT_ARRAY_BUFFER, $indexBuffer);
    g.bufferData($bufferKind, Uint16Array.from($tris), g.STATIC_DRAW);
    g.drawElements(g.TRIANGLES, $tris.length, g.UNSIGNED_SHORT, 0)
}, 5)