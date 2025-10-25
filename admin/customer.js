// ================== SELECT ELEMENTS ==================
const customerForm = document.getElementById("formCustomer");
const customerTable = document.getElementById("customerTable");
const customerFormContainer = document.getElementById("customerForm");
const addCustomerBtn = document.getElementById("addCustomerBtn");
const cancelFormBtn = document.getElementById("cancelForm");
const customersBody = document.getElementById("customersBody");

const nameInput = document.getElementById("customerName");
const emailInput = document.getElementById("customerEmail");
const passInput = document.getElementById("customerPassword");
const phoneInput = document.getElementById("customerPhone");
const addressInput = document.getElementById("customerAddress");
const imageInput = document.getElementById("customerImage");
const imagePreview = document.getElementById("imagePreview");
const idInput = document.getElementById("customerId");

let customers = JSON.parse(localStorage.getItem("customers")) || [];
let editingIndex = null;

// ================== IMAGE PREVIEW ==================
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// ================== SHOW / HIDE FORM ==================
addCustomerBtn.addEventListener("click", () => {
  customerTable.style.display = "none";
  customerFormContainer.style.display = "block";
  resetForm();
});

cancelFormBtn.addEventListener("click", () => {
  customerTable.style.display = "block";
  customerFormContainer.style.display = "none";
  resetForm();
});

// ================== VALIDATION FUNCTION ==================
function validateForm() {
  let valid = true;

  // الاسم
  if (nameInput.value.trim().length < 3) {
    nameInput.classList.add("is-invalid");
    valid = false;
  } else nameInput.classList.remove("is-invalid");

  // الإيميل
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailInput.classList.add("is-invalid");
    valid = false;
  } else emailInput.classList.remove("is-invalid");

  // الباسورد
  if (passInput.value.trim().length < 6) {
    passInput.classList.add("is-invalid");
    valid = false;
  } else passInput.classList.remove("is-invalid");

  // الموبايل
  const phoneRegex = /^(\+201|01)[0-2,5]{1}[0-9]{8}$/;
  if (phoneInput.value.trim() && !phoneRegex.test(phoneInput.value.trim())) {
    phoneInput.classList.add("is-invalid");
    valid = false;
  } else phoneInput.classList.remove("is-invalid");

  // العنوان
  if (addressInput.value.trim().length < 5) {
    addressInput.classList.add("is-invalid");
    valid = false;
  } else addressInput.classList.remove("is-invalid");

  // الصورة
  if (!imagePreview.src || imagePreview.src === window.location.href) {
    imageInput.classList.add("is-invalid");
    valid = false;
  } else imageInput.classList.remove("is-invalid");

  return valid;
}

// ================== RESET FORM ==================
function resetForm() {
  customerForm.reset();
  imagePreview.src = "";
  imagePreview.style.display = "none";
  idInput.value = "";
  editingIndex = null;
  customerForm.querySelectorAll(".is-invalid").forEach((el) => {
    el.classList.remove("is-invalid");
  });
}

// ================== RENDER TABLE ==================
function renderCustomers() {
  customersBody.innerHTML = "";

  if (customers.length === 0) {
    customersBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No customers found</td></tr>`;
    return;
  }

  customers.forEach((customer, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${customer.image}" class="rounded-circle me-2" width="40" height="40"> ${customer.name}</td>
      <td>${customer.email}</td>
      <td>${customer.date}</td>
      <td>${customer.totalSpent} EGP</td>
      <td>
        <a href="#" class="edit text-primary me-3" data-index="${index}">Edit</a>
        <a href="#" class="delete text-danger" data-index="${index}">Delete</a>
      </td>
    `;
    customersBody.appendChild(tr);
  });
}

// ================== ADD / EDIT CUSTOMER ==================
customerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const newCustomer = {
    id: idInput.value || Date.now(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passInput.value.trim(),
    phone: phoneInput.value.trim(),
    address: addressInput.value.trim(),
    image: imagePreview.src,
    totalSpent: Math.floor(Math.random() * 1000) + 100, // عشوائي مؤقت
    date: new Date().toLocaleDateString(),
  };

  if (editingIndex !== null) {
    customers[editingIndex] = newCustomer; // تعديل
  } else {
    customers.push(newCustomer); // إضافة
  }

  localStorage.setItem("customers", JSON.stringify(customers));
  renderCustomers();
  resetForm();

  customerTable.style.display = "block";
  customerFormContainer.style.display = "none";
});

// ================== EDIT / DELETE EVENTS ==================
customersBody.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;
  const index = target.dataset.index;

  if (target.classList.contains("edit")) {
    const c = customers[index];
    editingIndex = index;

    nameInput.value = c.name;
    emailInput.value = c.email;
    passInput.value = c.password;
    phoneInput.value = c.phone;
    addressInput.value = c.address;
    imagePreview.src = c.image;
    imagePreview.style.display = "block";
    idInput.value = c.id;

    customerTable.style.display = "none";
    customerFormContainer.style.display = "block";
  }

  if (target.classList.contains("delete")) {
    if (confirm("Are you sure you want to delete this customer?")) {
      customers.splice(index, 1);
      localStorage.setItem("customers", JSON.stringify(customers));
      renderCustomers();
    }
  }
});

// ================== INIT ==================
renderCustomers();
