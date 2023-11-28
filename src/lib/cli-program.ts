import { Command } from 'commander';
import { dynamicImport } from 'tsimportlib';
import { createMergedCoverageReports } from './create-merged-coverage-reports';

export const createProgram = async ({ exitOverride = false } = {}) => {
  const program = new Command();

  if (exitOverride) {
    program.exitOverride();
  }

  const { readPackageUp } = (await dynamicImport(
    require.resolve('read-package-up'),
    module
  )) as typeof import('read-package-up');

  const {
    packageJson: { name, version, description },
  } = await readPackageUp({ cwd: __dirname });

  program
    .name(name)
    .description(description)
    .version(version, '-v, --version')
    .option(
      '-c, --coverageFileGlob <glob>',
      'Glob to get all json coverage files'
    )
    .option(
      '-o, --outputDirectory <dir>',
      'Directory where all merged coverage reports'
    )
    .option(
      '-r, --reporters <reporters...>',
      'Which reporters (either built-in, or custom) to use to generate the merged coverage reports'
    )
    .action((options) => {
      return createMergedCoverageReports(options);
    });

  return program;
};
