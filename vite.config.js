import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

const reactPlugin = react();

export default defineConfig({
	plugins: [
		laravel({
			input: 'resources/js/app.jsx',
			refresh: true,
		}),
		reactPlugin,
		VitePWA({ registerType: 'autoUpdate' })
	],
	resolve: {
		alias: {
			// This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
			// see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
			// process and buffer are excluded because already managed
			// by node-globals-polyfill
			util: 'rollup-plugin-node-polyfills/polyfills/util',
			sys: 'util',
			events: 'rollup-plugin-node-polyfills/polyfills/events',
			stream: 'rollup-plugin-node-polyfills/polyfills/stream',
			path: 'rollup-plugin-node-polyfills/polyfills/path',
			querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
			punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
			url: 'rollup-plugin-node-polyfills/polyfills/url',
			string_decoder:
				'rollup-plugin-node-polyfills/polyfills/string-decoder',
			buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
			process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
			http: 'rollup-plugin-node-polyfills/polyfills/http',
			https: 'rollup-plugin-node-polyfills/polyfills/http',
			os: 'rollup-plugin-node-polyfills/polyfills/os',
			assert: 'rollup-plugin-node-polyfills/polyfills/assert',
			constants: 'rollup-plugin-node-polyfills/polyfills/constants',
			_stream_duplex:
				'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
			_stream_passthrough:
				'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
			_stream_readable:
				'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
			_stream_writable:
				'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
			_stream_transform:
				'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
			timers: 'rollup-plugin-node-polyfills/polyfills/timers',
			console: 'rollup-plugin-node-polyfills/polyfills/console',
			vm: 'rollup-plugin-node-polyfills/polyfills/vm',
			zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
			tty: 'rollup-plugin-node-polyfills/polyfills/tty',
			domain: 'rollup-plugin-node-polyfills/polyfills/domain'
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					process: true,
					buffer: true
				}),
				NodeModulesPolyfillPlugin()
			]
		}
	},
	build: {
		target: 'esnext',
		chunkSizeWarningLimit: 3000
	},
	worker: {
		plugins: [reactPlugin],
		format: 'es'
	}
});



// https://vitejs.dev/config/
// const defineConfig({
//     plugins: [react()],
//     resolve: {
//         alias: {
//             // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
//             // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
//             // process and buffer are excluded because already managed
//             // by node-globals-polyfill
//             util: 'rollup-plugin-node-polyfills/polyfills/util',
//             sys: 'util',
//             events: 'rollup-plugin-node-polyfills/polyfills/events',
//             stream: 'rollup-plugin-node-polyfills/polyfills/stream',
//             path: 'rollup-plugin-node-polyfills/polyfills/path',
//             querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
//             punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
//             url: 'rollup-plugin-node-polyfills/polyfills/url',
//             string_decoder:
//                 'rollup-plugin-node-polyfills/polyfills/string-decoder',
//             buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
//             process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
//             http: 'rollup-plugin-node-polyfills/polyfills/http',
//             https: 'rollup-plugin-node-polyfills/polyfills/http',
//             os: 'rollup-plugin-node-polyfills/polyfills/os',
//             assert: 'rollup-plugin-node-polyfills/polyfills/assert',
//             constants: 'rollup-plugin-node-polyfills/polyfills/constants',
//             _stream_duplex:
//                 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
//             _stream_passthrough:
//                 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
//             _stream_readable:
//                 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
//             _stream_writable:
//                 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
//             _stream_transform:
//                 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
//             timers: 'rollup-plugin-node-polyfills/polyfills/timers',
//             console: 'rollup-plugin-node-polyfills/polyfills/console',
//             vm: 'rollup-plugin-node-polyfills/polyfills/vm',
//             zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
//             tty: 'rollup-plugin-node-polyfills/polyfills/tty',
//             domain: 'rollup-plugin-node-polyfills/polyfills/domain'
//         }
//     },
//     optimizeDeps: {
//         esbuildOptions: {
//             // Node.js global to browser globalThis
//             define: {
//                 global: 'globalThis'
//             },
//             // Enable esbuild polyfill plugins
//             plugins: [
//                 NodeGlobalsPolyfillPlugin({
//                     process: true,
//                     buffer: true
//                 }),
//                 NodeModulesPolyfillPlugin()
//             ]
//         }
//     },
//     build: {
//         rollupOptions: {
//             plugins: [
//                 // Enable rollup polyfills plugin
//                 // used during production bundling
//                 rollupNodePolyFill()
//             ]
//         }
//     }
// })