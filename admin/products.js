// products.js

const addProductBtn = document.getElementById("addProductBtn");
const productForm = document.getElementById("productForm");
const productTable = document.getElementById("ProductTable");
const productsBody = document.getElementById("ProductsBody");
const cancelBtn = document.querySelector(".btn-cancel");
const form = productForm.querySelector("form");

// متغير لتخزين المنتجات
let products = [];

// دالة لتحميل البيانات من ملف JSON
async function loadProductsFromJSON() {
    try {
        const response = await fetch('../products.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        // عرض رسالة خطأ للمستخدم
        productsBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Failed to load products. Please try again later.
                </td>
            </tr>
        `;
    }
}

// دالة لعرض المنتجات في الجدول
function displayProducts() {
    productsBody.innerHTML = '';
    
    if (products.length === 0) {
        productsBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="bi bi-inbox me-2"></i>
                    No products found.
                </td>
            </tr>
        `;
        return;
    }
    
    products.forEach(product => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${parseFloat(product.price).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${product.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        productsBody.appendChild(newRow);
    });
    
    // إضافة مستمعي الأحداث للأزرار الديناميكية
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

// دالة لتحرير منتج
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // تعبئة النموذج ببيانات المنتج
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("stock").value = product.stock;
    document.getElementById("description").value = product.description;
    document.getElementById("category").value = product.category;
    
    // تحديث الفئات الفرعية
    updateSubCategories();
    document.getElementById("subCategory").value = product.subCategory;
    
    // إظهار النموذج
    productTable.classList.add("d-none");
    productForm.classList.remove("d-none");
    
    // تغيير نص الزر
    const submitBtn = productForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fa-solid fa-upload me-2"></i>Update Product';
    
    // إضافة معرف المنتج للتحرير كنوع مخفي
    let hiddenInput = document.getElementById('editingProductId');
    if (!hiddenInput) {
        hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'editingProductId';
        form.appendChild(hiddenInput);
    }
    hiddenInput.value = productId;
}

// دالة لحذف منتج
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        displayProducts();
        alert('Product deleted successfully!');
    }
}

// عند فتح الصفحة -> تحميل البيانات من JSON
document.addEventListener('DOMContentLoaded', () => {
    productForm.classList.add("d-none");
    productTable.classList.remove("d-none");
    loadProductsFromJSON();
});

// عند الضغط على Add New Product -> إظهار الفورم
addProductBtn.addEventListener("click", () => {
    productTable.classList.add("d-none");
    productForm.classList.remove("d-none");
    
    // إعادة تعيين النموذج
    form.reset();
    
    // إزالة معرف المنتج للتحرير إذا كان موجودًا
    const hiddenInput = document.getElementById('editingProductId');
    if (hiddenInput) {
        hiddenInput.remove();
    }
    
    // إعادة تعيين نص الزر
    const submitBtn = productForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fa-solid fa-upload me-2"></i>Upload Product';
});

// عند الضغط على Cancel -> إخفاء الفورم وإظهار الجدول
cancelBtn.addEventListener("click", () => {
    productForm.classList.add("d-none");
    productTable.classList.remove("d-none");
    form.reset();
});

// عند إرسال الفورم
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // جمع البيانات من الحقول
    const id = parseInt(document.getElementById("productId").value);
    const name = document.getElementById("productName").value;
    const category = document.getElementById("category").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const description = document.getElementById("description").value;
    const subCategory = document.getElementById("subCategory").value;
    
    // التحقق من صحة البيانات
    if (!id || !name || !category || !price || !stock || !description) {
        alert("Please fill all required fields!");
        return;
    }

    // التحقق مما إذا كان هذا تحريرًا أم إضافة جديدة
    const editingProductId = document.getElementById('editingProductId');
    
    if (editingProductId) {
        // تحديث المنتج الموجود
        const productIndex = products.findIndex(p => p.id === parseInt(editingProductId.value));
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                id,
                name,
                category,
                price,
                stock,
                description,
                subCategory
            };
        }
    } else {
        // إضافة منتج جديد
        const newProduct = {
            id,
            name,
            category,
            price,
            stock,
            description,
            subCategory,
            colors: [],
            sizes: [],
            rating: 4.5,
            image: "https://via.placeholder.com/150"
        };
        products.push(newProduct);
    }

    // تحديث العرض
    displayProducts();

    // إرجاع الصفحة للوضع الطبيعي
    productForm.classList.add("d-none");
    productTable.classList.remove("d-none");
    form.reset();
});

// باقي الدوال المساعدة (نفس الكود الأصلي)
document.querySelectorAll('.color-option').forEach(color => {
    color.addEventListener('click', () => {
        color.classList.toggle('selected');
    });
});

document.querySelectorAll('.size-option').forEach(size => {
    size.addEventListener('click', () => {
        size.classList.toggle('selected');
    });
});

const categorySelect = document.getElementById('category');
const subCategorySelect = document.getElementById('subCategory');
const sizeOptions = document.querySelectorAll('.size-option');

function updateSubCategories() {
    const value = categorySelect.value;
    subCategorySelect.innerHTML = '<option value="">Select Sub Category</option>';

    if (value === 'bags') {
        ['Hand Bags', 'Beach Bags', 'ShoulderBags', 'Crossbody Bags'].forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.toLowerCase().replace(' ', '');
            opt.textContent = sub;
            subCategorySelect.appendChild(opt);
        });

        sizeOptions.forEach(size => {
            size.classList.remove('selected');
            size.style.pointerEvents = 'none';
            size.style.opacity = '0.4';
        });
    } else if (value === 'shoes') {
        ['Sandals', 'Heels', 'Sneakers', 'Flats'].forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.toLowerCase().replace(' ', '');
            opt.textContent = sub;
            subCategorySelect.appendChild(opt);
        });

        sizeOptions.forEach(size => {
            size.style.pointerEvents = 'auto';
            size.style.opacity = '1';
        });
    } else {
        sizeOptions.forEach(size => {
            size.style.pointerEvents = 'auto';
            size.style.opacity = '1';
        });
    }
}

categorySelect.addEventListener('change', updateSubCategories);

// التحقق من صحة النموذج
form.addEventListener('submit', function (e) {
    let valid = true;

    const name = document.getElementById('productName');
    const productId = document.getElementById('productId');
    const price = document.getElementById('price');
    const stock = document.getElementById('stock');
    const desc = document.getElementById('description');

    document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');

    if (name.value.trim() === '') {
        name.nextElementSibling.style.display = 'block';
        valid = false;
    }

    if (productId.value.trim() === '' || parseInt(productId.value) <= 0) {
        productId.nextElementSibling.style.display = 'block';
        valid = false;
    }

    if (price.value.trim() === '' || parseFloat(price.value) <= 0) {
        price.nextElementSibling.style.display = 'block';
        valid = false;
    }

    if (stock.value.trim() === '' || parseInt(stock.value) <= 0) {
        stock.nextElementSibling.style.display = 'block';
        valid = false;
    }

    if (desc.value.trim() === '') {
        desc.nextElementSibling.style.display = 'block';
        valid = false;
    }

    if (!valid) {
        e.preventDefault();
    }
});