const { app, ipcMain, Menu, dialog } = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
let mainWindow, settingsWindow

app.on('ready', () => {
  if (isDev) {
    autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml')
  }
  autoUpdater.autoDownload = false
  autoUpdater.checkForUpdates()
  autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error ', error == null? 'unknown': (error.stacktrace))
  })
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用有新版本',
      message: '发现新版本，是否现在更新?',
      buttons: ['是', '否']
    }, (buttonIndex) => {
      if (buttonIndex === 0)
        autoUpdater.downloadUpdate()
    })
  })
  autoUpdater.on('update-not-available', () => {
    // dialog.showMessageBox({
    //   title: '没有新版本',
    //   message: '当前已经是最新版本' 
    // })
  })
  const mainWindowConfig = {
    width: 1024,
    height: 680,
  }
  const urlLocation = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './index.html')}`
  mainWindow = new AppWindow(mainWindowConfig, urlLocation)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // hook up main events
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow
    }
    const settingsFileLocaton = `file://${path.join(__dirname, '../settings/settings.html')}`
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocaton)
    settingsWindow.on('closed', () => {
      mainWindow = null
    })
  })

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})