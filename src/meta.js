module.exports = {
    vpMatrix: (() => {
        const far = 100;
        const near = 0.1;
        const x = 0;
        const y = -5;
        const z = -20;

        const componentX = x !== 0 ? '1. / x_aspect.x *'+x : '0';

        const matArgs = [
            '1./x_aspect.x', 0, 0, 0,
            0, 1, 0, 0,
            0, 0, (far + near) / (near - far), -1,
            componentX, y, (2. * far * near) / (near - far) + (far + near) / (near - far) * z, -z
        ].map(x => {
            if (typeof x === 'string') return x;
            let result = x.toFixed(2);
            if (result.endsWith('.00')) {
                result = result.replace('.00', '');
            }
            return result;
        })
        .join(',');

        return `mat4(${matArgs})`;
    })()
};


// TODO: instead of inlining the whole matrix with zeros and all, try expanding the mat4 * vec4 expression