const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let pythonProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        autoHideMenuBar: true,
        title: "Digital Brain"
    });

    // Load the local HTML file
    mainWindow.loadFile(path.join(__dirname, '../frontend/index.html'));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function startFastAPI() {
    console.log("Starting FastAPI...");
    
    // Path to the Python executable in the virtual environment
    const pythonExe = process.platform === 'win32' 
        ? path.join(__dirname, '../venv/Scripts/python.exe')
        : path.join(__dirname, '../venv/bin/python');

    pythonProcess = spawn(pythonExe, [
        '-m', 'uvicorn', 
        'backend.main:app', 
        '--host', '127.0.0.1', 
        '--port', '8001'
    ], {
        cwd: path.join(__dirname, '..')
    });

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
}

// Function to check if FastAPI server is up before showing the window or doing heavy things
function waitForServer(callback, retries = 20) {
    if (retries === 0) {
        console.error("FastAPI server did not start in time.");
        return;
    }
    
    const req = http.get('http://127.0.0.1:8001/', (res) => {
        if (res.statusCode === 200 || res.statusCode === 307) {
            callback();
        } else {
            setTimeout(() => waitForServer(callback, retries - 1), 500);
        }
    });

    req.on('error', () => {
        setTimeout(() => waitForServer(callback, retries - 1), 500);
    });
}

app.whenReady().then(() => {
    startFastAPI();
    
    // Wait slightly to ensure server creates the DB and is ready to accept login requests
    waitForServer(() => {
        createWindow();
    });

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Important: Kill the python child process when electron closes
app.on('will-quit', () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }
});
