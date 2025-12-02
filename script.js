// ================= STAR RATING SYSTEM =================

let starRatings = [0, 0, 0, 0, 0];

function initializeStarRating() {
    const starRatingGrid = document.getElementById('starRatingGrid');

    for (let row = 0; row < 5; row++) {
        const starRow = document.createElement('div');
        starRow.className = 'star-row';
        starRow.dataset.row = row;

        for (let star = 0; star < 5; star++) {
            const starElement = document.createElement('i');
            starElement.className = 'fas fa-star star';
            starElement.dataset.row = row;
            starElement.dataset.star = star + 1;

            starElement.addEventListener('click', () => setStarRating(row, star + 1));
            starElement.addEventListener('mouseenter', () => highlightStars(row, star + 1));

            starRow.appendChild(starElement);
        }

        starRow.addEventListener('mouseleave', () => resetStarHighlight(row));
        starRatingGrid.appendChild(starRow);
    }
}

function setStarRating(row, rating) {
    starRatings[row] = rating;
    updateStarDisplay(row);
}

function highlightStars(row, rating) {
    const stars = document.querySelectorAll(`.star[data-row="${row}"]`);
    stars.forEach((star, i) => {
        star.style.color = i < rating ? '#f39c12' : '#7f8c8d';
    });
}

function resetStarHighlight(row) {
    updateStarDisplay(row);
}

function updateStarDisplay(row) {
    const stars = document.querySelectorAll(`.star[data-row="${row}"]`);
    const rating = starRatings[row];

    stars.forEach((star, i) => {
        star.style.color = i < rating ? '#f1c40f' : '#7f8c8d';
    });
}

function submitRating() {
    const totalRatings = starRatings.filter(r => r > 0).length;

    if (!totalRatings) {
        alert('Please select at least one rating before submitting.');
        return;
    }

    const average = starRatings.reduce((a, b) => a + b, 0) / 5;
    alert(`Thank you! Average rating: ${average.toFixed(1)} stars`);

    starRatings = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) updateStarDisplay(i);
}

// ================= MODALS =================

function openMembershipModal() {
    const modal = document.getElementById('membershipModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeMembershipModal() {
    const modal = document.getElementById('membershipModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';

    const form = document.getElementById('membershipForm');
    if (form) form.reset();
}

function openConfirmationModal() {
    document.getElementById('confirmationModal').classList.add('show');
}

function closeConfirmationModal() {
    document.getElementById('confirmationModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ================= CHARTS =================

function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js library not loaded.');
        return;
    }

    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        try {
            new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Sales ($)',
                        data: [1200, 1900, 3000, 5000, 2000, 3000],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { ticks: { color: '#bdc3c7' } },
                        y: { ticks: { color: '#bdc3c7' } }
                    }
                }
            });
        } catch (e) {
            console.error('Sales chart error:', e);
        }
    }

    // Spending Chart
    const spendingCtx = document.getElementById('spendingChart');
    if (spendingCtx) {
        try {
            new Chart(spendingCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Washing', 'Drying', 'Ironing', 'Special Services'],
                    datasets: [{
                        data: [400, 300, 350, 200],
                        backgroundColor: ['#3498db', '#27ae60', '#f39c12', '#e74c3c'],
                        borderWidth: 0
                    }]
                }
            });
        } catch (e) {
            console.error('Spending chart error:', e);
        }
    }
}

// ================= LOADING ANIMATION =================

function showLoadingAnimation() {
    document.querySelectorAll('.chart-container, .spending-chart').forEach(container => {
        container.style.position = 'relative';

        const loader = document.createElement('div');
        loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loader.className = 'chart-loader';
        loader.style.cssText = `
            position:absolute; top:50%; left:50%;
            transform:translate(-50%, -50%);
            color:#bdc3c7; font-size:14px;
        `;

        container.appendChild(loader);

        setTimeout(() => loader.remove(), 1000);
    });
}

// ================= MAIN DOM LOADED =================

document.addEventListener('DOMContentLoaded', () => {

    initializeStarRating();
    showLoadingAnimation();
    setTimeout(initializeCharts, 500);

    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        membershipForm.addEventListener('submit', e => {
            e.preventDefault();

            const data = new FormData(membershipForm);
            if (!data.get('fullName') || !data.get('contactNumber')) {
                alert('Please fill in required fields.');
                return;
            }

            closeMembershipModal();
            setTimeout(openConfirmationModal, 300);
        });
    }

    // Click outside modals
    document.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) {
            if (e.target.id === 'membershipModal') closeMembershipModal();
            if (e.target.id === 'confirmationModal') closeConfirmationModal();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeMembershipModal();
            closeConfirmationModal();
        }
    });
});
