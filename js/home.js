document.addEventListener("DOMContentLoaded", async () => {
  const slide1 = document.getElementById("Featured_Products_Slide1");
  const slide2 = document.getElementById("Featured_Products_Slide2");
  const newArrivalsContainer = document.getElementById("new-arrivals-con");
  try {
    const data = await getProducts();
    if (data.length === 0) {
      const errorMsg = `
        <div class="alert alert-warning text-center m-5" role="alert">
          <h4>⚠️ Failed to Load Products</h4>
          <p>Please make sure Products.json file exists.</p>
        </div>
      `;
      if (slide1) slide1.innerHTML = errorMsg;
      if (newArrivalsContainer) newArrivalsContainer.innerHTML = errorMsg;
      return;
    }
    const featured = data.slice(0, 8);
    const firstSlide = featured.slice(0, 4);
    const secondSlide = featured.slice(4, 8);
    const createCard = (product) => {
      return `
          <div class="col-12 col-md-4 col-lg-3">
            <div class="card text-center border-0 shadow-sm product-card" style="cursor:pointer">
              <img
                src="${
                  product.images && product.images[0]
                    ? product.images[0]
                    : "https://via.placeholder.com/300"
                }"
                class="card-img-top"
                alt="${product.name}"
              />
              <div class="card-body">
                <p class="text-secondary small mb-1">${product.name}</p>
                <p class="mb-2">
                  <span class="text-decoration-line-through text-muted small me-2">
                    ${Math.round(product.price * 1.2)} EGP
                  </span>
                  <span class="fw-bold text-danger">${product.price} EGP</span>
                </p>
                <button class="btn btn-cart w-100 btn-sm">View Details</button>
              </div>
            </div>
          </div>
        `;
    };
    firstSlide.forEach((product) => {
      slide1.innerHTML += createCard(product);
    });
    secondSlide.forEach((product) => {
      slide2.innerHTML += createCard(product);
    });
    const newArrivals = data.slice(-4);
    newArrivals.forEach((product) => {
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-3";
      card.innerHTML = `
          <div class="card text-center border-0 shadow-sm product-card" style="cursor:pointer">
            <div class="position-relative product-img-container">
              <img
                src="${
                  product.images && product.images[0]
                    ? product.images[0]
                    : "https://via.placeholder.com/300"
                }"
                class="main-img"
                alt="${product.name}"
              />
              <img
                src="${
                  product.images && product.images[1]
                    ? product.images[1]
                    : product.images && product.images[0]
                    ? product.images[0]
                    : "https://via.placeholder.com/300"
                }"
                class="hover-img position-absolute top-0 start-0"
                alt="${product.name} Hover"
              />
              <!-- overlay for sizes -->
              <div class="product-overlay d-flex flex-column justify-content-center align-items-center">
                <p class="text-white fw-bold mb-1">Available Sizes:</p>
                <div>
                  ${
                    product.sizes && product.sizes.length > 0
                      ? product.sizes
                          .map(
                            (size) =>
                              `<span class="badge bg-light text-dark mx-1">${size}</span>`
                          )
                          .join("")
                      : '<span class="badge bg-light text-dark mx-1">One Size</span>'
                  }
                </div>
              </div>
            </div>
            <div class="card-body py-3">
              <p class="text-secondary mb-1 small">${product.name}</p>
              <p class="fw-bold mb-2" style="color: #222">
                ${product.price} EGP
              </p>
              <button class="btn btn-cart w-100 btn-sm">View Details</button>
            </div>
          </div>
        `;
      newArrivalsContainer.appendChild(card);
    });
    const allCards = document.querySelectorAll(".product-card");
    allCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        let selectedProduct = null;
        const combinedProducts = [...featured, ...newArrivals];
        selectedProduct = combinedProducts[index] || combinedProducts[0];
        if (selectedProduct) {
          localStorage.setItem(
            "selectedProduct",
            JSON.stringify(selectedProduct)
          );
          window.location.href = "./Pages/ProductDetails.html";
        }
      });
    });
  } catch (error) {
    console.error("Error loading products from localStorage:", error);
    const errorMsg = `
      <div class="alert alert-danger text-center m-5" role="alert">
        <h4>❌ Error</h4>
        <p>${error.message}</p>
        <a href="./init-storage-once.html" class="btn btn-primary mt-3">Initialize Storage</a>
      </div>
    `;
    if (slide1) slide1.innerHTML = errorMsg;
    if (newArrivalsContainer) newArrivalsContainer.innerHTML = errorMsg;
  }
});
