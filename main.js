const { app, BrowserWindow } = require('electron');

let win;
let secondaryWin;
let ipc = require('electron').ipcMain;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');

    // win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

function createSecondaryWindow() {
    secondaryWin = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: 'blue',
        x: 0,
        y: 0,
        transparent: true,
        hasShadow: false,
        focusable: false,
        skipTaskbar: true,
        type: 'toolbar',
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // secondaryWin.webContents.openDevTools();

    secondaryWin.loadFile('secondary.html');

    secondaryWin.on('closed', () => {
        secondaryWin = null;
    });
}

app.on('ready', createWindow);

ipc.on('open-window', (event, data) => {
    console.log("EVENT OPEN WINDOW: " + data);
    createSecondaryWindow();
    secondaryWin.once('ready-to-show', () => {
        secondaryWin.show();
    });
});

ipc.on('update-secondary', (event, data)=>{
    secondaryWin.webContents.send('change-text', data);
});

ipc.on("close-window", (event, data) => {
    console.log("EVENT CLOSE WINDOW");
    secondaryWin.close();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});