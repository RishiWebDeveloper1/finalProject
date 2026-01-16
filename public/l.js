// DOM elements
const productsContainer = document.getElementById('productsContainer');
const productModal = document.getElementById('productModal');
const deleteModal = document.getElementById('deleteModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const imagePreview = document.getElementById('imagePreview');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const productImage = document.getElementById('productImage');
const productDescription = document.getElementById('productDescription');
const descriptionCounter = document.getElementById('descriptionCounter');
const productCategory = document.getElementById('productCategory');
const categoryOptions = document.querySelectorAll('.category-option');
// Global variables
let currentProductId = null;
let products = [];
// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    // Event listeners
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    productForm.addEventListener('submit', handleProductSubmit);
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    
    productImage.addEventListener('change', handleImagePreview);
    
    // Description character counter
    productDescription.addEventListener('input', updateDescriptionCounter);
    
    // Setup category selection
    categoryOptions.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.dataset.value;
            
            // Remove selected class from all options
            categoryOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update hidden select value
            productCategory.value = value;
        });
    });
    
    // Add form validation
    setupFormValidation();
});
// Setup enhanced form validation
function setupFormValidation() {
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    
    // Validate product name on input
    productName.addEventListener('input', function() {
        const name = this.value.trim();
        
        if (name.length < 3) {
            this.classList.add('invalid');
            this.classList.remove('valid');
        } else {
            this.classList.add('valid');
            this.classList.remove('invalid');
        }
    });
    
    // Validate price on input
    productPrice.addEventListener('input', function() {
        if (parseFloat(this.value) <= 0) {
            this.setCustomValidity('Price must be greater than 0');
            this.classList.add('invalid');
            this.classList.remove('valid');
        } else {
            this.setCustomValidity('');
            this.classList.add('valid');
            this.classList.remove('invalid');
        }
    });
}

// Load products from localStorage or API
function loadProducts() {
    // For demo purposes, using localStorage, but this could be replaced with API calls
    const storedProducts = localStorage.getItem('products');
    
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        renderProducts();
    } else {
        // Initialize with sample data
        products = [
            { id: 1, name: 'Sample Product', price: 19.99, description: 'This is a sample product', category: 'electronics', image: '' },
            { id: 2, name: 'Another Product', price: 29.99, description: 'Another great product', category: 'clothing', image: '' }
        ];
        saveProducts();
        renderProducts();
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Render products in the container
function renderProducts() {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<div class="no-products">No products available. Add a new product to get started.</div>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        
        const categoryClass = `category-tag ${product.category}`;
        
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<div class="no-image">No Image</div>'}
            </div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <div class="${categoryClass}">${product.category}</div>
                <p class="price">$${parseFloat(product.price).toFixed(2)}</p>
                <p class="description">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                <div class="actions">
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to new buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            openEditModal(productId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            openDeleteModal(productId);
        });
    });
}

// Open modal to add a new product
function openAddModal() {
    currentProductId = null;
    modalTitle.textContent = 'Add New Product';
    resetForm();
    productModal.classList.add('active');
}

// Open modal to edit an existing product
function openEditModal(productId) {
    currentProductId = productId;
    modalTitle.textContent = 'Edit Product';
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    productDescription.value = product.description;
    productCategory.value = product.category;
    
    // Set selected category
    categoryOptions.forEach(option => {
        if (option.dataset.value === product.category) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Update image preview if there's an image
    if (product.image) {
        imagePreview.innerHTML = `<img src="${product.image}" alt="Preview">`;
        imagePreview.classList.add('active');
    } else {
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('active');
    }
    
    updateDescriptionCounter();
    productModal.classList.add('active');
}

// Open delete confirmation modal
function openDeleteModal(productId) {
    currentProductId = productId;
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('deleteProductName').textContent = product.name;
        deleteModal.classList.add('active');
    }
}

// Close all modals
function closeModals() {
    productModal.classList.remove('active');
    deleteModal.classList.remove('active');
    resetForm();
}

// Reset the form
function resetForm() {
    productForm.reset();
    imagePreview.innerHTML = '';
    imagePreview.classList.remove('active');
    updateDescriptionCounter();
    
    // Reset validation classes
    document.querySelectorAll('.valid, .invalid').forEach(el => {
        el.classList.remove('valid', 'invalid');
    });
    
    // Reset category selection
    categoryOptions.forEach(option => option.classList.remove('selected'));
    
    // Set default category if available
    if (categoryOptions.length > 0) {
        categoryOptions[0].classList.add('selected');
        productCategory.value = categoryOptions[0].dataset.value;
    }
}

// Handle form submission
function handleProductSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = productDescription.value.trim();
    const category = productCategory.value;
    
    // Validate form
    if (name.length < 3) {
        showNotification('Product name must be at least 3 characters', 'error');
        return;
    }
    
    if (isNaN(price) || price <= 0) {
        showNotification('Please enter a valid price', 'error');
        return;
    }
    
    // Get image (for a real app, this would handle file uploads)
    let image = '';
    if (productImage.files && productImage.files[0]) {
        // In a real app, this would upload the file to a server
        // For demo purposes, we'll use a data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            image = e.target.result;
            saveProductDetails(name, price, description, category, image);
        };
        reader.readAsDataURL(productImage.files[0]);
    } else {
        // If editing and no new image selected, keep the old one
        if (currentProductId) {
            const currentProduct = products.find(p => p.id === currentProductId);
            if (currentProduct) {
                image = currentProduct.image;
            }
        }
        saveProductDetails(name, price, description, category, image);
    }
}

// Save product details
function saveProductDetails(name, price, description, category, image) {
    if (currentProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === currentProductId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                description,
                category,
                image
            };
            showNotification('Product updated successfully', 'success');
        }
    } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            price,
            description,
            category,
            image
        });
        showNotification('Product added successfully', 'success');
    }
    
    saveProducts();
    renderProducts();
    closeModals();
}

// Confirm product deletion
function confirmDelete() {
    if (!currentProductId) return;
    
    const index = products.findIndex(p => p.id === currentProductId);
    if (index !== -1) {
        products.splice(index, 1);
        saveProducts();
        renderProducts();
        showNotification('Product deleted successfully', 'success');
        closeModals();
    }
}

// Handle image preview
function handleImagePreview() {
    if (productImage.files && productImage.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            imagePreview.classList.add('active');
        };
        
        reader.readAsDataURL(productImage.files[0]);
    }
}

// Update description character counter
function updateDescriptionCounter() {
    const maxLength = 500;
    const currentLength = productDescription.value.length;
    
    descriptionCounter.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength > maxLength) {
        descriptionCounter.classList.add('exceeded');
        productDescription.value = productDescription.value.substring(0, maxLength);
    } else {
        descriptionCounter.classList.remove('exceeded');
    }
}

// Show notification
function showNotification(message, type) {
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('active');
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Add new product button
document.getElementById('addProductBtn').addEventListener('click', openAddModal);