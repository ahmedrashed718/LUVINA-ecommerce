let addProductBtn, productForm, productTable, productsBody, cancelBtn, form;
let products = [];
let uploadedImages = [];
const colorMap = {
  'rgb(0, 0, 0)': 'Black',
  '#000': 'Black',
  'rgb(255, 255, 255)': 'White',
  '#fff': 'White',
  'rgb(191, 3, 3)': 'Red',
  '#bf0303': 'Red',
  'rgb(118, 68, 15)': 'Brown',
  '#76440f': 'Brown',
  'rgb(245, 222, 179)': 'Beige',
  '#f5deb3': 'Beige',
  'rgb(181, 123, 15)': 'Gold',
  '#b57b0f': 'Gold',
  'rgb(7, 92, 9)': 'Green',
  '#075c09': 'Green'
};
function getColorName(colorValue) {
  if (!colorValue) return 'Unknown';
  const normalized = colorValue.toLowerCase().trim();
  return colorMap[normalized] || colorValue;
}
async function loadSellerProducts() {
  try {
    const seller = getCurrentSeller();
    console.log("🔍 Current Seller:", seller);
    if (!seller) {
      console.error("❌ No seller logged in!");
      productsBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Not logged in as seller!
          </td>
        </tr>
      `;
      return;
    }
    products = getCurrentSellerProducts();
    console.log("📦 Loaded seller products:", products.length);
    if (products.length === 0) {
      productsBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">
            <i class="bi bi-inbox me-2"></i>
            No products yet. Click "Add New Product" to create your first product!
          </td>
        </tr>
      `;
      return;
    }
    displayProducts();
  } catch (error) {
    console.error("❌ Error loading seller products:", error);
    productsBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Failed to load products: ${error.message}
        </td>
      </tr>
    `;
  }
}
function displayProducts() {
  productsBody.innerHTML = "";
  if (products.length === 0) {
    productsBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          <i class="bi bi-inbox me-2"></i>
          No products found.
        </td>
      </tr>
    `;
    return;
  }
  products.forEach((product) => {
    const newRow = document.createElement("tr");
    const category = product.Category || product.category || "N/A";
    const subCategory = product.subCategory || product.SubCategory || "";
    let statusBadge = '';
    switch (product.status) {
      case 'pending':
        statusBadge = '<span class="badge bg-warning text-dark">Pending Approval</span>';
        break;
      case 'approved':
        statusBadge = '<span class="badge bg-success">Approved</span>';
        break;
      case 'rejected':
        statusBadge = '<span class="badge bg-danger">Rejected</span>';
        break;
      default:
        statusBadge = '<span class="badge bg-secondary">Unknown</span>';
    }
    newRow.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${category}${subCategory ? " - " + subCategory : ""}</td>
      <td>${parseFloat(product.price).toFixed(2)} EGP</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${product.id}" 
          ${product.status === 'approved' ? 'title="Editing will reset status to pending"' : ''}>
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    productsBody.appendChild(newRow);
  });
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
function editProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("stock").value = product.stock || 10;
  document.getElementById("description").value = product.description;
  document.getElementById("rating").value = product.rating || 4.5;
  const category = (product.Category || product.category || "").toLowerCase();
  document.getElementById("category").value = category;
  updateSubCategories();
  const subCategory = product.subCategory || product.SubCategory || "";
  document.getElementById("subCategory").value = subCategory.toLowerCase().replace(" ", "");
  document.querySelectorAll(".color-option").forEach((color) => {
    color.classList.remove("selected");
  });
  if (product.colors && Array.isArray(product.colors)) {
    product.colors.forEach((color) => {
      const colorValue = typeof color === 'object' ? color.value : color;
      const colorElement = document.querySelector(`.color-option[style*="${colorValue}"]`);
      if (colorElement) {
        colorElement.classList.add("selected");
      }
    });
  }
  document.querySelectorAll(".size-option").forEach((size) => {
    size.classList.remove("selected");
  });
  if (product.sizes && Array.isArray(product.sizes)) {
    product.sizes.forEach((sizeValue) => {
      const sizeElement = Array.from(document.querySelectorAll(".size-option")).find(
        (el) => el.textContent.trim() === sizeValue.toString()
      );
      if (sizeElement) {
        sizeElement.classList.add("selected");
      }
    });
  }
  productTable.classList.add("d-none");
  productForm.classList.remove("d-none");
  const submitBtn = productForm.querySelector('button[type="submit"]');
  submitBtn.innerHTML = '<i class="bi bi-upload me-2"></i>Update Product';
  let productDataInput = document.getElementById("originalProductData");
  if (!productDataInput) {
    productDataInput = document.createElement("input");
    productDataInput.type = "hidden";
    productDataInput.id = "originalProductData";
    form.appendChild(productDataInput);
  }
  productDataInput.value = JSON.stringify(product);
  let hiddenInput = document.getElementById("editingProductId");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "editingProductId";
    form.appendChild(hiddenInput);
  }
  hiddenInput.value = productId;
  if (product.status === 'approved') {
    alert('⚠️ Note: Editing an approved product will change its status back to "Pending" and require admin approval again.');
  }
}
async function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    const success = deleteSellerProduct(productId);
    if (success) {
      products = getCurrentSellerProducts();
      displayProducts();
      alert("Product deleted successfully!");
    } else {
      alert("Failed to delete product!");
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  addProductBtn = document.getElementById("addProductBtn");
  productForm = document.getElementById("productForm");
  productTable = document.getElementById("ProductTable");
  productsBody = document.getElementById("ProductsBody");
  cancelBtn = document.querySelector(".btn-cancel");
  form = productForm ? productForm.querySelector("form") : null;
  if (!productForm || !productTable || !productsBody || !addProductBtn || !cancelBtn || !form) {
    console.error("Some required elements are missing!");
    return;
  }
  productForm.classList.add("d-none");
  productTable.classList.remove("d-none");
  loadSellerProducts();
  setupEventListeners();
});
function setupEventListeners() {
  addProductBtn.addEventListener("click", () => {
    productTable.classList.add("d-none");
    productForm.classList.remove("d-none");
    form.reset();
    uploadedImages = [];
    document.querySelectorAll(".color-option").forEach((color) => {
      color.classList.remove("selected");
    });
    document.querySelectorAll(".size-option").forEach((size) => {
      size.classList.remove("selected");
      size.style.pointerEvents = "auto";
      size.style.opacity = "1";
    });
    const hiddenInput = document.getElementById("editingProductId");
    if (hiddenInput) hiddenInput.remove();
    const originalData = document.getElementById("originalProductData");
    if (originalData) originalData.remove();
    const submitBtn = productForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="bi bi-upload me-2"></i>Upload Product';
    setTimeout(() => {
      setupImageUpload();
      setupColorAndSizeSelection();
    }, 100);
  });
  cancelBtn.addEventListener("click", () => {
    productForm.classList.add("d-none");
    productTable.classList.remove("d-none");
    form.reset();
    uploadedImages = [];
  });
  setupColorAndSizeSelection();
  const categorySelect = document.getElementById("category");
  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      updateSubCategories();
      setupColorAndSizeSelection();
    });
  }
  setupFormSubmission();
  const generateIdBtn = document.getElementById("generateIdBtn");
  const productIdInput = document.getElementById("productId");
  if (generateIdBtn && productIdInput) {
    generateIdBtn.addEventListener("click", () => {
      const allProducts = getAllSellerProducts();
      let maxId = 1000;
      if (allProducts && allProducts.length > 0) {
        maxId = Math.max(...allProducts.map((p) => parseInt(p.id) || 0));
      }
      const newId = maxId + 1;
      productIdInput.value = newId;
      generateIdBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
      setTimeout(() => {
        generateIdBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
      }, 1000);
    });
  }
}
function setupColorAndSizeSelection() {
  console.log("🎨 Setting up color and size selection...");
  const colorOptions = document.querySelectorAll(".color-option");
  const sizeOptions = document.querySelectorAll(".size-option");
  colorOptions.forEach((color) => {
    const newColor = color.cloneNode(true);
    color.parentNode.replaceChild(newColor, color);
    newColor.addEventListener("click", function() {
      this.classList.toggle("selected");
      console.log("🎨 Color clicked:", this.style.backgroundColor, "Selected:", this.classList.contains("selected"));
    });
  });
  sizeOptions.forEach((size) => {
    const newSize = size.cloneNode(true);
    size.parentNode.replaceChild(newSize, size);
    newSize.addEventListener("click", function() {
      if (this.style.pointerEvents !== "none") {
        this.classList.toggle("selected");
        console.log("📏 Size clicked:", this.textContent, "Selected:", this.classList.contains("selected"));
      }
    });
  });
  console.log("✅ Color and size selection setup complete!");
}
function updateSubCategories() {
  const categorySelect = document.getElementById("category");
  const subCategorySelect = document.getElementById("subCategory");
  const sizeOptions = document.querySelectorAll(".size-option");
  if (!categorySelect || !subCategorySelect) return;
  const value = categorySelect.value;
  subCategorySelect.innerHTML = '<option value="">Select Sub Category</option>';
  if (value === "bags") {
    ["Hand Bags", "Beach Bags", "ShoulderBags", "Crossbody Bags"].forEach((sub) => {
      const opt = document.createElement("option");
      opt.value = sub.toLowerCase().replace(" ", "");
      opt.textContent = sub;
      subCategorySelect.appendChild(opt);
    });
    sizeOptions.forEach((size) => {
      size.classList.remove("selected");
      size.style.pointerEvents = "none";
      size.style.opacity = "0.4";
    });
    console.log("👜 Bags selected - sizes disabled");
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
    console.log("👟 Shoes selected - sizes enabled");
  } else {
    sizeOptions.forEach((size) => {
      size.style.pointerEvents = "auto";
      size.style.opacity = "1";
    });
  }
}
function setupFormSubmission() {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("📝 Form submitted - validating...");
    const id = parseInt(document.getElementById("productId").value);
    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("category").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const description = document.getElementById("description").value.trim();
    const subCategory = document.getElementById("subCategory").value;
    const rating = parseFloat(document.getElementById("rating")?.value) || 4.5;
    const selectedColors = [];
    document.querySelectorAll(".color-option.selected").forEach((color) => {
      const bgColor = color.style.backgroundColor;
      const colorName = color.getAttribute('data-color-name') || getColorName(bgColor);
      if (bgColor && colorName) {
        selectedColors.push({
          value: bgColor,
          name: colorName
        });
      }
    });
    const selectedSizes = [];
    document.querySelectorAll(".size-option.selected").forEach((size) => {
      selectedSizes.push(size.textContent.trim());
    });
    console.log("📊 Form Data:");
    console.log("  - ID:", id);
    console.log("  - Name:", name);
    console.log("  - Category:", category);
    console.log("  - Sub-category:", subCategory);
    console.log("  - Price:", price);
    console.log("  - Stock:", stock);
    console.log("  - Colors:", selectedColors.length);
    console.log("  - Sizes:", selectedSizes.length);
    console.log("  - Images:", uploadedImages.length);
    let errors = [];
    if (!id || isNaN(id) || id <= 0) {
      errors.push("❌ Product ID is required and must be a positive number");
    }
    if (!name) {
      errors.push("❌ Product name is required");
    }
    if (!category) {
      errors.push("❌ Please select a category (Bags or Shoes)");
    }
    if (!subCategory) {
      errors.push("❌ Please select a sub-category");
    }
    if (!price || isNaN(price) || price <= 0) {
      errors.push("❌ Price is required and must be greater than 0");
    }
    if (!stock || isNaN(stock) || stock <= 0) {
      errors.push("❌ Stock is required and must be greater than 0");
    }
    if (!description) {
      errors.push("❌ Description is required");
    }
    if (selectedColors.length === 0) {
      errors.push("⚠️ No colors selected. Please click on color circles to select at least one color.");
    }
    if (category === "shoes" && selectedSizes.length === 0) {
      errors.push("⚠️ No sizes selected. Please click on size numbers to select at least one size for shoes.");
    }
    if (uploadedImages.length === 0) {
      errors.push("⚠️ No images uploaded. Please upload at least one product image.");
    }
    if (errors.length > 0) {
      console.error("❌ Validation failed:");
      errors.forEach(err => console.error("  " + err));
      alert("Please fix the following errors:\n\n" + errors.join("\n"));
      return;
    }
    console.log("✅ Validation passed!");
    let productImages = uploadedImages.length > 0 
      ? uploadedImages.map((img) => img.data || img)
      : ["https://via.placeholder.com/150"];
    const editingProductId = document.getElementById("editingProductId");
    const originalProductData = document.getElementById("originalProductData");
    if (editingProductId) {
      let originalProduct = {};
      if (originalProductData) {
        try {
          originalProduct = JSON.parse(originalProductData.value);
        } catch (e) {
          console.error("Error parsing original product data:", e);
        }
      }
      const updatedData = {
        id,
        name,
        Category: category.charAt(0).toUpperCase() + category.slice(1),
        price,
        stock,
        description,
        subCategory,
        colors: selectedColors.length > 0 ? selectedColors : originalProduct.colors || [],
        sizes: selectedSizes.length > 0 ? selectedSizes : originalProduct.sizes || [],
        rating: rating,
        images: productImages.length > 0 && uploadedImages.length > 0
          ? productImages
          : originalProduct.images || ["https://via.placeholder.com/150"]
      };
      const success = updateSellerProduct(parseInt(editingProductId.value), updatedData);
      if (success) {
        alert("Product updated successfully! It will be reviewed by admin before appearing in the store.");
      } else {
        alert("Failed to update product!");
        return;
      }
    } else {
      const newProduct = {
        id,
        name,
        Category: category.charAt(0).toUpperCase() + category.slice(1),
        price,
        stock,
        description,
        subCategory,
        colors: selectedColors,
        sizes: selectedSizes,
        rating: rating,
        images: productImages
      };
      console.log("📦 Adding seller product:", newProduct);
      const success = addSellerProduct(newProduct);
      if (success) {
        console.log("✅ Product added successfully!");
        alert("Product added successfully! It will be reviewed by admin before appearing in the store.");
      } else {
        console.error("❌ Failed to add product!");
        alert("Failed to add product! Check console for details.");
        return;
      }
    }
    products = getCurrentSellerProducts();
    displayProducts();
    productForm.classList.add("d-none");
    productTable.classList.remove("d-none");
    form.reset();
    uploadedImages = [];
  });
}
function setupImageUpload() {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  if (!dropZone || !fileInput) return;
  dropZone.addEventListener("click", () => {
    fileInput.click();
  });
  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
    fileInput.value = "";
  });
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#635BFF";
  });
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#ddd";
    handleFiles(e.dataTransfer.files);
  });
}
function handleFiles(files) {
  if (files.length === 0) return;
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
      uploadedImages.push({
        name: file.name,
        data: e.target.result,
        size: file.size
      });
      displayImages();
    };
    reader.readAsDataURL(file);
  });
}
function displayImages() {
  const container = document.getElementById("imagePreviewContainer");
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
    deleteBtn.style.cssText = "padding: 2px 6px; font-size: 12px; border-radius: 50%;";
    deleteBtn.innerHTML = '<i class="bi bi-x"></i>';
    deleteBtn.onclick = () => {
      uploadedImages.splice(index, 1);
      displayImages();
    };
    imgWrapper.appendChild(imgElement);
    imgWrapper.appendChild(deleteBtn);
    imagesGrid.appendChild(imgWrapper);
  });
  container.appendChild(imagesGrid);
}
