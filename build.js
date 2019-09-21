const shell = require('shelljs');
const fs = require('fs');
const _ = require('lodash');

const shortVarNames = _.range(10, 36)
    .map(x => x.toString(36))
    .filter(x => x !== 'g');

const minifyPrefixedIdentifiers = (prefix, js) => {
    const vars = _.uniq(js
        .match(new RegExp(`[^a-zA-Z0-9_]${prefix}[a-zA-Z0-9_]+`, 'g'))
        .map(x => x.substr(1)));

    vars.sort((a, b) => b.length - a.length);

    vars.forEach((v, i) => {
        js = js.replace(new RegExp('\\'+v, 'g'), shortVarNames[i]);
    });

    return js;
};

const extractAndMinifyShaders = js => {
    const SHADER_MIN_TOOL = process.platform === 'win32' ? 'tools\\shader_minifier.exe' : 'mono tools/shader_minifier.exe';
    const shaders = js.match(/__shader`[^`]+`/g).map(x => x.replace('__shader`', '').replace('`', ''));

    for (let i = 0; js.indexOf('__shader`') >= 0; ++i) {
        js = js.replace(/__shader`[^`]+`/, '__shader' + i);
    }

    for (let i = 0; i < shaders.length; ++i) {
        fs.writeFileSync('tmp_in.glsl', shaders[i]);
        shell.exec(`${SHADER_MIN_TOOL} --preserve-externals --no-renaming-list main --format none tmp_in.glsl -o tmp_out.glsl`);
        shaders[i] = fs.readFileSync('tmp_out.glsl', 'utf8');
    }

    return { js, shaders };
}

const reinsertShaders = (js, shaders) => {
    for (let i = 0; i < shaders.length; ++i) {
        js = js.replace(new RegExp('__shader'+i, 'g'), "'"+shaders[i]+"'");
    }
    return js;
};

const removeWhitespace = js => {
    js = js.replace(/[ \t\r\n]+/g, '');
    js = js.replace(/newFloat32Array/g, 'new Float32Array'); 
    // TODO handle whitespace better
    return js;
}

const main = () => {
    let js = fs.readFileSync('src/main.js', 'utf8');

    js = minifyPrefixedIdentifiers('\\$', js);
    js = minifyPrefixedIdentifiers('x_', js);
    const shaderMinResult = extractAndMinifyShaders(js);
    js = shaderMinResult.js;
    js = removeWhitespace(js);
    js = reinsertShaders(js, shaderMinResult.shaders);

    fs.writeFileSync('tmp_in.js', js);

    shell.exec('regpack --contextType 1 --hashWebGLContext true --contextVariableName g --varsNotReassigned g tmp_in.js > tmp_out.js');

    const packedJS = fs.readFileSync('tmp_out.js', 'utf8');
    const shimHTML = fs.readFileSync('src/shim.html', 'utf8');

    fs.writeFileSync('index.html', shimHTML.replace('__CODE__', packedJS));

    shell.rm('-rf', 'tmp*.*');
}

main();