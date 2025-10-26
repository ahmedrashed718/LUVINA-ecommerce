
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
        const response = await fetch('./Products.json');
        
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

/////////=========== add images==============//////////////

// ضع هذا الكود في نهاية ملف products.js

// ========== Image Upload Functionality ==========

const uploadBox = document.querySelector('.upload-box');
const imagePreviewContainer = document.createElement('div');
imagePreviewContainer.className = 'image-preview-container mt-3';
imagePreviewContainer.style.display = 'none';
uploadBox.parentElement.appendChild(imagePreviewContainer);

let uploadedImages = [];

// إنشاء input مخفي للصور
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.multiple = true;
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// عند الضغط على upload box
uploadBox.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
});

// عند سحب الملفات فوق الـ upload box
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#635BFF';
    uploadBox.style.backgroundColor = '#f0f0ff';
});

uploadBox.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#ccc';
    uploadBox.style.backgroundColor = 'transparent';
});

// عند إفلات الملفات
uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#ccc';
    uploadBox.style.backgroundColor = 'transparent';
    
    const files = e.dataTransfer.files;
    handleFiles(files);
});

// عند اختيار الصور من الـ file input
fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});

// دالة معالجة الملفات
function handleFiles(files) {
    if (files.length === 0) return;
    
    // التحقق من عدد الصور (أقصى 5 صور)
    if (uploadedImages.length + files.length > 5) {
        alert('You can upload maximum 5 images!');
        return;
    }
    
    // معالجة كل ملف
    Array.from(files).forEach(file => {
        // التحقق من نوع الملف
        if (!file.type.startsWith('image/')) {
            alert(`${file.name} is not an image file!`);
            return;
        }
        
        // التحقق من حجم الملف (أقصى 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert(`${file.name} is too large! Maximum size is 5MB.`);
            return;
        }
        
        // قراءة الملف
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = {
                name: file.name,
                data: e.target.result,
                size: file.size
            };
            
            uploadedImages.push(imageData);
            displayImages();
        };
        
        reader.readAsDataURL(file);
    });
}

// دالة عرض الصور المرفوعة
function displayImages() {
    if (uploadedImages.length === 0) {
        imagePreviewContainer.style.display = 'none';
        return;
    }
    
    imagePreviewContainer.style.display = 'block';
    imagePreviewContainer.innerHTML = '<h6 class="mb-3">Uploaded Images:</h6>';
    
    const imagesGrid = document.createElement('div');
    imagesGrid.className = 'd-flex flex-wrap gap-2';
    
    uploadedImages.forEach((img, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'position-relative';
        imgWrapper.style.cssText = 'width: 100px; height: 100px;';
        
        const imgElement = document.createElement('img');
        imgElement.src = img.data;
        imgElement.className = 'img-thumbnail';
        imgElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn btn-danger btn-sm position-absolute top-0 end-0';
        deleteBtn.style.cssText = 'padding: 2px 6px; font-size: 12px; border-radius: 50%;';
        deleteBtn.innerHTML = '<i class="bi bi-x"></i>';
        deleteBtn.onclick = () => removeImage(index);
        
        imgWrapper.appendChild(imgElement);
        imgWrapper.appendChild(deleteBtn);
        imagesGrid.appendChild(imgWrapper);
    });
    
    imagePreviewContainer.appendChild(imagesGrid);
}

// دالة حذف صورة
function removeImage(index) {
    uploadedImages.splice(index, 1);
    displayImages();
}

// تحديث form submission لحفظ الصور مع المنتج
const originalFormSubmit = form.onsubmit;
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // التحقق من وجود صور
    if (uploadedImages.length === 0) {
        alert("Please upload at least one product image!");
        return;
    }

    // جمع البيانات من الحقول
    const id = parseInt(document.getElementById("productId").value);
    const name = document.getElementById("productName").value;
    const category = document.getElementById("category").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const description = document.getElementById("description").value;
    const subCategory = document.getElementById("subCategory").value;
    
    // جمع الألوان المختارة
    const selectedColors = Array.from(document.querySelectorAll('.color-option.selected'))
        .map(color => color.style.backgroundColor);
    
    // جمع المقاسات المختارة
    const selectedSizes = Array.from(document.querySelectorAll('.size-option.selected'))
        .map(size => size.textContent);
    
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
                subCategory,
                colors: selectedColors,
                sizes: selectedSizes,
                images: [...uploadedImages] // حفظ الصور
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
            colors: selectedColors,
            sizes: selectedSizes,
            rating: 4.5,
            images: [...uploadedImages] // حفظ الصور
        };
        products.push(newProduct);
    }

    console.log('Product saved with images:', products[products.length - 1]);

    // تحديث العرض
    displayProducts();

    // إرجاع الصفحة للوضع الطبيعي
    productForm.classList.add("d-none");
    productTable.classList.remove("d-none");
    
    // إعادة تعيين النموذج والصور
    form.reset();
    uploadedImages = [];
    displayImages();
    
    alert('Product saved successfully!');
});

// تحديث دالة editProduct لعرض الصور عند التحرير
const originalEditProduct = window.editProduct;
window.editProduct = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // استدعاء الدالة الأصلية
    if (originalEditProduct) {
        originalEditProduct(productId);
    }
    
    // تحميل الصور إذا كانت موجودة
    if (product.images && product.images.length > 0) {
        uploadedImages = [...product.images];
        displayImages();
    } else {
        uploadedImages = [];
        displayImages();
    }
    
    // تحميل الألوان المختارة
    document.querySelectorAll('.color-option').forEach(color => {
        color.classList.remove('selected');
    });
    if (product.colors) {
        product.colors.forEach(selectedColor => {
            document.querySelectorAll('.color-option').forEach(color => {
                if (color.style.backgroundColor === selectedColor) {
                    color.classList.add('selected');
                }
            });
        });
    }
    
    // تحميل المقاسات المختارة
    document.querySelectorAll('.size-option').forEach(size => {
        size.classList.remove('selected');
    });
    if (product.sizes) {
        product.sizes.forEach(selectedSize => {
            document.querySelectorAll('.size-option').forEach(size => {
                if (size.textContent === selectedSize) {
                    size.classList.add('selected');
                }
            });
        });
    }
};

// إعادة تعيين الصور عند الضغط على Cancel
const originalCancelClick = cancelBtn.onclick;
cancelBtn.addEventListener("click", () => {
    uploadedImages = [];
    displayImages();
    fileInput.value = '';
});

// إعادة تعيين الصور عند فتح نموذج جديد
const originalAddProductClick = addProductBtn.onclick;
addProductBtn.addEventListener("click", () => {
    uploadedImages = [];
    displayImages();
    fileInput.value = '';
});