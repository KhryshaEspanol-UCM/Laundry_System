const sidebar = document.getElementById('sidebar');
const contentArea = document.getElementById('content-area');
const minimizeBtn = document.getElementById('minimizeSidebar');
const maximizeSidebar = document.getElementById('maximizeSidebar');
const expandedHeader = document.getElementById('expanded-header');
const minimizedHeader = document.getElementById('minimized-header');
const menuToggle = document.getElementById('menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');

function toggleSidebar(isMinimized) {
    if (isMinimized) {
        sidebar.classList.add('w-20');
        sidebar.classList.remove('w-64');
        contentArea.classList.replace('lg:ml-64', 'lg:ml-20');
        expandedHeader.classList.add('hidden');
        minimizedHeader.classList.remove('hidden');
        document.querySelectorAll('.nav-text, .bottom-link-text').forEach(el => el.classList.add('hidden'));
    } else {
        sidebar.classList.add('w-64');
        sidebar.classList.remove('w-20');
        contentArea.classList.replace('lg:ml-20', 'lg:ml-64');
        expandedHeader.classList.remove('hidden');
        minimizedHeader.classList.add('hidden');
        document.querySelectorAll('.nav-text, .bottom-link-text').forEach(el => el.classList.remove('hidden'));
    }
}

minimizeBtn.addEventListener('click', () => toggleSidebar(true));
maximizeSidebar.addEventListener('click', () => toggleSidebar(false));
menuToggle.addEventListener('click', () => sidebar.classList.remove('-translate-x-full'));
closeSidebar.addEventListener('click', () => sidebar.classList.add('-translate-x-full'));

const ordersData = {
    'ORD-001': { id: 'ORD-001', customerName: 'John Smith', serviceType: 'Wash & Dry', status: 'pending', date: '2024-01-15', estimated: '2024-01-16 14:00', amount: '$25.00', payment: 'Paid', notes: 'Handle with care. Extra fabric softener.' },
    'ORD-002': { id: 'ORD-002', customerName: 'Khrysha Español', serviceType: 'Wash, Dry & Fold', status: 'in-progress', date: '2024-01-15', estimated: '2024-01-16 16:00', amount: '$35.00', payment: 'Paid', notes: 'Separate whites and colors.' },
    'ORD-003': { id: 'ORD-003', customerName: 'Amber Pagusara', serviceType: 'Iron Only', status: 'ready', date: '2024-01-14', estimated: '2024-01-15 10:00', amount: '$15.00', payment: 'Paid', notes: 'Business shirts - high starch.' },
    'ORD-004': { id: 'ORD-004', customerName: 'Emily Davis', serviceType: 'Full Service', status: 'completed', date: '2024-01-14', estimated: '2024-01-15 12:00', amount: '$45.00', payment: 'Paid', notes: 'Delicate items included.' },
    'ORD-005': { id: 'ORD-005', customerName: 'David Wilson', serviceType: 'Wash & Dry', status: 'in-progress', date: '2024-01-15', estimated: '2024-01-16 15:00', amount: '$28.00', payment: 'Pending', notes: 'Large load - comforters.' },
    'ORD-006': { id: 'ORD-006', customerName: 'Lisa Anderson', serviceType: 'Dry Clean', status: 'pending', date: '2024-01-15', estimated: '2024-01-17 11:00', amount: '$55.00', payment: 'Paid', notes: 'Formal wear - wedding dress.' }
};

function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    Object.values(ordersData).reverse().forEach(order => {
        const row = document.createElement('tr');
        row.className = "hover:bg-white/5 transition duration-150 group";
        row.innerHTML = `
            <td class="py-5 px-2 font-bold text-secondary">#${order.id}</td>
            <td class="py-5 px-2 font-medium">${order.customerName}</td>
            <td class="py-5 px-2 opacity-80">${order.serviceType}</td>
            <td class="py-5 px-2"><span class="status-badge ${order.status}">${order.status.replace('-', ' ')}</span></td>
            <td class="py-5 px-2 text-center">
                <button class="text-secondary opacity-50 group-hover:opacity-100 transition" onclick="openOrderModal('${order.id}')">
                    <i class="fas fa-eye text-lg"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    updateSummaryCards();
}

function updateSummaryCards() {
    const counts = { pending: 0, 'in-progress': 0, ready: 0, completed: 0 };
    Object.values(ordersData).forEach(o => counts[o.status]++);
    
    if(document.getElementById('count-pending')) document.getElementById('count-pending').textContent = counts.pending;
    if(document.getElementById('count-in-progress')) document.getElementById('count-in-progress').textContent = counts['in-progress'];
    if(document.getElementById('count-ready')) document.getElementById('count-ready').textContent = counts.ready;
    if(document.getElementById('count-completed')) document.getElementById('count-completed').textContent = counts.completed;
}

function toggleNewOrderModal() {
    document.getElementById('newOrderModal').classList.toggle('hidden');
}

// Add event listener to the button if it exists
const newOrderBtn = document.querySelector('.new-order-btn');
if(newOrderBtn) {
    newOrderBtn.addEventListener('click', toggleNewOrderModal);
}

function openOrderModal(orderId) {
    const order = ordersData[orderId];
    if (!order) return;
    document.getElementById('modalOrderId').textContent = `Order #${order.id}`;
    document.getElementById('modalCustomerName').textContent = order.customerName;
    document.getElementById('modalServiceType').textContent = order.serviceType;
    document.getElementById('modalDate').textContent = order.date;
    document.getElementById('modalEstimated').textContent = order.estimated;
    document.getElementById('modalAmount').textContent = order.amount;
    document.getElementById('modalNotes').textContent = order.notes;
    const statusElement = document.getElementById('modalStatus');
    statusElement.textContent = order.status.toUpperCase();
    statusElement.className = `status-badge ${order.status}`;
    document.getElementById('orderModal').classList.remove('hidden');
}

function closeOrderModal() { 
    document.getElementById('orderModal').classList.add('hidden'); 
}

const newOrderForm = document.getElementById('newOrderForm');
if(newOrderForm) {
    newOrderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('newCustomerName').value;
        const service = document.getElementById('newServiceType').value;
        const notes = document.getElementById('newNotes').value;
        const weight = document.getElementById('newWeight').value || "0.0";
        const newId = `ORD-00${Object.keys(ordersData).length + 1}`;
        const today = new Date().toISOString().split('T')[0];
        
        ordersData[newId] = {
            id: newId, customerName: name, serviceType: service, status: 'pending',
            date: today, estimated: 'Processing...', amount: `$${(parseFloat(weight) * 5).toFixed(2)}`,
            payment: 'Pending', notes: notes || 'No instructions provided.'
        };
        
        renderOrders();
        this.reset();
        toggleNewOrderModal();
    });
}

document.addEventListener('DOMContentLoaded', renderOrders);
