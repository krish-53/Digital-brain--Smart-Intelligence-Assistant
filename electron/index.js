const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let javaProcess;

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

function startJavaBackend() {
    console.log("Starting Java Spring Boot Backend...");
    
    // Path to the compiled Java application (adjust if jar name differs)
    const jarPath = path.join(__dirname, '../java-backend/target/backend-0.0.1-SNAPSHOT.jar');

    javaProcess = spawn('java', [
        '-jar', jarPath,
        '--server.port=8001'
    ], {
        cwd: path.join(__dirname, '..')
    });

    javaProcess.stdout.on('data', (data) => {
        console.log(`Java: ${data}`);
    });

    javaProcess.stderr.on('data', (data) => {
        console.error(`Java Error: ${data}`);
    });

    javaProcess.on('close', (code) => {
        console.log(`Java process exited with code ${code}`);
    });
}

// Function to check if Spring server is up before showing the window or doing heavy things
function waitForServer(callback, retries = 60) {
    if (retries === 0) {
        console.error("Java server did not start in time. Make sure you have run 'mvn package' inside the java-backend folder.");
        return;
    }
    
    // We check /api/auth/me to see if server is responsive, or just root but Spring Boot might return 404 for root.
    // Actually, root connection failure is ECONNREFUSED, while 404/401/403 means the server is UP.
    const req = http.get('http://127.0.0.1:8001/api/auth/me', (res) => {
        // If we get ANY response from the server, it means Tomcat is running
        callback();
    });

    req.on('error', () => {
        setTimeout(() => waitForServer(callback, retries - 1), 1000);
    });
}

app.whenReady().then(() => {
    startJavaBackend();
    
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

// Important: Kill the java child process when electron closes
app.on('will-quit', () => {
    if (javaProcess) {
        javaProcess.kill();
    }
});
