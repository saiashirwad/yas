#!/usr/bin/env tsx

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { execaCommand } from "execa";
import type { PackageJson } from "../src/publicizePackageJson";
import { publicizePackageJson } from "../src/publicizePackageJson";
import type { MutableResource } from "../src/createMutableResource";

//const publishScript = `pnpm publish --no-git-checks`;
const publishScript = `echo "hello world"`;

async function releaseIncubation({ distFolder }: { distFolder: string }) {
  const exitCode = await publicizePackageJson({
    async operation(pkg) {
      // Bump the version
      await bumpPackageVersion(pkg);

      // Release to npm
      console.log(`Releasing with npm "${publishScript}"`);
      const { stdout } = await execaCommand(publishScript);
      console.log(stdout);
    },
    distFolder,
  });

  if (exitCode !== 0) {
    return exitCode;
  }

  return 0;
}

async function bumpPackageVersion(pkg: MutableResource<PackageJson>) {
  const version = pkg.contents.version;
  const [major, minor, patch] = version.split(".").map((n) => Number(n));

  if (patch === undefined) {
    throw new Error(`Invalid version: ${version}`);
  }

  const newVersion = `${major}.${minor}.${patch + 1}`;

  console.log(`Bumping version from ${version} to ${newVersion}`);
  pkg.update((pkg) => {
    pkg.version = newVersion;
  });
}

const args = yargs(hideBin(process.argv))
  .options({
    distFolder: { type: "string", alias: "d", demandOption: true },
  })
  .parseSync();

releaseIncubation(args).then(process.exit);
