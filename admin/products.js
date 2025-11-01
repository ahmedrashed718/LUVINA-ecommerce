// products.js

const addProductBtn = document.getElementById("addProductBtn");
const productForm = document.getElementById("productForm");
const productTable = document.getElementById("ProductTable");
const productsBody = document.getElementById("ProductsBody");
const cancelBtn = document.querySelector(".btn-cancel");
const form = productForm.querySelector("form");

// متغير لتخزين المنتجات
let products = [];

// ✅ دالة لتحميل البيانات من localStorage
async function loadProductsFromStorage() {
  try {
    products = await getProducts();

    if (products.length === 0) {
      productsBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-warning">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Failed to load products. Make sure Products.json exists.
                    </td>
                </tr>
            `;
      return;
    }

    displayProducts();
  } catch (error) {
    console.error("Error loading products from localStorage:", error);
    productsBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Failed to load products: ${error.message}
                </td>
            </tr>
        `;
  }
}

// دالة لعرض المنتجات في الجدول
function displayProducts() {
  productsBody.innerHTML = "";

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

  products.forEach((product) => {
    console.log(
      "📋 Displaying product in table:",
      product.name,
      "| Images:",
      product.images?.length || 0,
      "| Colors:",
      product.colors?.length || 0,
      "| Sizes:",
      product.sizes?.length || 0
    );

    const newRow = document.createElement("tr");
    // Handle both 'Category' and 'category' field names
    const category = product.Category || product.category || "N/A";
    const subCategory = product.subCategory || product.SubCategory || "";

    newRow.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${category}${subCategory ? " - " + subCategory : ""}</td>
            <td>${parseFloat(product.price).toFixed(2)} EGP</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${
                  product.id
                }">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${
                  product.id
                }">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    productsBody.appendChild(newRow);
  });

  // إضافة مستمعي الأحداث للأزرار الديناميكية
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      editProduct(productId);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      deleteProduct(productId);
    });
  });
}

// دالة لتحرير منتج
function editProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  // تعبئة النموذج ببيانات المنتج
  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("stock").value = product.stock || 10;
  document.getElementById("description").value = product.description;
  document.getElementById("rating").value = product.rating || 4.5;

  // Handle both 'Category' and 'category' field names
  const category = (product.Category || product.category || "").toLowerCase();
  document.getElementById("category").value = category;

  // تحديث الفئات الفرعية
  updateSubCategories();
  const subCategory = product.subCategory || product.SubCategory || "";
  document.getElementById("subCategory").value = subCategory
    .toLowerCase()
    .replace(" ", "");

  // إعادة تعيين الألوان المحددة
  document.querySelectorAll(".color-option").forEach((color) => {
    color.classList.remove("selected");
  });

  // تحديد الألوان الموجودة في المنتج
  if (product.colors && Array.isArray(product.colors)) {
    product.colors.forEach((colorValue) => {
      const colorElement = document.querySelector(
        `.color-option[style*="${colorValue}"]`
      );
      if (colorElement) {
        colorElement.classList.add("selected");
      }
    });
  }

  // إعادة تعيين الأحجام المحددة
  document.querySelectorAll(".size-option").forEach((size) => {
    size.classList.remove("selected");
  });

  // تحديد الأحجام الموجودة في المنتج
  if (product.sizes && Array.isArray(product.sizes)) {
    product.sizes.forEach((sizeValue) => {
      const sizeElement = Array.from(
        document.querySelectorAll(".size-option")
      ).find((el) => el.textContent.trim() === sizeValue.toString());
      if (sizeElement) {
        sizeElement.classList.add("selected");
      }
    });
  }

  // إظهار النموذج
  productTable.classList.add("d-none");
  productForm.classList.remove("d-none");

  // تغيير نص الزر
  const submitBtn = productForm.querySelector('button[type="submit"]');
  submitBtn.innerHTML = '<i class="fa-solid fa-upload me-2"></i>Update Product';

  // عرض الصور في منطقة المعاينة
  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer"
  );
  const uploadBox = document.getElementById("uploadBox");

  if (product.images && product.images.length > 0) {
    // إخفاء صندوق الرفع وإظهار المعاينة
    uploadBox.style.display = "none";
    imagePreview.style.display = "block";

    // مسح المعاينة السابقة
    imagePreviewContainer.innerHTML = "";

    // عرض جميع صور المنتج
    product.images.forEach((imgSrc, index) => {
      const imgElement = document.createElement("div");
      imgElement.className = "position-relative";
      imgElement.style.cssText = "width: 100px; height: 100px;";
      imgElement.innerHTML = `
                <img src="${imgSrc}" 
                     alt="Product Image ${index + 1}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;">
                <span class="badge bg-primary position-absolute top-0 start-0 m-1" style="font-size: 10px;">
                    ${index + 1}
                </span>
            `;
      imagePreviewContainer.appendChild(imgElement);
    });
  } else {
    // لا توجد صور - إظهار صندوق الرفع
    uploadBox.style.display = "block";
    imagePreview.style.display = "none";
  }

  // حفظ بيانات المنتج الأصلية (الصور خاصة) في input مخفي
  let productDataInput = document.getElementById("originalProductData");
  if (!productDataInput) {
    productDataInput = document.createElement("input");
    productDataInput.type = "hidden";
    productDataInput.id = "originalProductData";
    form.appendChild(productDataInput);
  }
  productDataInput.value = JSON.stringify(product);

  // إضافة معرف المنتج للتحرير كنوع مخفي
  let hiddenInput = document.getElementById("editingProductId");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "editingProductId";
    form.appendChild(hiddenInput);
  }
  hiddenInput.value = productId;
}

// دالة لحذف منتج
async function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    // ✅ Delete from localStorage
    const allProducts = await getProducts();
    const filtered = allProducts.filter((p) => p.id !== productId);
    saveProducts(filtered);

    products = await getProducts();
    displayProducts();
    alert("Product deleted successfully!");
  }
}

// عند فتح الصفحة -> تحميل البيانات من localStorage
document.addEventListener("DOMContentLoaded", () => {
  productForm.classList.add("d-none");
  productTable.classList.remove("d-none");
  loadProductsFromStorage();

  // Setup image upload functionality
  setupImageUpload();
});

// عند الضغط على Add New Product -> إظهار الفورم
addProductBtn.addEventListener("click", () => {
  productTable.classList.add("d-none");
  productForm.classList.remove("d-none");

  // إعادة تعيين النموذج
  form.reset();

  // Reset uploaded images
  uploadedImages = [];
  displayUploadedImages();

  // إعادة تعيين الألوان والأحجام
  document.querySelectorAll(".color-option").forEach((color) => {
    color.classList.remove("selected");
  });
  document.querySelectorAll(".size-option").forEach((size) => {
    size.classList.remove("selected");
  });

  // إعادة عرض صندوق الرفع وإخفاء المعاينة
  const imagePreview = document.getElementById("imagePreview");
  const uploadBox = document.getElementById("uploadBox");
  if (imagePreview) imagePreview.style.display = "none";
  if (uploadBox) uploadBox.style.display = "block";

  // إزالة معرف المنتج للتحرير إذا كان موجودًا
  const hiddenInput = document.getElementById("editingProductId");
  if (hiddenInput) {
    hiddenInput.remove();
  }

  // إزالة البيانات الأصلية إذا كانت موجودة
  const originalData = document.getElementById("originalProductData");
  if (originalData) {
    originalData.remove();
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

  // Reset uploaded images
  uploadedImages = [];
  displayUploadedImages();

  // إعادة تعيين الألوان والأحجام
  document.querySelectorAll(".color-option").forEach((color) => {
    color.classList.remove("selected");
  });
  document.querySelectorAll(".size-option").forEach((size) => {
    size.classList.remove("selected");
  });

  // إعادة عرض صندوق الرفع وإخفاء المعاينة
  const imagePreview = document.getElementById("imagePreview");
  const uploadBox = document.getElementById("uploadBox");
  if (imagePreview) imagePreview.style.display = "none";
  if (uploadBox) uploadBox.style.display = "block";
});

// عند إرسال الفورم
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // جمع البيانات من الحقول
  const id = parseInt(document.getElementById("productId").value);
  const name = document.getElementById("productName").value;
  const category = document.getElementById("category").value;
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);
  const description = document.getElementById("description").value;
  const subCategory = document.getElementById("subCategory").value;
  const rating = parseFloat(document.getElementById("rating").value) || 4.5;

  // جمع الألوان المحددة
  const selectedColors = [];
  document.querySelectorAll(".color-option.selected").forEach((color) => {
    const bgColor = color.style.backgroundColor;
    if (bgColor) {
      selectedColors.push(bgColor);
    }
  });

  // جمع الأحجام المحددة
  const selectedSizes = [];
  document.querySelectorAll(".size-option.selected").forEach((size) => {
    selectedSizes.push(size.textContent.trim());
  });

  console.log("📏 Selected sizes:", selectedSizes);
  console.log("📏 Selected colors:", selectedColors);

  // التحقق من صحة البيانات
  if (!id || !name || !category || !price || !stock || !description) {
    alert("Please fill all required fields!");
    return;
  }

  // Validation: Check if images were uploaded
  if (uploadedImages.length === 0) {
    const confirmUsePlaceholder = confirm(
      "⚠️ No images uploaded!\n\nWould you like to continue with a placeholder image?\n\nClick OK to continue with placeholder, or Cancel to go back and upload images."
    );
    if (!confirmUsePlaceholder) {
      return; // User wants to go back and upload images
    }
  }

  // Get uploaded images if available
  let productImages = ["https://via.placeholder.com/150"]; // Default placeholder
  console.log("🔍 uploadedImages array length:", uploadedImages.length);
  console.log("🔍 uploadedImages:", uploadedImages);

  if (uploadedImages.length > 0) {
    productImages = uploadedImages.map((img) => {
      console.log("🔍 Processing image:", img);
      return img.data || img;
    });
    console.log("✅ Saving product with", productImages.length, "images");
    console.log(
      "First image preview (first 100 chars):",
      productImages[0] ? productImages[0].substring(0, 100) + "..." : "empty"
    );
  } else {
    console.log("⚠️ No images uploaded, using placeholder");
    console.log("⚠️ Check if images were actually selected in the upload box");
  }

  // التحقق مما إذا كان هذا تحريرًا أم إضافة جديدة
  const editingProductId = document.getElementById("editingProductId");
  const originalProductData = document.getElementById("originalProductData");

  if (editingProductId) {
    // ✅ تحديث المنتج في localStorage
    // الحصول على البيانات الأصلية للحفاظ على الصور
    let originalProduct = {};
    if (originalProductData) {
      try {
        originalProduct = JSON.parse(originalProductData.value);
      } catch (e) {
        console.error("Error parsing original product data:", e);
      }
    }

    // Use capital 'Category' to match the existing data structure
    const updatedData = {
      id,
      name,
      Category: category.charAt(0).toUpperCase() + category.slice(1),
      price,
      stock,
      description,
      subCategory,
      colors:
        selectedColors.length > 0
          ? selectedColors
          : originalProduct.colors || [],
      sizes:
        selectedSizes.length > 0 ? selectedSizes : originalProduct.sizes || [],
      rating: rating,
      // Use uploaded images or keep existing ones
      images:
        productImages.length > 0 && uploadedImages.length > 0
          ? productImages
          : originalProduct.images || originalProduct.image
          ? originalProduct.images || [originalProduct.image]
          : ["https://via.placeholder.com/150"],
    };

    const success = await updateProduct(
      parseInt(editingProductId.value),
      updatedData
    );

    if (!success) {
      alert("Failed to update product!");
      return;
    }

    alert("Product updated successfully!");
  } else {
    // ✅ إضافة منتج جديد إلى localStorage
    const newProduct = {
      id,
      name,
      Category: category.charAt(0).toUpperCase() + category.slice(1),
      price,
      stock,
      description,
      subCategory,
      colors: selectedColors.length > 0 ? selectedColors : [],
      sizes: selectedSizes.length > 0 ? selectedSizes : [],
      rating: rating,
      images: productImages, // Use uploaded images instead of placeholder
    };

    console.log("📦 Adding new product:", newProduct);
    console.log("📦 Product images array:", newProduct.images);
    console.log("📦 Product has", newProduct.images.length, "images");
    console.log("📦 Product colors:", newProduct.colors);
    console.log("📦 Product sizes:", newProduct.sizes);

    const success = await addProduct(newProduct);
    if (!success) {
      alert("Failed to add product!");
      return;
    }

    console.log("✅ Product added successfully!");

    // ✅ Verify what was actually saved
    const savedProducts = await getProducts();
    const justAddedProduct = savedProducts.find((p) => p.id === id);
    console.log("🔍 Product retrieved from localStorage:", justAddedProduct);
    console.log("🔍 Retrieved product images:", justAddedProduct?.images);
    console.log("🔍 Retrieved product colors:", justAddedProduct?.colors);
    console.log("🔍 Retrieved product sizes:", justAddedProduct?.sizes);

    alert("Product added successfully!");
  }

  // ✅ Reload from localStorage and update display
  products = await getProducts();
  displayProducts();

  // إرجاع الصفحة للوضع الطبيعي
  productForm.classList.add("d-none");
  productTable.classList.remove("d-none");
  form.reset();
});

// باقي الدوال المساعدة (نفس الكود الأصلي)
document.querySelectorAll(".color-option").forEach((color) => {
  color.addEventListener("click", () => {
    color.classList.toggle("selected");
  });
});

document.querySelectorAll(".size-option").forEach((size) => {
  size.addEventListener("click", () => {
    size.classList.toggle("selected");
  });
});

const categorySelect = document.getElementById("category");
const subCategorySelect = document.getElementById("subCategory");
const sizeOptions = document.querySelectorAll(".size-option");

function updateSubCategories() {
  const value = categorySelect.value;
  subCategorySelect.innerHTML = '<option value="">Select Sub Category</option>';

  if (value === "bags") {
    ["Hand Bags", "Beach Bags", "ShoulderBags", "Crossbody Bags"].forEach(
      (sub) => {
        const opt = document.createElement("option");
        opt.value = sub.toLowerCase().replace(" ", "");
        opt.textContent = sub;
        subCategorySelect.appendChild(opt);
      }
    );

    // NOTE: Bags don't typically need sizes, but we'll enable them anyway for flexibility
    sizeOptions.forEach((size) => {
      size.classList.remove("selected");
      size.style.pointerEvents = "auto";
      size.style.opacity = "1";
    });
  } else if (value === "shoes") {
    ["Sandals", "Heels", "Sneakers", "Flats"].forEach((sub) => {
      const opt = document.createElement("option");
      opt.value = sub.toLowerCase().replace(" ", "");
      opt.textContent = sub;
      subCategorySelect.appendChild(opt);
    });

    sizeOptions.forEach((size) => {
      size.style.pointerEvents = "auto";
      size.style.opacity = "1";
    });
  } else {
    sizeOptions.forEach((size) => {
      size.style.pointerEvents = "auto";
      size.style.opacity = "1";
    });
  }
}

categorySelect.addEventListener("change", updateSubCategories);

// ========== Image Upload Functionality ==========
let uploadedImages = [];

function setupImageUpload() {
  console.log("🔧 Admin Panel: Setting up image upload...");

  const uploadBox = document.getElementById("uploadBox");
  const fileInput = document.getElementById("fileInput");
  const uploadImagePreviewContainer = document.getElementById(
    "uploadImagePreviewContainer"
  );

  if (!uploadBox || !fileInput) {
    console.log("Upload elements not found");
    return;
  }

  console.log("✅ Admin: Image upload elements found");

  // Click to browse - Make clickable on all parts of the box
  uploadBox.addEventListener("click", function (e) {
    console.log("📦 Admin: Upload box clicked!", e.target);

    // Only trigger if clicked on the upload box itself, not on child elements
    if (
      e.target === uploadBox ||
      (e.target.closest("#uploadBox") && e.target !== fileInput)
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log("📂 Triggering file input click...");

      // Temporarily enable pointer events to allow click
      const originalPointerEvents = fileInput.style.pointerEvents;
      fileInput.style.pointerEvents = "auto";
      fileInput.click();

      // Restore after a short delay
      setTimeout(() => {
        fileInput.style.pointerEvents = originalPointerEvents;
      }, 100);
    }
  });

  // Also allow direct click on any text/element inside
  const uploadText = uploadBox.querySelector("p");
  if (uploadText) {
    uploadText.style.cursor = "pointer";
    uploadText.addEventListener("click", function (e) {
      e.stopPropagation();
      fileInput.click();
    });
  }

  // Make the icon clickable too
  const uploadIcon = uploadBox.querySelector("i");
  if (uploadIcon) {
    uploadIcon.style.cursor = "pointer";
    uploadIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      fileInput.click();
    });
  }

  // Make the browse button clickable
  const uploadButton = document.getElementById("uploadButton");
  if (uploadButton) {
    uploadButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("📁 Button clicked!");
      console.log("📂 Triggering file input from button...");

      // Temporarily enable pointer events to allow click
      const originalPointerEvents = fileInput.style.pointerEvents;
      fileInput.style.pointerEvents = "auto";
      fileInput.click();

      // Restore after a short delay
      setTimeout(() => {
        fileInput.style.pointerEvents = originalPointerEvents;
      }, 100);
    });
  } else {
    console.log("⚠️ Upload button not found!");
  }

  // Hover effects
  uploadBox.addEventListener("mouseenter", function () {
    uploadBox.style.borderColor = "#635BFF";
    uploadBox.style.backgroundColor = "#f8f9ff";
  });

  uploadBox.addEventListener("mouseleave", function () {
    uploadBox.style.borderColor = "#ddd";
    uploadBox.style.backgroundColor = "transparent";
  });

  // Drag and drop
  uploadBox.addEventListener("dragover", function (e) {
    e.preventDefault();
    uploadBox.style.borderColor = "#635BFF";
    uploadBox.style.backgroundColor = "#f0f0ff";
  });

  uploadBox.addEventListener("dragleave", function (e) {
    e.preventDefault();
    uploadBox.style.borderColor = "#ddd";
    uploadBox.style.backgroundColor = "transparent";
  });

  uploadBox.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadBox.style.borderColor = "#ddd";
    uploadBox.style.backgroundColor = "transparent";

    const files = e.dataTransfer.files;
    handleImageFiles(files);
  });

  // File input change
  fileInput.addEventListener("change", function (e) {
    console.log("📁 Admin: Files selected:", e.target.files.length);
    const files = e.target.files;
    handleImageFiles(files);

    // Reset file input after handling
    // This allows selecting the same file again if needed
    fileInput.value = "";
  });

  console.log("✅ Admin: Image upload setup complete!");
}

// Handle image files
function handleImageFiles(files) {
  if (files.length === 0) return;

  // Maximum 5 images
  if (uploadedImages.length + files.length > 5) {
    alert("You can upload maximum 5 images!");
    return;
  }

  Array.from(files).forEach((file) => {
    if (!file.type.startsWith("image/")) {
      alert(`${file.name} is not an image file!`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} is too large! Maximum size is 5MB.`);
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const imageData = {
        name: file.name,
        data: e.target.result,
        size: file.size,
      };

      uploadedImages.push(imageData);
      displayUploadedImages();
    };

    reader.readAsDataURL(file);
  });
}

// Display uploaded images
function displayUploadedImages() {
  const container = document.getElementById("uploadImagePreviewContainer");

  if (!container) return;

  if (uploadedImages.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  container.innerHTML = '<h6 class="mb-3">Uploaded Images:</h6>';

  const imagesGrid = document.createElement("div");
  imagesGrid.className = "d-flex flex-wrap gap-2";

  uploadedImages.forEach((img, index) => {
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "position-relative";
    imgWrapper.style.cssText = "width: 100px; height: 100px;";

    const imgElement = document.createElement("img");
    imgElement.src = img.data || img;
    imgElement.className = "img-thumbnail";
    imgElement.style.cssText = "width: 100%; height: 100%; object-fit: cover;";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-danger btn-sm position-absolute top-0 end-0";
    deleteBtn.style.cssText =
      "padding: 2px 6px; font-size: 12px; border-radius: 50%;";
    deleteBtn.innerHTML = '<i class="bi bi-x"></i>';
    deleteBtn.onclick = () => removeUploadedImage(index);

    imgWrapper.appendChild(imgElement);
    imgWrapper.appendChild(deleteBtn);
    imagesGrid.appendChild(imgWrapper);
  });

  container.appendChild(imagesGrid);
}

// Remove uploaded image
function removeUploadedImage(index) {
  uploadedImages.splice(index, 1);
  displayUploadedImages();
}

// التحقق من صحة النموذج
form.addEventListener("submit", function (e) {
  let valid = true;

  const name = document.getElementById("productName");
  const productId = document.getElementById("productId");
  const price = document.getElementById("price");
  const stock = document.getElementById("stock");
  const desc = document.getElementById("description");

  document
    .querySelectorAll(".error-message")
    .forEach((msg) => (msg.style.display = "none"));

  if (name.value.trim() === "") {
    name.nextElementSibling.style.display = "block";
    valid = false;
  }

  if (productId.value.trim() === "" || parseInt(productId.value) <= 0) {
    productId.nextElementSibling.style.display = "block";
    valid = false;
  }

  if (price.value.trim() === "" || parseFloat(price.value) <= 0) {
    price.nextElementSibling.style.display = "block";
    valid = false;
  }

  if (stock.value.trim() === "" || parseInt(stock.value) <= 0) {
    stock.nextElementSibling.style.display = "block";
    valid = false;
  }

  if (desc.value.trim() === "") {
    desc.nextElementSibling.style.display = "block";
    valid = false;
  }

  if (!valid) {
    e.preventDefault();
  }
});
