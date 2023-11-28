import { Command } from 'commander';

import { createMergedCoverageReports } from './create-merged-coverage-reports';
import { createProgram } from './cli-program';

vi.mock('./create-merged-coverage-reports', () => {
  return {
    createMergedCoverageReports: vi.fn(),
  };
});

describe('CLI program', () => {
  let program: Command;

  beforeEach(async () => {
    program = await createProgram({ exitOverride: true });
  });

  it('should forward options to `createMergedCoverageReports`', async () => {
    const coverageFileGlob = 'foo/**/coverage-final.json';
    const outputDirectory = 'out';
    const reporters = ['lcovonly'];

    program.parse(
      ['-c', coverageFileGlob, '-o', outputDirectory, '-r', ...reporters],
      { from: 'user' }
    );

    expect(createMergedCoverageReports).toHaveBeenCalledOnce();
    expect(createMergedCoverageReports).toHaveBeenCalledWith({
      coverageFileGlob,
      outputDirectory,
      reporters,
    });
  });
});
