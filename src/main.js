const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let threads = { 
  view: null, 
  logger: null,
  comm: null,
  format: null
};

app.on('ready', createThreads);
app.on('activate', createThreads);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function createThreads() {
  if (threads.view === null) {
    threads.view = new BrowserWindow({
      show: false,
      frame: false, 
      titleBarStyle: 'hidden', 
      icon: path.join(__dirname, 'icon.png')
    });

    threads.view.once('ready-to-show', () => {
      threads.view.show()
    });

    threads.view.loadURL(url.format({
      pathname: path.join(__dirname, './view/view.html'),
      protocol: 'file:',
      slashes: true
    }));

    threads.view.webContents.openDevTools({mode: 'detach'});

    threads.view.on('closed', () => {
      threads.view = null
    });
  }

  
}