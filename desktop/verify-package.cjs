const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { createReadStream } = require("node:fs");
const { readFile, stat, writeFile } = require("node:fs/promises");
const { execFileSync, spawnSync } = require("node:child_process");
const path = require("node:path");
const { getCurrentFuseWire, FuseV1Options } = require("@electron/fuses");
const asar = require("@electron/asar");
const release = path.join(__dirname, "..", "release");
const expectedFiles = [
  "/main.cjs",
  "/navigation.cjs",
  "/offline.html",
  "/package.json",
].sort();
const expectedFuses = {
  RunAsNode: false,
  EnableCookieEncryption: true,
  EnableNodeOptionsEnvironmentVariable: false,
  EnableNodeCliInspectArguments: false,
  EnableEmbeddedAsarIntegrityValidation: true,
  OnlyLoadAppFromAsar: true,
  GrantFileProtocolExtraPrivileges: false,
};
async function sha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}
async function main() {
  const manifest = JSON.parse(
    await readFile(path.join(__dirname, "package.json"), "utf8"),
  );
  const evidence = {
    checkedAt: new Date().toISOString(),
    version: manifest.version,
    electron: manifest.devDependencies.electron,
    signing: "ad-hoc only; no Developer ID; not notarized",
    packages: [],
  };
  for (const arch of ["arm64", "x64"]) {
    const app = path.join(
      release,
      arch === "arm64" ? "mac-arm64" : "mac",
      "Auspice.app",
    );
    const archive = path.join(app, "Contents", "Resources", "app.asar");
    const info = path.join(app, "Contents", "Info.plist");
    execFileSync("codesign", ["--verify", "--deep", "--strict", app]);
    const signing = spawnSync("codesign", ["--display", "--verbose=4", app], {
      encoding: "utf8",
    });
    assert.equal(signing.status, 0);
    assert.match(signing.stderr, /Signature=adhoc/);
    const minimumMacOS = execFileSync(
      "plutil",
      ["-extract", "LSMinimumSystemVersion", "raw", "-o", "-", info],
      { encoding: "utf8" },
    ).trim();
    assert.equal(minimumMacOS, "13.0");
    const architecture = execFileSync(
      "lipo",
      ["-archs", path.join(app, "Contents", "MacOS", "Auspice")],
      { encoding: "utf8" },
    ).trim();
    assert.equal(architecture, arch === "x64" ? "x86_64" : "arm64");
    const wire = await getCurrentFuseWire(app);
    const fuseEvidence = {};
    for (const [name, enabled] of Object.entries(expectedFuses)) {
      assert.equal(
        wire[FuseV1Options[name]],
        enabled ? 49 : 48,
        `${arch} ${name}`,
      );
      fuseEvidence[name] = enabled;
    }
    const files = asar.listPackage(archive).sort();
    assert.deepEqual(files, expectedFiles);
    for (const filename of ["main.cjs", "navigation.cjs", "offline.html"]) {
      assert.deepEqual(
        asar.extractFile(archive, filename),
        await readFile(path.join(__dirname, filename)),
        `${arch} bundled ${filename} matches source`,
      );
    }
    const integrity = JSON.parse(
      execFileSync(
        "plutil",
        ["-extract", "ElectronAsarIntegrity", "json", "-o", "-", info],
        { encoding: "utf8" },
      ),
    );
    const recordedHeader = integrity["Resources/app.asar"];
    assert.equal(recordedHeader.algorithm, "SHA256");
    assert.equal(
      recordedHeader.hash,
      createHash("sha256")
        .update(asar.getRawHeader(archive).headerString)
        .digest("hex"),
    );
    const resources = path.join(app, "Contents", "Resources");
    assert.deepEqual(
      await readFile(path.join(resources, "LICENSE.auspice.txt")),
      await readFile(path.join(__dirname, "..", "LICENSE")),
    );
    const electronLicense = await readFile(
      path.join(resources, "LICENSE.electron.txt"),
      "utf8",
    );
    assert.match(electronLicense, /Permission is hereby granted/);
    const chromiumNotice = await readFile(
      path.join(resources, "LICENSES.chromium.html"),
      "utf8",
    );
    assert.ok(chromiumNotice.length > 1000000);
    assert.match(chromiumNotice, /Chromium/i);
    const notices = [
      "LICENSE.auspice.txt",
      "LICENSE.electron.txt",
      "LICENSES.chromium.html",
    ];
    const zip = path.join(
      release,
      `Auspice-${manifest.version}-mac-${arch}.zip`,
    );
    execFileSync("unzip", ["-tq", zip], { stdio: "pipe" });
    evidence.packages.push({
      arch,
      minimumMacOS,
      app,
      zip,
      bytes: (await stat(zip)).size,
      sha256: await sha256(zip),
      signatureVerified: true,
      asarHeaderIntegrityVerified: true,
      bundledFiles: files,
      notices,
      fuses: fuseEvidence,
    });
  }
  await writeFile(
    path.join(release, "verification.json"),
    JSON.stringify(evidence, null, 2) + "\n",
  );
  await writeFile(
    path.join(release, "SHA256SUMS"),
    evidence.packages
      .map((item) => `${item.sha256}  ${path.basename(item.zip)}`)
      .join("\n") + "\n",
  );
  console.log(JSON.stringify(evidence, null, 2));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
