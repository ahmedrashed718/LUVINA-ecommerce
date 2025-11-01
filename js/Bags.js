document.addEventListener("DOMContentLoaded", async () => {
  const bagsCon = document.getElementById("bags-con");
  const buttons = document.querySelectorAll(".btn-group .btn");
  const searchInput = document.querySelector(".search-bar input");
  let allBags = [];
  let currentFilter = "all";

  // ✅ Get products from localStorage (auto-initializes on first load)
  try {
    const allProducts = await getProducts();

    if (allProducts.length === 0) {
      bagsCon.innerHTML = `
        <div class="alert alert-warning text-center" role="alert">
          <h4>⚠️ Failed to Load Products</h4>
          <p>Please make sure Products.json file exists.</p>
        </div>
      `;
      return;
    }

    // Get only products that belong to Bags category
    allBags = allProducts.filter(
      (item) => item.Category?.toLowerCase() === "bags"
    );

    // ✅ Check if there's a selected category saved in localStorage
    const storedCategory = localStorage.getItem("selectedBagCategory");

    if (storedCategory) {
      currentFilter = storedCategory;
      localStorage.removeItem("selectedBagCategory");
    }

    // ✅ Activate correct filter button
    activateButton(currentFilter);

    // ✅ Display filtered products initially
    displayProducts(currentFilter);

    // ✅ Listen to search input
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      displayProducts(currentFilter, query);
    });
  } catch (error) {
    console.error("Error loading products from localStorage:", error);
    bagsCon.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        <h4>❌ Error</h4>
        <p>${error.message}</p>
        <a href="../init-storage-once.html" class="btn btn-primary mt-3">Initialize Storage</a>
      </div>
    `;
  }

  // ✅ Function to activate filter button
  function activateButton(filter) {
    buttons.forEach((btn) => {
      const btnFilter = btn.getAttribute("data-filter")?.toLowerCase();
      btn.classList.toggle("active", btnFilter === filter.toLowerCase());
    });
  }

  // ✅ Function to display products
  function displayProducts(filter, searchQuery = "") {
    bagsCon.innerHTML = "";

    const normalizedFilter = filter.toLowerCase();

    let filtered =
      filter === "all"
        ? allBags
        : allBags.filter(
            (item) =>
              item.subCategory &&
              item.subCategory.toLowerCase() === normalizedFilter
          );

    // ✅ Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.description?.toLowerCase().includes(searchQuery)
      );
    }

    // ✅ No results message
    if (filtered.length === 0) {
      bagsCon.innerHTML = `
        <p class="text-center text-muted py-5">No products found.</p>
      `;
      return;
    }

    // ✅ Create product cards
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

      // ✅ Click on card OR button → go to product details
      const card = col.querySelector(".luv-card");
      card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "./ProductDetails.html";
      });

      bagsCon.appendChild(col);
    });
  }

  // ✅ Filter buttons functionality
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      currentFilter = filter;
      displayProducts(filter, searchInput.value.trim().toLowerCase());
    });
  });
});
