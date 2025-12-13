// -----------------------------------------------------------------------------
// Shared Functionality Across All Pages
// -----------------------------------------------------------------------------
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initializePage();
        setupNavigation();
        applyDarkModeFromStorage();
        setupStorageListener();
        setupDarkModeToggle(); // Handles the toggle on Settings page
    });

    // -------------------------------------------------------------------------
    // Dark Mode Toggle (Settings Page)
    // -------------------------------------------------------------------------
    function setupDarkModeToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');

        // Only runs if toggle exists on this page
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', function () {
                const isDarkMode = this.checked;
                applyDarkMode(isDarkMode);
                localStorage.setItem('darkMode', isDarkMode);
            });
        }
    }

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------
    function initializePage() {
        const currentPage = getCurrentPage();
        setActiveNavItem(currentPage);
        console.log(`Initialized ${currentPage} page`);
    }

    // Get current page name
    function getCurrentPage() {
        const path = window.location.pathname;
        let page = path.split('/').pop().split('.')[0];

        // Default to index
        if (page === '' || page === 'dashboard') {
            page = 'index';
        }

        return page;
    }

    // -------------------------------------------------------------------------
    // Set Active Navigation Item
    // -------------------------------------------------------------------------
    function setActiveNavItem(currentPage) {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.classList.remove('active');

            const href = item.getAttribute('href');
            if (href) {
                let linkPage = href.split('.')[0];

                // Map both "dashboard" and "index" to the index page
                if (linkPage === 'index' && (currentPage === 'index' || currentPage === 'dashboard')) {
                    item.classList.add('active');
                } else if (linkPage === currentPage) {
                    item.classList.add('active');
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // Navigation Click Behavior
    // -------------------------------------------------------------------------
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Logout button behavior
                if (this.classList.contains('logout')) {
                    e.preventDefault();
                    if (confirm('Are you sure you want to log out?')) {
                        console.log('Logging out...');
                        // window.location.href = 'login.html';
                    }
                    return;
                }

                // Highlight the active nav item
                if (href && href !== '#') {
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // Apply Dark Mode (On Load)
    // -------------------------------------------------------------------------
    function applyDarkModeFromStorage() {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            applyDarkMode(true);
        }
    }

    // -------------------------------------------------------------------------
    // Apply Dark / Light Theme
    // -------------------------------------------------------------------------
    function applyDarkMode(isDarkMode) {
        const body = document.body;

        if (isDarkMode) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }

        // Sync the toggle switch IF it exists on this page
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = isDarkMode;
        }
    }

    // -------------------------------------------------------------------------
    // Cross-Tab Sync (LocalStorage Listener)
    // -------------------------------------------------------------------------
    function setupStorageListener() {
        window.addEventListener('storage', function (e) {
            if (e.key === 'darkMode') {
                const isDarkMode = e.newValue === 'true';
                applyDarkMode(isDarkMode);
            }
        });
    }

    // -------------------------------------------------------------------------
    // Export Functions Globally
    // -------------------------------------------------------------------------
    window.SharedManager = {
        applyDarkMode: applyDarkMode,
        getCurrentPage: getCurrentPage,
        setActiveNavItem: setActiveNavItem
    };

})();
