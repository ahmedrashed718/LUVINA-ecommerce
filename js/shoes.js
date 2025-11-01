document.addEventListener("DOMContentLoaded", async () => {
  const shoesCon = document.getElementById("bags-con"); // container for shoes
  const buttons = document.querySelectorAll(".btn-group .btn");
  const searchInput = document.querySelector(".search-bar input"); // ✅ input from navbar
  let allProducts = [];

  // ✅ Get products from localStorage (auto-initializes on first load)
  try {
    allProducts = await getProducts();

    if (allProducts.length === 0) {
      shoesCon.innerHTML = `
        <div class="alert alert-warning text-center" role="alert">
          <h4>⚠️ Failed to Load Products</h4>
          <p>Please make sure Products.json file exists.</p>
        </div>
      `;
      return;
    }

    // Continue with existing logic
    const data = allProducts;

    // ✅ Filter only items where Category = "Shoes"
    const shoes = allProducts.filter(
      (item) => item.Category && item.Category.trim().toLowerCase() === "shoes"
    );

    // ✅ Check if there is a stored shoe category in localStorage
    const savedFilter = localStorage.getItem("selectedShoeCategory");

    // ✅ Display products with saved filter or show all
    displayProducts(savedFilter ? savedFilter : "all", shoes);

    // ✅ Activate the correct button if exists (case-insensitive)
    if (savedFilter) {
      const savedFilterLower = savedFilter.toLowerCase();
      let buttonActivated = false;

      buttons.forEach((b) => {
        const buttonFilter = b.getAttribute("data-filter")?.toLowerCase();
        if (buttonFilter === savedFilterLower) {
          b.classList.add("active");
          buttonActivated = true;
        } else {
          b.classList.remove("active");
        }
      });

      // If no button matched, activate "All"
      if (!buttonActivated) {
        buttons[0].classList.add("active");
      }

      // Clear the saved filter after use
      localStorage.removeItem("selectedShoeCategory");
    } else {
      buttons[0].classList.add("active"); // default to "All"
    }

    // ✅ Handle filter buttons
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        // ✅ Save selected shoe category in localStorage
        localStorage.setItem("selectedShoeCategory", filter);

        displayProducts(filter, shoes);
      });
    });

    // ✅ Handle search (navbar)
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        // لو السيرش فاضي، اعرض كل المنتجات
        if (searchTerm === "") {
          displayProducts("all", shoes);
          buttons.forEach((b) => b.classList.remove("active"));
          buttons[0].classList.add("active");
          return;
        }

        // ✅ فلترة المنتجات حسب الاسم أو الوصف أو الـsubCategory
        const filteredShoes = shoes.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description?.toLowerCase().includes(searchTerm) ||
            item.subCategory?.toLowerCase().includes(searchTerm)
        );

        // ✅ إزالة التفعيل من الأزرار
        buttons.forEach((b) => b.classList.remove("active"));

        // ✅ عرض النتائج
        displaySearchResults(filteredShoes);
      });
    }

    // ✅ دالة عرض نتائج السيرش
    function displaySearchResults(results) {
      shoesCon.innerHTML = "";

      if (results.length === 0) {
        shoesCon.innerHTML = `
            <p class="text-center text-muted py-5">No matching shoes found.</p>
          `;
        return;
      }

      results.forEach((item) => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-lg-3";

        col.innerHTML = `
            <div class="luv-card" style="cursor: pointer;">
              <div class="luv-card__imgbox">
                <img
                  src="${item.images[0]}"
                  class="luv-card__img--main"
                  alt="${item.name}"
                />
                <img
                  src="${item.images[1]}"
                  class="luv-card__img--hover"
                  alt="${item.name} hover"
                />
              </div>
              <div class="luv-card__body">
                <p class="luv-card__title">${item.name}</p>
                <p class="luv-card__price">${item.price} EGP</p>
                <button class="btn luv-card__btn">View Details</button>
              </div>
            </div>
          `;

        const card = col.querySelector(".luv-card");
        const viewBtn = col.querySelector(".luv-card__btn");

        // Click on entire card OR button → go to details
        card.addEventListener("click", () => {
          localStorage.setItem("selectedProduct", JSON.stringify(item));
          window.location.href = "./ProductDetails.html";
        });

        shoesCon.appendChild(col);
      });
    }
  } catch (error) {
    console.error("Error loading products from localStorage:", error);
    shoesCon.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        <h4>❌ Error</h4>
        <p>${error.message}</p>
        <a href="../init-storage-once.html" class="btn btn-primary mt-3">Initialize Storage</a>
      </div>
    `;
  }

  // ✅ Display products function
  function displayProducts(filter, shoes) {
    shoesCon.innerHTML = "";

    // ✅ Filter by subcategory or show all
    const filtered =
      filter === "all"
        ? shoes
        : shoes.filter(
            (item) =>
              item.subCategory &&
              item.subCategory.trim().toLowerCase() === filter.toLowerCase()
          );

    if (filtered.length === 0) {
      shoesCon.innerHTML = `
        <p class="text-center text-muted py-5">No shoes found in this category.</p>
      `;
      return;
    }

    // ✅ Generate cards dynamically
    filtered.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-3";

      col.innerHTML = `
        <div class="luv-card" style="cursor: pointer;">
          <div class="luv-card__imgbox">
            <img
              src="${
                item.images && item.images[0]
                  ? item.images[0]
                  : "https://via.placeholder.com/300"
              }"
              class="luv-card__img--main"
              alt="${item.name}"
            />
            <img
              src="${
                item.images && item.images[1]
                  ? item.images[1]
                  : item.images && item.images[0]
                  ? item.images[0]
                  : "https://via.placeholder.com/300"
              }"
              class="luv-card__img--hover"
              alt="${item.name} hover"
            />
          </div>
          <div class="luv-card__body">
            <p class="luv-card__title">${item.name}</p>
            <p class="luv-card__price">${item.price} EGP</p>
            <button class="btn luv-card__btn">View Details</button>
          </div>
        </div>
      `;

      const card = col.querySelector(".luv-card");

      // Click on entire card OR button → go to details
      card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "./ProductDetails.html";
      });

      shoesCon.appendChild(col);
    });
  }
});
