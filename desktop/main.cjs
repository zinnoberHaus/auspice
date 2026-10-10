const {
  app,
  BrowserWindow,
  Menu,
  protocol,
  session,
  shell,
} = require("electron");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const {
  PRODUCTION_ORIGIN,
  OFFLINE_URL,
  isAppUrl,
  isOfflineUrl,
  isAllowedNavigation,
  externalUrl,
  allowDownload,
} = require("./navigation.cjs");
let window;
const SANCTUARY_URL = `${PRODUCTION_ORIGIN}/sanctuary`;
const OFFLINE_CSP =
  "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
app.enableSandbox();
protocol.registerSchemesAsPrivileged([
  { scheme: "auspice", privileges: { standard: true, secure: true } },
]);
async function openExternal(value) {
  const url = externalUrl(value);
  if (!url) return;
  try {
    await shell.openExternal(url);
  } catch {
    console.error("External link could not be opened.");
  }
}
async function loadSanctuary() {
  if (!window || window.isDestroyed()) return;
  try {
    await window.loadURL(SANCTUARY_URL);
  } catch {
    await showOffline();
  }
}
async function showOffline() {
  if (
    !window ||
    window.isDestroyed() ||
    isOfflineUrl(window.webContents.getURL())
  )
    return;
  try {
    await window.loadURL(OFFLINE_URL);
  } catch {
    console.error("The offline page could not be opened.");
  }
}
function configureSession() {
  const appSession = session.defaultSession;
  appSession.setPermissionRequestHandler((_contents, _permission, callback) =>
    callback(false),
  );
  appSession.setPermissionCheckHandler(() => false);
  appSession.setDevicePermissionHandler(() => false);
  appSession.webRequest.onBeforeRequest((details, callback) => {
    const cancel =
      details.resourceType === "subFrame" ||
      (details.resourceType === "mainFrame" &&
        !isAllowedNavigation(details.url));
    callback({ cancel });
  });
  appSession.on("will-download", (event, item, webContents) => {
    if (
      webContents !== window?.webContents ||
      !isAppUrl(webContents.getURL()) ||
      !allowDownload(item.getURLChain(), item.getMimeType())
    ) {
      event.preventDefault();
      return;
    }
    // Only account exports are supported. The OS dialog selects the destination;
    // the app never silently saves or opens downloaded files.
    item.setSaveDialogOptions({
      title: "Export your Auspice journal",
      defaultPath: "auspice-journal.json",
      filters: [{ name: "JSON journal", extensions: ["json"] }],
    });
  });
}
function createWindow() {
  window = new BrowserWindow({
    width: 1240,
    height: 850,
    minWidth: 380,
    minHeight: 620,
    title: "Auspice",
    backgroundColor: "#f8f6f2",
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      navigateOnDragDrop: false,
      devTools: !app.isPackaged,
    },
  });
  const contents = window.webContents;
  contents.on("will-attach-webview", (event) => event.preventDefault());
  contents.setWindowOpenHandler(({ url }) => {
    if (isAppUrl(contents.getURL())) {
      if (isAppUrl(url)) void contents.loadURL(url).catch(showOffline);
      else void openExternal(url);
    }
    return { action: "deny" };
  });
  contents.on("will-frame-navigate", (details) => {
    if (!details.isMainFrame || !isAllowedNavigation(details.url)) {
      details.preventDefault();
      if (details.isMainFrame && isAppUrl(contents.getURL()))
        void openExternal(details.url);
    }
  });
  contents.on("will-redirect", (details) => {
    // Server redirects must never cause external applications to open.
    if (!details.isMainFrame || !isAppUrl(details.url))
      details.preventDefault();
  });
  contents.on(
    "did-fail-load",
    (_event, code, _description, url, isMainFrame) => {
      if (isMainFrame && code !== -3 && !isOfflineUrl(url)) void showOffline();
    },
  );
  contents.on("render-process-gone", () => {
    void showOffline();
  });
  void loadSanctuary();
  window.on("closed", () => {
    window = null;
  });
}
app.whenReady().then(async () => {
  const offlineHtml = await readFile(
    path.join(__dirname, "offline.html"),
    "utf8",
  );
  protocol.handle("auspice", (request) => {
    if (!isOfflineUrl(request.url) || !["GET", "HEAD"].includes(request.method))
      return new Response("Not found", { status: 404 });
    return new Response(request.method === "HEAD" ? null : offlineHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy": OFFLINE_CSP,
        "X-Content-Type-Options": "nosniff",
      },
    });
  });
  configureSession();
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      ...(process.platform === "darwin"
        ? [
            {
              label: "Auspice",
              submenu: [
                { role: "about" },
                { type: "separator" },
                { role: "hide" },
                { role: "hideOthers" },
                { role: "unhide" },
                { type: "separator" },
                { role: "quit" },
              ],
            },
          ]
        : []),
      {
        label: "File",
        submenu: [
          {
            label: "Open sanctuary",
            accelerator: "CmdOrCtrl+Home",
            click: loadSanctuary,
          },
          {
            label: "Open in browser",
            click: () => {
              void openExternal(PRODUCTION_ORIGIN);
            },
          },
          { role: "close" },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "selectAll" },
        ],
      },
      {
        label: "View",
        submenu: [
          {
            label: "Reconnect",
            accelerator: "CmdOrCtrl+R",
            click: loadSanctuary,
          },
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
          { role: "togglefullscreen" },
        ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "Auspice guides",
            click: () => {
              void openExternal(`${PRODUCTION_ORIGIN}/guides`);
            },
          },
          {
            label: "Privacy",
            click: () => {
              void openExternal(`${PRODUCTION_ORIGIN}/privacy`);
            },
          },
        ],
      },
    ]),
  );
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
