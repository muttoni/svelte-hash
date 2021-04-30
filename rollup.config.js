import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import copy from "rollup-plugin-copy";
import fs from "fs";
import posthtml from "posthtml";
import { hash } from "posthtml-hash";
import htmlnano from "htmlnano";
import rimraf from "rimraf";
import css from 'rollup-plugin-css-only';

const PROD = !process.env.ROLLUP_WATCH;
const OUT_DIR = "build";

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

function hashStatic() {
  return {
    name: "hash-static",
    buildStart() {
      rimraf.sync(OUT_DIR);
    },
    writeBundle() {
      posthtml([
        // hashes `bundle.[hash].css` and `bundle.[hash].js`
        hash({ path: OUT_DIR }),
        
        // minifies `build/index.html`
        // https://github.com/posthtml/htmlnano
        htmlnano(),
      ])
      .process(fs.readFileSync(`${OUT_DIR}/index.html`))
      .then((result) =>
        fs.writeFileSync(`${OUT_DIR}/index.html`, result.html)
      );
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: !PROD,
    format: "iife",
    name: "app",
    file: `${OUT_DIR}/bundle.[hash].js`,
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !PROD
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.[hash].css' }),
    
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),

    commonjs(),
    
    rimraf.sync(OUT_DIR),

    copy({ targets: [{ src: "public/*", dest: OUT_DIR }] }),
    
    !PROD && serve(),
    
    !PROD && livereload({ watch: OUT_DIR }),
    
    PROD && terser({ 
      compress: {
        drop_console: true
      }, 
      mangle: true 
    }),
    
    PROD && hashStatic(),
  ],
};
