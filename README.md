# Electron OBS

## Configure

1.  Install [Visual Studio 2022](https://visualstudio.microsoft.com/).
1.  Install [Node 22.11.0](https://nodejs.org/en/download/prebuilt-binaries).
1.  Install [Python 3.12.7](https://www.python.org/downloads/windows/).
1.  Clone `obsproject/obs-studio` into a peer directory.
1.  Build it according to its instructions.  Ensure there is a `build_x64\rundir\Debug\bin\64bit` directory.
1.  Run the following in a command prompt in this repository's root directory.
	1.  `corepack enable`
	1.  `python -m venv venv`
	1.  `venv\Scripts\activate.bat`
	1.  `python -m pip install --upgrade pip`
	1.  `pip install -U setuptools`
	1.  `pip install wheel`
	1.  `yarn`
1.  Dismiss any system modal dialogs that appear.

More recent versions of Node and Python are likely to work but are untested.

## Debug

1.  Run the following in a command prompt in this repository's root directory.
	1.  `venv\Scripts\activate.bat`
	1.  `PATH C:\full\path\to\obs-studio\build_x64\rundir\Debug\bin\64bit;%path%`
	1. `devenv`
1.  Open `electron-obs.sln` in Visual Studio 2022.
1.  Set a breakpoint in the TypeScript code of the main process, such as at line 12 in `src\main\api.ts`.
1.  Start debugging by selecting **Start Debugging** from the **Debug** menu or pressing **F5**.  It will stop at your breakpoint.
1.  Set a breakpoint in the C++ code, such as at line 28 in `native\native.cc`.  The breakpoint will not appear in this file.
1.  Select **Attach to process...** from the **Debug** menu.
1.  Select the `electron.exe` process whose title is `Electron OBS` and click **Attach**.
1.  Continue debugging by selecting **Continue** from the **Debug** menu or pressing **F5**.  It will stop at your C++ breakpoint
	although in a copy of your source file.  You may set additional breakpoints in this file or in the TypeScript files.

If you continue to run the app and the UI does not appear, select **Reload** from the **View** menu or press **Ctrl+R** to reload
the UI.

## Release

1.  Enable [Developer Mode](https://learn.microsoft.com/en-us/windows/apps/get-started/developer-mode-features-and-debugging) in
	Windows 11.
1.  Run the following in a command prompt in this repository's root directory.
	1.  `yarn release`

The output is in the `dist` directory.  The installer is `dist\Electron OBS Setup 0.1.0.exe`.  You may run the release version of
the application at `dist\win-unpacked\Electron OBS.exe`.

## Notes

To rebuild the `native` module, run `yarn add file:native`.  Dismiss any system modal dialogs that appear.  It is not necessary to
initialize the `native` project with `yarn`.  However, running `yarn` in the `native` directory will provide additional compiler
output, such as warnings, that is silenced when running `yarn add file:native` in the root directory.  Doing so will create a
`yarn.lock` file in the `native` directory that is unnecessary and unused in the root directory.
