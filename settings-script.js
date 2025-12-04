// ================= SETTINGS SCRIPT =================
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const emailNotifications = document.getElementById('emailNotifications');
    const smsNotifications = document.getElementById('smsNotifications');
    const promotionalEmails = document.getElementById('promotionalEmails');
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackName = document.getElementById('feedbackName');
    const feedbackMessage = document.getElementById('feedbackMessage');

    // Initialize settings on page load
    initializeSettings();

    // ===== DARK MODE =====
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            toggleDarkMode(darkModeToggle.checked);
        });
    }

    // ===== NOTIFICATION TOGGLES =====
    const notificationToggles = [emailNotifications, smsNotifications, promotionalEmails];
    notificationToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('change', () => handleNotificationToggle(toggle));
        }
    });

    // ===== FEEDBACK FORM =====
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + D => toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            if (darkModeToggle) {
                darkModeToggle.checked = !darkModeToggle.checked;
                toggleDarkMode(darkModeToggle.checked);
            }
        }

        // Escape => close notifications
        if (e.key === 'Escape') {
            document.querySelectorAll('.notification').forEach(n => n.remove());
        }
    });

    // ===== SYNC ACROSS TABS =====
    window.addEventListener('storage', e => {
        if (e.key === 'darkMode') {
            const isDark = e.newValue === 'true';
            if (darkModeToggle) darkModeToggle.checked = isDark;
            toggleDarkMode(isDark);
        }
        if (['emailNotifications', 'smsNotifications', 'promotionalEmails'].includes(e.key)) {
            const toggle = document.getElementById(e.key);
            if (toggle) toggle.checked = e.newValue === 'true';
        }
    });
});

// ===== INITIALIZE SETTINGS =====
function initializeSettings() {
    // Dark mode
    const darkModeSaved = localStorage.getItem('darkMode') === 'true';
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = darkModeSaved;
        toggleDarkMode(darkModeSaved);
    }

    // Notification preferences
    ['emailNotifications', 'smsNotifications', 'promotionalEmails'].forEach(id => {
        const saved = localStorage.getItem(id) === 'true';
        const toggle = document.getElementById(id);
        if (toggle) toggle.checked = saved;
    });
}

// ===== DARK MODE FUNCTION =====
function toggleDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('darkMode', isDark);
    applyThemeStyles(isDark);
    showNotification(`${isDark ? 'Dark' : 'Light'} mode activated`, 'success');
}

function applyThemeStyles(isDark) {
    const root = document.documentElement;
    if (isDark) {
        root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #1a1a2e, #16213e, #0f1419)');
        root.style.setProperty('--sidebar-bg', 'rgba(26,26,46,0.95)');
        root.style.setProperty('--card-bg', 'rgba(0,0,0,0.3)');
        root.style.setProperty('--input-bg', 'rgba(255,255,255,0.1)');
        root.style.setProperty('--input-text', '#fff');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', 'rgba(255,255,255,0.8)');
        root.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');
        root.style.setProperty('--toggle-active', '#64b5f6');
        root.style.setProperty('--button-bg', '#64b5f6');
    } else {
        root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #2d5a5a, #1a3d3d, #0f2626)');
        root.style.setProperty('--sidebar-bg', 'rgba(45,90,90,0.9)');
        root.style.setProperty('--card-bg', 'rgba(255,255,255,0.1)');
        root.style.setProperty('--input-bg', 'rgba(255,255,255,0.9)');
        root.style.setProperty('--input-text', '#333333');
        root.style.setProperty('--text-primary', '#000000');
        root.style.setProperty('--text-secondary', 'rgba(0,0,0,0.6)');
        root.style.setProperty('--border-color', 'rgba(0,0,0,0.2)');
        root.style.setProperty('--toggle-active', '#4ecdc4');
        root.style.setProperty('--button-bg', '#4ecdc4');
    }
}

// ===== HANDLE NOTIFICATION TOGGLES =====
function handleNotificationToggle(toggle) {
    const isEnabled = toggle.checked;
    localStorage.setItem(toggle.id, isEnabled);
    const names = {
        emailNotifications: 'Email Notifications',
        smsNotifications: 'SMS Notifications',
        promotionalEmails: 'Promotional Emails'
    };
    showNotification(`${names[toggle.id] || toggle.id} ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
}

// ===== FEEDBACK FORM =====
function handleFeedbackSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('feedbackName').value.trim();
    const message = document.getElementById('feedbackMessage').value.trim();
    if (!name) return showNotification('Please enter your name', 'error');
    if (!message) return showNotification('Please enter your message', 'error');

    console.log('Feedback submitted:', { name, message });
    showNotification('Feedback sent successfully!', 'success');
    e.target.reset();
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const colors = { success: '#28a745', error: '#dc3545', info: '#17a2b8', warning: '#ffc107' };
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());

    const box = document.createElement('div');
    box.className = `notification notification-${type}`;
    box.innerHTML = `<span>${message}</span><button class="close-btn">×</button>`;
    box.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${colors[type]};
        color: white; padding: 15px 20px; border-radius: 8px; z-index: 1000;
        display: flex; align-items: center; justify-content: space-between;
        max-width: 350px; font-size: 14px; animation: slideInRight 0.3s ease;
    `;
    box.querySelector('.close-btn').onclick = () => box.remove();
    document.body.appendChild(box);

    setTimeout(() => {
        box.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => box.remove(), 300);
    }, 4000);
}

// ===== EXPORT SETTINGS =====
function exportSettings() {
    const settings = {
        theme: localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light',
        emailNotifications: localStorage.getItem('emailNotifications') === 'true',
        smsNotifications: localStorage.getItem('smsNotifications') === 'true',
        promotionalEmails: localStorage.getItem('promotionalEmails') === 'true',
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'settings.json';
    link.click();
    showNotification('Settings exported successfully', 'success');
}

// ===== IMPORT SETTINGS =====
function importSettings(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const settings = JSON.parse(e.target.result);
            if (settings.theme) {
                const isDark = settings.theme === 'dark';
                localStorage.setItem('darkMode', isDark);
                toggleDarkMode(isDark);
                const darkToggle = document.getElementById('darkModeToggle');
                if (darkToggle) darkToggle.checked = isDark;
            }
            ['emailNotifications', 'smsNotifications', 'promotionalEmails'].forEach(id => {
                if (settings.hasOwnProperty(id)) {
                    localStorage.setItem(id, settings[id]);
                    const toggle = document.getElementById(id);
                    if (toggle) toggle.checked = settings[id];
                }
            });
            showNotification('Settings imported successfully', 'success');
        } catch (err) {
            console.error('Import error:', err);
            showNotification('Error importing settings file', 'error');
        }
    };
    reader.readAsText(file);
}

// ===== EXPORT MODULE =====
window.SettingsManager = { toggleDarkMode, showNotification, initializeSettings, exportSettings, importSettings };

// ===== ADD ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
.notification { cursor: pointer; transition: transform 0.2s ease; }
.notification:hover { transform: translateX(-5px); }
.notification .close-btn:hover { background-color: rgba(255,255,255,0.2); border-radius: 50%; }
`;
document.head.appendChild(style);
