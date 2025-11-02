let addProductBtn, productForm, productTable, productsBody, cancelBtn, form;
let products = [];
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
    const newRow = document.createElement("tr");
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
  const category = (product.Category || product.category || "").toLowerCase();
  document.getElementById("category").value = category;
  updateSubCategories();
  const subCategory = product.subCategory || product.SubCategory || "";
  document.getElementById("subCategory").value = subCategory
    .toLowerCase()
    .replace(" ", "");
  productTable.classList.add("d-none");
  productForm.classList.remove("d-none");
  const submitBtn = productForm.querySelector('button[type="submit"]');
  submitBtn.innerHTML = '<i class="fa-solid fa-upload me-2"></i>Update Product';
  let hiddenInput = document.getElementById("editingProductId");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "editingProductId";
    form.appendChild(hiddenInput);
  }
  hiddenInput.value = productId;
}
async function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    const allProducts = await getProducts();
    const filtered = allProducts.filter((p) => p.id !== productId);
    saveProducts(filtered);
    products = await getProducts();
    displayProducts();
    alert("Product deleted successfully!");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  addProductBtn = document.getElementById("addProductBtn");
  productForm = document.getElementById("productForm");
  productTable = document.getElementById("ProductTable");
  productsBody = document.getElementById("ProductsBody");
  cancelBtn = document.querySelector(".btn-cancel");
  form = productForm ? productForm.querySelector("form") : null;
  if (
    !productForm ||
    !productTable ||
    !productsBody ||
    !addProductBtn ||
    !cancelBtn ||
    !form
  ) {
    console.error("Some required elements are missing!");
    return;
  }
  productForm.classList.add("d-none");
  productTable.classList.remove("d-none");
  loadProductsFromStorage();
  setupEventListeners();
  const shouldOpenForm = localStorage.getItem("openAddProductForm");
  if (shouldOpenForm === "true") {
    localStorage.removeItem("openAddProductForm");
    setTimeout(() => {
      addProductBtn.click();
    }, 100);
  }
});
function setupEventListeners() {
  addProductBtn.addEventListener("click", () => {
    productTable.classList.add("d-none");
    productForm.classList.remove("d-none");
    form.reset();
    document.querySelectorAll(".color-option").forEach((color) => {
      color.classList.remove("selected");
    });
    document.querySelectorAll(".size-option").forEach((size) => {
      size.classList.remove("selected");
    });
    const hiddenInput = document.getElementById("editingProductId");
    if (hiddenInput) {
      hiddenInput.remove();
    }
    const originalData = document.getElementById("originalProductData");
    if (originalData) {
      originalData.remove();
    }
    if (typeof uploadedImages !== "undefined") {
      uploadedImages = [];
      if (typeof displayImages === "function") {
        displayImages();
      }
    }
    const submitBtn = productForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="bi bi-upload me-2"></i>Upload Product';
    const imagePreview = document.getElementById("imagePreview");
    const uploadBox = document.getElementById("uploadBox");
    if (imagePreview) imagePreview.classList.add("d-none");
    if (uploadBox) uploadBox.classList.remove("d-none");
    console.log("🎯 Form opened, setting up image upload...");
    setTimeout(() => {
      setupImageUpload();
    }, 100);
  });
  cancelBtn.addEventListener("click", () => {
    productForm.classList.add("d-none");
    productTable.classList.remove("d-none");
    form.reset();
    document.querySelectorAll(".color-option").forEach((color) => {
      color.classList.remove("selected");
    });
    document.querySelectorAll(".size-option").forEach((size) => {
      size.classList.remove("selected");
    });
    if (typeof uploadedImages !== "undefined") {
      uploadedImages = [];
      if (typeof displayImages === "function") {
        displayImages();
      }
    }
    const imagePreview = document.getElementById("imagePreview");
    const uploadBox = document.getElementById("uploadBox");
    if (imagePreview) imagePreview.classList.add("d-none");
    if (uploadBox) uploadBox.classList.remove("d-none");
  });
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
  if (categorySelect) {
    categorySelect.addEventListener("change", updateSubCategories);
  }
  setupFormSubmission();
  const clearProductsBtn = document.getElementById("clearProductsBtn");
  if (clearProductsBtn) {
    clearProductsBtn.addEventListener("click", async () => {
      if (
        confirm(
          "⚠️ WARNING: This will delete ALL products permanently!\n\nAre you absolutely sure?"
        )
      ) {
        if (confirm("This action cannot be undone. Delete all products?")) {
          try {
            localStorage.removeItem("luvinaProducts");
            localStorage.removeItem("luvinaProductsInitialized");
            products = [];
            displayProducts();
            alert("✅ All products have been cleared successfully!");
          } catch (error) {
            console.error("Error clearing products:", error);
            alert("❌ Failed to clear products!");
          }
        }
      }
    });
  }
  const generateIdBtn = document.getElementById("generateIdBtn");
  const productIdInput = document.getElementById("productId");
  if (generateIdBtn && productIdInput) {
    generateIdBtn.addEventListener("click", async () => {
      const currentProducts = await getProducts();
      let maxId = 0;
      if (currentProducts && currentProducts.length > 0) {
        maxId = Math.max(...currentProducts.map((p) => parseInt(p.id) || 0));
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
function updateSubCategories() {
  const categorySelect = document.getElementById("category");
  const subCategorySelect = document.getElementById("subCategory");
  const sizeOptions = document.querySelectorAll(".size-option");
  if (!categorySelect || !subCategorySelect) return;
  const value = categorySelect.value;
  subCategorySelect.innerHTML = '<option value="">Select Sub Category</option>';
  if (value === "bags") {
    ["Hand Bag", "Beach Bag", "Shoulder Bag", "Crossbody Bag"].forEach(
      (sub) => {
        const opt = document.createElement("option");
        opt.value = sub;
        opt.textContent = sub;
        subCategorySelect.appendChild(opt);
      }
    );
    sizeOptions.forEach((size) => {
      size.classList.remove("selected");
      size.style.pointerEvents = "none";
      size.style.opacity = "0.4";
    });
  } else if (value === "shoes") {
    ["Sandals", "Heels", "Sneakers", "Flats"].forEach((sub) => {
      const opt = document.createElement("option");
      opt.value = sub;
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
function setupFormSubmission() {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = parseInt(document.getElementById("productId").value);
    const name = document.getElementById("productName").value;
    const category = document.getElementById("category").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const description = document.getElementById("description").value;
    const subCategory = document.getElementById("subCategory").value;
    const rating = parseFloat(document.getElementById("rating")?.value) || 4.5;
    const selectedColors = [];
    document.querySelectorAll(".color-option.selected").forEach((color) => {
      const bgColor = color.style.backgroundColor;
      if (bgColor) {
        selectedColors.push(bgColor);
      }
    });
    const selectedSizes = [];
    document.querySelectorAll(".size-option.selected").forEach((size) => {
      selectedSizes.push(size.textContent.trim());
    });
    if (!id || !name || !category || !price || !stock || !description) {
      alert("Please fill all required fields!");
      return;
    }
    const editingProductId = document.getElementById("editingProductId");
    const originalProductData = document.getElementById("originalProductData");
    let originalProduct = {};
    if (originalProductData) {
      try {
        originalProduct = JSON.parse(originalProductData.value);
      } catch (e) {
        console.error("Error parsing original product data:", e);
      }
    }
    let productImages = ["https://via.placeholder.com/150"];
    if (typeof uploadedImages !== "undefined" && uploadedImages.length > 0) {
      productImages = uploadedImages.map((img) => img.data || img);
    } else if (originalProduct.images && originalProduct.images.length > 0) {
      productImages = originalProduct.images;
    } else if (originalProduct.image) {
      productImages = [originalProduct.image];
    }
    if (editingProductId) {
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
          selectedSizes.length > 0
            ? selectedSizes
            : originalProduct.sizes || [],
        rating: rating,
        images: productImages,
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
        rating: 4.5,
        images: productImages,
      };
      const success = await addProduct(newProduct);
      if (!success) {
        alert("Failed to add product!");
        return;
      }
      alert("Product added successfully!");
    }
    products = await getProducts();
    displayProducts();
    productForm.classList.add("d-none");
    productTable.classList.remove("d-none");
    form.reset();
    document.querySelectorAll(".color-option").forEach((color) => {
      color.classList.remove("selected");
    });
    document.querySelectorAll(".size-option").forEach((size) => {
      size.classList.remove("selected");
    });
    if (typeof uploadedImages !== "undefined") {
      uploadedImages = [];
      if (typeof displayImages === "function") {
        displayImages();
      }
    }
  });
}
let uploadedImages = [];
let imageUploadSetup = false;
function setupImageUpload() {
  if (imageUploadSetup) {
    console.log("⏭️ Image upload already set up, skipping...");
    return;
  }
  console.log("🔧 Setting up image upload...");
  const uploadBox = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer"
  );
  console.log("Upload Box:", uploadBox);
  console.log("File Input:", fileInput);
  console.log("Preview Container:", imagePreviewContainer);
  if (!uploadBox) {
    console.error("❌ Upload box (dropZone) not found!");
    return;
  }
  if (!fileInput) {
    console.error("❌ File input not found!");
    return;
  }
  console.log("✅ All elements found, attaching event listeners...");
  uploadBox.addEventListener("click", function (e) {
    console.log("📦 Upload box clicked!");
    e.preventDefault();
    e.stopPropagation();
    const originalPointerEvents = fileInput.style.pointerEvents;
    fileInput.style.pointerEvents = "auto";
    fileInput.click();
    setTimeout(() => {
      fileInput.style.pointerEvents = originalPointerEvents;
    }, 100);
  });
  const uploadText = uploadBox.querySelector("p");
  if (uploadText) {
    uploadText.style.cursor = "pointer";
    uploadText.addEventListener("click", function (e) {
      e.stopPropagation();
      fileInput.click();
    });
  }
  const uploadIcon = uploadBox.querySelector("i");
  if (uploadIcon) {
    uploadIcon.style.cursor = "pointer";
    uploadIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      fileInput.click();
    });
  }
  const uploadButton = document.getElementById("uploadButton");
  if (uploadButton) {
    uploadButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("📁 Button clicked!");
      const originalPointerEvents = fileInput.style.pointerEvents;
      fileInput.style.pointerEvents = "auto";
      fileInput.click();
      setTimeout(() => {
        fileInput.style.pointerEvents = originalPointerEvents;
      }, 100);
    });
  }
  uploadBox.addEventListener("mouseenter", function () {
    uploadBox.style.borderColor = "#635BFF";
    uploadBox.style.backgroundColor = "#f8f9ff";
  });
  uploadBox.addEventListener("mouseleave", function () {
    uploadBox.style.borderColor = "#ddd";
    uploadBox.style.backgroundColor = "transparent";
  });
  uploadBox.addEventListener("dragover", function (e) {
    e.preventDefault();
    uploadBox.style.borderColor = "#635BFF";
    uploadBox.style.backgroundColor = "#f0f0ff";
  });
  uploadBox.addEventListener("dragleave", function (e) {
    e.preventDefault();
    uploadBox.style.borderColor = "#ccc";
    uploadBox.style.backgroundColor = "transparent";
  });
  uploadBox.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadBox.style.borderColor = "#ccc";
    uploadBox.style.backgroundColor = "transparent";
    const files = e.dataTransfer.files;
    handleFiles(files);
  });
  fileInput.addEventListener("change", function (e) {
    console.log("📁 Files selected:", e.target.files.length);
    const files = e.target.files;
    handleFiles(files);
    fileInput.value = "";
  });
  imageUploadSetup = true;
  console.log("✅ Image upload setup complete!");
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
      const imageData = {
        name: file.name,
        data: e.target.result,
        size: file.size,
      };
      uploadedImages.push(imageData);
      displayImages();
    };
    reader.readAsDataURL(file);
  });
}
function displayImages() {
  const imagePreviewContainer = document.getElementById(
    "imagePreviewContainer"
  );
  if (!imagePreviewContainer) {
    console.log("Image preview container not found");
    return;
  }
  if (uploadedImages.length === 0) {
    imagePreviewContainer.style.display = "none";
    return;
  }
  imagePreviewContainer.style.display = "block";
  imagePreviewContainer.innerHTML = '<h6 class="mb-3">Uploaded Images:</h6>';
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
    deleteBtn.onclick = () => removeImage(index);
    imgWrapper.appendChild(imgElement);
    imgWrapper.appendChild(deleteBtn);
    imagesGrid.appendChild(imgWrapper);
  });
  imagePreviewContainer.appendChild(imagesGrid);
}
function removeImage(index) {
  uploadedImages.splice(index, 1);
  displayImages();
}
const originalEditProduct = window.editProduct;
window.editProduct = function (productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  if (originalEditProduct) {
    originalEditProduct(productId);
  }
  if (product.images && product.images.length > 0) {
    uploadedImages = [...product.images];
    displayImages();
  } else {
    uploadedImages = [];
    displayImages();
  }
  document.querySelectorAll(".color-option").forEach((color) => {
    color.classList.remove("selected");
  });
  if (product.colors) {
    product.colors.forEach((selectedColor) => {
      document.querySelectorAll(".color-option").forEach((color) => {
        if (color.style.backgroundColor === selectedColor) {
          color.classList.add("selected");
        }
      });
    });
  }
  document.querySelectorAll(".size-option").forEach((size) => {
    size.classList.remove("selected");
  });
  if (product.sizes) {
    product.sizes.forEach((selectedSize) => {
      document.querySelectorAll(".size-option").forEach((size) => {
        if (size.textContent === selectedSize) {
          size.classList.add("selected");
        }
      });
    });
  }
};
