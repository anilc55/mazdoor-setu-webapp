// Navigation Functions
function openPage(page) {
    switch(page) {
        case 'info':
            window.location.href = 'info.html';
            break;
        case 'search-mazdoor':
            window.location.href = 'search-mazdoor.html';
            break;
        case 'search-room':
            window.location.href = 'search-room.html';
            break;
        case 'post-ad':
            window.location.href = 'post-ad.html';
            break;
        case 'profile':
            window.location.href = 'profile.html';
            break;
    }
}

function toggleMenu() {
    const menu = document.getElementById('side-menu');
    menu.classList.toggle('active');
}

function goToProfile() {
    const userRole = localStorage.getItem('userRole') || 'guest';
    
    switch(userRole) {
        case 'mazdoor':
            window.location.href = '../dashboard/mazdoor.html';
            break;
        case 'contractor':
            window.location.href = '../dashboard/contractor.html';
            break;
        case 'owner':
            window.location.href = '../dashboard/owner.html';
            break;
        default:
            window.location.href = 'profile.html';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userMode');
    window.location.href = '../index.html';
}

// Check Login Status
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userMode = localStorage.getItem('userMode');
    
    if (!isLoggedIn && userMode !== 'guest') {
        window.location.href = '../index.html';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Add animation to petals
    const petals = document.querySelectorAll('.petal-btn');
    petals.forEach((petal, index) => {
        setTimeout(() => {
            petal.style.opacity = '1';
            petal.style.transform = petal.style.transform + ' scale(1)';
        }, index * 100);
    });
});
