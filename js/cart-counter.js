function getUserCart() {
  try {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    const userEmail = loggedInUser.email;
    if (!userEmail) {
      return [];
    }
    const userCartKey = `cart_${userEmail}`;
    const cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    return cart;
  } catch (error) {
    console.error("Error reading user cart:", error);
    return [];
  }
}
function saveUserCart(cart) {
  try {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    const userEmail = loggedInUser.email;
    if (!userEmail) {
      return false;
    }
    const userCartKey = `cart_${userEmail}`;
    localStorage.setItem(userCartKey, JSON.stringify(cart));
    updateCartBadge();
    return true;
  } catch (error) {
    console.error("Error saving user cart:", error);
    return false;
  }
}
function getCartCount() {
  try {
    const cart = getUserCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  } catch (error) {
    return 0;
  }
}
function updateCartBadge() {
  const count = getCartCount();
  let badge = document.querySelector(".cart-count-badge");
  if (!badge) {
    const cartLinks = document.querySelectorAll('a[href*="Cart.html"]');
    cartLinks.forEach((link) => {
      if (!link.querySelector(".cart-count-badge")) {
        badge = document.createElement("span");
        badge.className = "cart-count-badge";
        badge.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: bold;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    z-index: 10;
                `;
        link.style.position = "relative";
        link.appendChild(badge);
      }
    });
  }
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach((badge) => {
    if (count > 0) {
      badge.textContent = count > 99 ? "99+" : count;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
window.addEventListener("storage", (e) => {
  if (e.key && e.key.startsWith("cart_")) {
    updateCartBadge();
  }
});
setInterval(updateCartBadge, 1000);
