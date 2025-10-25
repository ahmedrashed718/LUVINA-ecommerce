document.addEventListener("DOMContentLoaded", () => {
  const itemsCon = document.getElementById("items-con");
  const buttons = document.querySelectorAll(".btn-group .btn");
  const searchInput = document.querySelector(".search-bar input"); // 🟢 سيرش الناف بار
  let allProducts = [];
  let currentFilter = "all";
  let searchQuery = "";

  // ✅ تحميل المنتجات من JSON
  fetch("../products.json")
    .then((response) => response.json())
    .then((data) => {
      allProducts = data;
      displayProducts("all", "");
    })
    .catch((error) => console.error("Error loading products:", error));

  // ✅ دالة عرض المنتجات
  function displayProducts(filter, query) {
    itemsCon.innerHTML = "";

    // فلترة حسب النوع (All / Shoes / Bags)
    let filtered =
      filter === "all"
        ? allProducts
        : allProducts.filter(
            (item) =>
              item.Category &&
              item.Category.trim().toLowerCase() === filter.toLowerCase()
          );

    // 🟢 تطبيق البحث
    if (query && query.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // في حالة عدم وجود نتائج
    if (filtered.length === 0) {
      itemsCon.innerHTML = `
        <p class="text-center text-muted py-5">No products found.</p>
      `;
      return;
    }

    // 🟢 إنشاء الكروت
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

      // 🟢 لما تضغط على الكارت
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("luv-card__btn")) return;
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "./productDetails.html";
      });

      itemsCon.appendChild(col);
    });
  }

  // ✅ أزرار الفلترة
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.getAttribute("data-filter");
      displayProducts(currentFilter, searchQuery);
    });
  });

  // ✅ تشغيل السيرش بتاع الناف بار
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    displayProducts(currentFilter, searchQuery);
  });
});
