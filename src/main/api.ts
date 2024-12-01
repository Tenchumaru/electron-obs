import { type BrowserWindow, ipcMain } from 'electron';
import { startObs, stopObs } from 'native';

export interface Api {
  window: BrowserWindow;
}

export function createApi(): Api {
  let window: BrowserWindow;

  ipcMain.handle('startStreaming', (_event, streamKey: string) => {
    return startObs(streamKey);
  });
  ipcMain.on('stopStreaming', () => {
    stopObs();
  });

  return {
    get window() {
      return window;
    },
    set window(value: BrowserWindow) {
      window = value;
    },
  };
}
