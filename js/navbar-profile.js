document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && loggedInUser) {
        setupProfileDropdown(loggedInUser);
    }
});
function setupProfileDropdown(user) {
    const profileLinks = document.querySelectorAll('a[href*="ProfilePage.html"]');
    profileLinks.forEach(profileLink => {
        if (user.accountType === 'admin') {
            createAdminDropdown(profileLink);
        }
        else if (user.accountType === 'business') {
            createSellerDropdown(profileLink);
        }
    });
}
function createAdminDropdown(profileLink) {
    const parent = profileLink.parentElement;
    const dropdownDiv = document.createElement('div');
    dropdownDiv.className = 'dropdown';
    dropdownDiv.innerHTML = `
        <a class="icon-btn position-relative dropdown-toggle" href="#" role="button" 
           id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person fs-4"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                  style="font-size: 9px;">
                Admin
            </span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            <li><h6 class="dropdown-header">Admin Account</h6></li>
            <li><a class="dropdown-item" href="${getProfilePath()}">
                <i class="bi bi-person-circle me-2"></i>My Profile
            </a></li>
            <li><a class="dropdown-item" href="${getAdminPanelPath()}">
                <i class="bi bi-speedometer2 me-2"></i>Admin Panel
            </a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" onclick="logoutUser()">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
            </a></li>
        </ul>
    `;
    parent.replaceChild(dropdownDiv, profileLink);
}
function createSellerDropdown(profileLink) {
    const parent = profileLink.parentElement;
    const dropdownDiv = document.createElement('div');
    dropdownDiv.className = 'dropdown';
    dropdownDiv.innerHTML = `
        <a class="icon-btn position-relative dropdown-toggle" href="#" role="button" 
           id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person fs-4"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" 
                  style="font-size: 9px;">
                Seller
            </span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            <li><h6 class="dropdown-header">Seller Account</h6></li>
            <li><a class="dropdown-item" href="${getProfilePath()}">
                <i class="bi bi-person-circle me-2"></i>My Profile
            </a></li>
            <li><a class="dropdown-item" href="${getSellerPanelPath()}">
                <i class="bi bi-shop me-2"></i>Seller Panel
            </a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" onclick="logoutUser()">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
            </a></li>
        </ul>
    `;
    parent.replaceChild(dropdownDiv, profileLink);
}
function getProfilePath() {
    if (window.location.pathname.includes('/pages/')) {
        return './ProfilePage.html';
    } else {
        return './pages/ProfilePage.html';
    }
}
function getAdminPanelPath() {
    if (window.location.pathname.includes('/pages/')) {
        return '../admin/dashboard .html';
    } else if (window.location.pathname.includes('/admin/')) {
        return './dashboard .html';
    } else {
        return './admin/dashboard .html';
    }
}
function getSellerPanelPath() {
    if (window.location.pathname.includes('/pages/')) {
        return '../Seller/sellerDashboard.html';
    } else if (window.location.pathname.includes('/Seller/')) {
        return './sellerDashboard.html';
    } else {
        return './Seller/sellerDashboard.html';
    }
}
function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = getLoginPath();
    }
}
function getLoginPath() {
    if (window.location.pathname.includes('/pages/')) {
        return './Login-Customer.html';
    } else if (window.location.pathname.includes('/admin/')) {
        return '../pages/Login-Customer.html';
    } else if (window.location.pathname.includes('/Seller/')) {
        return '../pages/Login-Customer.html';
    } else {
        return './pages/Login-Customer.html';
    }
}
