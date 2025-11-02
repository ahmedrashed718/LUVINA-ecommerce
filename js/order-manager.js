const ORDERS_KEY = "orders";
function getAllOrders() {
  try {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}
function getUserOrders() {
  try {
    const allOrders = getAllOrders();
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    const userEmail = loggedInUser.email;
    if (!userEmail) {
      return []; 
    }
    return allOrders.filter((order) => order.email === userEmail);
  } catch (error) {
    console.error("Error getting user orders:", error);
    return [];
  }
}
function saveOrder(orderData) {
  try {
    const orders = getAllOrders();
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    const orderNumber = "LUV" + Date.now();
    const newOrder = {
      orderNumber: orderNumber,
      email: loggedInUser.email || orderData.email || "guest@luvina.com",
      customerName:
        loggedInUser.fullname || loggedInUser.name || orderData.name || "Guest",
      address: loggedInUser.address || orderData.address || "No address",
      phone:
        loggedInUser.phone || loggedInUser.mobile || orderData.phone || "N/A",
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shipping: orderData.shipping || 0,
      total: orderData.total || 0,
      status: "Pending",
      orderDate: new Date().toISOString(),
      estimatedDelivery: orderData.estimatedDelivery || calculateDeliveryDate(),
      paymentMethod: orderData.paymentMethod || "Cash on Delivery",
    };
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    console.log("✅ Order saved:", orderNumber);
    return orderNumber;
  } catch (error) {
    console.error("Error saving order:", error);
    return null;
  }
}
function getOrderByNumber(orderNumber) {
  const orders = getAllOrders();
  return orders.find((order) => order.orderNumber === orderNumber);
}
function updateOrderStatus(orderNumber, newStatus) {
  try {
    const orders = getAllOrders();
    const index = orders.findIndex(
      (order) => order.orderNumber === orderNumber
    );
    if (index !== -1) {
      orders[index].status = newStatus;
      orders[index].updatedAt = new Date().toISOString();
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
}
function calculateDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function getUserOrdersCount() {
  return getUserOrders().length;
}
function getUserTotalSpent() {
  const orders = getUserOrders();
  return orders.reduce((total, order) => total + (order.total || 0), 0);
}
function formatOrderDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function getStatusBadgeClass(status) {
  const statusMap = {
    Pending: "bg-warning",
    Processing: "bg-info",
    Shipped: "bg-primary",
    Delivered: "bg-success",
    Cancelled: "bg-danger",
  };
  return statusMap[status] || "bg-secondary";
}
