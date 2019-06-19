const {app, BrowserWindow, ipcMain} = require('electron')
let mainWin = null;

app.on('ready', () => {
    mainWin = new BrowserWindow({
        width: 500,
        height: 300,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
    })


    mainWin.loadFile('pages/index/index.html')

    mainWin.on('closed', () => {
        mainWin = null
    })

    // mainWin.webContents.openDevTools()
})


ipcMain.on('main-win-minimize', () => {
    mainWin.minimize()
})

ipcMain.on('main-win-close', () => {
    mainWin.close()
})

ipcMain.on('top-toggle', (e, flag) => {
    mainWin.setAlwaysOnTop(flag)
})
