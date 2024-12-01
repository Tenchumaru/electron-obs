import { contextBridge, ipcRenderer } from 'electron';

(() => {
  // Expose functions that send requests to the main process for the renderer process.
  const main: Main = {
    startStreaming: (filePath: string) => {
      return ipcRenderer.invoke('startStreaming', filePath);
    },
    stopStreaming: (): void => {
      ipcRenderer.send('stopStreaming');
    },
  };
  contextBridge.exposeInMainWorld('main', main);
})();
