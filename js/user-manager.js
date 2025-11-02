function initializeAdminAccount() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.some(user => user.accountType === 'admin');
    if (!adminExists) {
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
function getAllUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}
function getUsersByType(accountType) {
    const users = getAllUsers();
    return users.filter(user => user.accountType === accountType);
}
function getUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email === email);
}
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
function deleteUser(email) {
    const users = getAllUsers();
    const filteredUsers = users.filter(user => user.email !== email);
    if (filteredUsers.length < users.length) {
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        return true;
    }
    return false;
}
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
function getAccountTypeBadge(accountType) {
    const badges = {
        'admin': 'bg-danger',
        'business': 'bg-primary',
        'customer': 'bg-success'
    };
    return badges[accountType] || 'bg-secondary';
}
function getStatusBadge(status) {
    const badges = {
        'active': 'bg-success',
        'suspended': 'bg-danger',
        'pending': 'bg-warning'
    };
    return badges[status] || 'bg-secondary';
}
function isAdmin() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser && loggedInUser.accountType === 'admin';
}
function isBusiness() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser && loggedInUser.accountType === 'business';
}
function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
if (typeof window !== 'undefined') {
    initializeAdminAccount();
}
