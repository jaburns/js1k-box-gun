$shader = g.createProgram();

$verts = [
    -1, -1, -1,
    1, -1, -1,
    -1,  1, -1,
    1,  1, -1,
    -1, -1,  1,
    1, -1,  1,
    -1,  1,  1,
    1,  1,  1
];

$tris =[
    1,0,2,
    1,2,3,

    4,5,6,
    6,5,7,

    5,3,7,
    5,1,3,

    0,6,2,
    0,4,6,

    4,0,5,
    0,1,5,

    2,6,7,
    7,3,2
];

$shaderSource = __shader('shader.vert');
$newShader = g.createShader(g.VERTEX_SHADER);
g.shaderSource($newShader, $shaderSource);
g.compileShader($newShader);
g.attachShader($shader, $newShader);

$shaderSource = __shader('shader.frag');
$newShader = g.createShader(g.FRAGMENT_SHADER);
g.shaderSource($newShader, $shaderSource);
g.compileShader($newShader);
g.attachShader($shader, $newShader);

g.linkProgram($shader);
g.useProgram($shader);

g.enable(g.DEPTH_TEST);

$vertexBuffer = g.createBuffer();
$indexBuffer = g.createBuffer();

$time = 0;
setInterval(_ => {
    $time += .01;

    g.clearColor(.2,.2,.2,1);
//  g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
    g.clear(16640);

    $verts[18] = -.5+.5*Math.sin($time);
    $verts[19] =  .5+.5*Math.cos($time);

    g.bindBuffer($bufferKind = g.ARRAY_BUFFER, $vertexBuffer);
    g.bufferData($bufferKind, Float32Array.from($verts), g.STATIC_DRAW);
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 3, g.FLOAT, false, 0, 0);

    g.uniform3f(g.getUniformLocation($shader, 'x_aspect'), a.width/a.height,0,0,0);

    g.bindBuffer($bufferKind = g.ELEMENT_ARRAY_BUFFER, $indexBuffer);
    g.bufferData($bufferKind, Uint16Array.from($tris), g.STATIC_DRAW);
    g.drawElements(g.TRIANGLES, $tris.length, g.UNSIGNED_SHORT, 0);
}, 5);