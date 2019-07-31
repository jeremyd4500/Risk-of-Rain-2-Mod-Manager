# Risk of Rain 2 Mod Manager

A simplistic mod manager for Risk of Rain 2 built using Electron and React.

## Downloads

Not ready yet, come back soon!

## To Work on This App

1. Download [Node.js](https://nodejs.org/en/).
2. [Download](https://github.com/jeremyd4500/Risk-of-Rain-2-Mod-Manager/archive/master.zip) or [clone](https://github.com/jeremyd4500/Risk-of-Rain-2-Mod-Manager.git) the repository.
3. Navigate to the newly downloaded repository in a terminal of your choice.
4. Create a new branch for yourself.  
5. Run `npm i`.
6. Then run `npm run electron-dev` to build and start the application. A browser window and a desktop app will open together, both accepting live updates.
7. To build the app into an installer, run `npm run electron-pack` and the installer will be placed into the *dist* folder.

## To Do

- Figure out the best way to take advantage of the `cache` folder. When a user installs a mod, the app should check if the mod is already downloaded in said folder. This requires including the mod's downloaded version in the zipped folder name.
- Add a search bar for both the "Not Installed" and the "Installed" windows.
- Be able to select a specific version of a mod to install.
- Figure out functionality to uninstall a mod.
- Figure out how to build trees from the file structure.
  - Use this as "snapshots" of sorts to be able to create diffs of the file structure for deleting mods.
- Build out the Settings menu:
  - Auto-update switch
  - Change game install location
  - Delete all mods button
  - Disable all mods switch
- **Auto Update** feature will allow the app to keep installed mods updated for the user.
  - If enabled, once the app is loaded, it should check for updated versions of all currently installed mods and update if a new version is found.
  - If a new version is found, the app should first delete the old mod folder and then add the new one.
- **Change Game Install Location** feature will allow a user to change the directory for the app to use for mods.
  - When this setting is changed, the app should move the core mod files/folders to the new location.
- **Delete All Mods** feature will purge the game directory of all installed mods.
  - When clicked, the app should only delete all the mods, it won't delete BepInExPack from the game
- **Disable All Mods** feature will allow a user to completely remove mods from the game.
  - This should simply move the core mod files/folders to the `cache` folder instead of deleting them.
  - When this option is enabled in the settings, pretty much the entire UI should be disabled except for the option to re-enable mods.
