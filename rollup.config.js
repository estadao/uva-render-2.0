import svelte from 'rollup-plugin-svelte';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';

export default {
    input: 'src/lib/index.js',
    output: {
        file: 'public/uva-render-02.js',
        format: 'iife',
        name: 'UvaRender'
    },
    plugins: [
        alias({
            entries: [
                { find: 'stores', replacement: 'src/lib/stores' },
                { find: 'components', replacement: 'src/lib/components' },
                { find: 'css', replacement: 'src/lib/css' },
                { find: 'scripts', replacement: 'src/lib/scripts' },
            ]}),
        svelte({
            emitCss: false
        }),
        nodeResolve({
            browser: true,
            preferBuiltins: true
        }),
        commonjs(),
        postcss({
            extract: false
        }),
        terser()
    ]
};