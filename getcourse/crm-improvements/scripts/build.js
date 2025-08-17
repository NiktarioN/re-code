const { resolve } = require('node:path');
const { rmSync } = require('node:fs');
const { build } = require('esbuild');

const buildPath = resolve(__dirname, '../build');

// Очищаем предыдущую сборку
rmSync(buildPath, { recursive: true, force: true });

build({
  bundle: true,
  minify: true,
  entryPoints: [resolve(__dirname, '../src/**/*.js')],
  outdir: buildPath,
});
