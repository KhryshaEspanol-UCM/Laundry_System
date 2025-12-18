// Data Object
const ordersData = {
    'ORD-001': { id: 'ORD-001', customerName: 'John Smith', serviceType: 'Wash & Dry', status: 'pending', date: '2024-01-15', estimated: '2024-01-16 14:00', amount: '$25.00', payment: 'Paid', notes: 'Handle with care. Extra fabric softener.' },
    'ORD-002': { id: 'ORD-002', customerName: 'Khrysha Español', serviceType: 'Wash, Dry & Fold', status: 'in-progress', date: '2024-01-15', estimated: '2024-01-16 16:00', amount: '$35.00', payment: 'Paid', notes: 'Separate whites and colors.' },
    'ORD-003': { id: 'ORD-003', customerName: 'Amber Pagusara', serviceType: 'Iron Only', status: 'ready', date: '2024-01-14', estimated: '2024-01-15 10:00', amount: '$15.00', payment: 'Paid', notes: 'Business shirts - high starch.' },
    'ORD-004': { id: 'ORD-004', customerName: 'Emily Davis', serviceType: 'Full Service', status: 'completed', date: '2024-01-14', estimated: '2024-01-15 12:00', amount: '$45.00', payment: 'Paid', notes: 'Delicate items included.' },
    'ORD-005': { id: 'ORD-005', customerName: 'David Wilson', serviceType: 'Wash & Dry', status: 'in-progress', date: '2024-01-15', estimated: '2024-01-16 15:00', amount: '$28.00', payment: 'Pending', notes: 'Large load - comforters.' },
    'ORD-006': { id: 'ORD-006', customerName: 'Lisa Anderson', serviceType: 'Dry Clean', status: 'pending', date: '2024-01-15', estimated: '2024-01-17 11:00', amount: '$55.00', payment: 'Paid', notes: 'Formal wear - wedding dress.' }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
    setupSidebar();
    
    const newOrderBtn = document.querySelector('.new-order-btn');
    if(newOrderBtn) {
        newOrderBtn.addEventListener('click', toggleNewOrderModal);
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
});

function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    Object.values(ordersData).reverse().forEach(order => {
        const row = document.createElement('tr');
        row.className = "hover:bg-white/5 transition duration-150 group";
        row.setAttribute('data-status', order.status);
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

function openOrderModal(orderId) {
    const order = ordersData[orderId];
    if (!order) return;

    document.getElementById('modalOrderId').textContent = `#${order.id}`;
    document.getElementById('modalCustomerName').textContent = order.customerName;
    document.getElementById('modalServiceType').textContent = order.serviceType;
    document.getElementById('modalDate').textContent = order.date;
    document.getElementById('modalEstimated').textContent = order.estimated;
    document.getElementById('modalAmount').textContent = order.amount;
    document.getElementById('modalNotes').textContent = order.notes;

    const statusElement = document.getElementById('modalStatus');
    statusElement.textContent = order.status.toUpperCase();
    statusElement.className = `status-badge ${order.status}`;

    const printBtn = document.querySelector('#orderModal .primary-button');
    
    // FIXED SELECTOR: Only targets the button with "Update Status" text
    const updateBtn = Array.from(document.querySelectorAll('#orderModal button')).find(btn => 
        btn.textContent.includes('Update Status')
    );

    if (printBtn) printBtn.onclick = () => printOrderReceipt(order.id);
    if (updateBtn) updateBtn.onclick = () => promptUpdateStatus(order.id);

    document.getElementById('orderModal').classList.remove('hidden');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.add('hidden');
}

function printOrderReceipt(orderId) {
    const order = ordersData[orderId];
    const printWindow = window.open('', '_blank');
    const content = `
        <html>
        <head>
            <title>Receipt - ${order.id}</title>
            <style>
                body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
                .header { text-align: center; border-bottom: 2px solid #58A5A2; padding-bottom: 10px; margin-bottom: 20px; }
                .row { display: flex; justify-content: space-between; margin: 10px 0; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                .total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #58A5A2; margin-top: 20px; padding-top: 10px; }
            </style>
        </head>
        <body>
            <div class="header"><h1>WASH & FOLD</h1><p>OFFICIAL RECEIPT</p></div>
            <div class="row"><span>Order ID:</span> <span>#${order.id}</span></div>
            <div class="row"><span>Customer:</span> <span>${order.customerName}</span></div>
            <div class="row"><span>Service:</span> <span>${order.serviceType}</span></div>
            <div class="row"><span>Date:</span> <span>${order.date}</span></div>
            <div class="row total"><span>Total Amount:</span> <span>${order.amount}</span></div>
            <p><strong>Notes:</strong><br>${order.notes}</p>
            <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
        </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
}

function promptUpdateStatus(orderId) {
    const validStatuses = ['pending', 'in-progress', 'ready', 'completed'];
    const currentStatus = ordersData[orderId].status;
    const newStatus = prompt(`Enter new status for ${orderId}:\n(pending, in-progress, ready, completed)`, currentStatus);

    if (newStatus && validStatuses.includes(newStatus.toLowerCase())) {
        ordersData[orderId].status = newStatus.toLowerCase();
        renderOrders();
        closeOrderModal();
        alert(`Order ${orderId} updated to ${newStatus.toUpperCase()}`);
    } else if (newStatus) {
        alert("Invalid status! Use: pending, in-progress, ready, or completed.");
    }
}

function toggleNewOrderModal() {
    document.getElementById('newOrderModal').classList.toggle('hidden');
}

function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const contentArea = document.getElementById('content-area');
    const minimizeBtn = document.getElementById('minimizeSidebar');
    const maximizeSidebar = document.getElementById('maximizeSidebar');

    minimizeBtn?.addEventListener('click', () => {
        sidebar.classList.add('w-20'); sidebar.classList.remove('w-64');
        contentArea?.classList.replace('lg:ml-64', 'lg:ml-20');
        document.getElementById('expanded-header')?.classList.add('hidden');
        document.getElementById('minimized-header')?.classList.remove('hidden');
        document.querySelectorAll('.nav-text').forEach(el => el.classList.add('hidden'));
    });

    maximizeSidebar?.addEventListener('click', () => {
        sidebar.classList.add('w-64'); sidebar.classList.remove('w-20');
        contentArea?.classList.replace('lg:ml-20', 'lg:ml-64');
        document.getElementById('expanded-header')?.classList.remove('hidden');
        document.getElementById('minimized-header')?.classList.add('hidden');
        document.querySelectorAll('.nav-text').forEach(el => el.classList.remove('hidden'));
    });
}
