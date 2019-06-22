const {app, BrowserWindow, ipcMain} = require('electron')

ipcMain.on('main-win-minimize', (e, id) => {
    const win = BrowserWindow.fromId(id)
    if (win) win.minimize()
})

ipcMain.on('main-win-close', (e, id) => {
    const win = BrowserWindow.fromId(id)
    if (win) win.close()
})

ipcMain.on('top-toggle', (e, flag, id) => {
    const win = BrowserWindow.fromId(id)
    if (win) win.setAlwaysOnTop(flag)
})

ipcMain.on('new-server', initWindow)

// 创建窗口
function createWindow () {
    let win = new BrowserWindow({
        width: 500,
        height: 300,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        show: false
    })

    win.on('closed', () => {
        win = null
    })

    win.webContents.on('did-finish-load', e => {
        win.show()
        win.webContents.send('window-created', win.id)
    })

    return win
}

// 打开窗口
function initWindow () {
    const win = createWindow()
    win.loadFile('pages/index/index.html')
}

app.on('ready', initWindow)
