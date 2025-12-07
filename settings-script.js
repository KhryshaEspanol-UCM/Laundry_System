// Firebase Imports (Standard Setup)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Set Log Level for debugging
setLogLevel('Debug');

const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

// Check if config is valid before initializing
let auth = null;
let app = null;

if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    // Firestore initialization is necessary even if not used, to satisfy the environment requirements
    getFirestore(app);

    // Authentication logic
    if (typeof __initial_auth_token !== 'undefined') {
        signInWithCustomToken(auth, __initial_auth_token).catch(e => console.error("Firebase custom sign-in failed:", e));
    } else {
        signInAnonymously(auth).catch(e => console.error("Firebase anonymous sign-in failed:", e));
    }
}

// --- Persistence Keys ---
// Keys used for localStorage to remember user preferences across pages.
const DARK_MODE_KEY = 'darkModeEnabled';
const SIDEBAR_MINIMIZED_KEY = 'sidebarMinimized';
// NEW: Notification Keys
const NOTIF_ORDER_READY = 'notifOrderReady';
const NOTIF_PROMOTIONS = 'notifPromotions';
const NOTIF_NEW_FEATURES = 'notifNewFeatures';


document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebarMobile = document.getElementById('close-sidebar'); 
    const minimizeSidebar = document.getElementById('minimizeSidebar');
    const maximizeSidebar = document.getElementById('maximizeSidebar');

    // --- DARK MODE PERSISTENCE LOGIC ---
    const darkModeToggle = document.getElementById('darkModeToggle');

    const saveDarkModeState = (isEnabled) => {
        localStorage.setItem(DARK_MODE_KEY, isEnabled ? 'true' : 'false');
    };

    const loadAndSetDarkMode = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedState = localStorage.getItem(DARK_MODE_KEY);
        let isEnabled = storedState === 'true'; 

        if (storedState === null) {
            isEnabled = prefersDark;
            saveDarkModeState(isEnabled);
        }

        if (isEnabled) {
            body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = false;
        }
    };

    loadAndSetDarkMode();

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            const isEnabled = darkModeToggle.checked;
            body.classList.toggle('dark-mode', isEnabled);
            saveDarkModeState(isEnabled); 
        });
    }


    // --- NOTIFICATION TOGGLE PERSISTENCE LOGIC ---

    /**
     * Finds a toggle button by its ID and sets up persistence.
     * @param {string} toggleId - The ID of the checkbox/toggle element (e.g., 'notifOrderReadyToggle').
     * @param {string} storageKey - The key used in localStorage (e.g., NOTIF_ORDER_READY).
     * @param {boolean} defaultState - The default state if no preference is found.
     */
    const setupTogglePersistence = (toggleId, storageKey, defaultState) => {
        const toggle = document.getElementById(toggleId);
        if (!toggle) return;

        // 1. Load state
        const storedState = localStorage.getItem(storageKey);
        let isEnabled = defaultState;

        // Check if a state is explicitly stored
        if (storedState !== null) {
            // localStorage stores strings, 'true' means enabled
            isEnabled = storedState === 'true'; 
        }

        // Apply loaded state
        toggle.checked = isEnabled;
        
        // 2. Add event listener to save state on change
        toggle.addEventListener('change', () => {
            localStorage.setItem(storageKey, toggle.checked ? 'true' : 'false');
        });
    };

    // Apply persistence to all notification toggles
    // This is the implementation you requested for persistence:
    setupTogglePersistence('notifOrderReadyToggle', NOTIF_ORDER_READY, true);
    setupTogglePersistence('notifPromotionsToggle', NOTIF_PROMOTIONS, false);
    setupTogglePersistence('notifNewFeaturesToggle', NOTIF_NEW_FEATURES, true);

    // --- SIDEBAR MOBILE LOGIC ---
    const closeSidebar = () => {
        sidebar.classList.add('-translate-x-full');
    };

    const openSidebar = () => {
        sidebar.classList.remove('-translate-x-full');
    };

    if (menuToggle) menuToggle.addEventListener('click', openSidebar);
    if (closeSidebarMobile) closeSidebarMobile.addEventListener('click', closeSidebar);


    // --- SIDEBAR MINIMIZATION PERSISTENCE LOGIC (Desktop only) ---
    
    // Helper function to save sidebar state
    const saveSidebarState = (isMinimized) => {
        localStorage.setItem(SIDEBAR_MINIMIZED_KEY, isMinimized ? 'true' : 'false');
    };

    const minimize = () => {
        body.classList.add('is-minimized');
        if (minimizeSidebar) minimizeSidebar.style.display = 'none';
        if (maximizeSidebar) maximizeSidebar.style.display = 'flex';
        saveSidebarState(true); // Save state added here
    };

    const maximize = () => {
        body.classList.remove('is-minimized');
        if (minimizeSidebar) minimizeSidebar.style.display = 'block';
        if (maximizeSidebar) maximizeSidebar.style.display = 'none';
        saveSidebarState(false); // Save state added here
    };

    if (minimizeSidebar) minimizeSidebar.addEventListener('click', minimize);
    if (maximizeSidebar) maximizeSidebar.addEventListener('click', maximize);

    // Initial check for desktop view to set sidebar state
    const checkWindowSize = () => {
         // Only apply minimization controls on desktop (>= lg)
        if (window.innerWidth >= 1024) { 
            // Load state from local storage
            const storedState = localStorage.getItem(SIDEBAR_MINIMIZED_KEY);
            
            // If state is stored and is 'true', minimize. Otherwise, maximize.
            if (storedState === 'true') {
                minimize();
            } else {
                maximize(); 
            }
            
            // Ensure mobile close button is hidden on desktop
            if (closeSidebarMobile) closeSidebarMobile.style.display = 'none';
        } else {
            // On mobile, ensure sidebar is initially closed and expanded state controls are hidden
            closeSidebar(); 
            if (minimizeSidebar) minimizeSidebar.style.display = 'none';
            if (maximizeSidebar) maximizeSidebar.style.display = 'none';
        }
    };
    
    window.addEventListener('resize', checkWindowSize);
    checkWindowSize(); // Run once on load


    // --- FEEDBACK FORM LOGIC ---
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackSuccessMessage = document.getElementById('feedbackSuccessMessage');
    const closeFeedbackSuccessMessageButton = document.getElementById('closeFeedbackSuccessMessage');

    const resetFeedbackFields = () => {
        if (feedbackForm) {
            document.getElementById('feedbackName').value = '';
            document.getElementById('feedbackMessage').value = '';
        }
    };

    const closeModal = () => {
        if (feedbackSuccessMessage) {
            feedbackSuccessMessage.classList.add('hidden');
        }
    };

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            if (!feedbackForm.checkValidity()) {
                return;
            }
            
            e.preventDefault();
            
            resetFeedbackFields();
            
            if (feedbackSuccessMessage) {
                feedbackSuccessMessage.classList.remove('hidden');
            }
        });
    }

    if (closeFeedbackSuccessMessageButton) {
        closeFeedbackSuccessMessageButton.addEventListener('click', closeModal);
    }
    
    if (feedbackSuccessMessage) {
        feedbackSuccessMessage.addEventListener('click', (e) => {
            if (e.target === feedbackSuccessMessage) {
                closeModal();
            }
        });
    }
});
