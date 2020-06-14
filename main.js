const { app, ipcMain, Menu } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
let mainWindow, settingsWindow

app.on('ready', () => {
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
    const settingsFileLocaton = `file://${path.join(__dirname, './settings/settings.html')}`
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocaton)
    settingsWindow.on('closed', () => {
      mainWindow = null
    })
  })

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})