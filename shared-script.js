// Shared functionality across all pages
(function() {
    'use strict';

    // Initialize on DOM content loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializePage();
        setupNavigation();
        applyDarkModeFromStorage();
        setupStorageListener();
    });

    // Initialize page-specific functionality
    function initializePage() {
        const currentPage = getCurrentPage();
        setActiveNavItem(currentPage);
        
        console.log(`Initialized ${currentPage} page`);
    }

    // Get current page name
    function getCurrentPage() {
        const path = window.location.pathname;
        let page = path.split('/').pop().split('.')[0];
        
        // Handle different naming conventions
        if (page === '' || page === 'dashboard') {
            page = 'index';
        }
        
        return page;
    }

    // Set active navigation item
    function setActiveNavItem(currentPage) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            
            const href = item.getAttribute('href');
            if (href) {
                let linkPage = href.split('.')[0];
                
                // Handle index/dashboard mapping
                if (linkPage === 'index' && (currentPage === 'index' || currentPage === 'dashboard')) {
                    item.classList.add('active');
                } else if (linkPage === currentPage) {
                    item.classList.add('active');
                }
            }
        });
    }

    // Setup navigation functionality
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Handle logout confirmation
                if (this.classList.contains('logout')) {
                    e.preventDefault();
                    if (confirm('Are you sure you want to log out?')) {
                        console.log('Logging out...');
                        // Add logout functionality here
                        // window.location.href = 'login.html';
                    }
                    return;
                }
                
                // Update active state for navigation
                if (href && href !== '#') {
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }

    // Apply dark mode from localStorage
    function applyDarkModeFromStorage() {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            applyDarkMode(true);
        }
    }

    // Apply dark mode theme
    function applyDarkMode(isDarkMode) {
        const body = document.body;
        const html = document.documentElement;
        
        if (isDarkMode) {
            body.classList.add('dark-mode');
            html.setAttribute('data-theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            html.removeAttribute('data-theme');
        }
        
        // Apply theme styles
        applyThemeStyles(isDarkMode);
        
        // Update dark mode toggle if on settings page
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = isDarkMode;
        }
    }

    // Apply theme styles using CSS variables
    function applyThemeStyles(isDarkMode) {
        const root = document.documentElement;
        
        if (isDarkMode) {
            // Dark mode CSS variables
            root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)');
            root.style.setProperty('--sidebar-bg', 'rgba(26, 26, 46, 0.95)');
            root.style.setProperty('--card-bg', 'rgba(0, 0, 0, 0.3)');
            root.style.setProperty('--card-bg-alt', 'rgba(0, 0, 0, 0.2)');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.8)');
            root.style.setProperty('--text-muted', 'rgba(255, 255, 255, 0.6)');
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
            root.style.setProperty('--input-bg', 'rgba(255, 255, 255, 0.1)');
            root.style.setProperty('--input-text', '#ffffff');
            root.style.setProperty('--input-border', 'rgba(255, 255, 255, 0.2)');
            root.style.setProperty('--toggle-bg', 'rgba(255, 255, 255, 0.2)');
            root.style.setProperty('--toggle-active', '#64b5f6');
            root.style.setProperty('--button-bg', '#64b5f6');
            root.style.setProperty('--button-hover', '#42a5f5');
        } else {
            // Light mode CSS variables (reset to default)
            root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #2d5a5a 0%, #1a3d3d 50%, #0f2626 100%)');
            root.style.setProperty('--sidebar-bg', 'rgba(45, 90, 90, 0.9)');
            root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.1)');
            root.style.setProperty('--card-bg-alt', 'rgba(255, 255, 255, 0.05)');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.8)');
            root.style.setProperty('--text-muted', 'rgba(255, 255, 255, 0.6)');
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.2)');
            root.style.setProperty('--input-bg', 'rgba(255, 255, 255, 0.9)');
            root.style.setProperty('--input-text', '#333333');
            root.style.setProperty('--input-border', 'rgba(255, 255, 255, 0.3)');
            root.style.setProperty('--toggle-bg', 'rgba(255, 255, 255, 0.3)');
            root.style.setProperty('--toggle-active', '#4ecdc4');
            root.style.setProperty('--button-bg', '#4ecdc4');
            root.style.setProperty('--button-hover', '#44b3a8');
        }
    }

    // Setup storage event listener for cross-tab synchronization
    function setupStorageListener() {
        window.addEventListener('storage', function(e) {
            if (e.key === 'darkMode') {
                const isDarkMode = e.newValue === 'true';
                applyDarkMode(isDarkMode);
            }
        });
    }

    // Export functions for global use
    window.SharedManager = {
        applyDarkMode: applyDarkMode,
        getCurrentPage: getCurrentPage,
        setActiveNavItem: setActiveNavItem,
        applyThemeStyles: applyThemeStyles
    };

})();
