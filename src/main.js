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

$attachShader = (a, b) => (
    $x = g.createShader(a),
    g.shaderSource($x, b),
    g.compileShader($x),
    g.attachShader($shader, $x)
);

$attachShader(g.VERTEX_SHADER, __shader`
    attribute vec2 x_position;
    varying vec2 x_uv;

    void main()
    {
        gl_Position = vec4(x_position, 0, 1);
        x_uv = x_position.xy*0.5 + 0.5;
    }
`);

$attachShader(g.FRAGMENT_SHADER, __shader`
    varying highp vec2 x_uv;

    void main()
    {
        gl_FragColor = vec4(x_uv, 0, 1);
    }
`);

g.linkProgram($shader);
g.useProgram($shader);

$vertexBuffer = g.createBuffer();
g.bindBuffer(g.ARRAY_BUFFER, $vertexBuffer);
g.bufferData(g.ARRAY_BUFFER, new Float32Array([ -1,1,-1,-.5,1,-1,1,-1,1,1,-1,1 ]), g.STATIC_DRAW);

g.enableVertexAttribArray(0);
g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);

g.drawArrays(g.TRIANGLES, 0, 6);