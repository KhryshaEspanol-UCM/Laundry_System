// Sample order data
const ordersData = {
    'ORD-001': {
        id: 'ORD-001',
        customerName: 'John Smith',
        serviceType: 'Wash & Dry',
        status: 'pending',
        date: '2024-01-15',
        estimated: '2024-01-16 14:00',
        amount: '$25.00',
        payment: 'Paid',
        notes: 'Handle with care. Customer requested extra fabric softener.'
    },
    'ORD-002': {
        id: 'ORD-002',
        customerName: 'Khrysha Español',
        serviceType: 'Wash, Dry & Fold',
        status: 'in-progress',
        date: '2024-01-15',
        estimated: '2024-01-16 16:00',
        amount: '$35.00',
        payment: 'Paid',
        notes: 'Separate whites and colors. No bleach on colored items.'
    },
    'ORD-003': {
        id: 'ORD-003',
        customerName: 'Amber Pagusara',
        serviceType: 'Iron Only',
        status: 'ready',
        date: '2024-01-14',
        estimated: '2024-01-15 10:00',
        amount: '$15.00',
        payment: 'Paid',
        notes: 'Business shirts - high starch level requested.'
    },
    'ORD-004': {
        id: 'ORD-004',
        customerName: 'Emily Davis',
        serviceType: 'Full Service',
        status: 'completed',
        date: '2024-01-14',
        estimated: '2024-01-15 12:00',
        amount: '$45.00',
        payment: 'Paid',
        notes: 'Delicate items included. Customer very satisfied with service.'
    },
    'ORD-005': {
        id: 'ORD-005',
        customerName: 'David Wilson',
        serviceType: 'Wash & Dry',
        status: 'in-progress',
        date: '2024-01-15',
        estimated: '2024-01-16 15:00',
        amount: '$28.00',
        payment: 'Pending',
        notes: 'Large load - comforters and blankets. Extra drying time needed.'
    },
    'ORD-006': {
        id: 'ORD-006',
        customerName: 'Lisa Anderson',
        serviceType: 'Dry Clean',
        status: 'pending',
        date: '2024-01-15',
        estimated: '2024-01-17 11:00',
        amount: '$55.00',
        payment: 'Paid',
        notes: 'Formal wear - wedding dress and suit. Handle with extreme care.'
    }
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const statusFilter = document.getElementById('statusFilter');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Navigation functionality
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (!href || href === '#') {
                e.preventDefault();
                
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                const navText = this.querySelector('span');
                if (navText) {
                    const page = navText.textContent.toLowerCase();
                    console.log(`Navigating to: ${page}`);
                    
                    switch(page) {
                        case 'dashboard':
                            window.location.href = 'index.html';
                            break;
                        case 'home':
                            window.location.href = 'home.html';
                            break;
                        case 'profile':
                            window.location.href = 'profile.html';
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
    
    // Status filter functionality
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterOrders(this.value);
        });
    }
    
    // New Order button functionality
    const newOrderBtn = document.querySelector('.new-order-btn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', function() {
            console.log('Opening new order form...');
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Future: Open new order modal or redirect to new order page
            alert('New Order functionality will be implemented soon!');
        });
    }
    
    // Initialize page
    updateSummaryCards();
});

// Filter orders by status
function filterOrders(status) {
    const rows = document.querySelectorAll('#ordersTableBody tr');
    
    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        
        if (status === 'all' || rowStatus === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update summary cards based on filter
    updateSummaryCards(status);
}

// Update summary cards
function updateSummaryCards(filterStatus = 'all') {
    const rows = document.querySelectorAll('#ordersTableBody tr');
    const counts = {
        pending: 0,
        'in-progress': 0,
        ready: 0,
        completed: 0
    };
    
    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        if (filterStatus === 'all' || status === filterStatus) {
            counts[status]++;
        }
    });
    
    // Update the summary cards
    document.querySelector('.summary-card.pending .summary-info h3').textContent = counts.pending;
    document.querySelector('.summary-card.in-progress .summary-info h3').textContent = counts['in-progress'];
    document.querySelector('.summary-card.ready .summary-info h3').textContent = counts.ready;
    document.querySelector('.summary-card.completed .summary-info h3').textContent = counts.completed;
}

// Open order details modal
function openOrderModal(orderId) {
    const order = ordersData[orderId];
    if (!order) {
        console.error('Order not found:', orderId);
        return;
    }
    
    // Populate modal with order data
    document.getElementById('modalOrderId').textContent = `#${order.id}`;
    document.getElementById('modalCustomerName').textContent = order.customerName;
    document.getElementById('modalServiceType').textContent = order.serviceType;
    document.getElementById('modalDate').textContent = order.date;
    document.getElementById('modalEstimated').textContent = order.estimated;
    document.getElementById('modalAmount').textContent = order.amount;
    document.getElementById('modalPayment').textContent = order.payment;
    document.getElementById('modalNotes').textContent = order.notes;
    
    // Update status badge
    const statusElement = document.getElementById('modalStatus');
    statusElement.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ');
    statusElement.className = `status-badge ${order.status}`;
    
    // Show modal
    const modal = document.getElementById('orderModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close order details modal
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Modal action handlers
document.addEventListener('DOMContentLoaded', function() {
    // Update Status button
    const updateStatusBtn = document.querySelector('.update-status-btn');
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', function() {
            const currentOrderId = document.getElementById('modalOrderId').textContent.replace('#', '');
            console.log('Updating status for order:', currentOrderId);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Future: Open status update form
            alert('Status update functionality will be implemented soon!');
        });
    }
    
    // Print Receipt button
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            const currentOrderId = document.getElementById('modalOrderId').textContent.replace('#', '');
            console.log('Printing receipt for order:', currentOrderId);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Simple print functionality
            printOrderReceipt(currentOrderId);
        });
    }
});

// Print order receipt
function printOrderReceipt(orderId) {
    const order = ordersData[orderId];
    if (!order) return;
    
    const printWindow = window.open('', '_blank');
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order Receipt - ${order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .order-details { margin-bottom: 20px; }
                .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>WASH & FOLD LAUNDRY SHOP</h1>
                <h2>Order Receipt</h2>
            </div>
            <div class="order-details">
                <div class="detail-row">
                    <span>Order ID:</span>
                    <span>#${order.id}</span>
                </div>
                <div class="detail-row">
                    <span>Customer:</span>
                    <span>${order.customerName}</span>
                </div>
                <div class="detail-row">
                    <span>Service:</span>
                    <span>${order.serviceType}</span>
                </div>
                <div class="detail-row">
                    <span>Date:</span>
                    <span>${order.date}</span>
                </div>
                <div class="detail-row">
                    <span>Status:</span>
                    <span>${order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}</span>
                </div>
                <div class="detail-row">
                    <span>Payment Status:</span>
                    <span>${order.payment}</span>
                </div>
                <div class="detail-row total">
                    <span>Total Amount:</span>
                    <span>${order.amount}</span>
                </div>
            </div>
            <div class="notes">
                <h3>Notes:</h3>
                <p>${order.notes}</p>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    }
                }
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('orderModal');
    if (e.target === modal) {
        closeOrderModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('orderModal');
    if (modal.classList.contains('show') && e.key === 'Escape') {
        closeOrderModal();
    }
});

// Auto-refresh functionality (optional)
function autoRefreshOrders() {
    console.log('Auto-refreshing orders...');
    // Future: Fetch updated order data from server
    updateSummaryCards();
}

// Set up auto-refresh every 30 seconds (optional)
// setInterval(autoRefreshOrders, 30000);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error in Orders page:', e.error);
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    console.log('Window resized - adjusting orders layout if needed');
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Search functionality (future enhancement)
function searchOrders(searchTerm) {
    const rows = document.querySelectorAll('#ordersTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export functionality (future enhancement)
function exportOrders(format = 'csv') {
    console.log(`Exporting orders in ${format} format...`);
    // Future: Implement CSV/PDF export functionality
}
