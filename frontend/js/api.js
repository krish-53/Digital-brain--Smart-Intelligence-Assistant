// Auto-detect if running via Web (ngrok) or Local Desktop (file)
const isDesktop = window.location.protocol === 'file:';
const API_BASE_URL = isDesktop ? 'http://127.0.0.1:8001/api' : (window.location.origin + '/api');

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if(token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = { ...options.headers };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (options.body && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(options.body);
        }

        const response = await fetch(url, { ...options, headers });
        
        // Handle unauthorized generic
        if(response.status === 401) {
            this.setToken(null);
            document.dispatchEvent(new Event('auth-expired'));
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'API Error');
        }

        return data;
    }

    async login(username, password) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        // FastAPI OAuth2PasswordBearer expects form data
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        this.setToken(data.access_token);
        return data;
    }

    async register(username, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: { username, password }
        });
    }

    async getUser() {
        return this.request('/auth/me', {
            method: 'GET'
        });
    }
}

const api = new ApiService();
