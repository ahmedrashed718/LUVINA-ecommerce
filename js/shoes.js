document.addEventListener("DOMContentLoaded", () => {
  const shoesCon = document.getElementById("bags-con"); // container for shoes
  const buttons = document.querySelectorAll(".btn-group .btn");
  let allProducts = [];

  // ✅ Fetch products from JSON file
  fetch("../products.json")
    .then((response) => response.json())
    .then((data) => {
      allProducts = data;

      // ✅ Filter only items where Category = "Shoes"
      const shoes = allProducts.filter(
        (item) =>
          item.Category && item.Category.trim().toLowerCase() === "shoes"
      );

      displayProducts("all", shoes);

      // ✅ Handle filter buttons
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          const filter = btn.getAttribute("data-filter");
          displayProducts(filter, shoes);
        });
      });
    })
    .catch((error) => console.error("Error loading products:", error));

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

      const card = col.querySelector(".luv-card");
      const addToCartBtn = col.querySelector(".luv-card__btn");

      // ✅ Go to product details
      card.addEventListener("click", (e) => {
        // if (e.target === addToCartBtn) return;
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "./productDetails.html";
      });

      shoesCon.appendChild(col);
    });
  }
});
