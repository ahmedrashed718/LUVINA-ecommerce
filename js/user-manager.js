// User Management System for LUVINA E-Commerce

// Initialize Admin Account on first load
function initializeAdminAccount() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if admin already exists
    const adminExists = users.some(user => user.accountType === 'admin');
    
    if (!adminExists) {
        // Create default admin account
        const adminAccount = {
            fullname: 'Rashed Admin',
            phone: '01000000000',
            email: 'rashed@admin.com',
            password: 'rashed123',
            accountType: 'admin',
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        
        users.push(adminAccount);
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('✅ Admin account initialized');
        console.log('Email: rashed@admin.com');
        console.log('Password: rashed123');
        return adminAccount;
    }
    
    return null;
}

// Get all users
function getAllUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Get users by type
function getUsersByType(accountType) {
    const users = getAllUsers();
    return users.filter(user => user.accountType === accountType);
}

// Get user by email
function getUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email === email);
}

// Update user status
function updateUserStatus(email, newStatus) {
    const users = getAllUsers();
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex !== -1) {
        users[userIndex].status = newStatus;
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    
    return false;
}

// Delete user
function deleteUser(email) {
    const users = getAllUsers();
    const filteredUsers = users.filter(user => user.email !== email);
    
    if (filteredUsers.length < users.length) {
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        return true;
    }
    
    return false;
}

// Update user info
function updateUser(email, updates) {
    const users = getAllUsers();
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    
    return false;
}

// Get account type badge color
function getAccountTypeBadge(accountType) {
    const badges = {
        'admin': 'bg-danger',
        'business': 'bg-primary',
        'customer': 'bg-success'
    };
    return badges[accountType] || 'bg-secondary';
}

// Get status badge color
function getStatusBadge(status) {
    const badges = {
        'active': 'bg-success',
        'suspended': 'bg-danger',
        'pending': 'bg-warning'
    };
    return badges[status] || 'bg-secondary';
}

// Check if user is admin
function isAdmin() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser && loggedInUser.accountType === 'admin';
}

// Check if user is business
function isBusiness() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser && loggedInUser.accountType === 'business';
}

// Format date
function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Initialize admin on page load
if (typeof window !== 'undefined') {
    initializeAdminAccount();
}

