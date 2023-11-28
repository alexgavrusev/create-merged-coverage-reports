const preserveShebang = require('rollup-plugin-preserve-shebang');

/**
 * @param {import('rollup').RollupOptions} options
 */
function getRollupOptions(options) {
  /**
   * `preserveModules` improves tree-shaking by increasing the amount of modules
   * that can be skipped over
   */
  options.output.preserveModules = true;

  options.plugins.push(preserveShebang());

  return options;
}

module.exports = getRollupOptions;
