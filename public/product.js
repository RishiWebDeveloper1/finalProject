// // Initialize important variables
// let isLoggedIn = false;
// let allProducts = [];
// let cart = [];

// // Function to update UI based on login status
// function updateUIForLoginStatus() {
//     const loginButtons = document.getElementById('login-buttons');
//     const profileContainer = document.getElementById('profile-container');
    
//     // Get the most current login status
//     isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
//     if (isLoggedIn) {
//         loginButtons.style.display = 'none';
//         profileContainer.style.display = 'flex';
//     } else {
//         loginButtons.style.display = 'flex';
//         profileContainer.style.display = 'none';
//     }
// }

// // Load cart from localStorage
// function loadCart() {
//     cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     updateCartCounter();
// }

// // Function to update cart counter
// function updateCartCounter() {
//     const cartCounter = document.getElementById('cart-nav-count');
    
//     if (cart.length > 0) {
//         cartCounter.textContent = cart.length;
//         cartCounter.style.display = 'flex';
//     } else {
//         cartCounter.style.display = 'none';
//     }
// }

// // Function to show toast message
// function showToast(message, duration = 2000) {
//     const toast = document.getElementById('toast');
//     toast.textContent = message;
//     toast.classList.add('show');
    
//     setTimeout(() => {
//         toast.classList.remove('show');
//     }, duration);
// }

// // Function to render products
// function renderProducts(products) {
//     let container = document.getElementById("product-list");
//     container.innerHTML = "";
    
//     if (products.length === 0) {
//         container.innerHTML = "<div class='no-results'>No products found</div>";
//     } else {
//         products.forEach(product => {
//             // Check if product is in cart
//             const isInCart = cart.some(item => item.id === product.id);
            
//             container.innerHTML += `
//                 <div class="product-card" data-id="${product.id}">
//                     <div class="image-container">
//                         <img src="${product.imageUrl}" alt="${product.name}">
//                     </div>
//                     <div class="product-details">
//                         <h3 class="product-name">${product.name}</h3>
//                         <p class="product-description">${product.description || ''}</p>
//                         <p class="product-price">₹ ${product.price}</p>
//                         <p class="product-age">${product.age || ''}</p>
//                         <div class="product-actions">
//                             <button class="action-button cart-button ${isInCart ? 'active' : ''}" data-id="${product.id}">
//                                 ${isInCart ? '<i class="fas fa-check"></i> Added' : '<i class="fas fa-shopping-cart"></i> Add to Cart'}
//                             </button>
//                             <button class="action-button share-button" data-id="${product.id}">
//                                 <i class="fas fa-share-alt"></i> Share
//                             </button>
//                         </div>
//                     </div>
//                     <div class="divider"></div>
//                 </div>
//             `;
//         });
        
//         // Setup cart button functionality
//         document.querySelectorAll('.cart-button').forEach(button => {
//             button.addEventListener('click', handleCartButtonClick);
//         });
        
//         // Setup share button functionality
//         document.querySelectorAll('.share-button').forEach(button => {
//             button.addEventListener('click', handleShareButtonClick);
//         });
//     }
// }

// // Function to handle cart button click with login check
// function handleCartButtonClick(event) {
//     const button = event.currentTarget;
//     const productId = button.getAttribute('data-id');
//     const product = allProducts.find(p => p.id == productId);
    
//     if (!product) return;
    
//     // Always check the current login status from localStorage
//     const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // <-- Fix here
    
//     // Check if user is logged in
//     if (!isLoggedIn) {
//         showToast('Please login to add items to cart');
//         setTimeout(() => {
//             window.location.href = 'login.html';
//         }, 1500);
//         return;
//     }
    
//     // Check if product is already in cart
//     const productIndex = cart.findIndex(item => item.id == productId);
    
//     if (productIndex >= 0) {
//         // Remove from cart
//         cart.splice(productIndex, 1);
//         button.classList.remove('active');
//         button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
//         showToast('Removed from cart');
//     } else {
//         // Add to cart
//         cart.push(product);
//         button.classList.add('active');
//         button.innerHTML = '<i class="fas fa-check"></i> Added';
//         showToast('Added to cart');
//     }
    
//     // Save cart to localStorage
//     localStorage.setItem('cart', JSON.stringify(cart));
    
//     // Update cart counter
//     updateCartCounter();
// }

// // Function to handle share button click
// function handleShareButtonClick(event) {
//     const button = event.currentTarget;
//     const productId = button.getAttribute('data-id');
//     const product = allProducts.find(p => p.id == productId);
    
//     if (!product) return;
    
//     // Create a URL for sharing
//     const shareUrl = `${window.location.origin}/product/${productId}`;
    
//     // Update share dialog with product info
//     document.getElementById('share-link-input').value = shareUrl;
    
//     // Show share dialog
//     document.getElementById('share-dialog').classList.add('active');
// }

// // Function to filter products based on search query
// function filterProducts(query) {
//     query = query.toLowerCase().trim();
    
//     if (!query) {
//         return allProducts; // Return all products if query is empty
//     }
    
//     return allProducts.filter(product => {
//         return (
//             product.name.toLowerCase().includes(query) || 
//             (product.description && product.description.toLowerCase().includes(query))
//         );
//     });
// }

// // Setup search functionality
// function setupSearch() {
//     const searchInput = document.getElementById('search-input');
//     const searchButton = document.getElementById('search-button');
    
//     // Search when button is clicked
//     searchButton.addEventListener('click', () => {
//         const query = searchInput.value;
//         const filteredProducts = filterProducts(query);
//         renderProducts(filteredProducts);
//     });
    
//     // Search when Enter key is pressed
//     searchInput.addEventListener('keyup', (event) => {
//         if (event.key === 'Enter') {
//             const query = searchInput.value;
//             const filteredProducts = filterProducts(query);
//             renderProducts(filteredProducts);
//         }
//     });
// }

// // Setup share dialog functionality
// function setupShareDialog() {
//     // Copy link button functionality
//     document.getElementById('copy-link-button').addEventListener('click', function() {
//         const linkInput = document.getElementById('share-link-input');
//         linkInput.select();
//         document.execCommand('copy');
//         showToast('Link copied to clipboard!');
//     });
    
//     // Close share dialog
//     document.getElementById('close-dialog-button').addEventListener('click', function() {
//         document.getElementById('share-dialog').classList.remove('active');
//     });
    
//     // Share to social media platforms
//     document.querySelectorAll('.share-option').forEach(option => {
//         option.addEventListener('click', function() {
//             const platform = this.getAttribute('data-platform');
//             const shareUrl = document.getElementById('share-link-input').value;
//             let targetUrl;
            
//             switch(platform) {
//                 case 'facebook':
//                     targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
//                     break;
//                 case 'twitter':
//                     targetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out this awesome product!')}`;
//                     break;
//                 case 'whatsapp':
//                     targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this product: ' + shareUrl)}`;
//                     break;
//             }
            
//             if (targetUrl) {
//                 window.open(targetUrl, '_blank');
//             }
//         });
//     });
// }

// // Navigate to cart page when clicking the cart icon in navbar
// function setupCartNavigation() {
//     const cartNavButton = document.getElementById('cart-nav-button');
//     if (cartNavButton) {
//         cartNavButton.addEventListener('click', function() {
//             // Always check the current login status
//             const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // <-- Fix here
            
//             if (!isLoggedIn) {
//                 showToast('Please login to view your cart');
//                 setTimeout(() => {
//                     window.location.href = 'login.html';
//                 }, 1500);
//                 return;
//             }
            
//             // Redirect to cart page
//             window.location.href = 'cart.html';
//         });
//     }
// }

// // Handle logout
// function setupLogout() {
//     const logoutBtn = document.getElementById('logout-btn');
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', function(e) {
//             e.preventDefault();
//             localStorage.removeItem('isLoggedIn');
//             localStorage.removeItem('cart'); // Clear cart on logout
//             isLoggedIn = false;
//             updateUIForLoginStatus();
//             showToast('Logged out successfully');
//             setTimeout(() => {
//                 window.location.href = 'index.html'; // Redirect to home page
//             }, 1500);
//         });
//     }
// }

// // Fetch products from API
// function fetchProducts() {
//     const params = new URLSearchParams(window.location.search);
//     let category = params.get("category");
//     // If category is null or undefined, remove it
//     if (!category || category === "null") {
//         category = ""; 
//     }
    
//     fetch(`/api/products?category=${encodeURIComponent(category)}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Network response was not ok");
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Add unique IDs if they don't exist
//             allProducts = data.map((product, index) => {
//                 if (!product.id) {
//                     product.id = index + 1;
//                 }
//                 return product;
//             });
            
//             renderProducts(allProducts); // Render all products initially
//         })
//         .catch(error => {
//             console.error("Error fetching products:", error);
//             // For development purposes, load demo data if API fails
//             loadDemoData();
//         });
// }

// // Load demo data for development/testing
// function loadDemoData() {
//     allProducts = [
//         {
//             id: 1,
//             name: "Smartphone X10",
//             description: "Latest model with 128GB storage",
//             price: 27999,
//             age: "Brand New",
//             imageUrl: "/api/placeholder/400/350"
//         },
//         {
//             id: 2,
//             name: "Vintage Watch",
//             description: "Classic design from 1980s",
//             price: 5499,
//             age: "Used - Like New",
//             imageUrl: "/api/placeholder/400/350"
//         },
//         {
//             id: 3,
//             name: "Gaming Laptop",
//             description: "16GB RAM, RTX 3060",
//             price: 85000,
//             age: "6 months old",
//             imageUrl: "/api/placeholder/400/350"
//         },
//         {
//             id: 4,
//             name: "Mountain Bike",
//             description: "21-speed, aluminum frame",
//             price: 12500,
//             age: "1 year old",
//             imageUrl: "/api/placeholder/400/350"
//         }
//     ];
    
//     renderProducts(allProducts);
// }

// // Setup profile and menu toggles
// function setupUI() {
//     // Toggle profile dropdown
//     const profileIcon = document.getElementById('profile-icon');
//     if (profileIcon) {
//         profileIcon.addEventListener('click', function(e) {
//             e.stopPropagation(); // Prevent click from immediately closing the dropdown
//             document.querySelector('.profile-dropdown').classList.toggle('active');
//         });
//     }
    
//     // Toggle menu for mobile view
//     const menuToggle = document.querySelector('.menu-toggle');
//     if (menuToggle) {
//         menuToggle.addEventListener('click', function() {
//             document.querySelector('.route-link-box').classList.toggle('active');
//             document.querySelector('.login-box-container').classList.toggle('active');
//         });
//     }

//     // Close profile dropdown when clicking elsewhere
//     document.addEventListener('click', function(e) {
//         const dropdown = document.querySelector('.profile-dropdown');
//         const profileIcon = document.getElementById('profile-icon');
        
//         if (dropdown && dropdown.classList.contains('active') && 
//             profileIcon && !profileIcon.contains(e.target) && 
//             !dropdown.contains(e.target)) {
//             dropdown.classList.remove('active');
//         }
//     });
// }

// // Initialize everything when the page loads
// document.addEventListener('DOMContentLoaded', function() {
//     // Check login status from localStorage
//     isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
//     // Load cart from localStorage
//     loadCart();
    
//     // Setup UI based on login status
//     updateUIForLoginStatus();
    
//     // Setup UI elements and event handlers
//     setupUI();
//     setupSearch();
//     setupShareDialog();
//     setupCartNavigation();
//     setupLogout();
    
//     // Fetch products or load demo data
//     fetchProducts();
// });

// Initialize important variables
let isLoggedIn = false;
let allProducts = [];
let cart = [];

// Function to update UI based on login status
function updateUIForLoginStatus() {
    const loginButtons = document.getElementById('login-buttons');
    const profileContainer = document.getElementById('profile-container');
    
    // Get the most current login status
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        loginButtons.style.display = 'none';
        profileContainer.style.display = 'flex';
    } else {
        loginButtons.style.display = 'flex';
        profileContainer.style.display = 'none';
    }
}

// Load cart from localStorage
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateCartCounter();
}

// Function to update cart counter
function updateCartCounter() {
    const cartCounter = document.getElementById('cart-nav-count');
    
    if (cart.length > 0) {
        cartCounter.textContent = cart.length;
        cartCounter.style.display = 'flex';
    } else {
        cartCounter.style.display = 'none';
    }
}

// Function to show toast message
function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Function to render products
function renderProducts(products) {
    let container = document.getElementById("product-list");
    container.innerHTML = "";
    
    if (products.length === 0) {
        container.innerHTML = "<div class='no-results'>No products found</div>";
    } else {
        products.forEach(product => {
            // Check if product is in cart
            const isInCart = cart.some(item => item.id === product.id);
            
            container.innerHTML += `
                <div class="product-card" data-id="${product.id}">
                    <div class="image-container">
                        <img src="${product.imageUrl}" alt="${product.name}">
                    </div>
                    <div class="product-details">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description || ''}</p>
                        <p class="product-price">₹ ${product.price}</p>
                        <p class="product-age">${product.age || ''}</p>
                        <div class="product-actions">
                            <button class="action-button cart-button ${isInCart ? 'active' : ''}" data-id="${product.id}">
                                ${isInCart ? '<i class="fas fa-check"></i> Added' : '<i class="fas fa-shopping-cart"></i> Add to Cart'}
                            </button>
                            <button class="action-button share-button" data-id="${product.id}">
                                <i class="fas fa-share-alt"></i> Share
                            </button>
                        </div>
                    </div>
                    <div class="divider"></div>
                </div>
            `;
        });
        
        // Setup cart button functionality
        document.querySelectorAll('.cart-button').forEach(button => {
            button.addEventListener('click', handleCartButtonClick);
        });
        
        // Setup share button functionality
        document.querySelectorAll('.share-button').forEach(button => {
            button.addEventListener('click', handleShareButtonClick);
        });
    }
}

// Function to handle cart button click without login check
function handleCartButtonClick(event) {
    const button = event.currentTarget;
    const productId = button.getAttribute('data-id');
    const product = allProducts.find(p => p.id == productId);
    
    if (!product) return;
    
    // Check if product is already in cart
    const productIndex = cart.findIndex(item => item.id == productId);
    
    if (productIndex >= 0) {
        // Remove from cart
        cart.splice(productIndex, 1);
        button.classList.remove('active');
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        showToast('Removed from cart');
    } else {
        // Add to cart
        cart.push(product);
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        showToast('Added to cart');
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart counter
    updateCartCounter();
}

// Function to handle share button click
function handleShareButtonClick(event) {
    const button = event.currentTarget;
    const productId = button.getAttribute('data-id');
    const product = allProducts.find(p => p.id == productId);
    
    if (!product) return;
    
    // Create a URL for sharing
    const shareUrl = `${window.location.origin}/product/${productId}`;
    
    // Update share dialog with product info
    document.getElementById('share-link-input').value = shareUrl;
    
    // Show share dialog
    document.getElementById('share-dialog').classList.add('active');
}

// Function to filter products based on search query
function filterProducts(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
        return allProducts; // Return all products if query is empty
    }
    
    return allProducts.filter(product => {
        return (
            product.name.toLowerCase().includes(query) || 
            (product.description && product.description.toLowerCase().includes(query))
        );
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // Search when button is clicked
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        const filteredProducts = filterProducts(query);
        renderProducts(filteredProducts);
    });
    
    // Search when Enter key is pressed
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value;
            const filteredProducts = filterProducts(query);
            renderProducts(filteredProducts);
        }
    });
}

// Setup share dialog functionality
function setupShareDialog() {
    // Copy link button functionality
    document.getElementById('copy-link-button').addEventListener('click', function() {
        const linkInput = document.getElementById('share-link-input');
        linkInput.select();
        document.execCommand('copy');
        showToast('Link copied to clipboard!');
    });
    
    // Close share dialog
    document.getElementById('close-dialog-button').addEventListener('click', function() {
        document.getElementById('share-dialog').classList.remove('active');
    });
    
    // Share to social media platforms
    document.querySelectorAll('.share-option').forEach(option => {
        option.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const shareUrl = document.getElementById('share-link-input').value;
            let targetUrl;
            
            switch(platform) {
                case 'facebook':
                    targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                    break;
                case 'twitter':
                    targetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out this awesome product!')}`;
                    break;
                case 'whatsapp':
                    targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this product: ' + shareUrl)}`;
                    break;
            }
            
            if (targetUrl) {
                window.open(targetUrl, '_blank');
            }
        });
    });
}

// Navigate to cart page when clicking the cart icon in navbar
function setupCartNavigation() {
    const cartNavButton = document.getElementById('cart-nav-button');
    if (cartNavButton) {
        cartNavButton.addEventListener('click', function() {
            // Redirect to cart page without login check
            window.location.href = 'cart.html';
        });
    }
}

// Handle logout
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            // Don't clear cart on logout
            isLoggedIn = false;
            updateUIForLoginStatus();
            showToast('Logged out successfully');
            setTimeout(() => {
                window.location.href = 'index.html'; // Redirect to home page
            }, 1500);
        });
    }
}

// Fetch products from API
function fetchProducts() {
    const params = new URLSearchParams(window.location.search);
    let category = params.get("category");
    // If category is null or undefined, remove it
    if (!category || category === "null") {
        category = ""; 
    }
    
    fetch(`/api/products?category=${encodeURIComponent(category)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Add unique IDs if they don't exist
            allProducts = data.map((product, index) => {
                if (!product.id) {
                    product.id = index + 1;
                }
                return product;
            });
            
            renderProducts(allProducts); // Render all products initially
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            // For development purposes, load demo data if API fails
            loadDemoData();
        });
}

// Load demo data for development/testing
function loadDemoData() {
    allProducts = [
        {
            id: 1,
            name: "Smartphone X10",
            description: "Latest model with 128GB storage",
            price: 27999,
            age: "Brand New",
            imageUrl: "/api/placeholder/400/350"
        },
        {
            id: 2,
            name: "Vintage Watch",
            description: "Classic design from 1980s",
            price: 5499,
            age: "Used - Like New",
            imageUrl: "/api/placeholder/400/350"
        },
        {
            id: 3,
            name: "Gaming Laptop",
            description: "16GB RAM, RTX 3060",
            price: 85000,
            age: "6 months old",
            imageUrl: "/api/placeholder/400/350"
        },
        {
            id: 4,
            name: "Mountain Bike",
            description: "21-speed, aluminum frame",
            price: 12500,
            age: "1 year old",
            imageUrl: "/api/placeholder/400/350"
        }
    ];
    
    renderProducts(allProducts);
}

// Setup profile and menu toggles
function setupUI() {
    // Toggle profile dropdown
    const profileIcon = document.getElementById('profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent click from immediately closing the dropdown
            document.querySelector('.profile-dropdown').classList.toggle('active');
        });
    }
    
    // Toggle menu for mobile view
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.route-link-box').classList.toggle('active');
            document.querySelector('.login-box-container').classList.toggle('active');
        });
    }

    // Close profile dropdown when clicking elsewhere
    document.addEventListener('click', function(e) {
        const dropdown = document.querySelector('.profile-dropdown');
        const profileIcon = document.getElementById('profile-icon');
        
        if (dropdown && dropdown.classList.contains('active') && 
            profileIcon && !profileIcon.contains(e.target) && 
            !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check login status from localStorage
    isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Load cart from localStorage
    loadCart();
    
    // Setup UI based on login status
    updateUIForLoginStatus();
    
    // Setup UI elements and event handlers
    setupUI();
    setupSearch();
    setupShareDialog();
    setupCartNavigation();
    setupLogout();
    
    // Fetch products or load demo data
    fetchProducts();
});