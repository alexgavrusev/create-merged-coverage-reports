#!/usr/bin/env node

import { createProgram } from './lib/cli-program';

const main = async () => {
  const program = await createProgram();

  program.parse();
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
