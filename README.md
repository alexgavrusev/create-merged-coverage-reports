# create-merged-coverage-reports

Combine multiple coverage reports into a single merged one

## Installation

```bash
npm i -D create-merged-coverage-reports
```

## Usage

First, configure your testing framework to output either [`json`](https://istanbul.js.org/docs/advanced/alternative-reporters/#json), or, if you are running tests on multiple machines, [`relative-paths-istanbul-json-report`](https://github.com/alexgavrusev/relative-paths-istanbul-json-report#readme), coverage reports

Then, merge your coverage reports using either the CLI, or the API

### CLI

```
$ npx create-merged-coverage-reports@latest --help

Usage: create-merged-coverage-reports [options]

Create merged coverage reports

Options:
  -v, --version                   output the version number
  -c, --coverageFileGlob <glob>   Glob to get all json coverage files
  -o, --outputDirectory <dir>     Directory where all merged coverage reports
  -r, --reporters <reporters...>  Which reporters (either built-in, or custom) to use to generate the merged coverage
                                  reports
  -h, --help                      display help for command
```

### API

```ts
import { createMergedCoverageReports } from 'create-merged-coverage-reports';

async function main() {
  await createMergedCoverageReports();
}

main();
```

## Building

Run `nx build create-merged-coverage-reports` to build the library.

## Running unit tests

Run `nx test create-merged-coverage-reports` to execute the unit tests.

## License

MIT © Aliaksandr Haurusiou.
