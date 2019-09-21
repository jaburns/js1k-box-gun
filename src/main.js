$vertShaderSource = __shader`
    attribute vec2 x_position;
    varying vec2 x_uv;

    void main()
    {
        gl_Position = vec4(x_position, 0, 1);
        v_uv = x_position.xy*0.5 + 0.5;
    }
`;

$fragShaderSource = __shader`
    varying highp vec2 x_uv;

    void main()
    {
        gl_FragColor = vec4(x_uv, 0, 1);
    }
`;

$vertShader = g.createShader(g.VERTEX_SHADER);
g.shaderSource($vertShader, $vertShaderSource);
g.compileShader($vertShader);

$fragShader = g.createShader(g.FRAGMENT_SHADER);
g.shaderSource($fragShader, $fragShaderSource);
g.compileShader($fragShader);

$shader = g.createProgram();
g.attachShader($shader, $vertShader);
g.attachShader($shader, $fragShader);
g.linkProgram($shader);

g.useProgram($shader);

$vertexBuffer = g.createBuffer();
g.bindBuffer(g.ARRAY_BUFFER, $vertexBuffer);
g.bufferData(g.ARRAY_BUFFER, new Float32Array([ -1,.5,-1,-1,1,-1,1,-1,1,1,-1,1 ]), g.STATIC_DRAW);

$posLoc = g.getAttribLocation($shader, 'x_position');
g.enableVertexAttribArray($posLoc);
g.vertexAttribPointer($posLoc, 2, g.FLOAT, false, 0, 0);

g.drawArrays(g.TRIANGLES, 0, 6);