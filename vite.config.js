import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
    resolve: {
        alias: [
            { find: 'stores', replacement: '/src/lib/stores' },
            { find: 'components', replacement: '/src/lib/components' },
            { find: 'css', replacement: '/src/lib/css' },
            { find: 'scripts', replacement: '/src/lib/scripts' },
        ]
    }
});
