document.addEventListener("DOMContentLoaded", () => {
  const bagsCon = document.getElementById("bags-con");
  const buttons = document.querySelectorAll(".btn-group .btn");
  const searchInput = document.querySelector(".search-bar input");
  let allBags = [];
  let currentFilter = "all";

  // ✅ Fetch products from JSON file
  fetch("../products.json")
    .then((response) => response.json())
    .then((data) => {
      // Get only products that belong to Bags category
      allBags = data.filter((item) => item.Category?.toLowerCase() === "bags");

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
    })
    .catch((error) => console.error("Error loading products:", error));

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
            <button class="btn luv-card__btn">Add to Cart</button>
          </div>
        </div>
      `;

      // ✅ Click on card → go to product details
      const card = col.querySelector(".luv-card");
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("luv-card__btn")) return;

        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "./productDetails.html";
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
