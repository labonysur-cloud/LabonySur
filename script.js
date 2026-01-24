document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // LeetCode Stats Fetcher
    // Using a public proxy since direct LeetCode API has CORS
    const leetCodeUsername = 'labony_sur';
    const totalSolvedEl = document.getElementById('lc-total');
    const rankingEl = document.getElementById('lc-ranking');

    if (totalSolvedEl) {
        fetch(`https://leetcode-stats-api.herokuapp.com/${leetCodeUsername}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    totalSolvedEl.innerText = data.totalSolved;
                    rankingEl.innerText = data.ranking || 'N/A';
                } else {
                    totalSolvedEl.innerText = 'Profile Found';
                    rankingEl.innerText = '-';
                }
            })
            .catch(error => {
                console.error('Error fetching LeetCode stats:', error);
                totalSolvedEl.innerText = 'Check Profile';
            });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
