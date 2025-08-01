import { vi, describe, it, expect, beforeEach } from "vitest";
import { dirSync, type DirResult } from "tmp";
import * as path from "path";
import { readFile, rename, cp } from "fs/promises";
import { convertPathToPattern } from "tinyglobby";

import { createMergedCoverageReports } from "./create-merged-coverage-reports";

describe("createMergedCoverageReports", () => {
  let tmpDir: DirResult;

  const expectedMergedReportsDir = path.resolve(
    import.meta.dirname,
    "__fixtures__",
    "expected-merged",
  );

  const assertMergedCoverageFile = async ({
    dir = path.join("coverage", "merged"),
    file = "coverage-final.json",
  } = {}) => {
    await expect(
      await readFile(path.resolve(tmpDir.name, dir, file), "utf-8"),
    ).toMatchFileSnapshot(path.resolve(expectedMergedReportsDir, file));
  };

  beforeEach(async () => {
    tmpDir = dirSync();

    vi.spyOn(process, "cwd").mockReturnValue(tmpDir.name);

    await cp(
      path.resolve(import.meta.dirname, "__fixtures__", "coverage"),
      path.resolve(tmpDir.name, "coverage"),
      { recursive: true },
    );
  });

  it("should create merged json report", async () => {
    await createMergedCoverageReports();

    await assertMergedCoverageFile();
  });

  it("should throw error when no coverage files were found", async () => {
    await expect(
      createMergedCoverageReports({
        coverageFileGlob: "foo/**/bar.json",
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: No coverage reports found with the foo/**/bar.json glob]`,
    );
  });

  it("should exclude the merged report from merging", async () => {
    await createMergedCoverageReports();

    await assertMergedCoverageFile();

    await createMergedCoverageReports();

    await assertMergedCoverageFile();
  });

  describe("options", () => {
    it("should support custom glob", async () => {
      await rename(
        path.resolve(tmpDir.name, "coverage"),
        path.resolve(tmpDir.name, "custom-coverage"),
      );

      await createMergedCoverageReports({
        coverageFileGlob: "custom-coverage/**/coverage-final.json",
      });

      await assertMergedCoverageFile();
    });

    it("should support custom output directory", async () => {
      const dir = "custom-out";

      await createMergedCoverageReports({
        outputDirectory: dir,
      });

      await assertMergedCoverageFile({ dir });
    });

    it("should support absolute paths", async () => {
      await rename(
        path.resolve(tmpDir.name, "coverage"),
        path.resolve(tmpDir.name, "custom-coverage"),
      );

      const dir = path.resolve(tmpDir.name, "custom-out");
      const glob =
        convertPathToPattern(path.resolve(tmpDir.name, "custom-coverage")) +
        "/**/coverage-final.json";

      await createMergedCoverageReports({
        outputDirectory: dir,
        coverageFileGlob: glob,
      });

      await assertMergedCoverageFile({ dir });
    });

    it("should support custom reporters", async () => {
      await createMergedCoverageReports({
        reporters: ["lcovonly"],
      });

      await assertMergedCoverageFile({ file: "lcov.info" });
    });
  });
});
