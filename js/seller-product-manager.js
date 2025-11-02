const SELLER_PRODUCTS_KEY = 'sellerProducts';
const SELLER_SESSION_KEY = 'loggedInUser';
function getCurrentSeller() {
    const sellerData = localStorage.getItem(SELLER_SESSION_KEY);
    const user = sellerData ? JSON.parse(sellerData) : null;
    if (user && (user.accountType === 'business' || user.accountType === 'admin')) {
        return user;
    }
    return null;
}
function setCurrentSeller(seller) {
    localStorage.setItem(SELLER_SESSION_KEY, JSON.stringify(seller));
}
function clearSellerSession() {
    localStorage.removeItem(SELLER_SESSION_KEY);
    localStorage.removeItem('isLoggedIn');
}
function isSellerLoggedIn() {
    const seller = getCurrentSeller();
    return seller !== null && (seller.accountType === 'business' || seller.accountType === 'admin');
}
function getAllSellerProducts() {
    try {
        const data = localStorage.getItem(SELLER_PRODUCTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading seller products:', error);
        return [];
    }
}
function getSellerProductsBySellerId(sellerId) {
    const allProducts = getAllSellerProducts();
    return allProducts.filter(p => p.sellerId === sellerId);
}
function getCurrentSellerProducts() {
    const seller = getCurrentSeller();
    if (!seller) {
        console.warn('No seller logged in');
        return [];
    }
    return getSellerProductsBySellerId(seller.email);
}
function saveAllSellerProducts(products) {
    try {
        localStorage.setItem(SELLER_PRODUCTS_KEY, JSON.stringify(products));
        return true;
    } catch (error) {
        console.error('Error saving seller products:', error);
        return false;
    }
}
function addSellerProduct(product) {
    try {
        const seller = getCurrentSeller();
        if (!seller) {
            console.error('No seller logged in');
            return false;
        }
        const allProducts = getAllSellerProducts();
        if (!product.id) {
            const maxId = allProducts.length > 0 
                ? Math.max(...allProducts.map(p => p.id || 0)) 
                : 1000;
            product.id = maxId + 1;
        }
        const newProduct = {
            ...product,
            sellerId: seller.email,
            sellerName: seller.fullname || seller.email,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        allProducts.push(newProduct);
        return saveAllSellerProducts(allProducts);
    } catch (error) {
        console.error('Error adding seller product:', error);
        return false;
    }
}
function updateSellerProduct(productId, updatedData) {
    try {
        const seller = getCurrentSeller();
        if (!seller) {
            console.error('No seller logged in');
            return false;
        }
        const allProducts = getAllSellerProducts();
        const index = allProducts.findIndex(p => 
            p.id === productId && p.sellerId === seller.email
        );
        if (index === -1) {
            console.error('Product not found or unauthorized');
            return false;
        }
        allProducts[index] = {
            ...allProducts[index],
            ...updatedData,
            updatedAt: new Date().toISOString(),
            status: allProducts[index].status === 'approved' ? 'pending' : allProducts[index].status
        };
        return saveAllSellerProducts(allProducts);
    } catch (error) {
        console.error('Error updating seller product:', error);
        return false;
    }
}
function deleteSellerProduct(productId) {
    try {
        const seller = getCurrentSeller();
        if (!seller) {
            console.error('No seller logged in');
            return false;
        }
        const allProducts = getAllSellerProducts();
        const filtered = allProducts.filter(p => 
            !(p.id === productId && p.sellerId === seller.email)
        );
        if (filtered.length === allProducts.length) {
            console.error('Product not found or unauthorized');
            return false;
        }
        return saveAllSellerProducts(filtered);
    } catch (error) {
        console.error('Error deleting seller product:', error);
        return false;
    }
}
async function approveSellerProduct(productId) {
    try {
        const allSellerProducts = getAllSellerProducts();
        const productIndex = allSellerProducts.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            console.error('Seller product not found');
            return false;
        }
        const product = allSellerProducts[productIndex];
        allSellerProducts[productIndex].status = 'approved';
        allSellerProducts[productIndex].approvedAt = new Date().toISOString();
        saveAllSellerProducts(allSellerProducts);
        const mainProducts = await getProducts();
        const existsInMain = mainProducts.some(p => p.id === product.id);
        if (!existsInMain) {
            const mainProduct = {
                id: product.id,
                name: product.name,
                Category: product.Category,
                subCategory: product.subCategory,
                price: product.price,
                stock: product.stock,
                description: product.description,
                colors: product.colors,
                sizes: product.sizes,
                rating: product.rating || 4.5,
                images: product.images,
                seller: {
                    id: product.sellerId,
                    name: product.sellerName
                }
            };
            mainProducts.push(mainProduct);
            saveProducts(mainProducts);
        }
        console.log('✅ Product approved and added to main catalog');
        return true;
    } catch (error) {
        console.error('Error approving seller product:', error);
        return false;
    }
}
function rejectSellerProduct(productId, reason = '') {
    try {
        const allProducts = getAllSellerProducts();
        const index = allProducts.findIndex(p => p.id === productId);
        if (index === -1) {
            console.error('Product not found');
            return false;
        }
        allProducts[index].status = 'rejected';
        allProducts[index].rejectedAt = new Date().toISOString();
        allProducts[index].rejectionReason = reason;
        return saveAllSellerProducts(allProducts);
    } catch (error) {
        console.error('Error rejecting seller product:', error);
        return false;
    }
}
function getPendingSellerProducts() {
    const allProducts = getAllSellerProducts();
    return allProducts.filter(p => p.status === 'pending');
}
function getApprovedSellerProducts() {
    const allProducts = getAllSellerProducts();
    return allProducts.filter(p => p.status === 'approved');
}
function getRejectedSellerProducts() {
    const allProducts = getAllSellerProducts();
    return allProducts.filter(p => p.status === 'rejected');
}
function getSellerStats() {
    const seller = getCurrentSeller();
    if (!seller) return null;
    const sellerId = seller.email;
    const sellerProducts = getSellerProductsBySellerId(sellerId);
    return {
        totalProducts: sellerProducts.length,
        pendingProducts: sellerProducts.filter(p => p.status === 'pending').length,
        approvedProducts: sellerProducts.filter(p => p.status === 'approved').length,
        rejectedProducts: sellerProducts.filter(p => p.status === 'rejected').length
    };
}
if (typeof window !== 'undefined') {
    window.sellerProductManager = {
        getCurrentSeller,
        setCurrentSeller,
        clearSellerSession,
        isSellerLoggedIn,
        getCurrentSellerProducts,
        addSellerProduct,
        updateSellerProduct,
        deleteSellerProduct,
        getSellerStats,
        getAllSellerProducts,
        getSellerProductsBySellerId,
        approveSellerProduct,
        rejectSellerProduct,
        getPendingSellerProducts,
        getApprovedSellerProducts,
        getRejectedSellerProducts
    };
}
