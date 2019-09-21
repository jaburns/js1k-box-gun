const shell = require('shelljs');
const fs = require('fs');
const _ = require('lodash');

const shortVarNames = _.range(10, 36)
    .map(x => x.toString(36))
    .filter(x => x !== 'g');

const SHADER_MIN_TOOL = process.platform === 'win32' ? 'tools\\shader_minifier.exe' : 'mono tools/shader_minifier.exe';

let js = fs.readFileSync('src/main.js', 'utf8');




let cashVars = _.uniq(js
    .match(/[^a-zA-Z0-9_]\$[a-zA-Z0-9_]+/g)
    .map(x => x.substr(1)));

cashVars.sort((a, b) => b.length - a.length);

cashVars.forEach((v, i) => {
    js = js.replace(new RegExp('\\'+v, 'g'), shortVarNames[i]);
});



_.uniq(js
    .match(/[^a-zA-Z0-9_]x_[a-zA-Z0-9_]+/g)
    .map(x => x.substr(1))
)
.forEach((v, i) => {
    js = js.replace(new RegExp('\\'+v, 'g'), shortVarNames[i]);
});




const shaders = js.match(/__shader`[^`]+`/g).map(x => x.replace('__shader`', '').replace('`', ''));

for (let i = 0; js.indexOf('__shader`') >= 0; ++i)
    js = js.replace(/__shader`[^`]+`/, '__shader' + i);

// shell.exec(`${SHADER_MIN_TOOL} --preserve-externals --no-renaming-list main,${allIncludedFunctionNames.join(',')} --format js ${fileName} -o tmp.js`);


fs.writeFileSync('tmp.js', js);

shell.exec('regpack --contextType 1 --hashWebGLContext true --contextVariableName g --varsNotReassigned g tmp.js > packed.js');