/**
 * LUVINA Products - LocalStorage Manager
 * All products are stored and retrieved from browser localStorage
 * Auto-initializes on first load!
 */

const STORAGE_KEY = 'luvinaProducts';
const INIT_FLAG = 'luvinaProductsInitialized';
let initializationPromise = null;

// ==================== AUTO-INITIALIZATION ====================

/**
 * Auto-initialize localStorage from Products.json if needed
 * This runs automatically on script load
 */
async function autoInitialize() {
    // If already initialized, skip
    if (localStorage.getItem(INIT_FLAG) === 'true') {
        return true;
    }

    console.log('🚀 Auto-initializing products from Products.json...');

    try {
        const response = await fetch('Products.json');
        if (!response.ok) {
            // Try with different path (for pages in subdirectories)
            const response2 = await fetch('../Products.json');
            if (!response2.ok) {
                throw new Error('Products.json not found');
            }
            const products = await response2.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            localStorage.setItem(INIT_FLAG, 'true');
            console.log('✅ Auto-initialized', products.length, 'products!');
            return true;
        }
        
        const products = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        localStorage.setItem(INIT_FLAG, 'true');
        console.log('✅ Auto-initialized', products.length, 'products!');
        return true;
    } catch (error) {
        console.error('❌ Auto-initialization failed:', error);
        return false;
    }
}

// Start auto-initialization immediately when script loads
if (!initializationPromise) {
    initializationPromise = autoInitialize();
}

// ==================== CORE FUNCTIONS ====================

/**
 * Get all products from localStorage
 * Automatically initializes if needed
 */
async function getProducts() {
    // Wait for initialization if in progress
    if (initializationPromise) {
        await initializationPromise;
    }

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

/**
 * Save products to localStorage
 */
function saveProducts(products) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Get product by ID
 */
async function getProductById(id) {
    const products = await getProducts();
    return products.find(p => p.id === parseInt(id));
}

/**
 * Get products by category
 */
async function getProductsByCategory(category) {
    const products = await getProducts();
    return products.filter(p => 
        p.Category && p.Category.toLowerCase() === category.toLowerCase()
    );
}

/**
 * Get products by subcategory
 */
async function getProductsBySubCategory(subCategory) {
    const products = await getProducts();
    return products.filter(p => 
        p.subCategory && p.subCategory.toLowerCase() === subCategory.toLowerCase()
    );
}

/**
 * Search products
 */
async function searchProducts(query) {
    const products = await getProducts();
    const term = query.toLowerCase().trim();
    
    if (!term) return products;
    
    return products.filter(p => 
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(term))
    );
}

/**
 * Add new product
 */
async function addProduct(product) {
    try {
        const products = await getProducts();
        
        // Generate ID if not provided
        if (!product.id) {
            const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
            product.id = maxId + 1;
        }
        
        products.push(product);
        return saveProducts(products);
    } catch (error) {
        console.error('Error adding product:', error);
        return false;
    }
}

/**
 * Update existing product
 */
async function updateProduct(id, updatedData) {
    try {
        const products = await getProducts();
        const index = products.findIndex(p => p.id === parseInt(id));
        
        if (index === -1) return false;
        
        products[index] = { ...products[index], ...updatedData };
        return saveProducts(products);
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
}

/**
 * Delete product
 */
async function deleteProduct(id) {
    try {
        let products = await getProducts();
        products = products.filter(p => p.id !== parseInt(id));
        return saveProducts(products);
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

/**
 * Check if products are initialized
 */
function isStorageInitialized() {
    return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Get total products count
 */
async function getProductsCount() {
    const products = await getProducts();
    return products.length;
}

/**
 * Clear all products (use with caution!)
 */
function clearAllProducts() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

