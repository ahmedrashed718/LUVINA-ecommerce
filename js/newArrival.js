document.addEventListener("DOMContentLoaded", () => {
  const itemsCon = document.getElementById("items-con");
  const buttons = document.querySelectorAll(".btn-group .btn");
  let allProducts = [];

  // ✅ Load data from JSON file
  fetch("../products.json")
    .then((response) => response.json())
    .then((data) => {
      allProducts = data;
      displayProducts("all");
    })
    .catch((error) => console.error("Error loading products:", error));

  // ✅ Function to display products
  function displayProducts(filter) {
    itemsCon.innerHTML = "";

    const filtered =
      filter === "all"
        ? allProducts
        : allProducts.filter((item) => item.Category === filter);

    // ✅ If no products found
    if (filtered.length === 0) {
      itemsCon.innerHTML = `
        <p class="text-center text-muted py-5">No products found.</p>
      `;
      return;
    }

    // ✅ Create product cards
    filtered.forEach((item) => {
      // Main column (must be inside .row)
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

      // ✅ When clicking on the card (excluding the button)
      const card = col.querySelector(".luv-card");
      const addToCartBtn = col.querySelector(".luv-card__btn");

      card.addEventListener("click", (e) => {
        // Avoid triggering when clicking the "Add to Cart" button
        // if (e.target === addToCartBtn) return;

        // Save product to localStorage and redirect
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "./productDetails.html";
      });

      itemsCon.appendChild(col);
    });
  }

  // ✅ Filter buttons functionality
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      displayProducts(filter);
    });
  });
});
