import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  PRODUCTION_ORIGIN,
  OFFLINE_URL,
  isAppUrl,
  isOfflineUrl,
  isAllowedNavigation,
  externalUrl,
  allowDownload,
} = require("../desktop/navigation.cjs");

test("desktop navigation is pinned to credential-free HTTPS on the production origin", () => {
  assert.equal(isAppUrl(`${PRODUCTION_ORIGIN}/sanctuary?tool=tarot`), true);
  assert.equal(isAppUrl(`${PRODUCTION_ORIGIN}:443/guides`), true);
  for (const url of [
    "http://auspice-red.vercel.app",
    "https://auspice-red.vercel.app.evil.test",
    "https://auspice-red.vercel.app:444/",
    "https://name:password@auspice-red.vercel.app/",
    "https://evil.test@auspice-red.vercel.app/",
    "blob:https://auspice-red.vercel.app/opaque",
    "file:///etc/passwd",
    "javascript:alert(1)",
    "data:text/html,hello",
    "not a URL",
  ])
    assert.equal(isAppUrl(url), false, url);
});

test("offline access serves only the exact fixed URL without filesystem routing", () => {
  assert.equal(isOfflineUrl(OFFLINE_URL), true);
  assert.equal(isAllowedNavigation(OFFLINE_URL), true);
  for (const url of [
    "auspice://offline/secret",
    "auspice://offline/?file=../../secret",
    "auspice://offline/#x",
    "auspice://other/",
    "auspice://user@offline/",
    "auspice://offline:100/",
    "file:///offline.html",
  ])
    assert.equal(isOfflineUrl(url), false, url);
});

test("external links are restricted to reviewed source origins and the product repository", () => {
  assert.equal(
    externalUrl("https://www.metmuseum.org/perspectives/tarot-2"),
    "https://www.metmuseum.org/perspectives/tarot-2",
  );
  assert.equal(
    externalUrl(`${PRODUCTION_ORIGIN}/guides`),
    `${PRODUCTION_ORIGIN}/guides`,
  );
  assert.equal(
    externalUrl("https://github.com/zinnoberHaus/auspice/issues"),
    "https://github.com/zinnoberHaus/auspice/issues",
  );
  for (const url of [
    "https://untrusted.example/path",
    "https://github.com/another/project",
    "https://github.com/zinnoberHaus/auspice-evil",
    "https://www.metmuseum.org.evil.test/path",
    "https://user:pass@www.metmuseum.org/",
    "https://www.metmuseum.org:444/",
    "javascript:alert(1)",
    "file:///etc/passwd",
    "mailto:person@example.com",
    "data:text/html,hi",
    "bad",
  ])
    assert.equal(externalUrl(url), null, url);
});

test("downloads allow only the account's JSON export with no off-origin redirect", () => {
  const url = `${PRODUCTION_ORIGIN}/api/account/export`;
  assert.equal(allowDownload([url], "application/json"), true);
  assert.equal(allowDownload([url, url], "application/json"), true);
  assert.equal(allowDownload([], "application/json"), false);
  assert.equal(allowDownload([url], "application/octet-stream"), false);
  assert.equal(
    allowDownload([`${url}?destination=evil`], "application/json"),
    false,
  );
  assert.equal(
    allowDownload([`${PRODUCTION_ORIGIN}/unknown.json`], "application/json"),
    false,
  );
  assert.equal(
    allowDownload(
      [url, "https://untrusted.example/private.json"],
      "application/json",
    ),
    false,
  );
});

// Exercise the actual main-process handlers with Electron boundaries replaced by
// event emitters. This verifies policy wiring, not Chromium/OS runtime behavior.
import { EventEmitter } from "node:events";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
async function desktopHarness() {
  const calls = {
    opened: [] as string[],
    windows: [] as FakeWindow[],
    offline: undefined as undefined | ((request: Request) => Response),
    preferences: {} as Record<string, unknown>,
  };
  class FakeContents extends EventEmitter {
    currentUrl = `${PRODUCTION_ORIGIN}/sanctuary`;
    openHandler: ((details: { url: string }) => { action: string }) | undefined;
    getURL() {
      return this.currentUrl;
    }
    setWindowOpenHandler(handler: typeof this.openHandler) {
      this.openHandler = handler;
    }
    async loadURL(url: string) {
      this.currentUrl = url;
    }
  }
  class FakeWindow extends EventEmitter {
    webContents = new FakeContents();
    constructor(options: { webPreferences: Record<string, unknown> }) {
      super();
      calls.windows.push(this);
      calls.preferences = options.webPreferences;
    }
    isDestroyed() {
      return false;
    }
    async loadURL(url: string) {
      await this.webContents.loadURL(url);
    }
    static getAllWindows() {
      return calls.windows;
    }
  }
  const permissions = {
    request: undefined as unknown,
    check: undefined as unknown,
    device: undefined as unknown,
  };
  const appSession = new EventEmitter() as EventEmitter &
    Record<string, unknown>;
  appSession.setPermissionRequestHandler = (callback: unknown) => {
    permissions.request = callback;
  };
  appSession.setPermissionCheckHandler = (callback: unknown) => {
    permissions.check = callback;
  };
  appSession.setDevicePermissionHandler = (callback: unknown) => {
    permissions.device = callback;
  };
  appSession.webRequest = { onBeforeRequest() {} };
  const app = Object.assign(new EventEmitter(), {
    enableSandbox() {},
    isPackaged: true,
    whenReady: () => Promise.resolve(),
    quit() {},
  });
  const electron = {
    app,
    BrowserWindow: FakeWindow,
    Menu: {
      setApplicationMenu() {},
      buildFromTemplate: (value: unknown) => value,
    },
    protocol: {
      registerSchemesAsPrivileged() {},
      handle: (_scheme: string, handler: typeof calls.offline) => {
        calls.offline = handler;
      },
    },
    session: { defaultSession: appSession },
    shell: {
      openExternal: async (url: string) => {
        calls.opened.push(url);
      },
    },
  };
  const source = await readFile(
    new URL("../desktop/main.cjs", import.meta.url),
    "utf8",
  );
  vm.runInNewContext(source, {
    require: (name: string) =>
      name === "electron"
        ? electron
        : name === "node:fs/promises"
          ? { readFile: async () => "<!doctype html><title>Offline</title>" }
          : name === "./navigation.cjs"
            ? require("../desktop/navigation.cjs")
            : require(name),
    __dirname: path.resolve("desktop"),
    process: { platform: "darwin" },
    console,
    Response,
  });
  await new Promise<void>((resolve) => setImmediate(resolve));
  return {
    calls,
    appSession,
    permissions,
    contents: calls.windows[0].webContents,
  };
}
function navigationEvent(url: string, isMainFrame = true) {
  return {
    url,
    isMainFrame,
    prevented: false,
    preventDefault() {
      this.prevented = true;
    },
  };
}

test("main-process redirect and frame handlers cancel without launching off-origin content", async () => {
  const { contents, calls } = await desktopHarness();
  const redirect = navigationEvent("https://www.metmuseum.org/");
  contents.emit("will-redirect", redirect);
  assert.equal(redirect.prevented, true);
  assert.deepEqual(calls.opened, []);
  const iframe = navigationEvent(`${PRODUCTION_ORIGIN}/guides`, false);
  contents.emit("will-frame-navigate", iframe);
  assert.equal(iframe.prevented, true);
  const unknown = navigationEvent("https://untrusted.example/");
  contents.emit("will-frame-navigate", unknown);
  assert.equal(unknown.prevented, true);
  assert.deepEqual(calls.opened, []);
  const permitted = navigationEvent(`${PRODUCTION_ORIGIN}/account`);
  contents.emit("will-frame-navigate", permitted);
  assert.equal(permitted.prevented, false);
  const source = navigationEvent(
    "https://www.metmuseum.org/perspectives/tarot-2",
  );
  contents.emit("will-frame-navigate", source);
  assert.equal(source.prevented, true);
  assert.deepEqual(calls.opened, [source.url]);
  assert.equal(
    contents.openHandler?.({ url: "https://untrusted.example/" }).action,
    "deny",
  );
  assert.equal(calls.opened.length, 1);
});

test("packaged renderer options deny Node, privilege bridges, and all permission requests", async () => {
  const { calls, permissions, contents } = await desktopHarness();
  for (const name of [
    "nodeIntegration",
    "nodeIntegrationInWorker",
    "nodeIntegrationInSubFrames",
    "webviewTag",
    "allowRunningInsecureContent",
    "devTools",
  ])
    assert.equal(calls.preferences[name], false, name);
  for (const name of ["contextIsolation", "sandbox", "webSecurity"])
    assert.equal(calls.preferences[name], true, name);
  assert.equal("preload" in calls.preferences, false);
  let permitted = true;
  (
    permissions.request as (
      contents: null,
      permission: string,
      callback: (value: boolean) => void,
    ) => void
  )(null, "media", (value) => {
    permitted = value;
  });
  assert.equal(permitted, false);
  assert.equal((permissions.check as () => boolean)(), false);
  assert.equal((permissions.device as () => boolean)(), false);
  const webview = navigationEvent("https://untrusted.example");
  contents.emit("will-attach-webview", webview);
  assert.equal(webview.prevented, true);
});

test("download handler rejects unsolicited binaries and keeps journal exports behind a save dialog", async () => {
  const { appSession, contents } = await desktopHarness();
  let dialog: { defaultPath: string } | undefined;
  const binary = {
    getURLChain: () => [`${PRODUCTION_ORIGIN}/installer.exe`],
    getMimeType: () => "application/octet-stream",
    setSaveDialogOptions: (options: { defaultPath: string }) => {
      dialog = options;
    },
  };
  const rejected = navigationEvent("download");
  appSession.emit("will-download", rejected, binary, contents);
  assert.equal(rejected.prevented, true);
  assert.equal(dialog, undefined);
  const journal = {
    ...binary,
    getURLChain: () => [`${PRODUCTION_ORIGIN}/api/account/export`],
    getMimeType: () => "application/json",
  };
  const permitted = navigationEvent("download");
  appSession.emit("will-download", permitted, journal, contents);
  assert.equal(permitted.prevented, false);
  assert.equal(
    (dialog as { defaultPath: string } | undefined)?.defaultPath,
    "auspice-journal.json",
  );
});

test("offline protocol serves fixed HTML with restrictive CSP and rejects methods and paths", async () => {
  const { calls } = await desktopHarness();
  assert.ok(calls.offline);
  const response = calls.offline(new Request(OFFLINE_URL));
  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("Content-Security-Policy") || "",
    /default-src 'none'/,
  );
  assert.match(
    response.headers.get("Content-Security-Policy") || "",
    /base-uri 'none'; form-action 'none'/,
  );
  assert.equal(await response.text(), "<!doctype html><title>Offline</title>");
  assert.equal(calls.offline(new Request(`${OFFLINE_URL}secret`)).status, 404);
  assert.equal(
    calls.offline(new Request(OFFLINE_URL, { method: "POST" })).status,
    404,
  );
  assert.equal(
    await calls.offline(new Request(OFFLINE_URL, { method: "HEAD" })).text(),
    "",
  );
});
