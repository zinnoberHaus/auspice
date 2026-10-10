const { copyFile, writeFile } = require("node:fs/promises");
const { execFileSync } = require("node:child_process");
const path = require("node:path");
const { Arch } = require("builder-util");
const manifest = require("./package.json");
const checksums = require("./node_modules/electron/checksums.json");

// Upstream's Mac distribution puts notices beside Electron.app; the generated
// ZIP contains only Auspice.app. Copy notices inside the bundle before signing.
module.exports = async function afterPack(context) {
  const { downloadArtifact } = await import("@electron/get");
  const platform = context.electronPlatformName;
  if (platform !== "darwin")
    throw new Error("This notice hook is verified only for macOS packaging.");
  const archive = await downloadArtifact({
    version: manifest.devDependencies.electron,
    artifactName: "electron",
    platform,
    arch: Arch[context.arch],
    checksums,
  });
  const resources = path.join(
    context.appOutDir,
    "Auspice.app",
    "Contents",
    "Resources",
  );
  await copyFile(
    path.join(__dirname, "..", "LICENSE"),
    path.join(resources, "LICENSE.auspice.txt"),
  );
  for (const [upstreamName, outputName] of [
    ["LICENSE", "LICENSE.electron.txt"],
    ["LICENSES.chromium.html", "LICENSES.chromium.html"],
  ]) {
    const content = execFileSync("unzip", ["-p", archive, upstreamName], {
      maxBuffer: 30 * 1024 * 1024,
    });
    if (!content.length)
      throw new Error(`Missing Electron license notice: ${upstreamName}`);
    await writeFile(path.join(resources, outputName), content);
  }
};
