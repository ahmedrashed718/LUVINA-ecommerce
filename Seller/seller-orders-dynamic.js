let currentOrders = [];
function loadSellerOrders() {
    const seller = getCurrentSeller();
    if (!seller) {
        console.error('No seller logged in');
        return;
    }
    console.log('📦 Loading orders for seller:', seller.fullname || seller.email);
    currentOrders = getCurrentSellerOrders();
    console.log('📊 Found', currentOrders.length, 'orders containing seller products');
    displaySellerOrders();
}
function displaySellerOrders() {
    const tbody = document.getElementById('OrdersBody');
    if (!tbody) {
        console.error('OrdersBody element not found');
        return;
    }
    if (currentOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-3"></i>
                    <p class="mt-2">No orders yet</p>
                    <small>Orders containing your products will appear here</small>
                </td>
            </tr>
        `;
        return;
    }
    const seller = getCurrentSeller();
    const sellerId = seller.email;
    tbody.innerHTML = currentOrders.map(order => {
        let sellerTotal = 0;
        let sellerItemCount = 0;
        (order.items || []).forEach(item => {
            if (item.seller && item.seller.id === sellerId) {
                sellerTotal += (item.price || 0) * (item.quantity || 1);
                sellerItemCount++;
            }
        });
        const statusBadge = getStatusBadge(order.status);
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        return `
            <tr>
                <td>${order.orderNumber}</td>
                <td>${order.customerName || 'Unknown'}</td>
                <td>${sellerItemCount}</td>
                <td>${formatCurrency(sellerTotal)}</td>
                <td>${orderDate}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-outline-info view-order-btn" data-order="${order.orderNumber}">
                        <i class="bi bi-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    document.querySelectorAll('.view-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            viewOrderDetails(this.getAttribute('data-order'));
        });
    });
}
function getStatusBadge(status) {
    const badges = {
        'Pending': '<span class="badge bg-warning text-dark">Pending</span>',
        'Processing': '<span class="badge bg-info">Processing</span>',
        'Shipped': '<span class="badge bg-primary">Shipped</span>',
        'Delivered': '<span class="badge bg-success">Delivered</span>',
        'Cancelled': '<span class="badge bg-danger">Cancelled</span>'
    };
    return badges[status] || '<span class="badge bg-secondary">Unknown</span>';
}
function viewOrderDetails(orderNumber) {
    const order = currentOrders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    const seller = getCurrentSeller();
    const sellerId = seller.email;
    const sellerItems = (order.items || []).filter(item => 
        item.seller && item.seller.id === sellerId
    );
    let sellerTotal = 0;
    const itemsHTML = sellerItems.map(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        sellerTotal += itemTotal;
        const imageSrc = item.images && item.images[0] 
            ? item.images[0] 
            : 'https://via.placeholder.com/60';
        const colorName = item.selectedColorName || item.selectedColor || 'N/A';
        const size = item.selectedSize || 'N/A';
        return `
            <tr>
                <td>
                    <img src="${imageSrc}" alt="${item.name}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                </td>
                <td>${item.name}</td>
                <td>${colorName}</td>
                <td>${size}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(itemTotal)}</td>
            </tr>
        `;
    }).join('');
    const modalContent = `
        <div class="row">
            <div class="col-md-6">
                <h6>Order Information</h6>
                <table class="table table-sm">
                    <tr><th>Order Number:</th><td>${order.orderNumber}</td></tr>
                    <tr><th>Customer:</th><td>${order.customerName}</td></tr>
                    <tr><th>Phone:</th><td>${order.phone || 'N/A'}</td></tr>
                    <tr><th>Address:</th><td>${order.address || 'N/A'}</td></tr>
                    <tr><th>Order Date:</th><td>${new Date(order.orderDate).toLocaleString()}</td></tr>
                    <tr><th>Status:</th><td>${getStatusBadge(order.status)}</td></tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6>Your Items from This Order</h6>
                <table class="table table-sm">
                    <tr><th>Your Items:</th><td>${sellerItems.length}</td></tr>
                    <tr><th>Your Revenue:</th><td class="text-success fw-bold">${formatCurrency(sellerTotal)}</td></tr>
                    <tr><th>Total Order:</th><td>${formatCurrency(order.total)}</td></tr>
                    <tr><th>Payment:</th><td>${order.paymentMethod || 'Cash on Delivery'}</td></tr>
                </table>
            </div>
            <div class="col-12 mt-3">
                <h6>Your Products in This Order</h6>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                    <tfoot>
                        <tr class="fw-bold">
                            <td colspan="6" class="text-end">Your Revenue:</td>
                            <td class="text-success">${formatCurrency(sellerTotal)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;
    const modalBody = document.getElementById('orderDetailsModalBody');
    if (modalBody) {
        modalBody.innerHTML = modalContent;
        const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        modal.show();
    } else {
        const tempModal = document.createElement('div');
        tempModal.innerHTML = `
            <div class="modal fade" id="tempOrderModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Order Details - ${order.orderNumber}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">${modalContent}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(tempModal);
        const modal = new bootstrap.Modal(document.getElementById('tempOrderModal'));
        modal.show();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Seller Orders Page - Loading...');
    loadSellerOrders();
});
