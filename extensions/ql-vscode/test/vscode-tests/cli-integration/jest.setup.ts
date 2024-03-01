import { workspace } from "vscode";

import {
  afterAllAction,
  beforeAllAction,
  beforeEachAction,
} from "../jest.activated-extension.setup";
import { createWriteStream, existsSync, mkdirpSync } from "fs-extra";
import { dirname, join } from "path";
import { DB_URL, dbLoc, testprojLoc } from "../global.helper";
import fetch from "node-fetch";
import { createReadStream, renameSync } from "fs";
import { Extract } from "unzipper";

beforeAll(async () => {
  // ensure the test database is downloaded
  const dbParentDir = dirname(dbLoc);
  mkdirpSync(dbParentDir);
  if (!existsSync(dbLoc)) {
    console.log(`Downloading test database to ${dbLoc}`);

    await new Promise((resolve, reject) => {
      return fetch(DB_URL).then((response) => {
        const dest = createWriteStream(dbLoc);
        response.body.pipe(dest);

        response.body.on("error", reject);
        dest.on("error", reject);
        dest.on("close", () => {
          resolve(dbLoc);
        });
      });
    });
  }

  // unzip the database from dbLoc to testprojLoc
  if (!existsSync(testprojLoc)) {
    console.log(`Unzipping test database to ${testprojLoc}`);

    await new Promise((resolve, reject) => {
      createReadStream(dbLoc)
        .pipe(Extract({ path: dbParentDir }))
        .on("close", () => {
          console.log("Unzip completed.");
          resolve(undefined);
        })
        .on("error", (e) => reject(e));
    });

    renameSync(join(dbParentDir, "db"), testprojLoc);
  }

  await beforeAllAction();
});

beforeEach(async () => {
  await beforeEachAction();
});

beforeAll(() => {
  // check that the codeql folder is found in the workspace
  const folders = workspace.workspaceFolders;
  if (!folders) {
    throw new Error(
      'No workspace folders found.\nYou will need a local copy of the codeql repo.\nMake sure you specify the path to it in launch.json.\nIt should be something along the lines of "${workspaceRoot}/../codeql" depending on where you have your local copy of the codeql repo.',
    );
  } else {
    const codeqlFolder = folders.find((folder) =>
      ["codeql", "ql"].includes(folder.name),
    );
    if (!codeqlFolder) {
      throw new Error(
        'No workspace folders found.\nYou will need a local copy of the codeql repo.\nMake sure you specify the path to it in launch.json.\nIt should be something along the lines of "${workspaceRoot}/../codeql" depending on where you have your local copy of the codeql repo.\n\n\n',
      );
    }
  }
});

afterAll(async () => {
  await afterAllAction();
});
