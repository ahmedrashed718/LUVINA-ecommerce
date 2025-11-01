/**
 * Simple Cart Counter Badge for LUVINA
 * Shows item count on cart icon in navbar
 */

// Get user's cart from localStorage
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

// Save user's cart to localStorage
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

// Get cart count from existing cart system
function getCartCount() {
  try {
    const cart = getUserCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  } catch (error) {
    return 0;
  }
}

// Update cart counter badge
function updateCartBadge() {
  const count = getCartCount();
  let badge = document.querySelector(".cart-count-badge");

  // Create badge if doesn't exist
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

  // Update all badges
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});

// Update when cart changes in other tabs/windows
window.addEventListener("storage", (e) => {
  // Check if any user cart key changed
  if (e.key && e.key.startsWith("cart_")) {
    updateCartBadge();
  }
});

// Periodically check for updates (in case cart changes via JS)
setInterval(updateCartBadge, 1000);
