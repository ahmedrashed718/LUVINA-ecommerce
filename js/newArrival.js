document.addEventListener("DOMContentLoaded", async () => {
  const itemsCon = document.getElementById("items-con");
  const buttons = document.querySelectorAll(".btn-group .btn");
  const searchInput = document.querySelector(".search-bar input"); 
  let allProducts = [];
  let currentFilter = "all";
  let searchQuery = "";
  try {
    allProducts = await getProducts();
    if (allProducts.length === 0) {
      itemsCon.innerHTML = `
        <div class="alert alert-warning text-center" role="alert">
          <h4>⚠️ Failed to Load Products</h4>
          <p>Please make sure Products.json file exists.</p>
        </div>
      `;
      return;
    }
    displayProducts("all", "");
  } catch (error) {
    console.error("Error loading products from localStorage:", error);
    itemsCon.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        <h4>❌ Error</h4>
        <p>${error.message}</p>
      </div>
    `;
  }
  function displayProducts(filter, query) {
    itemsCon.innerHTML = "";
    let filtered =
      filter === "all"
        ? allProducts
        : allProducts.filter(
            (item) =>
              item.Category &&
              item.Category.trim().toLowerCase() === filter.toLowerCase()
          );
    if (query && query.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (filtered.length === 0) {
      itemsCon.innerHTML = `
        <p class="text-center text-muted py-5">No products found.</p>
      `;
      return;
    }
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
      card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "./ProductDetails.html";
      });
      itemsCon.appendChild(col);
    });
  }
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      displayProducts(currentFilter, searchQuery);
    });
  });
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    displayProducts(currentFilter, searchQuery);
  });
});
