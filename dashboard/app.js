/**
 * app.js
 * Handles:
 * - Dark Mode Toggle (with icon switch)
 * - Logout function
 * - Product Fetch & Display
 * - View Details Modal
 * - Favorite Toggle
 * - Category Filtering with Checkboxes
 */

let allProducts = []; // Stores all products after fetch

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  // Attach change listeners to checkboxes
  document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
  });
});

// Logout function
function logout() {
  alert("Logged out!");
  window.location.href = "../login.html";
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const themeIcon = document.getElementById("theme-toggle");
  const isDark = document.body.classList.contains("dark-mode");

  themeIcon.classList = isDark
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
  themeIcon.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}

// Fetch products from API and render them
function fetchProducts() {
  const container = document.getElementById("product-container");

  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      allProducts = data; // Store for filtering
      renderProducts(allProducts);
    })
    .catch(err => {
      container.innerHTML = "<p>Failed to load products.</p>";
      console.error(err);
    });
}

// Render product cards
function renderProducts(products) {
  const container = document.getElementById("product-container");

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.title}" width="100" height="100">
      <h4>${product.title}</h4>
      <p>$${product.price}</p>
      <div class="card-buttons">
        <button 
          class="view-btn"
          data-title="${encodeURIComponent(product.title)}"
          data-image="${encodeURIComponent(product.image)}"
          data-price="${product.price}"
          data-description="${encodeURIComponent(product.description)}"
          data-category="${encodeURIComponent(product.category)}"
          onclick="handleViewClick(this)"
        >
          View Details
        </button>
        <i class="fa-solid fa-heart favorite-icon" onclick="toggleFavorite(this)"></i>
      </div>
    </div>
  `).join('');
}

// Handle View Details button click
function handleViewClick(button) {
  const title = decodeURIComponent(button.dataset.title);
  const image = decodeURIComponent(button.dataset.image);
  const price = button.dataset.price;
  const description = decodeURIComponent(button.dataset.description);
  const category = decodeURIComponent(button.dataset.category);

  const product = { title, image, price, description, category };
  showModal(product);
}

// Show modal for selected product
function showModal(product) {
  const modal = document.createElement('div');
  modal.classList.add('modal-overlay');
  modal.innerHTML = `
    <div class="modal">
      <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <img src="${product.image}" alt="${product.title}" class="modal-img">
      <h3>${product.title}</h3>
      <p><strong>Price:</strong> $${product.price}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p>${product.description}</p>
    </div>
  `;
  document.body.appendChild(modal);
}

// Toggle heart icon (favorite)
function toggleFavorite(icon) {
  icon.classList.toggle("favorited");
}

// Filter products by selected categories
function filterProducts() {
  const selectedCategories = Array.from(document.querySelectorAll('.filter-section input[type="checkbox"]:checked'))
    .map(cb => cb.value.toLowerCase());

  const filtered = selectedCategories.length === 0
    ? allProducts
    : allProducts.filter(product =>
        selectedCategories.includes(product.category.toLowerCase())
      );

  renderProducts(filtered);
}
