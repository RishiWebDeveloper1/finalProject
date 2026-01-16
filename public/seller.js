document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('sellerForm');
    const loginButton = document.getElementById('loginButton');
    const startSellingButton = document.getElementById('startSelling');
    
    // Handle Start Selling button
    if (startSellingButton) {
        startSellingButton.addEventListener('click', function () {
            const user = localStorage.getItem('user');
            if (!user) {
                alert("❌ Please login first!");
                window.location.href = '/login.html';
            } else {
                window.location.href = '/seller.html';
            }
        });
    }
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            
            // Show loading indicator
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = "Uploading...";
            submitButton.disabled = true;
            
            try {
                // Basic validation
                const category = document.getElementById('category')?.value.trim();
                const description = document.getElementById('description')?.value.trim();
                const name = document.getElementById('name')?.value.trim();
                const price = document.getElementById('price')?.value.trim();
                const productImageInput = document.getElementById('productimage');
                
                if (!category || !description || !name || !price) {
                    throw new Error("All fields are required!");
                }
                
                if (!productImageInput || !productImageInput.files[0]) {
                    throw new Error("Please select an image file!");
                }
                
                // Create FormData with all fields
                const formData = new FormData();
                formData.append('category', category);
                formData.append('description', description);
                formData.append('name', name);
                formData.append('price', price);
                formData.append('productimage', productImageInput.files[0]);
                
                console.log("Sending data to server...");
                
                // Send to server
                const response = await fetch('https://online-exchange-platform.vercel.app/seller/add-product', {
                    method: 'POST',
                    body: formData,
                    // Important: Don't set Content-Type header
                    // The browser will set it automatically with boundary for multipart/form-data
                    credentials: 'include' // Include cookies for session authentication
                });
                
                const text = await response.text();
                console.log("Server response:", text);
                
                let data;
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    throw new Error("Server returned invalid response: " + text.substring(0, 100));
                }
                
                if (response.ok) {
                    // Success handling
                    alert("✅ Product uploaded successfully!");
                    form.reset();
                    window.location.href = '/category.html';

                    // Clear image preview if exists
                    const preview = document.getElementById('imagePreview');
                    if (preview) preview.innerHTML = '';
                    
                    const fileName = document.getElementById('fileName');
                    if (fileName) fileName.textContent = '';
                } else {
                    // Error handling
                    throw new Error(data.error || "Upload failed");
                }
            } catch (error) {
                console.error("❌ Error:", error);
                alert("❌ " + error.message);
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Handle login button
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            window.location.href = '/login.html';
        });
    }
    
    // Add image preview functionality
    const productImageInput = document.getElementById('productimage');
    if (productImageInput) {
        productImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                // Show file name
                const fileName = document.getElementById('fileName');
                if (fileName) fileName.textContent = file.name;
                
                // Show image preview
                const preview = document.getElementById('imagePreview');
                if (preview) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px;">`;
                    }
                    reader.readAsDataURL(file);
                }
            }
        });
    }
});