import { sveltekit } from '@sveltejs/kit/vite';
import commonjs from '@rollup/plugin-commonjs';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			plugins: [commonjs({ dynamicRequireTargets: ['node_modules/i2c-bus/*'] })]
		}
	}
});
