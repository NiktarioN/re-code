const presetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

module.exports = {
	plugins: [
		presetEnv(),
		cssNano({
			preset: 'default',
		}),
	],
};
