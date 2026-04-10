document.addEventListener('DOMContentLoaded', async () => {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const contentArea = document.getElementById('content-area');
    const currentPageTitle = document.getElementById('current-page-title');
    const welcomeText = document.getElementById('welcome-text');

    // -- Authentication Form --
    const authForm = document.getElementById('auth-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const authMessage = document.getElementById('auth-message');
    const btnLogin = document.getElementById('toggle-login');
    const btnRegister = document.getElementById('toggle-register');
    const submitBtn = document.getElementById('auth-submit-btn');

    let authMode = 'login'; // 'login' or 'register'

    btnLogin.addEventListener('click', () => {
        authMode = 'login';
        btnLogin.classList.add('active');
        btnRegister.classList.remove('active');
        submitBtn.innerText = 'Login';
        authMessage.innerText = '';
    });

    btnRegister.addEventListener('click', () => {
        authMode = 'register';
        btnRegister.classList.add('active');
        btnLogin.classList.remove('active');
        submitBtn.innerText = 'Register';
        authMessage.innerText = '';
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        authMessage.innerText = '';
        
        try {
            if (authMode === 'register') {
                await api.register(username, password);
                authMessage.style.color = '#10b981';
                authMessage.innerText = 'User created! Logging in...';
                // Automatically log them in after registering
                await api.login(username, password);
            } else {
                await api.login(username, password);
            }
            await initApp();
        } catch (error) {
            authMessage.style.color = 'var(--error-red)';
            authMessage.innerText = error.message;
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        api.setToken(null);
        appContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
    });

    document.addEventListener('auth-expired', () => {
        appContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
    });

    // -- App Logic --
    async function initApp() {
        if(!api.token) return;
        
        try {
            const user = await api.getUser();
            welcomeText.innerText = user.username;
            
            // Show App
            authContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            
            // Default to dashboard
            loadPage('dashboard');
        } catch(err) {
            console.error("Failed to fetch user, forcing logout", err);
            api.setToken(null);
        }
    }

    // -- Navigation --
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            loadPage(link.dataset.page);
        });
    });

    function loadPage(page) {
        currentPageTitle.innerText = page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
        
        let pageHtml = '';
        if (page === 'dashboard') {
            pageHtml = `
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:1.5rem;">
                    <div class="glass-panel" style="padding: 2rem;">
                        <h3>Welcome back, ${api.token ? welcomeText.innerText : 'User'}</h3>
                        <p style="color: var(--text-secondary); margin-bottom:1.5rem">Your Digital Brain is actively tracking.</p>
                        <div style="display:flex; gap:1rem; margin-bottom: 2rem;">
                            <div style="flex:1; background:rgba(0,0,0,0.2); padding:1.5rem; border-radius:12px;">
                                <h4>Activity Score</h4>
                                <h1 style="color: var(--accent-blue)">84%</h1>
                            </div>
                            <div style="flex:1; background:rgba(0,0,0,0.2); padding:1.5rem; border-radius:12px;">
                                <h4>New Ideas</h4>
                                <h1 style="color: var(--accent-purple)">12</h1>
                            </div>
                        </div>
                        <button class="btn-primary" style="width:auto" onclick="mockAppActions.captureIdea()">Capture Quick Idea</button>
                    </div>
                    <div class="glass-panel" style="padding: 2rem;">
                        <h3>Recent Timeline</h3>
                        <ul id="mock-timeline" style="list-style:none; margin-top:1rem; color:var(--text-secondary); font-size:0.9rem; line-height:2;">
                            <li>• Logged 4 hrs 12m in VS Code</li>
                            <li>• Scanned 45 new files</li>
                            <li>• Formed 3 idea connections</li>
                            <li>• Predicted habit matched 82%</li>
                            <li>• Analyzed 3 decision variables</li>
                        </ul>
                    </div>
                </div>
            `;
        } else if (page === 'activity') {
            pageHtml = `
                <div class="glass-panel" style="padding: 2rem;">
                    <h3>Application Usage Tracker</h3>
                    <div style="margin-top:2rem; height: 300px; display:flex; align-items:flex-end; gap:20px; border-bottom: 1px solid var(--glass-border); padding-bottom:10px;">
                        <div style="width:12%; background: var(--accent-blue); height: 80%; border-radius:8px 8px 0 0; position:relative; cursor:pointer;" onclick="mockAppActions.toast('VS Code usage: 4h 12m')">
                            <span style="position:absolute; top:-25px; left:25%; color:white; font-size:12px;">4h 12m</span>
                        </div>
                        <div style="width:12%; background: var(--accent-purple); height: 50%; border-radius:8px 8px 0 0; position:relative; cursor:pointer;" onclick="mockAppActions.toast('Browser usage: 2h 30m')">
                            <span style="position:absolute; top:-25px; left:25%; color:white; font-size:12px;">2h 30m</span>
                        </div>
                        <div style="width:12%; background: #10b981; height: 35%; border-radius:8px 8px 0 0; position:relative; cursor:pointer;" onclick="mockAppActions.toast('Spotify usage: 1h 45m')">
                            <span style="position:absolute; top:-25px; left:25%; color:white; font-size:12px;">1h 45m</span>
                        </div>
                        <div style="width:12%; background: #f59e0b; height: 60%; border-radius:8px 8px 0 0; position:relative; cursor:pointer;" onclick="mockAppActions.toast('Terminal usage: 3h 10m')">
                            <span style="position:absolute; top:-25px; left:25%; color:white; font-size:12px;">3h 10m</span>
                        </div>
                        <div style="width:12%; background: #ef4444; height: 15%; border-radius:8px 8px 0 0; position:relative; cursor:pointer;" onclick="mockAppActions.toast('Discord usage: 0h 45m')">
                            <span style="position:absolute; top:-25px; left:25%; color:white; font-size:12px;">0h 45m</span>
                        </div>
                        <div style="width:12%; background: #6366f1; height: 40%; border-radius:8px 8px 0 0; position:relative; cursor:pointer;" onclick="mockAppActions.toast('Postman usage: 2h 00m')">
                            <span style="position:absolute; top:-25px; left:25%; color:white; font-size:12px;">2h 00m</span>
                        </div>
                    </div>
                    <div style="display:flex; gap:20px; margin-top:10px; color:var(--text-secondary); font-size:0.8rem;">
                        <span style="width:12%; text-align:center;">VS Code</span>
                        <span style="width:12%; text-align:center;">Browser</span>
                        <span style="width:12%; text-align:center;">Spotify</span>
                        <span style="width:12%; text-align:center;">Terminal</span>
                        <span style="width:12%; text-align:center;">Discord</span>
                        <span style="width:12%; text-align:center;">Postman</span>
                    </div>
                </div>
            `;
        } else if (page === 'ideas') {
            pageHtml = `
                <div style="display:flex; gap:1.5rem; height:100%; flex-wrap: wrap;">
                    <div class="glass-panel" style="flex:1; min-width:300px; padding: 2rem; overflow-y:auto; max-height:calc(100vh - 120px)">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                            <h3>Your Idea Network</h3>
                            <button class="btn-primary" style="width:auto; padding:8px 16px;" onclick="mockAppActions.captureIdea()">+</button>
                        </div>
                        <div id="ideas-list">
                            <div style="margin-bottom:1rem; background:rgba(0,0,0,0.2); border-radius:12px; padding:1.5rem; border-left:3px solid var(--accent-blue)">
                                <h4>Phase 4 Optimization</h4>
                                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0.5rem 0;">Streamline the Digital Brain startup speed with C++ integrations.</p>
                                <span style="background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; font-size:0.75rem;">code</span>
                            </div>
                            <div style="margin-bottom:1rem; background:rgba(0,0,0,0.2); border-radius:12px; padding:1.5rem; border-left:3px solid var(--accent-purple)">
                                <h4>Project Alpha</h4>
                                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0.5rem 0;">A revolutionary new app idea focusing on personal productivity.</p>
                                <span style="background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; font-size:0.75rem;">app</span>
                            </div>
                            <div style="margin-bottom:1rem; background:rgba(0,0,0,0.2); border-radius:12px; padding:1.5rem; border-left:3px solid #10b981">
                                <h4>Machine Learning Sync</h4>
                                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0.5rem 0;">Connect local behavior to local ML models (Llama.cpp) without cloud.</p>
                                <span style="background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; font-size:0.75rem;">ai</span>
                                <span style="background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; font-size:0.75rem; margin-left:5px">privacy</span>
                            </div>
                            <div style="margin-bottom:1rem; background:rgba(0,0,0,0.2); border-radius:12px; padding:1.5rem; border-left:3px solid #f59e0b">
                                <h4>Content Strategy</h4>
                                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0.5rem 0;">Use React + Vite for landing pages, and pure CSS for fast loads.</p>
                                <span style="background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; font-size:0.75rem;">design</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="glass-panel" style="flex: 2; padding: 1.5rem; display:flex; flex-direction:column; min-height:500px; position:relative; overflow:hidden;">
                        <!-- Interactive Graph Visual System using SVG -->
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; z-index:10;">
                            <h3>Knowledge Graph</h3>
                            <div style="background:var(--bg-dark); padding:5px 10px; border-radius: 8px; font-size: 0.8rem; border:1px solid var(--glass-border); color:var(--text-secondary);">
                                <span style="color:#10b981">●</span> 4 Nodes Active
                            </div>
                        </div>
                        <div style="flex:1; background-image: radial-gradient(circle, rgba(255,255,255,0.05) 2px, transparent 2px); background-size: 30px 30px; border-radius:12px; position:relative; overflow:hidden; border:1px solid rgba(255,255,255,0.05); box-shadow: inset 0 0 50px rgba(0,0,0,0.5);">
                            <svg width="100%" height="100%" style="position:absolute; top:0; left:0; pointer-events:none;">
                                <!-- Connections -->
                                <line x1="25%" y1="35%" x2="55%" y2="50%" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
                                <line x1="55%" y1="50%" x2="75%" y2="35%" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
                                <line x1="55%" y1="50%" x2="45%" y2="75%" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
                            </svg>
                            
                            <!-- Graph Nodes (Positioned absolutely over SVG) -->
                            <div style="position:absolute; left:25%; top:35%; transform:translate(-50%, -50%); display:flex; flex-direction:column; align-items:center; cursor:pointer;" onclick="mockAppActions.toast('Node: Phase 4 Optimization')">
                                <div style="width:30px; height:30px; background:var(--accent-blue); border-radius:50%; box-shadow:0 0 20px var(--accent-blue); border:3px solid #fff; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>
                                <span style="margin-top:8px; font-size:0.75rem; font-weight:600; background:rgba(0,0,0,0.6); padding:4px 8px; border-radius:4px;">Optimization</span>
                            </div>

                            <div style="position:absolute; left:55%; top:50%; transform:translate(-50%, -50%); display:flex; flex-direction:column; align-items:center; cursor:pointer;" onclick="mockAppActions.toast('Node: ML Sync Hub')">
                                <div style="width:40px; height:40px; background:var(--accent-purple); border-radius:50%; box-shadow:0 0 25px var(--accent-purple); border:3px solid #fff; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>
                                <span style="margin-top:8px; font-size:0.8rem; font-weight:600; background:rgba(0,0,0,0.6); padding:4px 8px; border-radius:4px;">ML Sync</span>
                            </div>

                            <div style="position:absolute; left:75%; top:35%; transform:translate(-50%, -50%); display:flex; flex-direction:column; align-items:center; cursor:pointer;" onclick="mockAppActions.toast('Node: Project Alpha')">
                                <div style="width:25px; height:25px; background:#10b981; border-radius:50%; box-shadow:0 0 15px #10b981; border:2px solid #fff; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>
                                <span style="margin-top:8px; font-size:0.75rem; font-weight:600; background:rgba(0,0,0,0.6); padding:4px 8px; border-radius:4px;">Project Alpha</span>
                            </div>

                            <div style="position:absolute; left:45%; top:75%; transform:translate(-50%, -50%); display:flex; flex-direction:column; align-items:center; cursor:pointer;" onclick="mockAppActions.toast('Node: Content Strategy')">
                                <div style="width:25px; height:25px; background:#f59e0b; border-radius:50%; box-shadow:0 0 15px #f59e0b; border:2px solid #fff; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>
                                <span style="margin-top:8px; font-size:0.75rem; font-weight:600; background:rgba(0,0,0,0.6); padding:4px 8px; border-radius:4px;">Content</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (page === 'files') {
            pageHtml = `
                <div class="glass-panel" style="padding: 2rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
                        <h3>Smart File Analyzer</h3>
                        <div style="display:flex; gap:10px; width:50%;">
                            <input type="text" id="file-search-input" placeholder="Search insights..." style="margin:0;">
                            <button id="scan-btn" class="btn-primary" style="width:250px; margin:0;" onclick="mockAppActions.scanFiles(this)">Scan Local Directory</button>
                        </div>
                    </div>
                    <table id="file-table" style="width:100%; border-collapse: collapse; text-align:left;">
                        <tr style="border-bottom: 1px solid var(--glass-border);">
                            <th style="padding:1rem;">File Name</th>
                            <th style="padding:1rem;">AI Category</th>
                            <th style="padding:1rem; width:55%">Extracted Summary & Metadata</th>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition:background 0.2s; cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'" onclick="mockAppActions.toast('Opening budget_2026.xlsx...')">
                            <td style="padding:1rem;"><strong>budget_2026.xlsx</strong><br><span style="font-size:0.8rem; color:var(--text-secondary)">2.4 MB</span></td>
                            <td style="padding:1rem;"><span style="color:#10b981; background:rgba(16,185,129,0.1); padding:4px 8px; border-radius:4px; font-size:0.85rem;">Finance</span></td>
                            <td style="padding:1rem; color:var(--text-secondary); font-size:0.9rem;">Contains Q1/Q2 revenue projections and tax estimates. Heavy focus on software subscription costs.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition:background 0.2s; cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'" onclick="mockAppActions.toast('Opening meeting_notes.docx...')">
                            <td style="padding:1rem;"><strong>meeting_notes.docx</strong><br><span style="font-size:0.8rem; color:var(--text-secondary)">84 KB</span></td>
                            <td style="padding:1rem;"><span style="color:var(--accent-blue); background:rgba(59,130,246,0.1); padding:4px 8px; border-radius:4px; font-size:0.85rem;">Work</span></td>
                            <td style="padding:1rem; color:var(--text-secondary); font-size:0.9rem;">Action items from the weekly standup regarding Digital Brain architecture and Electron launch.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition:background 0.2s; cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'" onclick="mockAppActions.toast('Opening trip_itinerary.pdf...')">
                            <td style="padding:1rem;"><strong>trip_itinerary.pdf</strong><br><span style="font-size:0.8rem; color:var(--text-secondary)">1.1 MB</span></td>
                            <td style="padding:1rem;"><span style="color:#f59e0b; background:rgba(245,158,11,0.1); padding:4px 8px; border-radius:4px; font-size:0.85rem;">Personal</span></td>
                            <td style="padding:1rem; color:var(--text-secondary); font-size:0.9rem;">Flights, hotel bookings, and train schedules for the June trip to Japan. Includes confirmation codes.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition:background 0.2s; cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'" onclick="mockAppActions.toast('Opening sys_architecture.png...')">
                            <td style="padding:1rem;"><strong>sys_architecture.png</strong><br><span style="font-size:0.8rem; color:var(--text-secondary)">4.5 MB</span></td>
                            <td style="padding:1rem;"><span style="color:var(--accent-purple); background:rgba(139,92,246,0.1); padding:4px 8px; border-radius:4px; font-size:0.85rem;">Design</span></td>
                            <td style="padding:1rem; color:var(--text-secondary); font-size:0.9rem;">Image analysis: Diagram showing a Python backend connected to a SQLite database and Electron UI.</td>
                        </tr>
                        <tr style="transition:background 0.2s; cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'" onclick="mockAppActions.toast('Opening taxes_final.pdf...')">
                            <td style="padding:1rem;"><strong>taxes_final.pdf</strong><br><span style="font-size:0.8rem; color:var(--text-secondary)">300 KB</span></td>
                            <td style="padding:1rem;"><span style="color:#ef4444; background:rgba(239,68,68,0.1); padding:4px 8px; border-radius:4px; font-size:0.85rem;">Urgent</span></td>
                            <td style="padding:1rem; color:var(--text-secondary); font-size:0.9rem;">Requires signature on page 4. Due by April 15th!</td>
                        </tr>
                    </table>
                </div>
            `;
        } else if (page === 'habits') {
            pageHtml = `
                <div class="glass-panel" style="padding: 2rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h3>Predictive Habit Engine</h3>
                            <p style="color:var(--text-secondary); margin-bottom:2rem;">AI prediction of your upcoming likely actions based on history.</p>
                        </div>
                        <div style="background:rgba(0,0,0,0.3); padding:1rem; border-radius:8px; display:flex; gap:20px; text-align:center;">
                            <div><strong id="pattern-count" style="color:var(--accent-blue); font-size:1.2rem;">32</strong><br><span style="font-size:0.8rem; color:var(--text-secondary)">Patterns</span></div>
                            <div><strong style="color:#10b981; font-size:1.2rem;">87%</strong><br><span style="font-size:0.8rem; color:var(--text-secondary)">Accuracy</span></div>
                        </div>
                    </div>
                    
                    <div id="habits-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1.5rem;">
                        <div style="background:rgba(0,0,0,0.2); padding:1.5rem; border-radius:12px; border-left: 4px solid var(--accent-blue); cursor:pointer;" onclick="mockAppActions.toast('Configuring 8:00 AM pattern logic...')">
                            <h4>8:00 AM</h4>
                            <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:0.5rem; line-height:1.5;">Check Email<br>Read Slack Messages</p>
                            <span style="font-size:0.8rem; color:#10b981; display:inline-block; margin-top:10px;">95% Confidence</span>
                        </div>
                        <div style="background:rgba(0,0,0,0.2); padding:1.5rem; border-radius:12px; border-left: 4px solid var(--accent-purple); cursor:pointer;" onclick="mockAppActions.toast('Configuring 12:30 PM pattern logic...')">
                            <h4>12:30 PM</h4>
                            <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:0.5rem; line-height:1.5;">Read Tech Articles<br>Watch YouTube Tutorial</p>
                            <span style="font-size:0.8rem; color:#10b981; display:inline-block; margin-top:10px;">82% Confidence</span>
                        </div>
                        <div style="background:rgba(0,0,0,0.2); padding:1.5rem; border-radius:12px; border-left: 4px solid #f59e0b; cursor:pointer;" onclick="mockAppActions.toast('Configuring 3:00 PM pattern logic...')">
                            <h4>3:00 PM</h4>
                            <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:0.5rem; line-height:1.5;">Python API Development<br>Database debugging</p>
                            <span style="font-size:0.8rem; color:#10b981; display:inline-block; margin-top:10px;">78% Confidence</span>
                        </div>
                        <div style="background:rgba(0,0,0,0.2); padding:1.5rem; border-radius:12px; border-left: 4px solid #10b981; cursor:pointer;" onclick="mockAppActions.toast('Configuring 6:30 PM pattern logic...')">
                            <h4>6:30 PM</h4>
                            <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:0.5rem; line-height:1.5;">Listen to Spotify (Lo-fi)<br>File Re-organization</p>
                            <span style="font-size:0.8rem; color:#10b981; display:inline-block; margin-top:10px;">88% Confidence</span>
                        </div>
                        <div style="background:rgba(0,0,0,0.2); padding:1.5rem; border-radius:12px; border-left: 4px solid #ef4444; cursor:pointer;" onclick="mockAppActions.toast('Configuring 9:00 PM pattern logic...')">
                            <h4>9:00 PM</h4>
                            <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:0.5rem; line-height:1.5;">Code in VS Code<br>App Testing</p>
                            <span style="font-size:0.8rem; color:#10b981; display:inline-block; margin-top:10px;">91% Confidence</span>
                        </div>
                        <div style="background:rgba(255,255,255,0.02); border:1px dashed var(--glass-border); padding:1.5rem; border-radius:12px; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="mockAppActions.addHabitPattern()">
                            <span style="color:var(--text-secondary);">+ Configure Custom Pattern</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (page === 'decisions') {
            pageHtml = `
                <div class="glass-panel" style="padding: 2rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3>Active Decision: <span id="decision-title" style="color:var(--accent-blue)">Should I buy a new laptop?</span></h3>
                        <span style="background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:8px; font-size:0.8rem;">Status: Analyzing</span>
                    </div>
                    
                    <div style="display:flex; justify-content:space-between; margin:2rem 0; align-items:flex-start;">
                        <div style="background:rgba(16, 185, 129, 0.05); border: 1px solid rgba(16,185,129,0.3); padding: 2rem; width:45%; border-radius:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                                <h4 style="color:#10b981;">PROS (Reasons To Do It)</h4>
                                <span id="pro-score" style="font-size:1.5rem; color:#10b981; font-weight:800;">42</span>
                            </div>
                            <ul id="pro-list" style="list-style:none; line-height:2.5;">
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">Faster compilation times <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 9 ]</span></li>
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">Better battery life <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 8 ]</span></li>
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">Crisp OLED display <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 6 ]</span></li>
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">No keyboard typing issues <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 10 ]</span></li>
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">Lightweight for travel <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 9 ]</span></li>
                            </ul>
                            <div style="margin-top:10px; color:#10b981; cursor:pointer;" onclick="mockAppActions.addDecisionFactor('pro')">+ Add Pro Factor</div>
                        </div>
                        
                        <div style="padding-top:50px;">
                            <h2 style="color:var(--text-secondary); border:1px solid var(--glass-border); padding:15px; border-radius:50%; width:60px; height:60px; text-align:center;">VS</h2>
                        </div>

                        <div style="background:rgba(239, 68, 68, 0.05); border: 1px solid rgba(239,68,68,0.3); padding: 2rem; width:45%; border-radius:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                                <h4 style="color:#ef4444;">CONS (Reasons Against)</h4>
                                <span id="con-score" style="font-size:1.5rem; color:#ef4444; font-weight:800;">36</span>
                            </div>
                            <ul id="con-list" style="list-style:none; line-height:2.5;">
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">Very expensive ($2000+) <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 10 ]</span></li>
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">Current laptop still works <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 8 ]</span></li>
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">Setup & data migration <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 5 ]</span></li>
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">Only marginally faster <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 4 ]</span></li>
                                <li style="border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between;">Next Gen coming soon <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ 9 ]</span></li>
                            </ul>
                            <div style="margin-top:10px; color:#ef4444; cursor:pointer;" onclick="mockAppActions.addDecisionFactor('con')">+ Add Con Factor</div>
                        </div>
                    </div>
                    
                    <div style="text-align:center; padding:1.5rem; background:rgba(0,0,0,0.3); border-radius:12px; margin-top:20px; border-bottom: 3px solid var(--accent-blue)">
                        AI Recommendation Engine:<br>
                        <strong id="decision-result" style="color:var(--accent-blue); font-size:1.5rem; display:block; margin-top:10px;">Lean towards PRO (Positive Margin: +6)</strong>
                        <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:5px;">Statistically recommended based on your weighted inputs.</p>
                    </div>
                    
                    <div style="margin-top: 3rem; border-top: 1px solid var(--glass-border); padding-top: 2rem;">
                        <h4 style="color:var(--text-secondary); margin-bottom: 1.5rem;">Recent Decisions</h4>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:1rem 1.5rem; border-radius:8px; cursor:pointer;" onclick="mockAppActions.toast('Opening Linux switch decision...')">
                                <span style="font-weight:600;">Switch OS to Linux <span style="background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:4px; font-size:0.75rem; margin-left:10px; font-weight:normal;">Tech</span></span>
                                <span style="color:#ef4444; font-size:0.9rem; font-weight:600;">Decided: NO <span style="color:var(--text-secondary); font-weight:normal; margin-left:5px;">(Margin: -12)</span></span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:1rem 1.5rem; border-radius:8px; cursor:pointer;" onclick="mockAppActions.toast('Opening ETF investment decision...')">
                                <span style="font-weight:600;">Invest in S&P 500 ETFs <span style="background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:4px; font-size:0.75rem; margin-left:10px; font-weight:normal;">Finance</span></span>
                                <span style="color:#10b981; font-size:0.9rem; font-weight:600;">Decided: YES <span style="color:var(--text-secondary); font-weight:normal; margin-left:5px;">(Margin: +24)</span></span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:1rem 1.5rem; border-radius:8px; cursor:pointer;" onclick="mockAppActions.toast('Opening new laptop decision...')">
                                <span style="font-weight:600;">Buy New MacBook Pro <span style="background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:4px; font-size:0.75rem; margin-left:10px; font-weight:normal;">Hardware</span></span>
                                <span style="color:#f59e0b; font-size:0.9rem; font-weight:600;">PENDING <span style="color:var(--text-secondary); font-weight:normal; margin-left:5px;">(Awaiting info)</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        contentArea.innerHTML = pageHtml;
    }

    // -- Mock Interactivity Engine --
    window.mockAppActions = {
        toast: function(msg) {
            const el = document.createElement('div');
            el.innerText = msg;
            el.style = "position:fixed; bottom:20px; right:20px; background:var(--accent-blue); color:white; padding:12px 24px; border-radius:8px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.5); z-index:9999; animation: slideIn 0.3s ease-out;";
            document.body.appendChild(el);
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.3s ease';
                setTimeout(() => el.remove(), 300);
            }, 3000);
        },
        captureIdea: function() {
            const title = prompt("Enter a quick idea title:");
            if(title) {
                this.toast('Idea "' + title + '" saved securely locally!');
                const list = document.getElementById('ideas-list');
                if(list) {
                    const newItem = document.createElement('div');
                    newItem.style = "background:rgba(0,0,0,0.2); border-radius:12px; padding:1.5rem; border-left:3px solid var(--accent-blue)";
                    newItem.innerHTML = `<h4>${title}</h4><p style="font-size:0.85rem; color:var(--text-secondary); margin:0.5rem 0;">Drafted just now via quick capture.</p><span style="background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; font-size:0.75rem;">new</span>`;
                    list.insertBefore(newItem, list.firstChild);
                }
            }
        },
        scanFiles: function(btn) {
            btn.innerText = "Scanning... (Wait)";
            btn.style.opacity = '0.5';
            setTimeout(() => {
                btn.innerText = "Scan Local Directory";
                btn.style.opacity = '1';
                this.toast("Found 1 new local file!");
                const table = document.getElementById('file-table');
                if(table) {
                    const newRow = table.insertRow(1);
                    newRow.style = "border-bottom: 1px solid rgba(255,255,255,0.05); transition:background 0.2s; cursor:pointer;";
                    newRow.innerHTML = `
                        <td style="padding:1rem;"><strong>new_recording.mp4</strong><br><span style="font-size:0.8rem; color:var(--text-secondary)">12.5 MB</span></td>
                        <td style="padding:1rem;"><span style="color:var(--accent-purple); background:rgba(139,92,246,0.1); padding:4px 8px; border-radius:4px; font-size:0.85rem;">Media</span></td>
                        <td style="padding:1rem; color:var(--text-secondary); font-size:0.9rem;">Auto-detected screen recording from 2 minutes ago.</td>
                    `;
                }
            }, 1000);
        },
        recalculateNetwork: function() {
            // Function no longer used
        },
        addHabitPattern: function() {
            const time = prompt("What time? (e.g. 10:00 AM)");
            if(time) {
                const desc = prompt("What action usually happens at " + time + "?");
                if(desc) {
                    const grid = document.getElementById('habits-grid');
                    const countEl = document.getElementById('pattern-count');
                    if(countEl) countEl.innerText = parseInt(countEl.innerText) + 1;
                    if(grid) {
                        const newCard = document.createElement('div');
                        newCard.style = "background:rgba(255,255,255,0.05); padding:1.5rem; border-radius:12px; border-left: 4px solid var(--text-primary); cursor:pointer;";
                        newCard.innerHTML = `
                            <h4>${time}</h4>
                            <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:0.5rem; line-height:1.5;">${desc}</p>
                            <span style="font-size:0.8rem; color:var(--accent-blue); display:inline-block; margin-top:10px;">Newly Created</span>
                        `;
                        grid.insertBefore(newCard, grid.lastElementChild);
                    }
                }
            }
        },
        addDecisionFactor: function(type) {
            let scoreTag = type === 'pro' ? 'pro-score' : 'con-score';
            let listTag = type === 'pro' ? 'pro-list' : 'con-list';
            const desc = prompt(`Enter a ${type.toUpperCase()} factor:`);
            if(!desc) return;
            const weight = parseInt(prompt("Weight from 1 to 10?"));
            if(!weight || isNaN(weight)) return;

            // update list
            const list = document.getElementById(listTag);
            if(list) {
                const li = document.createElement('li');
                li.style = "border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; animation: slideIn 0.3s;";
                li.innerHTML = `${desc} <span><span style="color:var(--text-secondary); font-size:0.8rem; margin-right:10px;">Weight</span>[ ${weight} ]</span>`;
                list.insertBefore(li, list.lastElementChild);
            }

            // update score
            const scoreEl = document.getElementById(scoreTag);
            if(scoreEl) {
                scoreEl.innerText = parseInt(scoreEl.innerText) + weight;
            }

            // recalculate result
            const proScore = parseInt(document.getElementById('pro-score').innerText);
            const conScore = parseInt(document.getElementById('con-score').innerText);
            const resEl = document.getElementById('decision-result');
            if(resEl) {
                let margin = proScore - conScore;
                if(margin > 0) {
                    resEl.innerHTML = `Lean towards PRO (Positive Margin: +${margin})`;
                    resEl.style.color = "var(--accent-blue)";
                } else if(margin < 0) {
                    resEl.innerHTML = `Lean towards CON (Negative Margin: ${margin})`;
                    resEl.style.color = "var(--error-red)";
                } else {
                    resEl.innerHTML = `Neutral (Margin: 0) - Tiebreaker needed!`;
                    resEl.style.color = "var(--text-secondary)";
                }
            }
        }
    };
});
