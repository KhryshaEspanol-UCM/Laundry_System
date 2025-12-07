// Tailwind configuration must be applied before DOM rendering, so we put it outside the DOMContentLoaded listener.
// This block ensures Tailwind knows about the CSS variables defined in profile-styles.css
tailwind.config = {
    theme: {
        extend: {
            colors: {
                // Mapping the CSS variables to Tailwind utility classes
                'primary': 'var(--color-primary)',
                'secondary': 'var(--color-secondary)',
                'text-dark': 'var(--color-text-dark)',
                'text-light': 'var(--color-text-light)',
                'sidebar-dark': 'var(--color-sidebar-dark)', 
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    
    // Elements for the dynamic update (Edit Profile)
    const editButton = document.getElementById('editButton');
    const infoFields = document.querySelectorAll('#infoForm input[data-profile-field]');
    const displayNameInput = document.getElementById('displayNameInput');
    const profileNameDisplay = document.getElementById('profileNameDisplay');

    // Elements for Profile Picture Update
    const changePictureLink = document.getElementById('changePictureLink');
    const fileInput = document.getElementById('fileInput');
    const profileImage = document.getElementById('profileImage');
    const defaultProfileIcon = document.getElementById('defaultProfileIcon');
    
    // Elements for Sidebar Minimization
    const body = document.body;
    const minimizeSidebarButton = document.getElementById('minimizeSidebar');
    const maximizeSidebarButton = document.getElementById('maximizeSidebar');
    
    // Elements for Password Success Message
    const passwordForm = document.getElementById('passwordForm');
    const passwordSuccessMessage = document.getElementById('passwordSuccessMessage');
    const closeSuccessMessageButton = document.getElementById('closeSuccessMessage');
    
    // We keep this variable for consistency, though the auto-close logic is removed
    let autoCloseTimer = null; 


    // --- Sidebar Toggle (Mobile) ---
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            // Remove the hidden class to show the sidebar
            sidebar.classList.remove('-translate-x-full');
        });
    }

    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', () => {
            // Add the hidden class to hide the sidebar
            sidebar.classList.add('-translate-x-full');
        });
    }


    // --- Sidebar Minimization/Maximization Logic (Desktop) ---
    const toggleSidebar = () => {
        body.classList.toggle('is-minimized');
    };

    // Event listeners for desktop minimize/maximize buttons
    if (minimizeSidebarButton) {
        minimizeSidebarButton.addEventListener('click', toggleSidebar);
    }
    if (maximizeSidebarButton) {
        maximizeSidebarButton.addEventListener('click', toggleSidebar);
    }


    // --- Profile Edit Toggle Logic (Client-Side Only) ---
    
    if (editButton && infoFields.length > 0) {
        editButton.addEventListener('click', () => {
            // Check if we are currently in read-only mode (Button text is "Edit profile")
            const isReadOnly = editButton.textContent.trim() === 'Edit profile';

            infoFields.forEach(field => {
                // Toggle the readonly attribute
                field.readOnly = !field.readOnly;
            });

            if (isReadOnly) {
                // Entering Edit Mode
                editButton.textContent = 'Save changes';
                editButton.classList.remove('primary-button');
                editButton.classList.add('secondary-button'); // Highlight save action
            } else {
                // Exiting Edit Mode (Simulating Save)
                
                // 1. Get the new display name value
                const newDisplayName = displayNameInput.value || 'New User'; // Use a default if empty
                
                // 2. Update the display element below the profile icon
                profileNameDisplay.textContent = newDisplayName;
                
                // 3. Revert button and state
                editButton.textContent = 'Edit profile';
                editButton.classList.remove('secondary-button');
                editButton.classList.add('primary-button'); // Revert to primary style
            }
        });
    }

    // --- Profile Picture Change Functionality ---
    
    if (changePictureLink && fileInput && profileImage && defaultProfileIcon) {
        // 1. Link click triggers file input
        changePictureLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link navigation
            fileInput.click(); // Programmatically click the hidden file input
        });

        // 2. Handle file selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Set the new image source
                    profileImage.src = event.target.result;
                    
                    // Show the image and hide the default icon
                    profileImage.classList.remove('hidden');
                    defaultProfileIcon.classList.add('hidden');
                };
                // Read the image file as a data URL (base64 string)
                reader.readAsDataURL(file);
            }
        });
    }
    
    // --- Password Save Success Message Logic ---

    // Function to reset password fields
    const resetPasswordFields = () => {
        document.querySelector('input[name="currentPassword"]').value = '';
        document.querySelector('input[name="newPassword"]').value = '';
    }
    
    // Function to close the modal and clear the timer
    const closeModal = () => {
        if (passwordSuccessMessage) {
            passwordSuccessMessage.classList.add('hidden');
        }
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
        }
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop default form submission/page reload
            
            const currentPassword = document.querySelector('input[name="currentPassword"]').value;
            const newPassword = document.querySelector('input[name="newPassword"]').value;
            
            // Only show success if they actually attempted to change something
            if ((currentPassword || newPassword) && passwordSuccessMessage) {
                // 1. Reset fields visually (simulate clearing after save)
                resetPasswordFields();
                
                // 2. Show the success modal
                passwordSuccessMessage.classList.remove('hidden');
            }
            
        });
    }

    // Closes the modal only when the "Close" button is clicked
    if (closeSuccessMessageButton) {
        closeSuccessMessageButton.addEventListener('click', closeModal);
    }
    
    // Also close if the user clicks the dark overlay area
     if (passwordSuccessMessage) {
        passwordSuccessMessage.addEventListener('click', (e) => {
            // Check if the click occurred directly on the modal backdrop, not inside the modal content
            if (e.target === passwordSuccessMessage) {
                closeModal();
            }
        });
    }
});
