import { BrowserWindow, Menu, MenuItem, app, session } from 'electron';
import { join } from 'path';
import { format } from 'url';
import { createApi } from './api';

// Keep references to all window objects so they aren't garbage-collected.
const windows: BrowserWindow[] = [];

const api = createApi();

// This event will fire when Electron has finished initialization and is ready to create browser windows.  Some APIs can be used
// only after this event fires.
app.on('ready', () => {
  // Check if another instance is already running.
  if (app.requestSingleInstanceLock()) {
    // No, this is the first one.
    launchApplication();
  } else {
    // There is; quit.  The first instance will open another window.
    app.quit();
  }

  function launchApplication() {
    // Check the current application menu.
    const menu = Menu.getApplicationMenu();
    if (menu) {
      const { submenu } = menu.items[process.platform === 'darwin' ? 1 : 0];
      if (submenu) {
        // Add the "New Window" command to the application "File" menu.
        submenu.insert(0, new MenuItem({ click: createWindow, label: '&New Window', accelerator: 'CommandOrControl+N' }));
        Menu.setApplicationMenu(menu);
      }
    }

    // Set the "X-Requested-With" header of all requests.
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['X-Requested-With'] = `electron-obs; ${app.getVersion()}`;
      callback({ requestHeaders: details.requestHeaders });
    });

    app.on('activate', () => {
      // On macOS, it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
      if (!windows.length) {
        createWindow();
      }
    });

    app.on('second-instance', () => {
      // Another instance tried to run.  Open another window on its behalf.
      createWindow();
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On macOS, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd+Q.
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Create the first window.
    createWindow();
  }

  function createWindow() {
    // Create the browser window.
    const preload = join(__dirname, '..', 'preload', 'index.js');
    const webPreferences = { preload };
    const window = new BrowserWindow({ width: 800, height: 600, webPreferences });

    // Load the index.html of the app.  I don't await this since awaiting will prevent receiving the initial "did-finish-load" and
    // "focus" events below.
    void window.loadURL(composeApplicationUrl());

    // Open the Chromium Development Tools.
    // window.webContents.openDevTools();

    // Emitted when the window is closed.
    window.on('closed', () => {
      // Remove the window from the collection.
      windows.splice(0, windows.length, ...windows.filter((e) => e !== window));
    });

    // Emitted when the window gains focus.
    window.on('focus', () => {
      api.window = window;
    });

    windows.push(window);
  }

  function composeApplicationUrl(): string {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const url = process.env.ELECTRON_RENDERER_URL || format({
      protocol: 'file',
      pathname: join(__dirname, '..', 'renderer', 'index.html'),
    });
    return url;
  }
});
