// Initialize chart
document.addEventListener('DOMContentLoaded', function() {
    const ctxElement = document.getElementById('testChart');
    if (ctxElement) {
        const ctx = ctxElement.getContext('2d');
        const testChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [78, 22],
                    backgroundColor: [
                        '#f97316',
                        '#e5e7eb'
                    ],
                    borderWidth: 0,
                    cutout: '80%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }

    // Random student data for demo
    const studentNames = ["Nguyễn Thị Mai", "Trần Văn An", "Lê Thị Bình", "Phạm Hồng Đức", "Hoàng Minh Khôi"];
    const studentClasses = ["12A1", "12A2", "12B1", "12B2", "12C1"];
    const studentPoints = [1245, 987, 1560, 1120, 1345];
    
    // Change student data every 5 seconds for demo
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * studentNames.length);
        const studentNameElement = document.getElementById('student-name');
        const studentClassElement = document.getElementById('student-class');
        const studentPointsElement = document.getElementById('student-points');
        const profileAvatarElement = document.getElementById('profile-avatar');

        if (studentNameElement) studentNameElement.textContent = studentNames[randomIndex];
        if (studentClassElement) studentClassElement.textContent = studentClasses[randomIndex];
        if (studentPointsElement) studentPointsElement.textContent = studentPoints[randomIndex].toLocaleString();
        
        // Change avatar randomly
        if (profileAvatarElement) {
            const gender = randomIndex % 2 === 0 ? 'women' : 'men';
            const randomId = Math.floor(Math.random() * 100);
            profileAvatarElement.src = `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`;
        }
    }, 5000);
});
