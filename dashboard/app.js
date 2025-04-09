let allProducts = []; 
let likedProducts = []; 
let showingLikedOnly = false;

// Initial load
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();

    document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });


    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', filterProducts);
    }

    const storedLiked = localStorage.getItem('likedProducts');
    if (storedLiked) {
        likedProducts = JSON.parse(storedLiked);
    }
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

// Fetch Api
function fetchProducts() {
    const container = document.getElementById("product-container");

    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            allProducts = data; 
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
                <i class="fa-solid fa-heart favorite-icon ${likedProducts.includes(product.id) ? 'favorited' : ''}" 
                   data-id="${product.id}" 
                   onclick="toggleFavorite(this)"></i>
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
            <span class="close-btn" onclick="this.parentElement.parentElement.remove()">×</span>
            <img src="${product.image}" alt="${product.title}" class="modal-img">
            <h3>${product.title}</h3>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p>${product.description}</p>
        </div>
    `;
    document.body.appendChild(modal);
}

// Toggle heart icon and update liked products
function toggleFavorite(icon) {
    const productId = parseInt(icon.dataset.id);
    icon.classList.toggle("favorited");

    if (icon.classList.contains("favorited")) {
        if (!likedProducts.includes(productId)) {
            likedProducts.push(productId);
        }
    } else {
        likedProducts = likedProducts.filter(id => id !== productId);
    }

    // localStorage
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));

    // showing liked products
    if (showingLikedOnly) {
        showLikedProducts();
    }
}

// Filter products by selected categories and search criteria
function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.filter-section input[type="checkbox"]:checked'))
        .map(cb => cb.value.toLowerCase());
    
    const searchBar = document.querySelector('.search-bar');
    const searchTerm = searchBar.querySelector('input[type="text"]').value.toLowerCase();
    const minPrice = parseFloat(searchBar.querySelector('input[type="number"]:nth-child(2)').value) || 0;
    const maxPrice = parseFloat(searchBar.querySelector('input[type="number"]:nth-child(3)').value) || Infinity;

    let baseProducts = showingLikedOnly ? allProducts.filter(p => likedProducts.includes(p.id)) : allProducts;

    let filtered = baseProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm);
        const withinPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchesCategory = selectedCategories.length === 0 || 
            selectedCategories.includes(product.category.toLowerCase());
        
        return matchesSearch && withinPrice && matchesCategory;
    });

    renderProducts(filtered);
}

// Show only liked products
function showLikedProducts() {
    showingLikedOnly = !showingLikedOnly;
    const favIcon = document.getElementById('fav-like');
    
    if (showingLikedOnly) {
        favIcon.classList.add('favorited');
        const liked = allProducts.filter(product => likedProducts.includes(product.id));
        renderProducts(liked.length > 0 ? liked : []);
        if (liked.length === 0) {
            document.getElementById("product-container").innerHTML = "<p>No liked products yet.</p>";
        }
    } else {
        favIcon.classList.remove('favorited');
        filterProducts(); 
    }
}