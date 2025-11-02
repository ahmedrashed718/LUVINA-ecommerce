function getSellerOrders(sellerId) {
    try {
        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        return allOrders.filter(order => {
            if (!order.items || !Array.isArray(order.items)) return false;
            return order.items.some(item => {
                return item.seller && item.seller.id === sellerId;
            });
        });
    } catch (error) {
        console.error('Error getting seller orders:', error);
        return [];
    }
}
function getCurrentSellerOrders() {
    const seller = getCurrentSeller();
    if (!seller) {
        console.warn('No seller logged in');
        return [];
    }
    return getSellerOrders(seller.email);
}
function getSellerRevenue(sellerId) {
    try {
        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        let totalRevenue = 0;
        allOrders.forEach(order => {
            if (!order.items || !Array.isArray(order.items)) return;
            order.items.forEach(item => {
                if (item.seller && item.seller.id === sellerId) {
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    totalRevenue += itemTotal;
                }
            });
        });
        return totalRevenue;
    } catch (error) {
        console.error('Error calculating seller revenue:', error);
        return 0;
    }
}
function getCurrentSellerRevenue() {
    const seller = getCurrentSeller();
    if (!seller) return 0;
    return getSellerRevenue(seller.email);
}
function getSellerRecentOrders(sellerId, limit = 10) {
    const sellerOrders = getSellerOrders(sellerId);
    return sellerOrders
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, limit);
}
function getSellerPendingOrders(sellerId) {
    const sellerOrders = getSellerOrders(sellerId);
    return sellerOrders.filter(order => 
        order.status === 'Pending' || order.status === 'Processing'
    );
}
function getSellerDashboardStats() {
    const seller = getCurrentSeller();
    if (!seller) {
        console.error('No seller logged in');
        return null;
    }
    const sellerId = seller.email;
    const sellerProducts = getCurrentSellerProducts();
    const sellerOrders = getSellerOrders(sellerId);
    const sellerRevenue = getSellerRevenue(sellerId);
    const pendingOrders = sellerOrders.filter(o => 
        o.status === 'Pending' || o.status === 'Processing'
    ).length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thisWeekOrders = sellerOrders.filter(o => 
        new Date(o.orderDate) >= sevenDaysAgo
    );
    const thisWeekRevenue = thisWeekOrders.reduce((sum, order) => {
        let orderTotal = 0;
        (order.items || []).forEach(item => {
            if (item.seller && item.seller.id === sellerId) {
                orderTotal += (item.price || 0) * (item.quantity || 1);
            }
        });
        return sum + orderTotal;
    }, 0);
    const approvedProducts = sellerProducts.filter(p => p.status === 'approved').length;
    const pendingProducts = sellerProducts.filter(p => p.status === 'pending').length;
    const rejectedProducts = sellerProducts.filter(p => p.status === 'rejected').length;
    return {
        orders: {
            total: sellerOrders.length,
            pending: pendingOrders,
            thisWeek: thisWeekOrders.length
        },
        sales: {
            total: sellerRevenue,
            thisWeek: thisWeekRevenue,
            average: sellerOrders.length > 0 ? (sellerRevenue / sellerOrders.length) : 0
        },
        products: {
            total: sellerProducts.length,
            approved: approvedProducts,
            pending: pendingProducts,
            rejected: rejectedProducts
        }
    };
}
function getSellerSalesChartData() {
    const seller = getCurrentSeller();
    if (!seller) return { labels: [], data: [] };
    const sellerId = seller.email;
    const sellerOrders = getSellerOrders(sellerId);
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(dateStr);
        const dayOrders = sellerOrders.filter(o => {
            const orderDate = new Date(o.orderDate);
            return orderDate.toDateString() === date.toDateString();
        });
        const dayTotal = dayOrders.reduce((sum, order) => {
            let orderTotal = 0;
            (order.items || []).forEach(item => {
                if (item.seller && item.seller.id === sellerId) {
                    orderTotal += (item.price || 0) * (item.quantity || 1);
                }
            });
            return sum + orderTotal;
        }, 0);
        data.push(dayTotal);
    }
    return { labels, data };
}
function getSellerBestSellers(limit = 5) {
    const seller = getCurrentSeller();
    if (!seller) return [];
    const sellerId = seller.email;
    const sellerOrders = getSellerOrders(sellerId);
    const productSales = {};
    sellerOrders.forEach(order => {
        (order.items || []).forEach(item => {
            if (item.seller && item.seller.id === sellerId) {
                const productId = item.id;
                if (!productSales[productId]) {
                    productSales[productId] = {
                        ...item,
                        totalSold: 0,
                        totalRevenue: 0
                    };
                }
                productSales[productId].totalSold += item.quantity || 1;
                productSales[productId].totalRevenue += (item.price || 0) * (item.quantity || 1);
            }
        });
    });
    return Object.values(productSales)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, limit);
}
function formatCurrency(amount) {
    return amount.toLocaleString('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }) + ' EGP';
}
if (typeof window !== 'undefined') {
    window.sellerDataManager = {
        getSellerOrders,
        getCurrentSellerOrders,
        getSellerRevenue,
        getCurrentSellerRevenue,
        getSellerRecentOrders,
        getSellerPendingOrders,
        getSellerDashboardStats,
        getSellerSalesChartData,
        getSellerBestSellers,
        formatCurrency
    };
}
