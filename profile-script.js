// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for items without href or with #
            if (!href || href === '#') {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Handle navigation logic
                const navText = this.querySelector('span');
                if (navText) {
                    const page = navText.textContent.toLowerCase();
                    console.log(`Navigating to: ${page}`);
                    
                    switch(page) {
                        case 'orders':
                            console.log('Redirecting to orders page...');
                            break;
                        case 'settings':
                            console.log('Redirecting to settings page...');
                            break;
                        case 'log out':
                            if (confirm('Are you sure you want to log out?')) {
                                console.log('Logging out...');
                                // Redirect to login page
                            }
                            break;
                    }
                }
            }
        });
    });
    
    // Personal Information Form Handler
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const personalInfo = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                displayName: formData.get('displayName'),
                email: formData.get('email'),
                address: formData.get('address'),
                phoneNumber: formData.get('phoneNumber')
            };
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(personalInfo.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Validate phone number
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(personalInfo.phoneNumber)) {
                alert('Please enter a valid phone number.');
                return;
            }
            
            console.log('Personal Information Updated:', personalInfo);
            alert('Personal information updated successfully!');
        });
    }
    
    // Password Form Handler
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const currentPassword = formData.get('currentPassword');
            const newPassword = formData.get('newPassword');
            const confirmPassword = formData.get('confirmPassword');
            
            // Check if passwords are provided
            if (!currentPassword && !newPassword && !confirmPassword) {
                alert('Please fill in the password fields to change your password.');
                return;
            }
            
            // Validate new password requirements
            if (newPassword) {
                if (newPassword.length < 8) {
                    alert('New password must be at least 8 characters long.');
                    return;
                }
                
                if (newPassword !== confirmPassword) {
                    alert('New password and confirmation password do not match.');
                    return;
                }
                
                if (!currentPassword) {
                    alert('Please enter your current password to change it.');
                    return;
                }
            }
            
            console.log('Password change requested');
            alert('Password updated successfully!');
            
            // Clear password fields
            this.reset();
        });
    }
    
    // Edit Profile Button Handler
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Focus on the first input field
            const firstInput = document.getElementById('firstName');
            if (firstInput) {
                firstInput.focus();
                firstInput.select();
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
    
    // Auto-update display name based on first and last name
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const displayNameInput = document.getElementById('displayName');
    
    function updateDisplayName() {
        if (firstNameInput && lastNameInput && displayNameInput) {
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            
            if (firstName && lastName) {
                // Extract first name from "Michael John" -> "John"
                const firstNameParts = firstName.split(' ');
                const actualFirstName = firstNameParts.length > 1 ? firstNameParts[firstNameParts.length - 1] : firstName;
                displayNameInput.value = `${actualFirstName} ${lastName}`;
            }
        }
    }
    
    if (firstNameInput && lastNameInput) {
        firstNameInput.addEventListener('input', updateDisplayName);
        lastNameInput.addEventListener('input', updateDisplayName);
    }
    
    // Form validation styling
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = 'rgba(255, 100, 100, 0.5)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgba(255, 100, 100, 0.5)' && this.value.trim() !== '') {
                this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
        });
    });
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Profile picture click handler (for future file upload)
    const profilePicture = document.querySelector('.profile-picture');
    if (profilePicture) {
        profilePicture.addEventListener('click', function() {
            console.log('Profile picture clicked - could open file upload dialog');
            // Future: implement file upload functionality
        });
        
        profilePicture.style.cursor = 'pointer';
        profilePicture.setAttribute('title', 'Click to change profile picture');
    }
});

// Utility function to validate form data
function validatePersonalInfo(data) {
    const errors = [];
    
    if (!data.firstName.trim()) errors.push('First name is required');
    if (!data.lastName.trim()) errors.push('Last name is required');
    if (!data.displayName.trim()) errors.push('Display name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!data.address.trim()) errors.push('Address is required');
    if (!data.phoneNumber.trim()) errors.push('Phone number is required');
    
    return errors;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    console.log('Window resized - adjusting layout if needed');
});
