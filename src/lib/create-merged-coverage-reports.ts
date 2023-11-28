import * as path from 'path';
import { createCoverageMap } from 'istanbul-lib-coverage';
import { createContext } from 'istanbul-lib-report';
import { create as createReport, ReportOptions } from 'istanbul-reports';
import { readJson } from 'fs-extra';
import { dynamicImport } from 'tsimportlib';

type CreateMergedCoverageReportsOptions = {
  /**
   * Glob to get all json coverage files
   *
   * @default 'coverage/** /coverage-final.json'
   */
  coverageFileGlob?: string;

  /**
   * Directory where all merged coverage reports
   *
   * Note that this directory will be excluded from the coverage files lookup
   *
   * @default 'coverage/merged'
   */
  outputDirectory?: string;

  /**
   * Which reporters (either built-in, or custom) to use to generate the merged coverage reports
   *
   * @see https://istanbul.js.org/docs/advanced/alternative-reporters
   *
   * @default ['json']
   */
  reporters?: string[];
};

const getGlobby = () =>
  dynamicImport(require.resolve('globby'), module) as Promise<
    typeof import('globby')
  >;

const normalizeOptions = (options: CreateMergedCoverageReportsOptions) => {
  const {
    coverageFileGlob = 'coverage/**/coverage-final.json',
    outputDirectory = path.join('coverage', 'merged'),
    reporters = ['json'],
  } = options;

  return {
    coverageFileGlob,
    outputDirectory,
    reporters,
  };
};

export const createMergedCoverageReports = async (
  options: CreateMergedCoverageReportsOptions = {}
) => {
  const { coverageFileGlob, outputDirectory, reporters } =
    normalizeOptions(options);

  const { globby } = await getGlobby();

  const jsonFilePaths = await globby([
    coverageFileGlob,
    `!${outputDirectory}/**/*`,
  ]);

  if (jsonFilePaths.length === 0) {
    throw new Error(
      `No coverage reports found with the ${coverageFileGlob} glob`
    );
  }

  const mergedMap = createCoverageMap();

  for (const jsonFilePath of jsonFilePaths) {
    const coverageJson = await readJson(
      // ensure absolute path, otherwise ENOENT error happens
      path.resolve(jsonFilePath)
    );

    mergedMap.merge(coverageJson);
  }

  const reportGenerationContext = createContext({
    dir: outputDirectory,
    defaultSummarizer: 'nested',
    coverageMap: mergedMap,
  });

  reporters.forEach((reporter) => {
    const report = createReport(
      // HACK: may be a custom reporter
      reporter as unknown as keyof ReportOptions
    );

    report.execute(reportGenerationContext);
  });

  console.log(
    `Generated ${reporters.join(', ')} reports to ${outputDirectory}`
  );
};
