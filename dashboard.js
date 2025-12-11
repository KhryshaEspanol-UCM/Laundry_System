document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');

    // Sidebar toggle
    menuToggle.addEventListener('click', () => sidebar.classList.remove('-translate-x-full'));
    closeSidebar.addEventListener('click', () => sidebar.classList.add('-translate-x-full'));

    // Quick action cards
    const quickActionCards = document.querySelectorAll('.col-span-12 > section:nth-child(1) > div:nth-child(3) > div');
    quickActionCards.forEach(card => {
        card.addEventListener('click', () => window.location.href = 'orders.html');
    });


    // Charts
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [
                { label: '2023', data: [80,55,60,40,75,50,85,45,65,90,70,80], borderColor:'#6A5ACD', backgroundColor:'#6A5ACD10', fill:true, tension:0.4 },
                { label: '2024', data: [65,80,70,50,60,45,70,85,40,75,55,95], borderColor:'#3CB371', backgroundColor:'#3CB37110', fill:true, tension:0.4 },
                { label: '2025', data: [90,70,85,65,40,75,95,50,80,60,75,90], borderColor:'#FF6347', backgroundColor:'#FF634710', fill:true, tension:0.4 }
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom' } }, scales:{ y:{ beginAtZero:true } } }
    });

    const spendingCtx = document.getElementById('spendingChart').getContext('2d');
    new Chart(spendingCtx, {
        type:'bar',
        data:{
            labels:['Week 1','Week 2','Week 3','Week 4'],
            datasets:[{
                label:'Orders',
                data:[4,6,5,3],
                backgroundColor:'rgba(95,158,160,0.8)',
                borderColor:'rgba(95,158,160,1)',
                borderWidth:1,
                borderRadius:6
            }]
        },
        options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true, display:false, max:7 }, x:{ grid:{display:false}, ticks:{ font:{size:10} } } } }
    });
});