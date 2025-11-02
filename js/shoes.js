document.addEventListener("DOMContentLoaded", async () => {
  const shoesCon = document.getElementById("bags-con"); 
  const buttons = document.querySelectorAll(".btn-group .btn");
  const searchInput = document.querySelector(".search-bar input"); 
  let allProducts = [];
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
    const data = allProducts;
    const shoes = allProducts.filter(
      (item) => item.Category && item.Category.trim().toLowerCase() === "shoes"
    );
    const savedFilter = localStorage.getItem("selectedShoeCategory");
    displayProducts(savedFilter ? savedFilter : "all", shoes);
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
      if (!buttonActivated) {
        buttons[0].classList.add("active");
      }
      localStorage.removeItem("selectedShoeCategory");
    } else {
      buttons[0].classList.add("active"); 
    }
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");
        localStorage.setItem("selectedShoeCategory", filter);
        displayProducts(filter, shoes);
      });
    });
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm === "") {
          displayProducts("all", shoes);
          buttons.forEach((b) => b.classList.remove("active"));
          buttons[0].classList.add("active");
          return;
        }
        const filteredShoes = shoes.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description?.toLowerCase().includes(searchTerm) ||
            item.subCategory?.toLowerCase().includes(searchTerm)
        );
        buttons.forEach((b) => b.classList.remove("active"));
        displaySearchResults(filteredShoes);
      });
    }
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
  function displayProducts(filter, shoes) {
    shoesCon.innerHTML = "";
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
      shoesCon.appendChild(col);
    });
  }
});
