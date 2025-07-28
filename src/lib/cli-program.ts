import { Command } from "commander";
import { readPackageUp } from "read-package-up";

import { createMergedCoverageReports } from "./create-merged-coverage-reports";

export const createProgram = async ({ exitOverride = false } = {}) => {
  const program = new Command();

  if (exitOverride) {
    program.exitOverride();
  }

  const packageUpResult = await readPackageUp({ cwd: import.meta.dirname });

  if (!packageUpResult) {
    console.error("Cannot find package.json");
    process.exit(1);
  }

  const {
    packageJson: { name, version, description },
  } = packageUpResult;

  program
    .name(name)
    .description(description ?? "")
    .version(version, "-v, --version")
    .option(
      "-c, --coverageFileGlob <glob>",
      "Glob to get all json coverage files",
    )
    .option(
      "-o, --outputDirectory <dir>",
      "Directory where all merged coverage reports",
    )
    .option(
      "-r, --reporters <reporters...>",
      "Which reporters (either built-in, or custom) to use to generate the merged coverage reports",
    )
    .action((options) => {
      return createMergedCoverageReports(options);
    });

  return program;
};
