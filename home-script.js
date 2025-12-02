// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
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
                
                // Here you would typically handle routing
                switch(page) {
                    case 'dashboard':
                        // Redirect to dashboard
                        window.location.href = 'index.html';
                        break;
                    case 'home':
                        // Already on home page
                        break;
                    case 'profile':
                        // Redirect to profile page
                        console.log('Redirecting to profile...');
                        break;
                    case 'orders':
                        // Redirect to orders page
                        console.log('Redirecting to orders...');
                        break;
                    case 'settings':
                        // Redirect to settings page
                        console.log('Redirecting to settings...');
                        break;
                    case 'log out':
                        // Handle logout
                        if (confirm('Are you sure you want to log out?')) {
                            console.log('Logging out...');
                            // Redirect to login page
                        }
                        break;
                }
            }
        });
    });
    
    // Service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            console.log(`Selected service: ${serviceName}`);
            
            // Add a subtle animation feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Here you could open a service details modal or redirect
            // showServiceDetails(serviceName);
        });
        
        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Learn more about ${card.querySelector('h3').textContent} service`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Welcome animation
    const welcomeSection = document.querySelector('.welcome-section');
    const servicesSection = document.querySelector('.services-section');
    
    // Fade in animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initially hide sections for animation
    [welcomeSection, servicesSection].forEach(section => {
        if (section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        }
    });
    
    // Add loading animation for service cards
    const serviceCardsAnimation = document.querySelectorAll('.service-card');
    serviceCardsAnimation.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + (index * 100));
    });
});

// Utility function for future service details modal
function showServiceDetails(serviceName) {
    // This could open a modal with more details about the service
    console.log(`Opening details for ${serviceName} service`);
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Recalculate any dynamic layouts if needed
    console.log('Window resized');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});
