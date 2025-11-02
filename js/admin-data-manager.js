function getAdminDashboardStats() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('luvinaProducts')) || [];
    const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
    const customers = users.filter(u => u.accountType === 'customer').length;
    const businessUsers = users.filter(u => u.accountType === 'business').length;
    const admins = users.filter(u => u.accountType === 'admin').length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = orders.filter(o => new Date(o.orderDate) >= sevenDaysAgo);
    return {
        orders: {
            total: orders.length,
            pending: pendingOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
            thisWeek: recentOrders.length
        },
        sales: {
            total: totalSales,
            thisWeek: recentOrders.reduce((sum, order) => sum + (order.total || 0), 0),
            average: orders.length > 0 ? (totalSales / orders.length).toFixed(2) : 0
        },
        users: {
            total: users.length,
            customers: customers,
            business: businessUsers,
            admins: admins,
            newThisWeek: users.filter(u => new Date(u.createdAt) >= sevenDaysAgo).length
        },
        products: {
            total: products.length,
            available: products.filter(p => p.stock > 0).length,
            outOfStock: products.filter(p => p.stock === 0).length
        }
    };
}
function getAllOrdersForAdmin() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}
function getRecentOrders(limit = 10) {
    const orders = getAllOrdersForAdmin();
    return orders
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, limit);
}
function getOrdersByStatus(status) {
    const orders = getAllOrdersForAdmin();
    return orders.filter(o => o.status === status);
}
function updateOrderStatusAdmin(orderNumber, newStatus) {
    const orders = getAllOrdersForAdmin();
    const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        orders[orderIndex].lastUpdated = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        return true;
    }
    return false;
}
function getAllBusinessAccounts() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.filter(u => u.accountType === 'business');
}
function getRecentRegistrations(days = 7) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return users.filter(u => new Date(u.createdAt) >= cutoffDate)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
function getSalesChartData() {
    const orders = getAllOrdersForAdmin();
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(dateStr);
        const dayOrders = orders.filter(o => {
            const orderDate = new Date(o.orderDate);
            return orderDate.toDateString() === date.toDateString();
        });
        const dayTotal = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        data.push(dayTotal);
    }
    return { labels, data };
}
function getOrdersStatusChartData() {
    const orders = getAllOrdersForAdmin();
    return {
        labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        data: [
            orders.filter(o => o.status === 'Pending').length,
            orders.filter(o => o.status === 'Processing').length,
            orders.filter(o => o.status === 'Shipped').length,
            orders.filter(o => o.status === 'Delivered').length,
            orders.filter(o => o.status === 'Cancelled').length
        ]
    };
}
function formatCurrency(amount) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' EGP';
}
function formatDateAdmin(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function getOrderDetails(orderNumber) {
    const orders = getAllOrdersForAdmin();
    return orders.find(o => o.orderNumber === orderNumber);
}
function deleteOrderAdmin(orderNumber) {
    const orders = getAllOrdersForAdmin();
    const filteredOrders = orders.filter(o => o.orderNumber !== orderNumber);
    if (filteredOrders.length < orders.length) {
        localStorage.setItem('orders', JSON.stringify(filteredOrders));
        return true;
    }
    return false;
}
function searchOrders(query) {
    const orders = getAllOrdersForAdmin();
    const lowerQuery = query.toLowerCase();
    return orders.filter(o => 
        o.orderNumber.toLowerCase().includes(lowerQuery) ||
        o.customerName.toLowerCase().includes(lowerQuery) ||
        o.email.toLowerCase().includes(lowerQuery)
    );
}
function getTopCustomers(limit = 5) {
    const orders = getAllOrdersForAdmin();
    const customerOrders = {};
    orders.forEach(order => {
        const email = order.email;
        if (!customerOrders[email]) {
            customerOrders[email] = {
                name: order.customerName,
                email: email,
                orders: 0,
                totalSpent: 0
            };
        }
        customerOrders[email].orders++;
        customerOrders[email].totalSpent += order.total || 0;
    });
    return Object.values(customerOrders)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, limit);
}
if (typeof window !== 'undefined') {
    window.adminDataManager = {
        getAdminDashboardStats,
        getAllOrdersForAdmin,
        getRecentOrders,
        getOrdersByStatus,
        updateOrderStatusAdmin,
        getAllBusinessAccounts,
        getRecentRegistrations,
        getSalesChartData,
        getOrdersStatusChartData,
        formatCurrency,
        formatDateAdmin,
        getOrderDetails,
        deleteOrderAdmin,
        searchOrders,
        getTopCustomers
    };
}
