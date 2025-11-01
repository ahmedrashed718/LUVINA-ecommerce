/**
 * LUVINA Wishlist Manager
 * Manages wishlist with counter badge
 */

// ==================== WISHLIST FUNCTIONS ====================

/**
 * Get user-specific wishlist key
 */
function getWishlistKey() {
  try {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    const userEmail = loggedInUser.email;

    if (!userEmail) {
      return null;
    }

    return `luvinaWishlist_${userEmail}`;
  } catch (error) {
    console.error("Error getting wishlist key:", error);
    return null;
  }
}

/**
 * Get all wishlist items
 */
function getWishlistItems() {
  try {
    const wishlistKey = getWishlistKey();

    if (!wishlistKey) {
      return [];
    }

    const wishlist = localStorage.getItem(wishlistKey);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error("Error reading wishlist:", error);
    return [];
  }
}

/**
 * Save wishlist
 */
function saveWishlist(items) {
  try {
    const wishlistKey = getWishlistKey();

    if (!wishlistKey) {
      return false;
    }

    localStorage.setItem(wishlistKey, JSON.stringify(items));
    updateWishlistBadge();
    return true;
  } catch (error) {
    console.error("Error saving wishlist:", error);
    return false;
  }
}

/**
 * Add item to wishlist
 */
function addToWishlist(product) {
  try {
    let wishlist = getWishlistItems();

    // Check if already in wishlist
    const exists = wishlist.some((item) => item.id === product.id);

    if (exists) {
      console.log("Already in wishlist");
      return false;
    }

    // Add to wishlist
    wishlist.push({
      ...product,
      addedToWishlistAt: new Date().toISOString(),
    });

    saveWishlist(wishlist);
    console.log("✅ Added to wishlist:", product.name);
    return true;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return false;
  }
}

/**
 * Remove from wishlist
 */
function removeFromWishlist(productId) {
  try {
    let wishlist = getWishlistItems();
    wishlist = wishlist.filter((item) => item.id !== productId);
    saveWishlist(wishlist);
    return true;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return false;
  }
}

/**
 * Check if product is in wishlist
 */
function isInWishlist(productId) {
  const wishlist = getWishlistItems();
  return wishlist.some((item) => item.id === productId);
}

/**
 * Get wishlist count
 */
function getWishlistCount() {
  const wishlist = getWishlistItems();
  return wishlist.length;
}

/**
 * Clear wishlist
 */
function clearWishlist() {
  try {
    const wishlistKey = getWishlistKey();

    if (!wishlistKey) {
      return false;
    }

    localStorage.removeItem(wishlistKey);
    updateWishlistBadge();
    return true;
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return false;
  }
}

// ==================== WISHLIST BADGE UI ====================

/**
 * Update wishlist counter badge
 */
function updateWishlistBadge() {
  const count = getWishlistCount();
  const badges = document.querySelectorAll(".wishlist-count-badge");

  badges.forEach((badge) => {
    if (count > 0) {
      badge.textContent = count > 99 ? "99+" : count;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  });
}

/**
 * Initialize wishlist badge on page load
 */
function initWishlistBadge() {
  const wishlistLinks = document.querySelectorAll(
    'a[href*="wishlist.html"], a[href*="Wishlist.html"]'
  );

  wishlistLinks.forEach((link) => {
    if (!link.querySelector(".wishlist-count-badge")) {
      const badge = document.createElement("span");
      badge.className = "wishlist-count-badge";
      badge.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff1744;
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

  updateWishlistBadge();
}

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWishlistBadge);
} else {
  initWishlistBadge();
}

// Update when wishlist changes in other tabs
window.addEventListener("storage", (e) => {
  // Check if any user wishlist key changed
  if (e.key && e.key.startsWith("luvinaWishlist_")) {
    updateWishlistBadge();
  }
});

// Periodic update
setInterval(updateWishlistBadge, 1000);
